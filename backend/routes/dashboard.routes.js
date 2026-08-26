import express from "express";

import {
    getDashboardOverview
} from "../controllers/dashboard.controller.js";

import authMiddleware
    from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard overview APIs
 */

/**
 * @swagger
 * /api/dashboard/overview:
 *   get:
 *     summary: Get dashboard overview
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to load dashboard data
 */
router.get(
    "/overview",
    authMiddleware,
    getDashboardOverview
);

export default router;