import crypto from "crypto";
import groq from "./groq.service.js";
import SkillCache from "../../models/SkillCache.js";

const MAX_DESCRIPTION_LENGTH = 6000;
const MAX_SKILLS = 25;

export async function extractJobSkills(title = "", description = "") {

    try {

        if (!title && !description) {
            return [];
        }

        const cleanTitle = String(title).trim();

        const cleanDescription = String(description)
            .replace(/\s+/g, " ")
            .trim()
            .slice(0, MAX_DESCRIPTION_LENGTH);

        // Create cache hash
        const descriptionHash = crypto
            .createHash("sha256")
            .update(`${cleanTitle}\n${cleanDescription}`)
            .digest("hex");

        // Check cache
        const cachedSkills = await SkillCache.findOne({
            descriptionHash
        });

        if (cachedSkills) {

            console.log("✅ Skills loaded from cache");

            return Array.isArray(cachedSkills.skills)
                ? cachedSkills.skills
                : [];

        }

        // AI prompt
        const prompt = `
Extract technical skills from this job posting.

Job Title:
${cleanTitle}

Job Description:
${cleanDescription}

Return ONLY a JSON object.

Format:

{
  "skills": ["Java", "Spring Boot", "MongoDB"]
}

Rules:
- Maximum 25 skills.
- Remove duplicates.
- Include programming languages.
- Include frameworks.
- Include libraries.
- Include databases.
- Include cloud technologies.
- Include DevOps technologies.
- Include important technical technologies.
- Do not include soft skills.
- Do not provide explanations.
`;

        // Groq request
    const response =
        await groq.chat.completions.create({

            model: "qwen/qwen3.6-27b",

            temperature: 0.2,

            max_completion_tokens: 500,

            reasoning_effort: "none",

            reasoning_format: "hidden",

            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ]

    });

        let content =
            response.choices?.[0]?.message?.content;

        if (!content) {

            console.error("❌ Empty AI response");

            return [];

        }

        console.log("🤖 AI Response received");

        // ---------------------------------------
        // Remove <think>...</think>
        // ---------------------------------------

        content = content
            .replace(
                /<think>[\s\S]*?<\/think>/gi,
                ""
            )
            .trim();

        // ---------------------------------------
        // Remove markdown code blocks
        // ---------------------------------------

        content = content
            .replace(/^```json\s*/i, "")
            .replace(/^```\s*/i, "")
            .replace(/\s*```$/i, "")
            .trim();

        // ---------------------------------------
        // Find JSON object
        // ---------------------------------------

        const jsonStart = content.indexOf("{");
        const jsonEnd = content.lastIndexOf("}");

        if (jsonStart === -1 || jsonEnd === -1) {

            console.error(
                "❌ No JSON object found in AI response"
            );

            return [];

        }

        const jsonText =
            content.substring(
                jsonStart,
                jsonEnd + 1
            );

        // ---------------------------------------
        // Parse JSON
        // ---------------------------------------

        let result;

        try {

            result = JSON.parse(jsonText);

        } catch (error) {

            console.error(
                "❌ Could not parse AI JSON:"
            );

            console.error(jsonText);

            return [];

        }

        // ---------------------------------------
        // Validate skills
        // ---------------------------------------

        let skills = Array.isArray(result.skills)
            ? result.skills
            : [];

        skills = skills
            .filter(
                skill =>
                    typeof skill === "string"
            )
            .map(
                skill =>
                    skill.trim()
            )
            .filter(Boolean);

        // Remove duplicates
        skills = [
            ...new Set(skills)
        ];

        // Limit skills
        skills = skills.slice(
            0,
            MAX_SKILLS
        );

        // Save cache
        await SkillCache.findOneAndUpdate(
            {
                descriptionHash
            },
            {
                descriptionHash,
                skills
            },
            {
                upsert: true,
                returnDocument: "after"
            }
        );

        console.log(
            `💾 Skills cached: ${skills.length}`
        );

        return skills;

    } catch (error) {

        console.error(
            "❌ Skill Extraction Error"
        );

        console.error(
            error.response?.data ||
            error.message
        );

        return [];

    }

}