import Job from "../models/Job.js";

import {
    fetchJSearchJobs
} from "../services/jobProvider.service.js";

import AppError from "../utils/appError.js";


// ==========================
// Sync Jobs
// ==========================

export const syncJobs = async (
    req,
    res,
    next
) => {

    try {

        const {
            query = "Software Engineer",
            location = "India",
            page = 1
        } = req.body;


        const jsearchJobs =
            await fetchJSearchJobs(
                query,
                page
            );


        res.status(200).json({

            success: true,

            message:
                "Jobs synchronized successfully.",

            totalImported:
                jsearchJobs.length,

            jsearchImported:
                jsearchJobs.length

        });

    } catch (error) {

        next(error);

    }

};


// ==========================
// Get All Jobs
// ==========================

export const getJobs = async (
    req,
    res,
    next
) => {

    try {

        // ==========================
        // Query Parameters
        // ==========================

        const page =
            parseInt(req.query.page) || 1;

        const limit =
            parseInt(req.query.limit) || 10;

        const query =
            req.query.query?.trim();

        const location =
            req.query.location?.trim();

        const sort =
            req.query.sort || "latest";


        // Prevent invalid page or limit
        if (page < 1) {

            throw new AppError(
                "Page must be greater than 0.",
                400
            );

        }


        if (limit < 1) {

            throw new AppError(
                "Limit must be greater than 0.",
                400
            );

        }


        const skip =
            (page - 1) * limit;


        // ==========================
        // Build Dynamic Filter
        // ==========================

        const filter = {};

        const andConditions = [];


        // ==========================
        // Search Filter
        // ==========================

        if (query) {

            andConditions.push({

                $or: [

                    {
                        title: {
                            $regex: query,
                            $options: "i"
                        }
                    },

                    {
                        company: {
                            $regex: query,
                            $options: "i"
                        }
                    },

                    {
                        description: {
                            $regex: query,
                            $options: "i"
                        }
                    },

                    {
                        skills: {
                            $regex: query,
                            $options: "i"
                        }
                    },

                    {
                        technologies: {
                            $regex: query,
                            $options: "i"
                        }
                    }

                ]

            });

        }


        // ==========================
        // Location Filter
        // ==========================

        if (location) {

            andConditions.push({

                $or: [

                    {
                        "location.city": {
                            $regex: location,
                            $options: "i"
                        }
                    },

                    {
                        "location.state": {
                            $regex: location,
                            $options: "i"
                        }
                    },

                    {
                        "location.country": {
                            $regex: location,
                            $options: "i"
                        }
                    },

                    {
                        "location.fullLocation": {
                            $regex: location,
                            $options: "i"
                        }
                    }

                ]

            });

        }


        // Apply filters

        if (andConditions.length > 0) {

            filter.$and =
                andConditions;

        }


        // ==========================
        // Sorting
        // ==========================

        let sortOption = {};


        switch (sort) {

            case "oldest":

                sortOption = {
                    postedDate: 1
                };

                break;


            case "company":

                sortOption = {
                    company: 1
                };

                break;


            case "title":

                sortOption = {
                    title: 1
                };

                break;


            case "latest":

            default:

                sortOption = {
                    postedDate: -1
                };

        }


        // ==========================
        // Database Queries
        // ==========================

        const totalJobs =
            await Job.countDocuments(
                filter
            );


        const jobs =
            await Job.find(filter)
                .sort(sortOption)
                .skip(skip)
                .limit(limit);


        // ==========================
        // Response
        // ==========================

        res.status(200).json({

            success: true,

            page,

            limit,

            totalJobs,

            totalPages:
                Math.ceil(
                    totalJobs / limit
                ),

            sort,

            jobs

        });

    } catch (error) {

        next(error);

    }

};


// ==========================
// Get Single Job
// ==========================

export const getJobById = async (
    req,
    res,
    next
) => {

    try {

        const job =
            await Job.findById(
                req.params.id
            );


        if (!job) {

            throw new AppError(
                "Job not found.",
                404
            );

        }


        res.status(200).json({

            success: true,

            job

        });

    } catch (error) {

        // Handle invalid MongoDB ID
        if (
            error.name ===
            "CastError"
        ) {

            return next(
                new AppError(
                    "Invalid job ID.",
                    400
                )
            );

        }

        next(error);

    }

};