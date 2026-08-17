import * as fs from 'fs/promises';
import * as path from 'path';
import type { Chunck } from '../types.js'

const MAX_CHUNK_SIZE = 2000;

export function chunkMarkdown(content: string, filePath: string): Chunck[] {
    const fileName = path.basename(filePath);
    const chunks: Chunck[] = [];

    const sections = content.split(/(?=^## )/m);

    let globalPosition = 0;
    let lastParagraph = "";

    for (const section of sections) {
        if (!section.trim()) continue;

        const lines = section.split("\n");
        const firstLine = lines[0] ?? "";
        const isHeading = firstLine.startsWith("## ");
        const heading = isHeading ? firstLine.trim() : "(Introducción)";

        if (section.length <= MAX_CHUNK_SIZE) {
            const chunckContent = lastParagraph ? `${lastParagraph}\n\n${section.trim()}` : section.trim();

            chunks.push({
                id: `${fileName}-${globalPosition}`,
                content: chunckContent,
                metadata: {
                    source: fileName,
                    heading,
                    position: globalPosition,
                    charCount: chunckContent.length,
                },
            });

            const paragraphs = section.trim().split(/\n\n+/);
            lastParagraph = paragraphs[paragraphs.length - 1] ?? "";
            globalPosition++;
            continue;
        }

        const paragraphs = section.split(/\n\n+/).filter(p => p.trim().length > 0);
        let currentChunk = lastParagraph ? `${lastParagraph}\n\n` : "";

        for (let index = 0; index < paragraphs.length; index++) {
            const paragraph = paragraphs[index] ?? "";

            if (currentChunk.length > 0 && currentChunk.length + paragraph.length > MAX_CHUNK_SIZE) {
                const chunckContent = isHeading ? `${heading}\n\n${currentChunk.trim()}` : currentChunk.trim();
                chunks.push({
                    id: `${fileName}-${globalPosition}`,
                    content: chunckContent,
                    metadata: {
                        source: fileName,
                        heading,
                        position: globalPosition,
                        charCount: chunckContent.length,
                    },
                });

                const chunckParagraphs = currentChunk.trim().split(/\n\n+/);
                lastParagraph = chunckParagraphs[chunckParagraphs.length - 1] ?? "";
                currentChunk = `${lastParagraph}\n\n`;
                globalPosition++;
            }

            currentChunk += paragraph + "\n\n";
        }

        if (currentChunk.trim().length > 0) {
            const chunckContent = isHeading ? `${heading}\n\n${currentChunk.trim()}` : currentChunk.trim();
            chunks.push({
                id: `${fileName}-${globalPosition}`,
                content: chunckContent,
                metadata: {
                    source: fileName,
                    heading,
                    position: globalPosition,
                    charCount: chunckContent.length,
                },
            });

            const finalParagraphs = currentChunk.trim().split(/\n\n+/);
            lastParagraph = finalParagraphs[finalParagraphs.length - 1] ?? "";
            globalPosition++;
        }
    }

    return chunks;
}

export async function processDirectory(dirPath: string): Promise<Chunck[]> {
    const allChunks: Chunck[] = [];
    let entries;

    try {
        entries = await fs.readdir(dirPath, { withFileTypes: true });
    } catch (error) {
        throw new Error(`No se pudo leer el directorio: ${dirPath}`)
    }

    const markdownFiles = entries.filter(entry => entry.isFile() && entry.name.endsWith(".md")).sort((a, b) => a.name.localeCompare(b.name));

    for (const file of markdownFiles) {
        const fullPath = path.join(dirPath, file.name);

        let content: string;

        try {
            content = await fs.readFile(fullPath, "utf-8");
        } catch (error) {
            console.warn(`No se pudo leer: ${file.name}`);
            continue;
        }

        const chunks = chunkMarkdown(content, file.name);
        allChunks.push(...chunks);
        console.log(`Procesando ${file.name}... ${chunks.length} chunks generados`);
    }

    return allChunks;
}
