import { useCallback } from "react";
import { useLanguageStore } from "./languageStore";
import { translations } from "./translations";

function getPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => (acc && typeof acc === "object" ? (acc as Record<string, unknown>)[key] : undefined), obj);
}

export function useT() {
  const language = useLanguageStore((s) => s.language);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      const raw = getPath(translations[language], key);
      let text = typeof raw === "string" ? raw : key;
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          text = text.replace(`{${k}}`, String(v));
        }
      }
      return text;
    },
    [language]
  );

  return { t, language };
}
