import { useCallback, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useLanguageStore, isRtl } from "./languageStore";
import { Language } from "./translations";
import { useAuthStore } from "../store/authStore";
import { api } from "../lib/api";

/**
 * Keeps <html lang/dir> in sync with the current language, pulls the account's saved
 * language preference in as soon as the user is known (so it's remembered across
 * devices/sessions), and exposes a setter that persists the choice - to the account
 * when logged in, to localStorage always (so it also works for guests pre-signup).
 */
export function useLanguagePreference() {
  const language = useLanguageStore((s) => s.language);
  const setLanguageLocal = useLanguageStore((s) => s.setLanguage);
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const syncedForUserId = useRef<string | null>(null);
  const queryClient = useQueryClient();
  const isFirstRender = useRef(true);

  useEffect(() => {
    document.documentElement.lang = language === "HE" ? "he" : "en";
    document.documentElement.dir = isRtl(language) ? "rtl" : "ltr";
  }, [language]);

  // Server-fetched content (lesson text, quiz, dashboard labels, achievement names) is
  // localized server-side, so any already-cached response is stale the moment the
  // language changes - regardless of whether that change came from the toggle or from
  // syncing the account's saved preference on login.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    queryClient.invalidateQueries({ queryKey: ["course"] });
    queryClient.invalidateQueries({ queryKey: ["lesson"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    queryClient.invalidateQueries({ queryKey: ["achievements"] });
  }, [language, queryClient]);

  useEffect(() => {
    if (user && syncedForUserId.current !== user.id) {
      syncedForUserId.current = user.id;
      if (user.language !== language) {
        setLanguageLocal(user.language);
      }
    }
    if (!user) syncedForUserId.current = null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, user?.language]);

  const setLanguage = useCallback(
    (next: Language) => {
      setLanguageLocal(next);
      if (user) {
        updateUser({ language: next });
        api.patch("/users/me/language", { language: next }).catch(() => {});
      }
    },
    [user, setLanguageLocal, updateUser]
  );

  return { language, setLanguage };
}
