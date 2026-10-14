import { PromptTemplate } from "@langchain/core/prompts";
import { formatDocumentsAsString } from "@langchain/classic/util/document";
import type { Document } from "@langchain/core/documents";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { z } from "zod";

const titleSchema = z.object({
  title: z
    .string()
    .min(1, "Title cannot be empty")
    .max(60, "Title cannot exceed 60 characters"),
});

const GENERATE_TITLE_PROMPT = PromptTemplate.fromTemplate(`
    You are a helpful assistant that generate concise and clear titles.
    Based on the  following document content, create a single title that
    captures the main theme or subject of the document.
    Document Content:
    {document}
    Title:
`);

export const generateTitle = async (
  llm: BaseChatModel,
  doc: Document<Record<string, any>>[],
) => {
  const docToString = formatDocumentsAsString(doc);
  const structuresLlm = llm.withStructuredOutput(titleSchema);
  const chain = GENERATE_TITLE_PROMPT.pipe(structuresLlm);

  const chainResult = await chain.invoke({
    document: docToString,
  });

  return chainResult.title;
};
