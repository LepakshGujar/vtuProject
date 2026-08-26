import { detectTargetRole }
from "./services/ai/roleDetector.service.js";

const resume = `
Java
Spring Boot
Docker
AWS
REST API
Node.js
MongoDB
`;

const role =
await detectTargetRole(resume);

console.log(role);