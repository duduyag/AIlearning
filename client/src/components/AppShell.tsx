import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { BookOpen, LayoutDashboard, Award, ShieldCheck, LogOut, Sparkles } from "lucide-react";
import clsx from "clsx";
import { useAuthStore } from "../store/authStore";
import { useThemeStore } from "../store/themeStore";
import { api } from "../lib/api";
import { useT } from "../i18n/useT";
import LanguageToggle from "./LanguageToggle";

const LEVEL_BACKGROUNDS: Record<number, string> = {
  1: "bg-hero-gradient",
  2: "bg-hero-gradient-2",
  3: "bg-hero-gradient-3",
};

export default function AppShell() {
  const { t } = useT();
  const { user, clearAuth } = useAuthStore();
  const levelOrder = useThemeStore((s) => s.levelOrder);
  const navigate = useNavigate();

  const navItems = [
    { to: "/course", label: t("nav.course"), icon: BookOpen },
    { to: "/dashboard", label: t("nav.dashboard"), icon: LayoutDashboard },
    { to: "/achievements", label: t("nav.achievements"), icon: Award },
  ];

  async function handleLogout() {
    try {
      await api.post("/auth/logout");
    } finally {
      clearAuth();
      navigate("/");
    }
  }

  return (
    <div className={clsx("min-h-screen", LEVEL_BACKGROUNDS[levelOrder] ?? LEVEL_BACKGROUNDS[1])}>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <NavLink to="/course" className="flex items-center gap-2 font-display text-xl font-800 text-white">
            <Sparkles className="h-6 w-6 text-accent-400" aria-hidden="true" />
            {t("common.appName")}
          </NavLink>

          <nav className="hidden items-center gap-1 md:flex" aria-label={t("nav.course")}>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  clsx(
                    "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-700 text-white/70 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white",
                    isActive && "bg-white/15 text-white"
                  )
                }
              >
                <item.icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </NavLink>
            ))}
            {user?.role === "ADMIN" && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  clsx(
                    "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-700 text-white/70 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white",
                    isActive && "bg-white/15 text-white"
                  )
                }
              >
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                {t("nav.admin")}
              </NavLink>
            )}
          </nav>

          <div className="flex items-center gap-2">
            {user && (
              <div className="hidden items-center gap-2 rounded-full glass-panel px-3 py-1.5 text-sm text-white sm:flex">
                <span className="text-white/60">{user.totalXp} XP</span>
              </div>
            )}
            <LanguageToggle compact />
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 rounded-xl px-3 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              aria-label={t("common.logOut")}
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">{t("common.logOut")}</span>
            </button>
          </div>
        </div>

        <nav className="flex items-center justify-around border-t border-white/10 py-1 md:hidden" aria-label={t("nav.course")}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                clsx("flex flex-col items-center gap-0.5 rounded-lg px-2 py-1 text-[11px] text-white/70", isActive && "text-white")
              }
            >
              <item.icon className="h-5 w-5" aria-hidden="true" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main id="main-content" className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
