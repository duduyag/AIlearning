import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, UserPlus } from "lucide-react";
import { api, apiErrorMessage } from "../lib/api";
import { useAuthStore } from "../store/authStore";
import { AuthResponse } from "@ai-explorers/shared";
import { useT } from "../i18n/useT";
import LanguageToggle from "../components/LanguageToggle";
import RobotMascot from "../components/illustrations/RobotMascot";

export default function Signup() {
  const { t, language } = useT();
  const [form, setForm] = useState({
    displayName: "",
    username: "",
    email: "",
    password: "",
    ageGroup: 9,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.post<AuthResponse>("/auth/signup", { ...form, language });
      setAuth(res.data.user, res.data.accessToken);
      navigate("/course", { replace: true });
    } catch (err) {
      setError(apiErrorMessage(err, "Could not create your account. Please check your details."));
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
        <Link to="/" className="mb-2 flex items-center justify-center gap-2 font-display text-xl font-800">
          <Sparkles className="h-6 w-6 text-accent-400" aria-hidden="true" />
          {t("common.appName")}
        </Link>

        <RobotMascot className="mx-auto w-24" />

        <h1 className="text-center font-display text-2xl font-700">{t("auth.joinCourse")}</h1>
        <p className="mt-1 text-center text-sm text-white/60">{t("auth.signupSubtitle")}</p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div>
            <label htmlFor="signup-name" className="mb-1 block text-sm font-700 text-white/80">
              {t("auth.displayNameLabel")}
            </label>
            <input
              id="signup-name"
              className="input-field"
              value={form.displayName}
              onChange={(e) => update("displayName", e.target.value)}
              maxLength={40}
              required
            />
          </div>
          <div>
            <label htmlFor="signup-username" className="mb-1 block text-sm font-700 text-white/80">
              {t("auth.username")}
            </label>
            <input
              id="signup-username"
              className="input-field"
              value={form.username}
              onChange={(e) => update("username", e.target.value)}
              pattern="[a-zA-Z0-9_]{3,20}"
              title="3-20 letters, numbers, or underscores"
              required
            />
          </div>
          <div>
            <label htmlFor="signup-email" className="mb-1 block text-sm font-700 text-white/80">
              {t("auth.parentEmail")}
            </label>
            <input
              id="signup-email"
              type="email"
              className="input-field"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="signup-password" className="mb-1 block text-sm font-700 text-white/80">
              {t("auth.password")}
            </label>
            <input
              id="signup-password"
              type="password"
              className="input-field"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              minLength={8}
              required
            />
          </div>
          <div>
            <label htmlFor="signup-age" className="mb-1 block text-sm font-700 text-white/80">
              {t("auth.age")}: {form.ageGroup}
            </label>
            <input
              id="signup-age"
              type="range"
              min={7}
              max={12}
              value={form.ageGroup}
              onChange={(e) => update("ageGroup", Number(e.target.value))}
              className="w-full accent-accent-500"
              aria-valuemin={7}
              aria-valuemax={12}
              aria-valuenow={form.ageGroup}
            />
          </div>

          {error && (
            <p role="alert" className="rounded-lg bg-red-500/20 px-3 py-2 text-sm text-red-200">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} className="btn-primary mt-2 disabled:opacity-60">
            <UserPlus className="h-4 w-4" aria-hidden="true" />
            {loading ? t("auth.creatingAccount") : t("auth.createAccountBtn")}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-white/60">
          {t("auth.alreadyLearning")}{" "}
          <Link to="/login" className="font-700 text-accent-300 hover:underline">
            {t("auth.login")}
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
