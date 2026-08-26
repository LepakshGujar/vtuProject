import SkillTrend from "../models/SkillTrend.js";

export async function updateSkillTrends(job) {

    if (!job.skills || job.skills.length === 0) {
        return;
    }

    for (const skill of job.skills) {

        await SkillTrend.findOneAndUpdate(
            {
                skill
            },
            {
                $inc: {
                    demandCount: 1
                },

                $set: {
                    lastUpdated: new Date()
                },

                $addToSet: {
                    jobTitles: job.title,
                    locations: job.location?.fullLocation || "Unknown"
                }
            },
            {
                upsert: true,
                new: true
            }
        );

    }

}