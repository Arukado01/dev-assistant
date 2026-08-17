import config from "./config.js";
import { askClaude } from "./llm/anthropic-client.js";
import { CODE_REVIEWER_PROMPT } from "./llm/prompts.js";

const CODIGO_CON_PROBLEMAS = `
async function getUser(id) {
  const query = "SELECT * FROM users WHERE id = " + id;
  const result = await db.query(query);
  return result[0];
}

function calcularDescuento(precio, tipo) {
  if (tipo == "vip") {
    return precio * 0.8;
  } else if (tipo == "regular") {
    return precio * 0.9;
  } else {
    return precio;
  }
}
`;

async function main(): Promise<void> {
    console.log("╔════════════════════════════════════════╗");
    console.log("║        DevAssistant - Curso IA         ║");
    console.log("║             System Prompts             ║");
    console.log("╚════════════════════════════════════════╝");
    console.log("");
    console.log("Demo 1: enviando código SIN system prompt");
    console.log("");
    const question = `Revisa este código: \n\`\`\`javascript\n ${CODIGO_CON_PROBLEMAS}\`\`\``;
    const answer = await askClaude(question);
    console.log("-".repeat(50));
    console.log(answer);
    console.log("-".repeat(50));
    console.log("");

    console.log("Demo 2: enviando código CON system prompt");
    console.log("");
    const reviewerPromptAnswer = await askClaude(question, CODE_REVIEWER_PROMPT);
    console.log("-".repeat(50));
    console.log(reviewerPromptAnswer);
    console.log("-".repeat(50));
    console.log("");
    
}

main().catch((error: Error ) => console.error(" Error: ", error.message));
