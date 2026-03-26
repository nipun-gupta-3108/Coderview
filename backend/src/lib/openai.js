import { ENV } from "./env.js";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

export async function createAICompletion(messages) {
  if (!ENV.OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY is missing");
  }

  const response = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ENV.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": ENV.CLIENT_URL || "http://localhost:5173",
      "X-Title": "Coderview",
    },
    body: JSON.stringify({
      model: ENV.AI_MODEL,
      messages,
      temperature: 0.4,
      max_tokens: 500,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || data?.message || "AI request failed");
  }

  return data?.choices?.[0]?.message?.content?.trim() || "";
}
