import { Info } from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";
import { StatCard, type StatData } from "@/components/site/stat-card";
import {
  MonthlyReturnsChart,
  type MonthlyReturn,
} from "@/components/site/monthly-returns";

export function TrackRecord({
  eyebrow,
  title,
  subtitle,
  ytdLabel,
  note,
  disclaimer,
  stats,
  returns,
}: {
  eyebrow?: string | null;
  title: string;
  subtitle?: string | null;
  ytdLabel?: string;
  note?: string;
  disclaimer?: string;
  stats: StatData[];
  returns: MonthlyReturn[];
}) {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat, i) => (
            <StatCard key={stat.id} stat={stat} delay={i * 60} />
          ))}
        </div>

        <Reveal delay={120} className="mt-8 rounded-2xl border border-border bg-card p-6 sm:p-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-display text-lg font-semibold text-foreground">
              {ytdLabel ?? "Monthly performance"}
            </h3>
            {note && <p className="text-xs text-faint">{note}</p>}
          </div>
          <MonthlyReturnsChart data={returns} />
        </Reveal>

        {disclaimer && (
          <Reveal delay={160}>
            <p className="mt-6 flex items-start gap-2.5 rounded-xl border border-warning/25 bg-warning/5 p-4 text-xs leading-relaxed text-muted">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
              {disclaimer}
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
