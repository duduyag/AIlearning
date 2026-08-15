export default function RobotMascot({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label="Botly, the friendly AI tutor robot">
      <defs>
        <linearGradient id="rm-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7189ff" />
          <stop offset="100%" stopColor="#3a3ff5" />
        </linearGradient>
        <linearGradient id="rm-head" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ff8fd6" />
          <stop offset="100%" stopColor="#ff5fc0" />
        </linearGradient>
        <radialGradient id="rm-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#4fe0c5" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#4fe0c5" stopOpacity="0" />
        </radialGradient>
      </defs>

      <line x1="100" y1="28" x2="100" y2="10" stroke="#ffe08a" strokeWidth="4" strokeLinecap="round" />
      <circle cx="100" cy="10" r="8" fill="url(#rm-glow)" />
      <circle cx="100" cy="10" r="5" fill="#ffe08a" className="animate-pulse-glow" />

      <rect x="55" y="30" width="90" height="70" rx="24" fill="url(#rm-head)" />
      <rect x="55" y="30" width="90" height="70" rx="24" fill="white" fillOpacity="0.08" />

      <circle cx="82" cy="63" r="10" fill="white" />
      <circle cx="118" cy="63" r="10" fill="white" />
      <circle cx="84" cy="65" r="5" fill="#26277f" />
      <circle cx="120" cy="65" r="5" fill="#26277f" />

      <path d="M78 82 Q100 96 122 82" stroke="white" strokeWidth="4" strokeLinecap="round" fill="none" />

      <circle cx="68" cy="78" r="5" fill="#ffe08a" opacity="0.7" />
      <circle cx="132" cy="78" r="5" fill="#ffe08a" opacity="0.7" />

      <rect x="65" y="104" width="70" height="60" rx="18" fill="url(#rm-body)" />
      <rect x="82" y="118" width="36" height="26" rx="8" fill="white" fillOpacity="0.15" />
      <circle cx="100" cy="131" r="9" fill="#4fe0c5" className="animate-pulse-glow" />

      <circle cx="55" cy="122" r="9" fill="#ff5fc0" />
      <circle cx="145" cy="122" r="9" fill="#ff5fc0" />
      <line x1="65" y1="118" x2="55" y2="122" stroke="#3a3ff5" strokeWidth="6" strokeLinecap="round" />
      <line x1="135" y1="118" x2="145" y2="122" stroke="#3a3ff5" strokeWidth="6" strokeLinecap="round" />

      <rect x="78" y="162" width="14" height="18" rx="6" fill="#26277f" />
      <rect x="108" y="162" width="14" height="18" rx="6" fill="#26277f" />
    </svg>
  );
}
