import {
    uploadResumeService,
    getMyResumeService,
    analyzeMyResumeService
} from "../services/resume.service.js";

export async function uploadResume(req, res) {
    try {

        const resume = await uploadResumeService(
            req.user.id,
            req.file
        );

        res.status(201).json({
            success: true,
            message: "Resume uploaded successfully.",
            data: resume
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
}

export async function getMyResume(req, res) {

    try {

        const resume = await getMyResumeService(req.user.id);

        res.json({
            success: true,
            data: resume
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

}

export async function analyzeMyResume(req, res) {

    try {

        const resume =
            await analyzeMyResumeService(
                req.user.id
            );

        res.json({
            success: true,
            message: "Resume analyzed successfully.",
            data: resume
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
}