import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { Lock, Check, Play, RotateCcw } from "lucide-react";
import { api } from "../lib/api";
import { CourseLevelDTO } from "@ai-explorers/shared";
import { useAuthStore } from "../store/authStore";
import { useT } from "../i18n/useT";
import LoadingScreen from "../components/LoadingScreen";

export default function Roadmap() {
  const navigate = useNavigate();
  const { t } = useT();
  const user = useAuthStore((s) => s.user);

  const { data: levels, isLoading } = useQuery({
    queryKey: ["course"],
    queryFn: async () => (await api.get<CourseLevelDTO[]>("/course")).data,
  });

  if (isLoading || !levels) return <LoadingScreen label={t("common.loading")} />;

  const allLessons = levels.flatMap((l) => l.units.flatMap((u) => u.lessons));
  const doneCount = allLessons.filter((l) => l.status === "COMPLETED").length;

  return (
    <div className="text-white">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-3xl font-800">{t("roadmap.heading", { name: user?.displayName ?? "" })} 🚀</h1>
        <p className="mt-1 text-white/60">{t("roadmap.subheading")}</p>
        <p className="mt-2 text-sm font-700 text-accent-300">{t("roadmap.lessonsCount", { done: doneCount, total: allLessons.length })}</p>
      </motion.div>

      <div className="flex flex-col gap-10">
        {levels.map((level, levelIndex) => (
          <motion.section
            key={level.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: levelIndex * 0.1 }}
          >
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 font-display font-800">
                {level.order}
              </span>
              <div>
                <h2 className="font-display text-xl font-800">{level.name}</h2>
                <p className="text-sm text-white/60">{level.description}</p>
              </div>
            </div>

            <div className="flex flex-col gap-6 border-s-2 border-white/10 ps-6">
              {level.units.map((unit) => (
                <div key={unit.id}>
                  <h3 className="mb-3 font-display text-sm font-700 uppercase tracking-wide text-white/50">{unit.name}</h3>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {unit.lessons.map((lesson) => {
                      const locked = lesson.status === "LOCKED";
                      const completed = lesson.status === "COMPLETED";
                      return (
                        <motion.button
                          key={lesson.id}
                          disabled={locked}
                          onClick={() => navigate(`/lessons/${lesson.id}`)}
                          whileHover={!locked ? { scale: 1.02 } : undefined}
                          whileTap={!locked ? { scale: 0.98 } : undefined}
                          className={clsx(
                            "glass-card flex items-center gap-3 p-4 text-start transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-white",
                            locked && "cursor-not-allowed opacity-50",
                            !locked && "hover:bg-white/15"
                          )}
                        >
                          <span
                            className={clsx(
                              "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full",
                              completed && "bg-mint-500",
                              !completed && !locked && "bg-gradient-to-br from-brand-500 to-accent-500",
                              locked && "bg-white/10"
                            )}
                          >
                            {locked ? (
                              <Lock className="h-4 w-4 text-white/60" aria-hidden="true" />
                            ) : completed ? (
                              <Check className="h-5 w-5 text-white" aria-hidden="true" />
                            ) : (
                              <Play className="h-4 w-4 text-white rtl:rotate-180" aria-hidden="true" />
                            )}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-700">{lesson.title}</p>
                            <p className="text-xs text-white/50">
                              {locked
                                ? t("roadmap.locked")
                                : completed
                                  ? `${t("roadmap.completed")} · ${lesson.quizBestScore ?? 0}%`
                                  : t("roadmap.minutes", { count: lesson.estimatedMinutes })}
                            </p>
                          </div>
                          {completed && <RotateCcw className="h-4 w-4 flex-shrink-0 text-white/40" aria-hidden="true" />}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        ))}
      </div>
    </div>
  );
}
