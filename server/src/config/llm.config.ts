import { ChatOpenAI } from "@langchain/openai";
import { LLM_MODELS } from "@/utils/constant.util";

export const llm = new ChatOpenAI({
  model: LLM_MODELS.Nvidia,
  apiKey: process.env.OPENROUTER_API_KEY,
  configuration: {
    baseURL: "https://openrouter.ai/api/v1",
  },
});
