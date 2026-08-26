import "dotenv/config";
import Groq from "groq-sdk";


const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});
console.log(process.env.GROQ_API_KEY);

export default groq;