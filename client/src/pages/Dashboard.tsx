import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Flame, Trophy, BookOpenCheck, PieChart, ArrowRight } from "lucide-react";
import { api } from "../lib/api";
import { DashboardStatsDTO } from "@ai-explorers/shared";
import LoadingScreen from "../components/LoadingScreen";
import { iconFor } from "../lib/icons";
import { useT } from "../i18n/useT";

export default function Dashboard() {
  const { t } = useT();
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => (await api.get<DashboardStatsDTO>("/users/me/dashboard")).data,
  });

  if (isLoading || !data) return <LoadingScreen label={t("common.loading")} />;

  return (
    <div className="text-white">
      <h1 className="mb-6 font-display text-3xl font-800">{t("dashboard.title")}</h1>

      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon={Trophy} label={t("dashboard.totalXp")} value={data.totalXp} color="text-sunshine-400" />
        <StatCard icon={Flame} label={t("dashboard.streak")} value={data.currentStreak} color="text-accent-300" />
        <StatCard icon={BookOpenCheck} label={t("dashboard.lessonsCompleted")} value={`${data.lessonsCompleted}/${data.totalLessons}`} color="text-mint-400" />
        <StatCard icon={PieChart} label={t("dashboard.percentComplete")} value={`${data.percentComplete}%`} color="text-brand-300" />
      </div>

      <div className="mb-8 glass-card p-6">
        <h2 className="mb-3 font-display text-lg font-700">{t("dashboard.continueLearning")}</h2>
        {data.currentLesson ? (
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs text-white/50">
                {data.currentLesson.levelName} · {data.currentLesson.unitName}
              </p>
              <p className="font-700">{data.currentLesson.title}</p>
            </div>
            <button onClick={() => navigate(`/lessons/${data.currentLesson!.id}`)} className="btn-primary !px-4 !py-2 text-sm">
              {t("dashboard.goToLesson")}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
            </button>
          </div>
        ) : (
          <p className="font-display text-lg font-700 text-sunshine-400">{t("dashboard.courseComplete")}</p>
        )}
      </div>

      <div className="glass-card p-6">
        <h2 className="mb-4 font-display text-lg font-700">{t("dashboard.latestAchievements")}</h2>
        {data.achievements.length === 0 ? (
          <p className="text-sm text-white/50">{t("dashboard.noAchievementsYet")}</p>
        ) : (
          <div className="flex flex-wrap gap-4">
            {data.achievements.slice(0, 8).map((a) => {
              const Icon = iconFor(a.icon);
              return (
                <div key={a.id} className="flex w-24 flex-col items-center gap-1 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500">
                    <Icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <span className="text-xs text-white/70">{a.name}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: typeof Trophy; label: string; value: string | number; color: string }) {
  return (
    <div className="glass-card p-4">
      <Icon className={`h-5 w-5 ${color}`} aria-hidden="true" />
      <p className="mt-2 font-display text-2xl font-800">{value}</p>
      <p className="text-xs text-white/60">{label}</p>
    </div>
  );
}
