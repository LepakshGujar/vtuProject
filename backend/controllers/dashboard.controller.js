import {
    getDashboardOverviewService
} from "../services/dashboard.service.js";

export async function getDashboardOverview(req, res) {

    try {

        const data =
            await getDashboardOverviewService(
                req.user.id
            );

        res.status(200).json({

            success: true,

            data

        });

    } catch (error) {

        console.error(
            "Dashboard Error:",
            error.message
        );

        res.status(500).json({

            success: false,

            message:
                "Failed to load dashboard data."

        });

    }

}