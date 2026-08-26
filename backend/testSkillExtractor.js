import { extractJobSkills } from "./services/ai/skillExtractor.js";

const title = "Java Backend Developer";

const description = `
Looking for a Java Backend Developer with experience in Spring Boot,
REST APIs, Docker, Kubernetes, AWS, MySQL and Git.
`;

const skills = await extractJobSkills(title, description);

console.log(skills);