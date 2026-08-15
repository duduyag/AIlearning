import { create } from "zustand";
import { Language } from "./translations";

const STORAGE_KEY = "aie_lang";

function readStoredLanguage(): Language {
  if (typeof window === "undefined") return "EN";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "HE" || stored === "EN" ? stored : "EN";
}

interface LanguageState {
  language: Language;
  setLanguage: (language: Language) => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: readStoredLanguage(),
  setLanguage: (language) => {
    window.localStorage.setItem(STORAGE_KEY, language);
    set({ language });
  },
}));

export function isRtl(language: Language): boolean {
  return language === "HE";
}
