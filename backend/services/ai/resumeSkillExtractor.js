import groq from "./groq.service.js";

export async function extractResumeSkills(resumeText) {

    try {

        if (!resumeText || !resumeText.trim()) {
            console.error("❌ Resume text is empty");
            return [];
        }

        const prompt = `
You are an expert ATS Resume Analyzer.

Extract ONLY technical and professional skills from the resume.

Rules:

1. Return ONLY a JSON object.
2. The JSON object must contain exactly one key: "skills".
3. "skills" must be an array of strings.
4. No markdown.
5. No explanation.
6. Remove duplicate skills.
7. Ignore soft skills.
8. Include:
   - Programming Languages
   - Frameworks
   - Libraries
   - Databases
   - Cloud Platforms
   - DevOps Tools
   - Software
   - AI/ML Tools
   - Testing Tools
   - Security Technologies
   - Professional technical skills

Resume:

${resumeText}

Return exactly this format:

{
    "skills": [
        "Java",
        "Spring Boot",
        "Node.js"
    ]
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
            "\n========== AI RESUME RESPONSE =========="
        );

        console.log(content);

        console.log(
            "========================================\n"
        );

        if (!content) {

            console.error(
                "❌ AI returned an empty response"
            );

            return [];
        }


        // ---------------------------------------
        // 1. Remove Qwen <think>...</think>
        // ---------------------------------------

        let jsonText = content.trim();

        jsonText = jsonText.replace(
            /<think>[\s\S]*?<\/think>/gi,
            ""
        );

        jsonText = jsonText.trim();


        // ---------------------------------------
        // 2. Remove markdown code fences
        // ---------------------------------------

        jsonText = jsonText
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .trim();


        // ---------------------------------------
        // 3. Find the FIRST JSON object
        // ---------------------------------------

        const jsonMatch = jsonText.match(
            /\{\s*"skills"\s*:\s*\[[\s\S]*?\]\s*\}/
        );

        if (!jsonMatch) {

            console.error(
                "❌ No valid skills JSON found in AI response"
            );

            console.error(
                "Cleaned response:",
                jsonText
            );

            return [];
        }

        jsonText = jsonMatch[0];

        console.log(
            "✅ JSON extracted successfully"
        );


        // ---------------------------------------
        // 4. Parse JSON
        // ---------------------------------------

        let result;

        try {

            result =
                JSON.parse(jsonText);

        } catch (parseError) {

            console.error(
                "❌ Could not parse AI JSON"
            );

            console.error(
                "JSON:",
                jsonText
            );

            return [];
        }


        // ---------------------------------------
        // 5. Validate skills array
        // ---------------------------------------

        if (!Array.isArray(result.skills)) {

            console.error(
                "❌ AI JSON does not contain skills array"
            );

            return [];
        }


        // ---------------------------------------
        // 6. Clean and remove duplicates
        // ---------------------------------------

        const skills = [
            ...new Set(
                result.skills
                    .filter(
                        skill =>
                            typeof skill === "string"
                    )
                    .map(
                        skill =>
                            skill.trim()
                    )
                    .filter(
                        skill =>
                            skill.length > 0
                    )
            )
        ];


        // ---------------------------------------
        // 7. Log extracted skills
        // ---------------------------------------

        console.log(
            "✅ Extracted Resume Skills:"
        );

        console.log(skills);

        console.log(
            `✅ Total Skills: ${skills.length}`
        );


        return skills;


    } catch (error) {

        console.error(
            "❌ Resume Skill Extraction Error"
        );

        console.error(
            error.response?.data ||
            error.message
        );

        return [];

    }

}