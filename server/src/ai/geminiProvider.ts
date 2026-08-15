import { env } from "../lib/env";
import { AiProvider, AskTutorParams } from "./types";
import { tutorSystemPrompt } from "./prompts";

interface InteractionStep {
  type: string;
  content?: { type: string; text?: string }[];
}

interface InteractionsResponse {
  steps?: InteractionStep[];
  error?: { message: string };
}

const ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/interactions";

export const geminiProvider: AiProvider = {
  name: "gemini",

  async ask(params: AskTutorParams): Promise<string> {
    if (!env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not set");
    }

    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": env.GEMINI_API_KEY,
      },
      body: JSON.stringify({
        model: env.GEMINI_MODEL,
        system_instruction: tutorSystemPrompt(params),
        input: [
          ...params.history.map((m) => ({
            type: m.role === "assistant" ? "model_output" : "user_input",
            content: [{ type: "text", text: m.content }],
          })),
          { type: "user_input", content: [{ type: "text", text: params.message }] },
        ],
      }),
    });

    const data = (await res.json()) as InteractionsResponse;
    if (!res.ok) {
      throw new Error(`Gemini API error ${res.status}: ${data.error?.message ?? JSON.stringify(data)}`);
    }

    const modelStep = data.steps?.find((s) => s.type === "model_output");
    const text = modelStep?.content?.map((c) => c.text ?? "").join("") ?? "";
    return text.trim();
  },
};
