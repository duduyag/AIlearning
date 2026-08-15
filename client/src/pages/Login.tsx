import { FormEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, LogIn } from "lucide-react";
import { api, apiErrorMessage } from "../lib/api";
import { useAuthStore } from "../store/authStore";
import { AuthResponse } from "@ai-explorers/shared";
import { useT } from "../i18n/useT";
import LanguageToggle from "../components/LanguageToggle";

export default function Login() {
  const { t } = useT();
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? "/course";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.post<AuthResponse>("/auth/login", { emailOrUsername, password });
      setAuth(res.data.user, res.data.accessToken);
      navigate(from, { replace: true });
    } catch (err) {
      setError(apiErrorMessage(err, "Could not log in. Check your details and try again."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-hero-gradient px-4 py-10 text-white">
      <LanguageToggle compact />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card w-full max-w-md p-8"
      >
        <Link to="/" className="mb-6 flex items-center justify-center gap-2 font-display text-xl font-800">
          <Sparkles className="h-6 w-6 text-accent-400" aria-hidden="true" />
          {t("common.appName")}
        </Link>

        <h1 className="text-center font-display text-2xl font-700">{t("auth.welcomeBack")}</h1>
        <p className="mt-1 text-center text-sm text-white/60">{t("auth.loginSubtitle")}</p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div>
            <label htmlFor="login-email" className="mb-1 block text-sm font-700 text-white/80">
              {t("auth.emailOrUsername")}
            </label>
            <input
              id="login-email"
              className="input-field"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>
          <div>
            <label htmlFor="login-password" className="mb-1 block text-sm font-700 text-white/80">
              {t("auth.password")}
            </label>
            <input
              id="login-password"
              type="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <p role="alert" className="rounded-lg bg-red-500/20 px-3 py-2 text-sm text-red-200">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} className="btn-primary mt-2 disabled:opacity-60">
            <LogIn className="h-4 w-4" aria-hidden="true" />
            {loading ? t("auth.loggingIn") : t("auth.login")}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-white/60">
          {t("auth.newHere")}{" "}
          <Link to="/signup" className="font-700 text-accent-300 hover:underline">
            {t("auth.createAccount")}
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
