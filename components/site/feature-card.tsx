import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function FeatureCard({
  icon,
  title,
  description,
  className,
}: {
  icon?: ReactNode;
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "group rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold/40",
        className,
      )}
    >
      {icon && (
        <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-gold/25 bg-gold/10 text-gold transition-colors group-hover:bg-gold/15">
          {icon}
        </div>
      )}
      <h3 className="font-display text-base font-semibold text-foreground">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
    </div>
  );
}
