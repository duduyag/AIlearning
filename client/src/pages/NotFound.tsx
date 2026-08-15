import { Link } from "react-router-dom";
import { useT } from "../i18n/useT";

export default function NotFound() {
  const { t } = useT();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-hero-gradient text-center text-white">
      <h1 className="font-display text-6xl font-800">404</h1>
      <p className="text-white/70">{t("common.appName")}</p>
      <Link to="/" className="btn-primary">
        {t("common.back")}
      </Link>
    </div>
  );
}
