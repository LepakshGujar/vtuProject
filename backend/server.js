import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import jobRoutes from "./routes/job.routes.js";
import resumeRoutes from "./routes/resume.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";

import AppError from "./utils/appError.js";
import errorMiddleware from "./middleware/error.middleware.js";

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";

import {
    startJobScheduler
} from "./services/jobScheduler.service.js";


dotenv.config();

const app = express();


// ==========================
// Middleware
// ==========================

app.use(express.json());

app.use(cors());


// ==========================
// Swagger API Documentation
// ==========================

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);


// ==========================
// API Routes
// ==========================

app.use("/api/auth", authRoutes);

app.use("/api/user", userRoutes);

app.use("/api/jobs", jobRoutes);

app.use("/api/resume", resumeRoutes);

app.use("/api/dashboard", dashboardRoutes);


// ==========================
// Test Route
// ==========================

app.get("/", (req, res) => {

    res.json({
        success: true,
        message: "Job Market Insight API is running..."
    });

});


// ==========================
// Handle Unknown Routes
// Must be AFTER all routes
// ==========================

app.use((req, res, next) => {

    next(
        new AppError(
            `Route ${req.originalUrl} not found.`,
            404
        )
    );

});


// ==========================
// Centralized Error Handler
// Must be LAST middleware
// ==========================

app.use(errorMiddleware);


// ==========================
// MongoDB Connection & Server
// ==========================

async function startServer() {

    try {

        await mongoose.connect(
            process.env.MONGODB_URI
        );

        console.log("✅ MongoDB Connected");


        app.listen(
            process.env.PORT,
            () => {

                console.log(
                    `🚀 Server is running on port ${process.env.PORT}`
                );

                // Start automatic job scheduler
                startJobScheduler();

            }
        );

    } catch (err) {

        console.error(
            "❌ MongoDB Connection Failed:",
            err.message
        );

        process.exit(1);

    }

}


startServer();