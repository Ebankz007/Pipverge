import { ArrowRight, Play, ShieldCheck, Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/site/reveal";
import { TradingViewWidget } from "@/components/site/tradingview";

export type HeroContent = {
  badge?: string;
  primaryCtaLabel?: string;
  primaryCtaUrl?: string;
  secondaryCtaLabel?: string;
  secondaryCtaUrl?: string;
  tertiaryLabel?: string;
  tertiaryUrl?: string;
  symbols?: string[];
};

export function Hero({
  eyebrow,
  title,
  subtitle,
  content,
}: {
  eyebrow?: string | null;
  title: string;
  subtitle?: string | null;
  content: HeroContent;
}) {
  return (
    <section className="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.16),transparent_60%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 grid-lines opacity-[0.35]"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:px-8">
        <div>
          {eyebrow && (
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3.5 py-1.5 text-xs font-medium text-gold">
                <Sparkles className="h-3.5 w-3.5" />
                {eyebrow}
              </span>
            </Reveal>
          )}

          <Reveal delay={60}>
            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {title}
            </h1>
          </Reveal>

          {subtitle && (
            <Reveal delay={120}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
                {subtitle}
              </p>
            </Reveal>
          )}

          <Reveal delay={180}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ButtonLink
                href={content.primaryCtaUrl ?? "/register"}
                size="lg"
              >
                {content.primaryCtaLabel ?? "Start free"}
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink
                href={content.secondaryCtaUrl ?? "/features"}
                variant="secondary"
                size="lg"
              >
                <Play className="h-4 w-4" />
                {content.secondaryCtaLabel ?? "Explore the platform"}
              </ButtonLink>
            </div>
          </Reveal>

          {content.badge && (
            <Reveal delay={240}>
              <p className="mt-6 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-faint">
                <ShieldCheck className="h-4 w-4 text-gold" />
                {content.badge}
              </p>
            </Reveal>
          )}

          {content.symbols && content.symbols.length > 0 && (
            <Reveal delay={300}>
              <div className="mt-8 flex flex-wrap gap-2">
                {content.symbols.map((s) => (
                  <span
                    key={s}
                    className="rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-medium text-muted"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </Reveal>
          )}
        </div>

        <Reveal delay={200} className="relative">
          <div className="absolute -inset-4 rounded-3xl bg-gold/5 blur-2xl" aria-hidden="true" />
          <div className="relative">
            <TradingViewWidget symbol="OANDA:XAUUSD" height={460} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
