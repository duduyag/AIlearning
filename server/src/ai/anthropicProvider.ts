import Anthropic from "@anthropic-ai/sdk";
import { env } from "../lib/env";
import { AiProvider, AskTutorParams } from "./types";
import { tutorSystemPrompt } from "./prompts";

function client(): Anthropic {
  if (!env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not set");
  }
  return new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
}

export const anthropicProvider: AiProvider = {
  name: "anthropic",

  async ask(params: AskTutorParams): Promise<string> {
    const res = await client().messages.create({
      model: env.ANTHROPIC_MODEL,
      max_tokens: 300,
      system: tutorSystemPrompt(params),
      messages: [
        ...params.history.map((m) => ({ role: m.role, content: m.content })),
        { role: "user" as const, content: params.message },
      ],
    });

    return res.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("")
      .trim();
  },
};
