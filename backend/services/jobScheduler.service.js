import cron from "node-cron";
import { fetchJSearchJobs } from "./jobProvider.service.js";

export function startJobScheduler() {

    // Runs every day at 9:00 AM
    cron.schedule(
        "0 9 * * *",

        async () => {

            console.log(
                "⏰ Starting scheduled job synchronization..."
            );

            try {

                const queries = [
                    "Software Engineer",
                    "Backend Developer",
                    "Frontend Developer",
                    "Full Stack Developer",
                    "Data Analyst"
                ];

                for (const query of queries) {

                    console.log(
                        `Fetching jobs for: ${query}`
                    );

                    await fetchJSearchJobs(
                        query,
                        1,
                        1
                    );

                }

                console.log(
                    "✅ Scheduled job synchronization completed."
                );

            } catch (error) {

                console.error(
                    "❌ Scheduled job synchronization failed:",
                    error.message
                );

            }

        },

        {
            scheduled: true,
            timezone: "Asia/Kolkata"
        }
    );

    console.log(
        "⏰ Job scheduler started. Scheduled for 9:00 AM IST every day."
    );

}