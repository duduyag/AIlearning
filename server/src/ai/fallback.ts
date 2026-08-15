import { ContentLanguage } from "./types";

const FALLBACK_EN = [
  "I'm having trouble thinking right now! While I reboot, try re-reading the lesson above - the answer might already be there.",
  "Hmm, my circuits are a little busy! Take another look at the pictures and words in this lesson while I catch up.",
];

const FALLBACK_HE = [
  "אני מתקשה לחשוב כרגע! בזמן שאני מתאתחל, נסו לקרוא שוב את השיעור למעלה - אולי התשובה כבר שם.",
  "המעגלים שלי קצת עמוסים! תסתכלו שוב על התמונות והמילים בשיעור הזה בזמן שאני מתעדכן.",
];

export function getFallbackReply(language: ContentLanguage = "EN"): string {
  const pool = language === "HE" ? FALLBACK_HE : FALLBACK_EN;
  return pool[Math.floor(Math.random() * pool.length)];
}
