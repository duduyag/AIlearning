import { useLanguageStore } from "../i18n/languageStore";

export default function SkipLink() {
  const language = useLanguageStore((s) => s.language);

  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-white focus:px-4 focus:py-2 focus:font-700 focus:text-brand-900 focus:shadow-lg"
    >
      {language === "HE" ? "דלג לתוכן הראשי" : "Skip to main content"}
    </a>
  );
}
