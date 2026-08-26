import mongoose from "mongoose";

const skillTrendSchema = new mongoose.Schema(
    {
        skill: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            index: true
        },

        demandCount: {
            type: Number,
            default: 0
        },

        percentage: {
            type: Number,
            default: 0
        },

        category: {
            type: String,
            default: "General"
        },

        lastUpdated: {
            type: Date,
            default: Date.now
        },

        jobTitles: {
            type: [String],
            default: []
        },

        locations: {
            type: [String],
            default: []
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.models.SkillTrend ||
    mongoose.model("SkillTrend", skillTrendSchema);