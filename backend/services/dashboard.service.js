import Resume from "../models/Resume.js";
import SkillTrend from "../models/SkillTrend.js";
import Job from "../models/Job.js";

export async function getDashboardOverviewService(userId) {

    // ==========================
    // User's Latest Resume
    // ==========================

    const resume = await Resume.findOne({
        user: userId
    }).sort({
        createdAt: -1
    });


    // ==========================
    // Dashboard Statistics
    // ==========================

    const [
        totalJobs,
        remoteJobs,
        totalTrendingSkills
    ] = await Promise.all([

        Job.countDocuments(),

        Job.countDocuments({
            isRemote: true
        }),

        SkillTrend.countDocuments()

    ]);


    // ==========================
    // Top Trending Skills
    // ==========================

    const trendingSkills = await SkillTrend.find()
        .sort({
            demandCount: -1
        })
        .limit(10)
        .select(
            "skill demandCount percentage category lastUpdated"
        );


    // ==========================
    // Latest Jobs
    // ==========================

    const recentJobs = await Job.find()
        .sort({
            postedDate: -1,
            createdAt: -1
        })
        .limit(10)
        .select(
            "title company location employmentType salary applyLink postedDate source isRemote"
        );


    // ==========================
    // Dashboard Response
    // ==========================

    return {

        stats: {

            totalJobs,

            remoteJobs,

            totalTrendingSkills,

            resumeScore:
                resume?.resumeScore || 0,

            matchPercentage:
                resume?.matchPercentage || 0

        },


        // ==========================
        // Resume Data
        // ==========================

        resume: resume
            ? {

                id: resume._id,

                fileName: resume.fileName,

                targetRole: resume.targetRole,

                atsScore: resume.atsScore,

                resumeScore: resume.resumeScore,

                matchPercentage:
                    resume.matchPercentage,

                extractedSkills:
                    resume.extractedSkills,

                matchingSkills:
                    resume.matchingSkills,

                missingSkills:
                    resume.missingSkills,

                recommendations:
                    resume.recommendations,

                roadmap:
                    resume.roadmap

            }
            : null,


        // ==========================
        // Trending Skills
        // ==========================

        trendingSkills,


        // ==========================
        // Latest Jobs
        // ==========================

        recentJobs

    };

}