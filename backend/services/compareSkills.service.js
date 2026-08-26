import SkillTrend from "../models/SkillTrend.js";

export async function compareSkills(
    resumeSkills,
    targetRole = ""
) {

    try {

        // ---------------------------------------
        // Fetch market skills
        // ---------------------------------------

        const skillTrends =
            await SkillTrend.find()
                .select(
                    "skill category jobTitles demandCount percentage"
                );


        if (!skillTrends.length) {

            return {
                matchingSkills: [],
                missingSkills: [],
                matchPercentage: 0,
                weightedMatchPercentage: 0,
                atsScore: 0,
                skillGaps: []
            };

        }


        // ---------------------------------------
        // Normalize target role
        // ---------------------------------------

        const normalizedRole =
            targetRole
                .toLowerCase()
                .trim();


        // ---------------------------------------
        // Role keywords
        // ---------------------------------------

        const roleKeywords = {

            "backend developer": [
                "backend",
                "back end",
                "software engineer",
                "software developer",
                "java developer",
                "python developer",
                "node developer",
                "node.js developer",
                "full stack developer"
            ],

            "frontend developer": [
                "frontend",
                "front end",
                "react developer",
                "angular developer",
                "vue developer",
                "ui developer"
            ],

            "full stack developer": [
                "full stack",
                "software engineer",
                "web developer",
                "backend developer",
                "frontend developer"
            ],

            "data scientist": [
                "data scientist",
                "machine learning",
                "data analyst",
                "ai engineer"
            ],

            "devops engineer": [
                "devops",
                "cloud engineer",
                "site reliability",
                "sre",
                "platform engineer"
            ]

        };


        const keywords =
            roleKeywords[normalizedRole] || [
                normalizedRole
            ];


        // ---------------------------------------
        // Filter jobs relevant to target role
        // ---------------------------------------

        const roleRelevantSkills =
            skillTrends.filter(item => {

                const jobTitles =
                    Array.isArray(item.jobTitles)
                        ? item.jobTitles
                        : [];


                const titleText =
                    jobTitles
                        .join(" ")
                        .toLowerCase();


                return keywords.some(keyword =>
                    titleText.includes(keyword)
                );

            });


        // ---------------------------------------
        // Use role filtered data if available
        // ---------------------------------------

        let marketSkills =
            roleRelevantSkills.length >= 5
                ? roleRelevantSkills
                : skillTrends;


        // ---------------------------------------
        // Remove duplicate skills
        // ---------------------------------------

        const uniqueSkills =
            new Map();


        marketSkills.forEach(item => {

            const normalizedSkill =
                item.skill
                    .toLowerCase()
                    .trim();


            if (!uniqueSkills.has(normalizedSkill)) {

                uniqueSkills.set(
                    normalizedSkill,
                    item
                );

            }

        });


        marketSkills =
            [...uniqueSkills.values()];


        // ---------------------------------------
        // Remove zero-demand skills
        // ---------------------------------------

        const skillsWithDemand =
            marketSkills.filter(item => {

                const demandCount =
                    Number(item.demandCount) || 0;

                const percentage =
                    Number(item.percentage) || 0;

                return (
                    demandCount > 0 ||
                    percentage > 0
                );

            });


        if (skillsWithDemand.length >= 5) {

            marketSkills =
                skillsWithDemand;

        }


        // ---------------------------------------
        // Sort by market demand
        // ---------------------------------------

        marketSkills.sort((a, b) => {

            const demandA =
                Number(a.demandCount) || 0;

            const demandB =
                Number(b.demandCount) || 0;

            const percentageA =
                Number(a.percentage) || 0;

            const percentageB =
                Number(b.percentage) || 0;


            const scoreA =
                demandA + percentageA;

            const scoreB =
                demandB + percentageB;


            return scoreB - scoreA;

        });


        // ---------------------------------------
        // Keep top market skills
        // ---------------------------------------

        marketSkills =
            marketSkills.slice(0, 40);


        // ---------------------------------------
        // Normalize resume skills
        // ---------------------------------------

        const resumeSkillSet =
            new Set(
                (resumeSkills || [])
                    .map(skill =>
                        skill
                            .toLowerCase()
                            .trim()
                    )
            );


        // ---------------------------------------
        // Find matches
        // ---------------------------------------

        const matchingSkills = [];

        const missingSkills = [];


        marketSkills.forEach(item => {

            const normalizedSkill =
                item.skill
                    .toLowerCase()
                    .trim();


            if (
                resumeSkillSet.has(
                    normalizedSkill
                )
            ) {

                matchingSkills.push(
                    item.skill
                );

            } else {

                missingSkills.push(
                    item.skill
                );

            }

        });


        // ---------------------------------------
        // Raw match percentage
        // ---------------------------------------

        const matchPercentage =
            marketSkills.length === 0
                ? 0
                : Math.round(
                    (
                        matchingSkills.length /
                        marketSkills.length
                    ) * 100
                );


        // ---------------------------------------
        // Weighted match
        // ---------------------------------------

        let totalWeight = 0;

        let matchedWeight = 0;


        marketSkills.forEach(item => {

            const demandCount =
                Number(item.demandCount) || 0;

            const percentage =
                Number(item.percentage) || 0;


            // Combine frequency and percentage
            const weight =
                demandCount + percentage;


            totalWeight += weight;


            if (
                resumeSkillSet.has(
                    item.skill
                        .toLowerCase()
                        .trim()
                )
            ) {

                matchedWeight += weight;

            }

        });


        let weightedMatchPercentage =
            totalWeight === 0
                ? matchPercentage
                : Math.round(
                    (
                        matchedWeight /
                        totalWeight
                    ) * 100
                );


        // ---------------------------------------
        // Prevent unrealistic score
        // ---------------------------------------

        weightedMatchPercentage =
            Math.min(
                100,
                Math.max(
                    0,
                    weightedMatchPercentage
                )
            );


        // ---------------------------------------
        // Generate skill gaps
        // ---------------------------------------

        const skillGaps =
            marketSkills
                .filter(item =>
                    !resumeSkillSet.has(
                        item.skill
                            .toLowerCase()
                            .trim()
                    )
                )
                .slice(0, 15)
                .map(item => {

                    const demandPercentage =
                        Number(
                            item.percentage
                        ) || 0;


                    let priority = "Low";


                    if (
                        demandPercentage >= 40
                    ) {

                        priority = "High";

                    } else if (
                        demandPercentage >= 25
                    ) {

                        priority = "Medium";

                    }


                    return {

                        skill: item.skill,

                        demandPercentage,

                        priority

                    };

                });


        // ---------------------------------------
        // Final ATS score
        // ---------------------------------------

        const atsScore =
            weightedMatchPercentage;


        // ---------------------------------------
        // Log analysis
        // ---------------------------------------

        console.log(
            "\n========== MARKET SKILL ANALYSIS =========="
        );

        console.log(
            "Target Role:",
            targetRole
        );

        console.log(
            "Market Skills:",
            marketSkills.length
        );

        console.log(
            "Matching Skills:",
            matchingSkills.length
        );

        console.log(
            "Missing Skills:",
            missingSkills.length
        );

        console.log(
            "Match Percentage:",
            matchPercentage
        );

        console.log(
            "Weighted Match:",
            weightedMatchPercentage
        );

        console.log(
            "============================================\n"
        );


        return {

            matchingSkills,

            missingSkills,

            matchPercentage,

            weightedMatchPercentage,

            atsScore,

            skillGaps

        };


    } catch (error) {

        console.error(
            "❌ Skill comparison error:",
            error.message
        );


        return {

            matchingSkills: [],

            missingSkills: [],

            matchPercentage: 0,

            weightedMatchPercentage: 0,

            atsScore: 0,

            skillGaps: []

        };

    }

}