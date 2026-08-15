export default function LoadingScreen({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-hero-gradient">
      <div className="flex flex-col items-center gap-4">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-white/20 border-t-brand-400" />
        <p className="font-display text-white/80">{label}</p>
      </div>
    </div>
  );
}
