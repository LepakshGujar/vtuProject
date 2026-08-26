import mongoose from "mongoose";

const skillCacheSchema = new mongoose.Schema(
    {
        descriptionHash: {
            type: String,
            unique: true,
            required: true
        },

        skills: {
            type: [String],
            default: []
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("SkillCache", skillCacheSchema);