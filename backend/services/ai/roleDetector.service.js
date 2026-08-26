import groq from "./groq.service.js";

export async function detectTargetRole(resumeText) {

    try {

        if (!resumeText || !resumeText.trim()) {
            console.error("❌ Resume text is empty");
            return "";
        }

        const prompt = `
You are an expert HR Recruiter and ATS system.

Analyze the resume and identify the SINGLE most suitable job role.

IMPORTANT RULES:

1. Return ONLY a valid JSON object.
2. Do NOT include markdown.
3. Do NOT include explanation.
4. Do NOT include <think> tags.
5. Do NOT return placeholders such as "<role>", "role", or "N/A".
6. The "targetRole" value must contain the ACTUAL job role detected from the resume.
7. Use a maximum of 3 words.

Examples of valid roles:

Backend Developer
Frontend Developer
Full Stack Developer
Data Analyst
Data Scientist
Machine Learning Engineer
DevOps Engineer
Cloud Engineer
Cyber Security Analyst
UI UX Designer

Resume:

${resumeText}

Return ONLY this JSON format:

{
    "targetRole": "Actual detected role"
}
`;

        const completion =
            await groq.chat.completions.create({

                model: "qwen/qwen3.6-27b",

                temperature: 0,

                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ]

            });


        const content =
            completion?.choices?.[0]?.message?.content;


        console.log(
            "\n========== AI ROLE RESPONSE =========="
        );

        console.log(content);

        console.log(
            "======================================\n"
        );


        if (!content) {

            console.error(
                "❌ AI returned empty role response"
            );

            return "";
        }


        // Remove <think>...</think>
        let jsonText = content.trim();

        jsonText = jsonText.replace(
            /<think>[\s\S]*?<\/think>/gi,
            ""
        ).trim();


        // Remove markdown code blocks
        jsonText = jsonText
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .trim();


        // Find JSON object
        const startIndex =
            jsonText.indexOf("{");

        const endIndex =
            jsonText.lastIndexOf("}");


        if (
            startIndex === -1 ||
            endIndex === -1 ||
            endIndex <= startIndex
        ) {

            console.error(
                "❌ Role JSON not found"
            );

            return "";
        }


        jsonText = jsonText.substring(
            startIndex,
            endIndex + 1
        );


        // Parse JSON
        let result;

        try {

            result = JSON.parse(jsonText);

        } catch (error) {

            console.error(
                "❌ Could not parse role JSON"
            );

            console.error(jsonText);

            return "";
        }


        // Validate role
        const targetRole =
            typeof result.targetRole === "string"
                ? result.targetRole.trim()
                : "";


        // Reject invalid placeholder values
        const invalidRoles = [
            "",
            "<role>",
            "role",
            "n/a",
            "na",
            "unknown"
        ];


        if (
            invalidRoles.includes(
                targetRole.toLowerCase()
            )
        ) {

            console.error(
                "❌ Invalid target role:",
                targetRole
            );

            return "";
        }


        console.log(
            "✅ Detected Target Role:",
            targetRole
        );


        return targetRole;


    } catch (error) {

        console.error(
            "❌ Target Role Detection Error:",
            error.response?.data ||
            error.message
        );

        return "";
    }

}