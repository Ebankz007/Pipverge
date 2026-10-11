import type { Metadata } from "next";
import { getFaqs, getHomepageSection, getPricingPlans } from "@/lib/content";
import { PageHeader } from "@/components/site/page-header";
import { PricingSection } from "@/components/home/pricing-section";
import { FaqSection } from "@/components/home/social";
import type { PlanData } from "@/components/site/pricing-card";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Straightforward pricing on Pipverge signal plans and the automation suite. Start at $49/month. Cancel anytime.",
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function money(value: number) {
  return `$${value % 1 === 0 ? value.toFixed(0) : value.toFixed(2)}`;
}

export default async function PricingPage() {
  const [plans, pricingSection, faqs, faqSection] = await Promise.all([
    getPricingPlans(),
    getHomepageSection("pricing"),
    getFaqs(),
    getHomepageSection("faq"),
  ]);

  const planData: PlanData[] = plans.map((p) => ({
    id: p.id,
    name: p.name,
    description: null,
    price: money(p.price),
    period: p.billingPeriod,
    features: Array.isArray(p.features) ? (p.features as string[]) : [],
    isFeatured: p.isHighlighted,
    ctaLabel: p.ctaLabel,
    ctaUrl: p.ctaUrl ?? "/register",
  }));

  const content = asRecord(pricingSection?.content);

  return (
    <>
      <PageHeader
        eyebrow="Plans & pricing"
        title="Simple pricing, no surprises"
        subtitle="Pick a plan, change it, or cancel anytime. Every plan starts with a free trial of the daily feed."
      />

      <PricingSection
        eyebrow={pricingSection?.eyebrow ?? "Pricing"}
        title={pricingSection?.title ?? "Choose your plan"}
        subtitle={pricingSection?.subtitle ?? null}
        banner={content.banner as string | undefined}
        note={content.note as string | undefined}
        plans={planData}
      />

      {faqs.length > 0 && (
        <FaqSection
          eyebrow={faqSection?.eyebrow ?? "FAQ"}
          title={faqSection?.title ?? "Answers, upfront"}
          subtitle={faqSection?.subtitle ?? null}
          items={faqs.map((f) => ({
            id: f.id,
            question: f.question,
            answer: f.answer,
          }))}
        />
      )}
    </>
  );
}
