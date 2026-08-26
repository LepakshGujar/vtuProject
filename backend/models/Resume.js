import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        fileName: {
            type: String,
            required: true
        },

        fileUrl: {
            type: String,
            default: ""
        },

        // Complete extracted resume text
        extractedText: {
            type: String,
            default: ""
        },

        // Skills extracted by AI
        extractedSkills: {
            type: [String],
            default: []
        },

        // Skills already present in resume and demanded in market
        matchingSkills: {
            type: [String],
            default: []
        },

        // Skills missing compared to market demand
        missingSkills: {
            type: [String],
            default: []
        },

        // Prioritized skill gaps
        skillGaps: {
            type: [
                {
                    skill: {
                        type: String
                    },

                    demandPercentage: {
                        type: Number,
                        default: 0
                    },

                    priority: {
                        type: String,
                        enum: ["High", "Medium", "Low"],
                        default: "Low"
                    }
                }
            ],
            default: []
        },

        // AI detected target role
        targetRole: {
            type: String,
            default: ""
        },

        // Basic market skill match percentage
        matchPercentage: {
            type: Number,
            default: 0
        },

        // Weighted market skill match percentage
        weightedMatchPercentage: {
            type: Number,
            default: 0
        },

        // ATS Score
        atsScore: {
            type: Number,
            default: 0
        },

        // Resume Score
        resumeScore: {
            type: Number,
            default: 0
        },

        // AI Generated Recommendations
        recommendations: {
            type: [String],
            default: []
        },

        // AI Generated Learning Roadmap
        roadmap: {
            type: [
                {
                    week: {
                        type: String,
                        required: true
                    },
        
                    tasks: {
                        type: [String],
                        default: []
                    }
                }
            ],
            default: []
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Resume", resumeSchema);