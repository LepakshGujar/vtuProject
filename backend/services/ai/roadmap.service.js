import groq from "./groq.service.js";

export async function generateRoadmap({
    targetRole,
    extractedSkills,
    missingSkills,
    atsScore
}) {

    try {

        if (
            !missingSkills ||
            missingSkills.length === 0
        ) {

            console.log(
                "No missing skills found."
            );

            return [];

        }


        const importantMissingSkills =
            missingSkills.slice(0, 8);


        const prompt = `
You are an expert Software Engineering Career Mentor.

Create a practical 30-day learning roadmap.

Candidate Role:
${targetRole}

Current ATS Score:
${atsScore}

Current Skills:
${extractedSkills.join(", ")}

Important Missing Skills:
${importantMissingSkills.join(", ")}

Return ONLY valid JSON.

The response must contain exactly 4 roadmap items.

Each item must contain:
- week
- tasks

Each week must contain exactly 3 short and practical tasks.

Week 4 must include a practical project using some of the missing skills.

Use this JSON structure:

{
    "roadmap": [
        {
            "week": "Week 1",
            "tasks": [
                "Task 1",
                "Task 2",
                "Task 3"
            ]
        },
        {
            "week": "Week 2",
            "tasks": [
                "Task 1",
                "Task 2",
                "Task 3"
            ]
        },
        {
            "week": "Week 3",
            "tasks": [
                "Task 1",
                "Task 2",
                "Task 3"
            ]
        },
        {
            "week": "Week 4",
            "tasks": [
                "Task 1",
                "Task 2",
                "Task 3"
            ]
        }
    ]
}
`;


        const MAX_ATTEMPTS = 3;


        for (
            let attempt = 1;
            attempt <= MAX_ATTEMPTS;
            attempt++
        ) {

            try {

                console.log(
                    `Generating roadmap. Attempt ${attempt}...`
                );


                const response =
                    await groq.chat.completions.create({

                        model:
                            "openai/gpt-oss-20b",

                        temperature: 0,

                        max_tokens: 2000,

                        response_format: {
                            type: "json_object"
                        },

                        messages: [
                            {
                                role: "user",
                                content: prompt
                            }
                        ]

                    });


                const content =
                    response
                        ?.choices?.[0]
                        ?.message
                        ?.content;


                console.log(
                    "AI Roadmap Response:",
                    content
                );


                if (!content) {

                    console.error(
                        "AI returned an empty response."
                    );

                    continue;

                }


                let result;


                try {

                    result =
                        JSON.parse(content);

                } catch (error) {

                    console.error(
                        "Could not parse roadmap JSON."
                    );

                    continue;

                }


                if (
                    !Array.isArray(
                        result.roadmap
                    )
                ) {

                    console.error(
                        "Roadmap array not found."
                    );

                    continue;

                }


                // We need exactly 4 weeks
                if (
                    result.roadmap.length < 4
                ) {

                    console.error(
                        "AI returned fewer than 4 weeks."
                    );

                    continue;

                }


                // Normalize and keep first 4 weeks
                const roadmap =
                    result.roadmap
                        .slice(0, 4)
                        .map(
                            (item, index) => {

                                const tasks =
                                    Array.isArray(
                                        item.tasks
                                    )
                                        ? item.tasks
                                            .filter(
                                                task =>
                                                    typeof task ===
                                                    "string"
                                            )
                                            .map(
                                                task =>
                                                    task.trim()
                                            )
                                            .filter(
                                                task =>
                                                    task.length > 0
                                            )
                                            .slice(0, 3)
                                        : [];


                                return {

                                    week:
                                        `Week ${index + 1}`,

                                    tasks

                                };

                            }
                        );


                const isValid =
                    roadmap.length === 4 &&
                    roadmap.every(
                        item =>
                            item.tasks.length === 3
                    );


                if (!isValid) {

                    console.error(
                        "Invalid roadmap structure."
                    );

                    console.log(
                        roadmap
                    );

                    continue;

                }


                console.log(
                    "Roadmap generated successfully."
                );


                return roadmap;

            } catch (error) {

                console.error(
                    `Roadmap attempt ${attempt} failed:`,
                    error.response?.data ||
                    error.message
                );

            }

        }


        console.error(
            "Could not generate a valid roadmap."
        );

        return [];


    } catch (error) {

        console.error(
            "Roadmap Error:",
            error.response?.data ||
            error.message
        );

        return [];

    }

}