import axios from "axios";
import Job from "../models/Job.js";
import mapJSearchJob from "../mappers/jsearch.mapper.js";
import { extractJobSkills } from "./ai/skillExtractor.js";
import { updateSkillTrends } from "./skillTrend.service.js";

const JSEARCH_URL = "https://api.openwebninja.com/jsearch/search-v2";

export const fetchJSearchJobs = async (
    query = "Software Engineer",
    page = 1,
    numPages = 1
) => {
    try {
        const response = await axios.get(JSEARCH_URL, {
            params: {
                query,
                country: "in",
                language: "en",
                num_pages: numPages
            },
            headers: {
                "X-API-Key": process.env.JSEARCH_API_KEY
            }
        });

        const jobs = response.data.data.jobs || [];

        // Step 1: Map all jobs
        const mappedJobs = jobs.map(mapJSearchJob);

        // Step 2: AI Skill Extraction (Parallel)
        await Promise.all(
            mappedJobs.map(async (job) => {
                job.skills = await extractJobSkills(
                    job.title,
                    job.description
                );
            })
        );

        // Step 3: Check Existing Jobs
        const existingJobs = await Job.find({
            $or: mappedJobs.map(job => ({
                externalJobId: job.externalJobId,
                source: job.source
            }))
        }).select("externalJobId source");

        const existingSet = new Set(
            existingJobs.map(job => `${job.source}-${job.externalJobId}`)
        );

        // Step 4: Remove Duplicates
        const newJobs = mappedJobs.filter(
            job =>
                !existingSet.has(
                    `${job.source}-${job.externalJobId}`
                )
        );

        if (newJobs.length === 0) {
            console.log("No new jobs found.");
            return [];
        }

        // Step 5: Bulk Insert
        const insertedJobs = await Job.insertMany(newJobs);

        await Promise.all(
            insertedJobs.map(updateSkillTrends)
        );
        
        return insertedJobs;

    } catch (error) {

        console.error("Job Sync Failed");

        console.error(error.response?.data || error.message);

        throw error;
    }
};