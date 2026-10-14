import { generateTitle } from "@/langchain/title-generation.langchain";
import { create } from "@/services/note.service";
import type { Request, Response } from "express";
import path from "node:path";
import { writeFile } from "node:fs/promises";
import { llm } from "@/config/llm.config";
import { generateImage } from "@/langchain/generate-image.langchain";
import { generatePrompt } from "@/langchain/prompt-generator.langchain";
import { loadDocuments } from "@/langchain/note-loader.langchain";

export const createNote = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: "A document file is required." });
  }
  if (!req.body?.userId) {
    return res.status(400).json({ message: "userId is required." });
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  const documentPath = path.join(uploadDir, req.file.filename);
  const documents = await loadDocuments(documentPath, "text");
  const title = await generateTitle(llm, documents);
  const imagePrompt = await generatePrompt(llm, title);
  const imageBuffer = await generateImage(imagePrompt);

  const imageFilename = `${req.file.filename}.png`;
  await writeFile(path.join(uploadDir, imageFilename), imageBuffer);

  const imageUrl = `${process.env.APP_URL ?? ""}/public/uploads/${imageFilename}`;
  const note = await create({
    title,
    image: imageUrl,
    userId: req.body.userId,
  });

  return res.status(201).json(note);
};
