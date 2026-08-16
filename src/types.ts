export type Role = "user" | "assistant";
export interface Message {
    role: Role,
    content: string;
}

export interface ToolDefinition {
    name: string;
    description: string;
    input_schema: {
        type: "object";
        properties: Record<string, unknown>;
        required?: string[];
    }
}

export interface ToolResult {
    toolName: string;
    toolUseId: string;
    result: string;
    isError: boolean;
}

export interface Chunck {
    id: string;
    content: string;
    metadata: {
        source: string;
        heading: string;
        position: number;
        charCount: number;
    }
}

export interface RetrievedChunk extends Chunck {
    score: number;
}

export interface searchResult {
    chunk: Chunck;
    score: number;
}

export type ModelProvier = "anthropic" | "openai";

export interface AppConfig {
    provider: ModelProvier;
    anthropicApiKey: string;
    openaiApiKey: string;
    anthropicModel: string;
    openaiModel: string;
    openaiEmbeddingModel: string;
    docsPath: string;
    dbPath: string;
    ragTopK: number;
}

export interface AgentResponse {
    text: string;
    toolsUsed: string[];
    inputTokens: number;
    outputTokens: number;
}
