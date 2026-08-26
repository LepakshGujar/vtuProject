import Job from "../models/Job.js";

export async function analyzeResume(targetRole, resumeSkills) {

    // Find jobs similar to the detected role
    const jobs = await Job.find({
        title: {
            $regex: targetRole,
            $options: "i"
        }
    });

    // If no matching jobs are found, analyze all jobs
    const jobsToAnalyze = jobs.length > 0
        ? jobs
        : await Job.find();

    // Collect all market skills
    const marketSkillSet = new Set();

    jobsToAnalyze.forEach(job => {

        if (!job.skills) return;

        job.skills.forEach(skill => {
            marketSkillSet.add(
                skill.toLowerCase().trim()
            );
        });

    });

    const marketSkills = [...marketSkillSet];

    const resumeSkillSet = new Set(
        resumeSkills.map(skill =>
            skill.toLowerCase().trim()
        )
    );

    const matchingSkills = [];
    const missingSkills = [];

    marketSkills.forEach(skill => {

        if (resumeSkillSet.has(skill)) {

            matchingSkills.push(skill);

        } else {

            missingSkills.push(skill);

        }

    });

    const matchPercentage =
        marketSkills.length === 0
            ? 0
            : Math.round(
                  (matchingSkills.length / marketSkills.length) * 100
              );

    return {

        targetRole,

        matchingSkills,

        missingSkills,

        totalMarketSkills: marketSkills.length,

        matchedSkills: matchingSkills.length,

        matchPercentage,

        atsScore: matchPercentage

    };

}