import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import { refreshAccessToken } from "./lib/api";
import { useLanguagePreference } from "./i18n/useLanguagePreference";

import AppShell from "./components/AppShell";
import SkipLink from "./components/SkipLink";
import { ProtectedRoute, AdminRoute, GuestOnlyRoute } from "./components/ProtectedRoute";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Roadmap from "./pages/Roadmap";
import LessonView from "./pages/LessonView";
import Dashboard from "./pages/Dashboard";
import AchievementsPage from "./pages/AchievementsPage";
import Accessibility from "./pages/Accessibility";
import NotFound from "./pages/NotFound";

import AdminLayout from "./admin/AdminLayout";
import AdminOverview from "./admin/AdminOverview";
import AdminCurriculum from "./admin/AdminCurriculum";
import AdminAchievements from "./admin/AdminAchievements";
import AdminUsers from "./admin/AdminUsers";

export default function App() {
  const setBootstrapped = useAuthStore((s) => s.setBootstrapped);
  useLanguagePreference();

  useEffect(() => {
    refreshAccessToken().finally(() => setBootstrapped());
  }, [setBootstrapped]);

  return (
    <>
      <SkipLink />
      <Routes>
        <Route element={<GuestOnlyRoute />}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        <Route path="/accessibility" element={<Accessibility />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route path="/course" element={<Roadmap />} />
            <Route path="/lessons/:id" element={<LessonView />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/achievements" element={<AchievementsPage />} />
          </Route>
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminOverview />} />
            <Route path="curriculum" element={<AdminCurriculum />} />
            <Route path="achievements" element={<AdminAchievements />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
