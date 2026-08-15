import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useLanguagePreference } from "../i18n/useLanguagePreference";

const CONTENT = {
  EN: {
    title: "Accessibility Statement",
    updated: "Last updated",
    intro:
      "AI Explorers is committed to making this site usable by everyone, including children and adults using assistive technology. We build toward the Web Content Accessibility Guidelines (WCAG) 2.1 level AA, which form the technical basis referenced by Israel's accessibility regulations (Israeli Standard 5568).",
    sections: [
      {
        heading: "What we've done",
        items: [
          "Semantic landmarks (header, navigation, main content) and a skip-to-content link on every page",
          "Keyboard-navigable interface with visible focus indicators on every interactive element",
          "Text alternatives for icon-only buttons and decorative elements marked as hidden from screen readers",
          "Color contrast checked against WCAG AA thresholds for body text and interactive controls",
          "Support for both English and Hebrew, including right-to-left layout",
          "Forms with associated labels and clear error messages",
          "Decorative animations are disabled site-wide when the operating system's reduced-motion setting is on",
        ],
      },
      {
        heading: "Known limitations",
        items: ["AI Tutor chat replies are not manually reviewed for accessibility phrasing before being shown to learners"],
      },
      {
        heading: "Feedback",
        items: [
          "If you encounter an accessibility barrier anywhere on this site, please let us know so we can fix it. This statement reflects our own technical implementation and has not yet undergone a formal third-party accessibility audit.",
        ],
      },
    ],
    back: "Back",
  },
  HE: {
    title: "הצהרת נגישות",
    updated: "עודכן לאחרונה",
    intro:
      "AI Explorers מחויבת להנגיש את האתר לכל המשתמשים, כולל ילדים ומבוגרים המשתמשים בטכנולוגיה מסייעת. אנו בונים את האתר בהתאם להנחיות הנגישות לתוכן אינטרנט (WCAG) ברמה AA, המהווים את הבסיס הטכני עליו מסתמכות תקנות הנגישות בישראל (תקן ישראלי 5568).",
    sections: [
      {
        heading: "מה כבר עשינו",
        items: [
          'אזורי ניווט סמנטיים (כותרת, ניווט, תוכן ראשי) וקישור "דלג לתוכן" בכל עמוד',
          "ממשק הניתן לניווט במקלדת עם סימון פוקוס ברור על כל רכיב אינטראקטיבי",
          "טקסט חלופי לכפתורים המבוססים על אייקון בלבד, ורכיבים דקורטיביים המוסתרים מקוראי מסך",
          "בדיקת ניגודיות צבעים מול רף WCAG AA עבור טקסט ורכיבים אינטראקטיביים",
          "תמיכה בעברית ובאנגלית, כולל פריסה מימין לשמאל",
          "טפסים עם תוויות מקושרות והודעות שגיאה ברורות",
          'אנימציות דקורטיביות מושבתות בכל האתר כאשר הגדרת "הפחתת תנועה" של מערכת ההפעלה פעילה',
        ],
      },
      {
        heading: "מגבלות ידועות",
        items: ["תשובות הצ'אט של מורה ה-AI לא נבדקות ידנית מבחינת ניסוח נגיש לפני שהן מוצגות ללומדים"],
      },
      {
        heading: "משוב",
        items: [
          "אם נתקלתם במחסום נגישות בכל מקום באתר, אנא ספרו לנו כדי שנוכל לתקן זאת. הצהרה זו משקפת את היישום הטכני שלנו ועדיין לא עברה ביקורת נגישות רשמית על ידי גורם חיצוני.",
        ],
      },
    ],
    back: "חזרה",
  },
};

export default function Accessibility() {
  const { language } = useLanguagePreference();
  const content = CONTENT[language];

  return (
    <div className="min-h-screen bg-hero-gradient px-4 py-10 text-white">
      <div className="mx-auto max-w-2xl">
        <Link to="/" className="mb-6 inline-flex items-center gap-1 text-sm text-white/60 hover:text-white">
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
          {content.back}
        </Link>

        <div className="glass-card p-8">
          <h1 className="font-display text-3xl font-800">{content.title}</h1>
          <p className="mt-1 text-xs text-white/50">{content.updated}: 2026-08-15</p>
          <p className="mt-4 text-white/80">{content.intro}</p>

          {content.sections.map((section) => (
            <div key={section.heading} className="mt-6">
              <h2 className="font-display text-lg font-700">{section.heading}</h2>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-white/70">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
