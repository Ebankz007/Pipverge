import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export type PlanData = {
  id: string;
  name: string;
  description: string | null;
  price: string;
  period: string | null;
  features: string[];
  isFeatured: boolean;
  ctaLabel: string;
  ctaUrl: string;
};

export function PricingCard({ plan }: { plan: PlanData }) {
  return (
    <div
      className={cn(
        "relative flex h-full flex-col rounded-2xl border bg-card p-7 transition-all duration-300",
        plan.isFeatured
          ? "border-gold/50 shadow-[0_20px_60px_-30px_rgba(212,175,55,0.6)] lg:-translate-y-2"
          : "border-border hover:border-gold/30",
      )}
    >
      {plan.isFeatured && (
        <Badge tone="gold" className="absolute -top-3 left-1/2 -translate-x-1/2">
          Most popular
        </Badge>
      )}
      <h3 className="font-display text-lg font-semibold text-foreground">
        {plan.name}
      </h3>
      {plan.description && (
        <p className="mt-1.5 text-sm text-muted">{plan.description}</p>
      )}
      <div className="mt-5 flex items-end gap-1.5">
        <span className="font-display text-4xl font-bold tracking-tight text-foreground">
          {plan.price}
        </span>
        {plan.period && (
          <span className="pb-1 text-sm text-muted">/{plan.period}</span>
        )}
      </div>

      <ul className="mt-6 flex-1 space-y-3">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3 text-sm text-muted">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <ButtonLink
        href={plan.ctaUrl}
        variant={plan.isFeatured ? "primary" : "secondary"}
        size="lg"
        className="mt-7 w-full"
      >
        {plan.ctaLabel}
      </ButtonLink>
    </div>
  );
}
