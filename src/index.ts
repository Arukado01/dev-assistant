import config from "./config.js";
import { askClaude } from "./llm/anthropic-client.js";

async function main(): Promise<void> {
    console.log("╔════════════════════════════════════════╗");
    console.log("║        DevAssistant - Curso IA         ║");
    console.log("║            Primera llamada             ║");
    console.log("╚════════════════════════════════════════╝");
    console.log("");
    console.log("Enviando pregunta a Claude...");
    console.log("");
    const question = "¿Qué es Typescript y en qué se diferencia de Javascript?. Responde máximo en 3 puntos concisos";
    console.log(` Pregunta: ${question}`);
    const answer = await askClaude(question);
    console.log("-".repeat(50));
    console.log(answer);
    console.log("-".repeat(50));
}

main().catch((error: Error ) => console.error(" Error: ", error.message));
