import type { Metadata } from "next";
import {
  getFaqs,
  getHomepageSections,
  getMonthlyReturns,
  getPricingPlans,
  getStats,
  getTestimonials,
} from "@/lib/content";
import { getSiteSettings } from "@/lib/settings";
import { Hero, type HeroContent } from "@/components/home/hero";
import { MarketSection } from "@/components/home/market";
import { TrackRecord } from "@/components/home/track-record";
import { FeaturesSection, HowItWorks } from "@/components/home/features";
import { PricingSection } from "@/components/home/pricing-section";
import { AutomationSection } from "@/components/home/automation";
import { PromoSection, type PromoStep } from "@/components/home/promo";
import { FaqSection, TestimonialsSection } from "@/components/home/social";
import { FinalCta } from "@/components/home/final-cta";
import type { StatData } from "@/components/site/stat-card";
import type { MonthlyReturn } from "@/components/site/monthly-returns";
import type { PlanData } from "@/components/site/pricing-card";
import type { FeatureItem, StepItem } from "@/components/home/features";

export const metadata: Metadata = {
  title: "Pipverge — Intelligent trading. Smarter decisions. Better execution.",
  description:
    "Structured market signals, automated strategies, and performance analytics for forex, gold, and index traders.",
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function money(value: number) {
  return `$${value % 1 === 0 ? value.toFixed(0) : value.toFixed(2)}`;
}

export default async function HomePage() {
  const [sections, stats, returns, plans, testimonials, faqs, settings] =
    await Promise.all([
      getHomepageSections(),
      getStats(),
      getMonthlyReturns(),
      getPricingPlans(),
      getTestimonials(),
      getFaqs(),
      getSiteSettings(),
    ]);

  const byKey = Object.fromEntries(sections.map((s) => [s.key, s]));

  const hero = byKey["hero"];
  const market = byKey["market"];
  const track = byKey["track_record"];
  const whatYouGet = byKey["what_you_get"];
  const howItWorks = byKey["how_it_works"];
  const pricing = byKey["pricing"];
  const eaBot = byKey["ea_bot"];
  const promo = byKey["promo"];
  const testimonialsSection = byKey["testimonials"];
  const faqSection = byKey["faq"];
  const finalCta = byKey["final_cta"];

  const statData: StatData[] = stats.map((s) => ({
    id: s.id,
    label: s.label,
    value: s.value,
    suffix: s.suffix,
    prefix: null,
    description: s.note,
  }));

  const returnData: MonthlyReturn[] = returns.map((r) => ({
    id: r.id,
    year: r.year,
    month: r.month,
    value: r.pct,
  }));

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

  const trackContent = asRecord(track?.content);
  const featureContent = asRecord(whatYouGet?.content);
  const stepsContent = asRecord(howItWorks?.content);
  const pricingContent = asRecord(pricing?.content);
  const eaContent = asRecord(eaBot?.content);
  const promoContent = asRecord(promo?.content);
  const finalContent = asRecord(finalCta?.content);

  return (
    <>
      {hero && (
        <Hero
          eyebrow={hero.eyebrow}
          title={hero.title}
          subtitle={hero.subtitle}
          content={asRecord(hero.content) as HeroContent}
        />
      )}

      {market && (
        <MarketSection
          eyebrow={market.eyebrow}
          title={market.title}
          subtitle={market.subtitle}
          symbols={
            Array.isArray(asRecord(market.content).symbols)
              ? (asRecord(market.content).symbols as string[])
              : []
          }
        />
      )}

      {track && (
        <TrackRecord
          eyebrow={track.eyebrow}
          title={track.title}
          subtitle={track.subtitle}
          ytdLabel={trackContent.ytdLabel as string | undefined}
          note={trackContent.note as string | undefined}
          disclaimer={trackContent.disclaimer as string | undefined}
          stats={statData}
          returns={returnData}
        />
      )}

      {whatYouGet && (
        <FeaturesSection
          eyebrow={whatYouGet.eyebrow}
          title={whatYouGet.title}
          subtitle={whatYouGet.subtitle}
          features={
            Array.isArray(featureContent.features)
              ? (featureContent.features as FeatureItem[])
              : []
          }
        />
      )}

      {howItWorks && (
        <HowItWorks
          eyebrow={howItWorks.eyebrow}
          title={howItWorks.title}
          subtitle={howItWorks.subtitle}
          steps={
            Array.isArray(stepsContent.steps)
              ? (stepsContent.steps as StepItem[])
              : []
          }
        />
      )}

      {pricing && (
        <PricingSection
          eyebrow={pricing.eyebrow}
          title={pricing.title}
          subtitle={pricing.subtitle}
          banner={pricingContent.banner as string | undefined}
          note={pricingContent.note as string | undefined}
          plans={planData}
        />
      )}

      {eaBot && (
        <AutomationSection
          eyebrow={eaBot.eyebrow}
          title={eaBot.title}
          subtitle={eaBot.subtitle}
          codeLines={
            Array.isArray(eaContent.codeLines)
              ? (eaContent.codeLines as string[])
              : []
          }
          features={
            Array.isArray(eaContent.features)
              ? (eaContent.features as string[])
              : []
          }
          ctaLabel={(eaContent.ctaLabel as string) ?? "Request access"}
          ctaUrl={(eaContent.ctaUrl as string) ?? "/contact"}
        />
      )}

      {promo && (
        <PromoSection
          eyebrow={promo.eyebrow}
          title={promo.title}
          subtitle={promo.subtitle}
          steps={
            Array.isArray(promoContent.steps)
              ? (promoContent.steps as PromoStep[])
              : []
          }
          ctaLabel={(promoContent.ctaLabel as string) ?? "Request the link"}
          ctaUrl={(promoContent.ctaUrl as string) ?? "/contact"}
          disclaimer={promoContent.disclaimer as string | undefined}
        />
      )}

      {testimonialsSection && testimonials.length > 0 && (
        <TestimonialsSection
          eyebrow={testimonialsSection.eyebrow}
          title={testimonialsSection.title}
          subtitle={testimonialsSection.subtitle}
          items={testimonials.map((t) => ({
            id: t.id,
            quote: t.quote,
            author: t.name,
            role: t.role,
            rating: 5,
          }))}
        />
      )}

      {faqSection && faqs.length > 0 && (
        <FaqSection
          eyebrow={faqSection.eyebrow}
          title={faqSection.title}
          subtitle={faqSection.subtitle}
          items={faqs.map((f) => ({
            id: f.id,
            question: f.question,
            answer: f.answer,
          }))}
        />
      )}

      {finalCta && (
        <FinalCta
          title={finalCta.title}
          subtitle={finalCta.subtitle}
          ctaLabel={(finalContent.ctaLabel as string) ?? "Create your account"}
          ctaUrl={(finalContent.ctaUrl as string) ?? "/register"}
        />
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: settings.siteName,
            url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
            description: settings.defaultSeoDescription,
            email: settings.contactEmail,
          }),
        }}
      />
    </>
  );
}
