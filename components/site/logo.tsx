import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={cn("h-9 w-9", className)}
      aria-hidden="true"
      role="img"
    >
      <defs>
        <linearGradient id="pv-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F4C542" />
          <stop offset="50%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#A67C00" />
        </linearGradient>
      </defs>
      <rect
        x="1"
        y="1"
        width="38"
        height="38"
        rx="11"
        fill="#0B0B0D"
        stroke="url(#pv-gold)"
        strokeWidth="1.5"
      />
      <path
        d="M10 27 L17 19 L22 24 L30 12"
        fill="none"
        stroke="url(#pv-gold)"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="30" cy="12" r="2.7" fill="url(#pv-gold)" />
    </svg>
  );
}

export function Logo({
  className,
  showWordmark = true,
  siteName = "Pipverge",
}: {
  className?: string;
  showWordmark?: boolean;
  siteName?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      {showWordmark && (
        <span className="font-display text-lg font-bold tracking-tight text-foreground">
          {siteName}
          <span className="text-gold">.</span>
        </span>
      )}
    </span>
  );
}
