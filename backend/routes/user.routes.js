import express from "express";

import authMiddleware from "../middleware/auth.middleware.js";

import {
    getProfile,
    updateProfile
} from "../controllers/user.controller.js";

const router = express.Router();


/**
 * @swagger
 * tags:
 *   name: User
 *   description: User profile management APIs
 */


/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Get logged-in user's profile
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get(
    "/profile",
    authMiddleware,
    getProfile
);


/**
 * @swagger
 * /api/user/profile:
 *   put:
 *     summary: Update logged-in user's profile
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.put(
    "/profile",
    authMiddleware,
    updateProfile
);


export default router;