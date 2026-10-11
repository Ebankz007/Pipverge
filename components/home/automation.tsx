import { Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/site/reveal";
import { CodeBlock } from "@/components/site/code-block";

export function AutomationSection({
  eyebrow,
  title,
  subtitle,
  codeLines,
  features,
  ctaLabel,
  ctaUrl,
}: {
  eyebrow?: string | null;
  title: string;
  subtitle?: string | null;
  codeLines: string[];
  features: string[];
  ctaLabel: string;
  ctaUrl: string;
}) {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          {eyebrow && (
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              <span className="h-px w-6 bg-gold/60" />
              {eyebrow}
            </span>
          )}
          <Reveal delay={60}>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {title}
            </h2>
          </Reveal>
          {subtitle && (
            <Reveal delay={120}>
              <p className="mt-4 text-base leading-relaxed text-muted">
                {subtitle}
              </p>
            </Reveal>
          )}
          <Reveal delay={180}>
            <ul className="mt-7 space-y-3">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-foreground/90">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  {f}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={240}>
            <ButtonLink href={ctaUrl} size="lg" className="mt-8">
              {ctaLabel}
            </ButtonLink>
          </Reveal>
        </div>

        <Reveal delay={160}>
          <CodeBlock lines={codeLines} />
        </Reveal>
      </div>
    </section>
  );
}
