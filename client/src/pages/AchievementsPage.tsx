import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { Lock } from "lucide-react";
import { api } from "../lib/api";
import { AchievementDTO } from "@ai-explorers/shared";
import { iconFor } from "../lib/icons";
import { useT } from "../i18n/useT";
import LoadingScreen from "../components/LoadingScreen";

type AchievementRow = AchievementDTO & { unlocked: boolean };

export default function AchievementsPage() {
  const { t } = useT();
  const { data, isLoading } = useQuery({
    queryKey: ["achievements"],
    queryFn: async () => (await api.get<AchievementRow[]>("/achievements")).data,
  });

  if (isLoading || !data) return <LoadingScreen label={t("common.loading")} />;

  return (
    <div className="text-white">
      <h1 className="mb-2 font-display text-3xl font-800">{t("achievements.title")}</h1>
      <p className="mb-6 text-white/60">
        {t("achievements.unlockedOf", { unlocked: data.filter((a) => a.unlocked).length, total: data.length })}
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((a) => {
          const Icon = iconFor(a.icon);
          return (
            <div key={a.id} className={clsx("glass-card flex items-center gap-4 p-5", !a.unlocked && "opacity-50 grayscale")}>
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500">
                {a.unlocked ? <Icon className="h-7 w-7 text-white" aria-hidden="true" /> : <Lock className="h-6 w-6 text-white" aria-hidden="true" />}
              </div>
              <div>
                <p className="font-display font-700">{a.name}</p>
                <p className="text-sm text-white/60">{a.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
