import mongoose from "mongoose";
import dotenv from "dotenv";

import Job from "../models/Job.js";
import { extractJobSkills } from "../services/ai/skillExtractor.js";
import { updateSkillTrends } from "../services/skillTrend.service.js";

dotenv.config();

async function enrichExistingJobs() {

    try {

        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);

        console.log("✅ MongoDB connected");

        // Find jobs without skills
        const jobs = await Job.find({
            $or: [
                { skills: { $exists: false } },
                { skills: { $size: 0 } }
            ]
        });

        console.log(
            `📋 Jobs without skills: ${jobs.length}`
        );

        if (jobs.length === 0) {

            console.log(
                "✅ All jobs already have skills."
            );

            return;

        }

        let processed = 0;

        for (const job of jobs) {

            console.log(
                `\n🔍 Processing: ${job.title}`
            );

            const skills = await extractJobSkills(
                job.title,
                job.description
            );

            job.skills = skills;

            await job.save();

            console.log(
                `✅ Skills: ${skills.join(", ")}`
            );

            // Update skill trends
            await updateSkillTrends(job);

            processed++;

            console.log(
                `📊 Progress: ${processed}/${jobs.length}`
            );
        }

        console.log(
            "\n🎉 Existing jobs enriched successfully!"
        );

    } catch (error) {

        console.error(
            "❌ Job enrichment failed:"
        );

        console.error(error);

    } finally {

        await mongoose.connection.close();

        console.log(
            "🔌 MongoDB connection closed"
        );

    }

}

enrichExistingJobs();