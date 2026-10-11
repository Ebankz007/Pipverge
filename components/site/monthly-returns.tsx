"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type MonthlyReturn = {
  id: string;
  year: number;
  month: number;
  value: number;
};

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function MonthlyReturnsChart({ data }: { data: MonthlyReturn[] }) {
  const years = React.useMemo(
    () => Array.from(new Set(data.map((d) => d.year))).sort((a, b) => b - a),
    [data],
  );
  const [year, setYear] = React.useState(years[0]);
  const rows = React.useMemo(
    () => data.filter((d) => d.year === year).sort((a, b) => a.month - b.month),
    [data, year],
  );

  const max = Math.max(1, ...rows.map((r) => Math.abs(r.value)));

  return (
    <div>
      {years.length > 1 && (
        <div className="mb-6 flex gap-2">
          {years.map((y) => (
            <button
              key={y}
              type="button"
              onClick={() => setYear(y)}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                y === year
                  ? "border-gold/50 bg-gold/10 text-gold"
                  : "border-border text-muted hover:text-foreground",
              )}
            >
              {y}
            </button>
          ))}
        </div>
      )}

      <div className="flex h-56 items-end gap-2">
        {rows.map((r) => {
          const height = Math.max(6, (Math.abs(r.value) / max) * 100);
          const positive = r.value >= 0;
          return (
            <div
              key={r.id}
              className="group flex flex-1 flex-col items-center justify-end gap-2"
            >
              <span
                className={cn(
                  "text-[10px] font-semibold tabular-nums",
                  positive ? "text-success" : "text-danger",
                )}
              >
                {positive ? "+" : ""}
                {r.value.toFixed(1)}%
              </span>
              <div
                className={cn(
                  "w-full rounded-t-md transition-all duration-500",
                  positive
                    ? "bg-gradient-to-t from-gold/30 to-gold"
                    : "bg-gradient-to-t from-danger/30 to-danger",
                )}
                style={{ height: `${height}%` }}
                title={`${MONTHS[r.month - 1]} ${r.year}: ${r.value}%`}
              />
              <span className="text-[10px] text-faint">
                {MONTHS[r.month - 1]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
