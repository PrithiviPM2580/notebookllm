export const LLM_MODELS = {
  Nvidia: "openrouter:nvidia/nemotron-3.5-lightning:free",
  Cohere: "openrouter:cohere/north-mini-code:free",
  Gemma: "openrouter:google/gemma-4-26b-a4b-it:free",
  Laguna: "openrouter:poolside/laguna-xs-2.1:free",
  LFM: "openrouter:liquid/lfm-2.5-2.6b:free",
} as const;

export type LlmModel = (typeof LLM_MODELS)[keyof typeof LLM_MODELS];
