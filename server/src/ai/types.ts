export type ContentLanguage = "EN" | "HE";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AskTutorParams {
  lessonTitle: string;
  lessonContext: string;
  history: ChatMessage[];
  message: string;
  ageGroup: number;
  language: ContentLanguage;
}

export interface AiProvider {
  name: "anthropic" | "openai" | "gemini";
  ask(params: AskTutorParams): Promise<string>;
}
