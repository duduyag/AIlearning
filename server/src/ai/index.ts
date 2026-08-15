import { env } from "../lib/env";
import { anthropicProvider } from "./anthropicProvider";
import { openaiProvider } from "./openaiProvider";
import { geminiProvider } from "./geminiProvider";
import { AiProvider, AskTutorParams } from "./types";
import { getFallbackReply } from "./fallback";

const providers: Record<string, AiProvider> = {
  anthropic: anthropicProvider,
  openai: openaiProvider,
  gemini: geminiProvider,
};

function isConfigured(provider: AiProvider): boolean {
  if (provider.name === "anthropic") return Boolean(env.ANTHROPIC_API_KEY);
  if (provider.name === "openai") return Boolean(env.OPENAI_API_KEY);
  return Boolean(env.GEMINI_API_KEY);
}

function providerOrder(): AiProvider[] {
  const primary = providers[env.AI_PROVIDER];
  const rest = Object.values(providers).filter((p) => p !== primary);
  return [primary, ...rest];
}

export async function askTutor(params: AskTutorParams): Promise<{ reply: string; provider: string }> {
  for (const provider of providerOrder().filter(isConfigured)) {
    try {
      const reply = await provider.ask(params);
      if (reply) return { reply, provider: provider.name };
    } catch (err) {
      console.error(`[ai] ${provider.name} ask failed:`, (err as Error).message);
    }
  }

  return { reply: getFallbackReply(params.language), provider: "fallback" };
}
