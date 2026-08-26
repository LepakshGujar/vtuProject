import express from "express";

import upload from "../config/multer.js";

import {
    uploadResume,
    getMyResume,
    analyzeMyResume
} from "../controllers/resume.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Resume
 *   description: Resume management and analysis APIs
 */

/**
 * @swagger
 * /api/resume/upload:
 *   post:
 *     summary: Upload a resume
 *     tags: [Resume]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - resume
 *             properties:
 *               resume:
 *                 type: string
 *                 format: binary
 *                 description: Resume file to upload
 *     responses:
 *       201:
 *         description: Resume uploaded successfully
 *       400:
 *         description: Invalid file or request
 *       401:
 *         description: Unauthorized
 */
router.post(
    "/upload",
    authMiddleware,
    upload.single("resume"),
    uploadResume
);


/**
 * @swagger
 * /api/resume/me:
 *   get:
 *     summary: Get logged-in user's latest resume
 *     tags: [Resume]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Resume retrieved successfully
 *       404:
 *         description: Resume not found
 *       401:
 *         description: Unauthorized
 */
router.get(
    "/me",
    authMiddleware,
    getMyResume
);


/**
 * @swagger
 * /api/resume/analyze:
 *   post:
 *     summary: Analyze logged-in user's resume
 *     tags: [Resume]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Resume analyzed successfully
 *       404:
 *         description: Resume not found
 *       401:
 *         description: Unauthorized
 */
router.post(
    "/analyze",
    authMiddleware,
    analyzeMyResume
);

export default router;