import OpenAI from "openai";
import { env } from "../lib/env";
import { AiProvider, AskTutorParams } from "./types";
import { tutorSystemPrompt } from "./prompts";

function client(): OpenAI {
  if (!env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not set");
  }
  return new OpenAI({ apiKey: env.OPENAI_API_KEY });
}

export const openaiProvider: AiProvider = {
  name: "openai",

  async ask(params: AskTutorParams): Promise<string> {
    const res = await client().chat.completions.create({
      model: env.OPENAI_MODEL,
      messages: [
        { role: "system", content: tutorSystemPrompt(params) },
        ...params.history.map((m) => ({ role: m.role, content: m.content })),
        { role: "user" as const, content: params.message },
      ],
    });

    return (res.choices[0]?.message?.content ?? "").trim();
  },
};
