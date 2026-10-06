// FA monogram + wordmark. Pure SVG/CSS, no image files. Wordmark scales down on small screens.
export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-label="Furqan Ansari logo" className="shrink-0">
      <defs>
        <linearGradient id="fa-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4f46e5" /><stop offset="0.6" stopColor="#7c3aed" /><stop offset="1" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="url(#fa-g)" />
      <path d="M19 47V17h16M19 31h12" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M33 47l8-30 8 30M36 39h10" fill="none" stroke="#fff" strokeOpacity=".9" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Logo({ size = 36, stacked = false }: { size?: number; stacked?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${stacked ? "flex-col text-center" : ""}`}>
      <LogoMark size={size} />
      <span className="leading-tight">
        <span className="block text-sm font-bold tracking-wide sm:text-base">FURQAN <span className="grad-text">ANSARI</span></span>
        <span className="hidden text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 min-[380px]:block">AI • Web • Digital</span>
      </span>
    </span>
  );
}
