import dotenv from "dotenv";
dotenv.config();

import groq from "./services/ai/groq.service.js";

try {
    const models = await groq.models.list();

    console.log("\n========== AVAILABLE GROQ MODELS ==========\n");

    models.data.forEach((model) => {
        console.log(model.id);
    });

    console.log("\n==========================================\n");

} catch (error) {
    console.error("❌ Error:", error.message);
}