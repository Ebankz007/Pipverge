import {
  Globe,
  MessageSquare,
  Target,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";
import { FeatureCard } from "@/components/site/feature-card";

const ICONS: Record<string, LucideIcon> = {
  target: Target,
  globe: Globe,
  zap: Zap,
  "message-square": MessageSquare,
};

export type FeatureItem = { icon?: string; title: string; body: string };
export type StepItem = { title: string; body: string };

export function FeaturesSection({
  eyebrow,
  title,
  subtitle,
  features,
}: {
  eyebrow?: string | null;
  title: string;
  subtitle?: string | null;
  features: FeatureItem[];
}) {
  return (
    <section className="border-y border-border bg-surface/60 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => {
            const Icon = f.icon ? ICONS[f.icon] : undefined;
            return (
              <Reveal key={f.title} delay={i * 70}>
                <FeatureCard
                  icon={Icon ? <Icon className="h-5 w-5" /> : undefined}
                  title={f.title}
                  description={f.body}
                />
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function HowItWorks({
  eyebrow,
  title,
  subtitle,
  steps,
}: {
  eyebrow?: string | null;
  title: string;
  subtitle?: string | null;
  steps: StepItem[];
}) {
  return (
    <section id="how-it-works" className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} />
        <div className="relative mt-14 grid gap-8 lg:grid-cols-3">
          <div
            className="pointer-events-none absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent lg:block"
            aria-hidden="true"
          />
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 90} className="relative">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 bg-background font-display text-lg font-bold text-gold">
                {i + 1}
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {step.body}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
