import { PromptTemplate } from "@langchain/core/prompts";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { z } from "zod";

const promptSchema = z.object({
  prompt: z.string().min(1, "Prompt cannot be empty"),
});

const PROMPT_IMAGE_GENERATOR = PromptTemplate.fromTemplate(`
    You are an expert prompt enginner for an AI image generator . Your task is to 
    take the user's input, which is a document title, and create a single, concise
    prompt to generate a logo for it.
    The prompt you create must instruct the image generator to produce:
    A minimalistic and modern vector icon that visually  represents the title.
    The style should be flat design with clean simple lines.
    The final image must be only the logo with a transparent background.
    Your output should be the prompt itself, and nothing more.
    Here is the user's imput: {input}
`);

export const generatePrompt = async (
  llm: BaseChatModel,
  title: string,
) => {
  const withStructuredOutput = llm.withStructuredOutput(promptSchema);
  const chain = PROMPT_IMAGE_GENERATOR.pipe(withStructuredOutput);
  const chainResult = await chain.invoke({
    input: title,
  });
  return chainResult.prompt;
};
