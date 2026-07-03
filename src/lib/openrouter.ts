import OpenAI from "openai";

export const AI_MODELS = {
  premium: "anthropic/claude-sonnet-4-20250514",
  standard: "google/gemini-2.5-pro-preview-03-25",
  fast: "google/gemini-2.5-flash-preview-04-17",
  budget: "deepseek/deepseek-chat",
} as const;

export type ModelTier = keyof typeof AI_MODELS;

let openaiInstance: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!openaiInstance) {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error("OPENROUTER_API_KEY is not configured");
    }
    openaiInstance = new OpenAI({
      apiKey,
      baseURL: process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "X-Title": "WebForge AI",
      },
    });
  }
  return openaiInstance;
}

export async function queryAI(
  prompt: string,
  systemPrompt: string,
  tier: ModelTier = "standard",
  options?: {
    temperature?: number;
    maxTokens?: number;
    responseFormat?: "text" | "json_object";
  }
): Promise<string> {
  const openai = getOpenAI();
  const model = AI_MODELS[tier];

  const completion = await openai.chat.completions.create({
    model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ],
    temperature: options?.temperature ?? 0.7,
    max_tokens: options?.maxTokens ?? 4096,
    response_format: options?.responseFormat === "json_object"
      ? { type: "json_object" }
      : undefined,
  });

  return completion.choices[0]?.message?.content ?? "";
}

export async function queryAIJSON<T>(
  prompt: string,
  systemPrompt: string,
  tier: ModelTier = "standard"
): Promise<T> {
  const response = await queryAI(prompt, systemPrompt, tier, {
    responseFormat: "json_object",
    temperature: 0.3,
  });
  return JSON.parse(response) as T;
}
