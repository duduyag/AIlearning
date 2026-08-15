import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, MessageCircle, TrendingUp, Award, ArrowRight, Star, Rocket, GraduationCap } from "lucide-react";
import { useT } from "../i18n/useT";
import LanguageToggle from "../components/LanguageToggle";
import RobotMascot from "../components/illustrations/RobotMascot";

const LEVELS = [
  { icon: Star, key: "beginner" },
  { icon: Rocket, key: "intermediate" },
  { icon: GraduationCap, key: "advanced" },
];

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.6, delay, ease: "easeOut" },
  };
}

export default function Landing() {
  const { t } = useT();

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-hero-gradient text-white">
      <div className="pointer-events-none absolute -top-20 -start-20 h-72 w-72 animate-float rounded-full bg-brand-500/30 blur-3xl" />
      <div className="pointer-events-none absolute top-40 end-0 h-96 w-96 animate-float-slow rounded-full bg-accent-500/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 start-1/3 h-80 w-80 animate-float rounded-full bg-mint-500/20 blur-3xl" />

      <header id="main-content" className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-4 py-6 sm:px-6">
        <div className="flex items-center gap-2 font-display text-xl font-800">
          <Sparkles className="h-6 w-6 text-accent-400" aria-hidden="true" />
          {t("common.appName")}
        </div>
        <div className="flex items-center gap-3">
          <LanguageToggle compact />
          <Link
            to="/login"
            className="rounded-xl px-4 py-2 text-sm font-700 text-white/80 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          >
            {t("landing.login")}
          </Link>
          <Link to="/signup" className="btn-primary !px-4 !py-2 text-sm">
            {t("landing.getStarted")}
          </Link>
        </div>
      </header>

      <section className="relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-8 px-4 pb-24 pt-10 text-center sm:px-6 sm:pt-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full glass-panel px-4 py-1.5 text-xs font-700 uppercase tracking-wide text-white/80"
        >
          <Sparkles className="h-3.5 w-3.5 text-accent-400" aria-hidden="true" />
          {t("landing.badge")}
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }} className="w-40 sm:w-48">
          <RobotMascot />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-4xl font-800 leading-tight sm:text-6xl"
        >
          {t("landing.title1")}{" "}
          <span className="bg-gradient-to-r from-brand-300 via-accent-400 to-mint-400 bg-clip-text text-transparent">
            {t("landing.titleHighlight1")}
          </span>{" "}
          {t("landing.title2")}{" "}
          <span className="bg-gradient-to-r from-mint-400 via-accent-400 to-brand-300 bg-clip-text text-transparent">
            {t("landing.titleHighlight2")}
          </span>
        </motion.h1>

        <motion.p {...fadeUp(0.2)} className="max-w-2xl text-lg text-white/70">
          {t("landing.subtitle")}
        </motion.p>

        <motion.div {...fadeUp(0.3)} className="flex flex-col items-center gap-4 sm:flex-row">
          <Link to="/signup" className="btn-primary text-base">
            {t("landing.startLearning")}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
          </Link>
          <Link to="/login" className="btn-secondary text-base">
            {t("landing.haveAccount")}
          </Link>
        </motion.div>
      </section>

      <section className="relative z-10 mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <motion.div {...fadeUp()} className="mb-10 text-center">
          <h2 className="font-display text-3xl font-800 sm:text-4xl">{t("landing.pathHeading")}</h2>
          <p className="mt-2 text-white/60">{t("landing.pathSubheading")}</p>
        </motion.div>
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6">
          {LEVELS.map((level, i) => (
            <motion.div key={level.key} {...fadeUp(i * 0.15)} className="flex flex-1 flex-col items-center gap-4">
              <div className="glass-card flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 shadow-glow">
                <level.icon className="h-9 w-9 text-white" aria-hidden="true" />
              </div>
              {i < LEVELS.length - 1 && <div className="hidden h-0.5 w-full bg-gradient-to-r from-white/30 to-transparent sm:block" />}
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { icon: MessageCircle, title: t("landing.featuresTitle1"), desc: t("landing.featuresDesc1") },
            { icon: TrendingUp, title: t("landing.featuresTitle2"), desc: t("landing.featuresDesc2") },
            { icon: Award, title: t("landing.featuresTitle3"), desc: t("landing.featuresDesc3") },
          ].map((f, i) => (
            <motion.div key={f.title} {...fadeUp(i * 0.1)} className="glass-card p-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/10">
                <f.icon className="h-7 w-7 text-mint-400" aria-hidden="true" />
              </div>
              <h3 className="font-display text-xl font-700">{f.title}</h3>
              <p className="mt-2 text-sm text-white/60">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-4xl px-4 pb-24 sm:px-6">
        <motion.div {...fadeUp()} className="glass-card flex flex-col items-center gap-6 p-10 text-center sm:p-14">
          <h2 className="font-display text-3xl font-800 sm:text-4xl">{t("landing.ctaTitle")}</h2>
          <p className="max-w-md text-white/70">{t("landing.ctaSubtitle")}</p>
          <Link to="/signup" className="btn-primary text-base">
            {t("landing.ctaButton")}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
          </Link>
        </motion.div>
      </section>

      <footer className="relative z-10 border-t border-white/10 py-8 text-center text-sm text-white/40">
        <p>
          © {new Date().getFullYear()} {t("common.appName")}. {t("landing.footer")}
        </p>
        <Link to="/accessibility" className="mt-2 inline-block underline hover:text-white/60">
          {t("landing.accessibilityLink")}
        </Link>
      </footer>
    </div>
  );
}
