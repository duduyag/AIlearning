import { NavLink, Outlet } from "react-router-dom";
import clsx from "clsx";
import { LayoutDashboard, BookOpen, Award, Users } from "lucide-react";

const TABS = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/curriculum", label: "Curriculum", icon: BookOpen, end: false },
  { to: "/admin/achievements", label: "Achievements", icon: Award, end: false },
  { to: "/admin/users", label: "Users", icon: Users, end: false },
];

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-hero-gradient text-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-6 font-display text-3xl font-800">Admin Panel</h1>

        <div className="mb-6 flex flex-wrap gap-1 rounded-2xl glass-panel p-1">
          {TABS.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-700 transition",
                  isActive ? "bg-white/20 text-white" : "text-white/60 hover:text-white"
                )
              }
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </NavLink>
          ))}
        </div>

        <Outlet />
      </div>
    </div>
  );
}
