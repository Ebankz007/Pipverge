import { Tag } from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";
import { PricingCard, type PlanData } from "@/components/site/pricing-card";

export function PricingSection({
  eyebrow,
  title,
  subtitle,
  banner,
  note,
  plans,
}: {
  eyebrow?: string | null;
  title: string;
  subtitle?: string | null;
  banner?: string;
  note?: string;
  plans: PlanData[];
}) {
  return (
    <section id="pricing" className="border-y border-border bg-surface/60 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} />

        {banner && (
          <Reveal className="mx-auto mt-8 flex w-fit items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-sm font-medium text-gold">
            <Tag className="h-4 w-4" />
            {banner}
          </Reveal>
        )}

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <Reveal key={plan.id} delay={i * 80}>
              <PricingCard plan={plan} />
            </Reveal>
          ))}
        </div>

        {note && (
          <Reveal delay={120}>
            <p className="mt-8 text-center text-sm text-muted">{note}</p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
