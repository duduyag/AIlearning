import { useQuery } from "@tanstack/react-query";
import { Users, BookOpen, CheckCircle2, TrendingUp, MessageCircle } from "lucide-react";
import { api } from "../lib/api";
import LoadingScreen from "../components/LoadingScreen";

interface Analytics {
  totalUsers: number;
  totalLessons: number;
  lessonsCompleted: number;
  avgXp: number;
  totalTutorMessages: number;
}

export default function AdminOverview() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: async () => (await api.get<Analytics>("/admin/analytics")).data,
  });

  if (isLoading || !data) return <LoadingScreen label="Loading analytics..." />;

  const cards = [
    { icon: Users, label: "Total Users", value: data.totalUsers },
    { icon: BookOpen, label: "Total Lessons", value: data.totalLessons },
    { icon: CheckCircle2, label: "Lessons Completed", value: data.lessonsCompleted },
    { icon: TrendingUp, label: "Average XP", value: data.avgXp },
    { icon: MessageCircle, label: "AI Tutor Messages", value: data.totalTutorMessages },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((c) => (
        <div key={c.label} className="glass-card p-6">
          <c.icon className="h-6 w-6 text-brand-300" />
          <p className="mt-3 font-display text-3xl font-800">{c.value}</p>
          <p className="text-sm text-white/60">{c.label}</p>
        </div>
      ))}
    </div>
  );
}
