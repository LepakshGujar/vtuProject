import groq from "./groq.service.js";

export async function generateRecommendations({
    targetRole,
    extractedSkills,
    missingSkills,
    atsScore
}) {

    try {

        if (!missingSkills || missingSkills.length === 0) {
            return [];
        }

        // Only use the most important missing skills
        const importantMissingSkills =
            missingSkills.slice(0, 7);

        const prompt = `
You are an expert Career Coach and Hiring Manager.

Candidate Target Role:
${targetRole}

Current ATS Score:
${atsScore}

Candidate Skills:
${extractedSkills.join(", ")}

Important Missing Skills:
${importantMissingSkills.join(", ")}

Generate practical recommendations for this candidate.

IMPORTANT:
Return ONLY the final JSON object.
Do NOT show reasoning.
Do NOT write <think>.
Do NOT provide an example.
Do NOT write anything before or after the JSON.

Rules:

1. Return one JSON object with exactly one key: "recommendations".
2. "recommendations" must be an array of strings.
3. Generate exactly 7 recommendations.
4. Each recommendation must be complete and specific.
5. Each recommendation must be under 25 words.
6. Focus mainly on the important missing skills.
7. Include learning, project building, testing, cloud/DevOps, and interview preparation.
8. Do not repeat recommendations.
9. No markdown.
10. No explanation.

Return ONLY:

{
    "recommendations": [
        "Recommendation 1",
        "Recommendation 2",
        "Recommendation 3",
        "Recommendation 4",
        "Recommendation 5",
        "Recommendation 6",
        "Recommendation 7"
    ]
}
`;

        // ---------------------------------------
        // Call Groq
        // ---------------------------------------

        const response =
            await groq.chat.completions.create({

                model: "qwen/qwen3.6-27b",

                temperature: 0,

                max_tokens: 4000,

                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ]

            });


        // ---------------------------------------
        // Get AI response
        // ---------------------------------------

        const content =
            response?.choices?.[0]?.message?.content;

        console.log(
            "\n========== AI RECOMMENDATION RESPONSE =========="
        );

        console.log(content);

        console.log(
            "=================================================\n"
        );


        if (!content) {

            console.error(
                "❌ AI returned empty recommendation response"
            );

            return [];
        }


        // ---------------------------------------
        // Remove <think>...</think>
        // ---------------------------------------

        let jsonText =
            content.trim();

        jsonText =
            jsonText.replace(
                /<think>[\s\S]*?<\/think>/gi,
                ""
            ).trim();


        // ---------------------------------------
        // Remove markdown fences
        // ---------------------------------------

        jsonText =
            jsonText
                .replace(/```json/gi, "")
                .replace(/```/g, "")
                .trim();


        // ---------------------------------------
        // Find JSON object
        // ---------------------------------------

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
                "❌ Complete recommendation JSON not found"
            );

            console.error(
                "Cleaned response:",
                jsonText
            );

            return [];
        }


        // ---------------------------------------
        // Extract JSON
        // ---------------------------------------

        jsonText =
            jsonText.substring(
                startIndex,
                endIndex + 1
            );


        // ---------------------------------------
        // Parse JSON
        // ---------------------------------------

        let result;

        try {

            result =
                JSON.parse(jsonText);

        } catch (error) {

            console.error(
                "❌ Could not parse recommendation JSON"
            );

            console.error(
                jsonText
            );

            return [];
        }


        // ---------------------------------------
        // Validate recommendations
        // ---------------------------------------

        if (
            !result ||
            !Array.isArray(result.recommendations)
        ) {

            console.error(
                "❌ Recommendations array not found"
            );

            return [];
        }


        // ---------------------------------------
        // Clean recommendations
        // ---------------------------------------

        const recommendations =
            [
                ...new Set(
                    result.recommendations
                        .filter(
                            recommendation =>
                                typeof recommendation === "string"
                        )
                        .map(
                            recommendation =>
                                recommendation.trim()
                        )
                        .filter(
                            recommendation =>
                                recommendation.length > 0
                        )
                )
            ]
            .slice(0, 7);


        // ---------------------------------------
        // Success
        // ---------------------------------------

        console.log(
            "✅ Recommendations generated:"
        );

        console.log(
            recommendations
        );


        return recommendations;


    } catch (error) {

        console.error(
            "❌ Recommendation Error:"
        );

        console.error(
            error.response?.data ||
            error.message
        );

        return [];

    }

}