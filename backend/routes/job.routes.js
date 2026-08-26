import express from "express";

import {
    syncJobs,
    getJobs,
    getJobById
} from "../controllers/job.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: Job collection and job management APIs
 */


/**
 * @swagger
 * /api/jobs/sync:
 *   post:
 *     summary: Synchronize jobs from the job provider
 *     tags:
 *       - Jobs
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               query:
 *                 type: string
 *                 example: Backend Developer
 *               location:
 *                 type: string
 *                 example: India
 *               page:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Jobs synchronized successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post(
    "/sync",
    authMiddleware,
    syncJobs
);


/**
 * @swagger
 * /api/jobs:
 *   get:
 *     summary: Get all jobs
 *     tags:
 *       - Jobs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         example: 1
 *
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         example: 10
 *
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         example: Backend Developer
 *
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         example: Bengaluru
 *
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum:
 *             - latest
 *             - oldest
 *             - company
 *             - title
 *         example: latest
 *
 *     responses:
 *       200:
 *         description: Jobs retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get(
    "/",
    authMiddleware,
    getJobs
);


/**
 * @swagger
 * /api/jobs/{id}:
 *   get:
 *     summary: Get a job by ID
 *     tags:
 *       - Jobs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 66a123456789abcdef123456
 *     responses:
 *       200:
 *         description: Job retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Job not found
 *       500:
 *         description: Server error
 */
router.get(
    "/:id",
    authMiddleware,
    getJobById
);

export default router;