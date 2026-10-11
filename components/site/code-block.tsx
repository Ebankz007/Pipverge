"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function CodeBlock({
  lines,
  className,
  speed = 28,
}: {
  lines: string[];
  className?: string;
  speed?: number;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = React.useState(0);
  const started = React.useRef(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const run = () => {
      if (started.current) return;
      started.current = true;
      if (reduce) {
        setVisibleCount(lines.length);
        return;
      }
      let i = 0;
      const timer = setInterval(() => {
        i += 1;
        setVisibleCount(i);
        if (i >= lines.length) clearInterval(timer);
      }, speed * 12);
      return () => clearInterval(timer);
    };

    if (typeof IntersectionObserver === "undefined") {
      run();
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          run();
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [lines.length, speed]);

  return (
    <div
      ref={ref}
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-[#0b0d11] font-mono text-[13px] leading-relaxed",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-danger/70" />
        <span className="h-3 w-3 rounded-full bg-warning/70" />
        <span className="h-3 w-3 rounded-full bg-success/70" />
        <span className="ml-2 text-xs text-faint">strategy.ts</span>
      </div>
      <pre className="overflow-x-auto p-4">
        <code>
          {lines.map((line, i) => (
            <span
              key={i}
              className={cn(
                "block transition-opacity duration-300",
                i < visibleCount ? "opacity-100" : "opacity-0",
              )}
            >
              <span className="mr-4 inline-block w-5 select-none text-right text-faint">
                {i + 1}
              </span>
              <span className="text-foreground/90">{line}</span>
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
