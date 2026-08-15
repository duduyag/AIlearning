import clsx from "clsx";
import { Languages } from "lucide-react";
import { useLanguagePreference } from "../i18n/useLanguagePreference";

export default function LanguageToggle({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage } = useLanguagePreference();

  return (
    <div className="inline-flex items-center gap-1 rounded-full glass-panel p-1" role="group" aria-label="Language / שפה">
      <Languages className="ms-2 h-3.5 w-3.5 text-white/50" aria-hidden="true" />
      <button
        type="button"
        onClick={() => setLanguage("EN")}
        aria-pressed={language === "EN"}
        className={clsx(
          "rounded-full px-3 py-1 text-xs font-700 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-white",
          language === "EN" ? "bg-white/20 text-white" : "text-white/60 hover:text-white"
        )}
      >
        {compact ? "EN" : "English"}
      </button>
      <button
        type="button"
        onClick={() => setLanguage("HE")}
        aria-pressed={language === "HE"}
        className={clsx(
          "rounded-full px-3 py-1 text-xs font-700 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-white",
          language === "HE" ? "bg-white/20 text-white" : "text-white/60 hover:text-white"
        )}
      >
        {compact ? "עב" : "עברית"}
      </button>
    </div>
  );
}
