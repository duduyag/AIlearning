import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useT } from "../i18n/useT";
import LoadingScreen from "./LoadingScreen";

export function ProtectedRoute() {
  const { user, isBootstrapped } = useAuthStore();
  const { t } = useT();
  const location = useLocation();

  if (!isBootstrapped) return <LoadingScreen label={t("common.loading")} />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return <Outlet />;
}

export function AdminRoute() {
  const { user, isBootstrapped } = useAuthStore();
  const { t } = useT();

  if (!isBootstrapped) return <LoadingScreen label={t("common.loading")} />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "ADMIN") return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}

export function GuestOnlyRoute() {
  const { user, isBootstrapped } = useAuthStore();
  const { t } = useT();
  if (!isBootstrapped) return <LoadingScreen label={t("common.loading")} />;
  if (user) return <Navigate to="/course" replace />;
  return <Outlet />;
}
