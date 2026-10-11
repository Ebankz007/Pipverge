import { Gift } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/site/reveal";

export type PromoStep = { step: string; title: string; body: string };

export function PromoSection({
  eyebrow,
  title,
  subtitle,
  steps,
  ctaLabel,
  ctaUrl,
  disclaimer,
}: {
  eyebrow?: string | null;
  title: string;
  subtitle?: string | null;
  steps: PromoStep[];
  ctaLabel: string;
  ctaUrl: string;
  disclaimer?: string;
}) {
  return (
    <section className="border-y border-border bg-surface/60 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="overflow-hidden rounded-3xl border border-gold/25 bg-gradient-to-br from-[#1a1708] via-[#12141a] to-[#0d0e12] p-8 sm:p-12">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3.5 py-1.5 text-xs font-medium text-gold">
                <Gift className="h-3.5 w-3.5" />
                {eyebrow}
              </span>
              <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {title}
              </h2>
              {subtitle && (
                <p className="mt-4 text-base leading-relaxed text-muted">
                  {subtitle}
                </p>
              )}
              <ButtonLink href={ctaUrl} size="lg" className="mt-7">
                {ctaLabel}
              </ButtonLink>
            </div>

            <ol className="space-y-4">
              {steps.map((s, i) => (
                <li
                  key={s.step}
                  className="flex gap-4 rounded-2xl border border-border bg-card/80 p-5"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/40 font-display text-sm font-bold text-gold">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-faint">
                      {s.step}
                    </p>
                    <h3 className="mt-0.5 font-medium text-foreground">
                      {s.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {disclaimer && (
            <p className="mt-8 border-t border-border pt-6 text-xs leading-relaxed text-faint">
              {disclaimer}
            </p>
          )}
        </Reveal>
      </div>
    </section>
  );
}
