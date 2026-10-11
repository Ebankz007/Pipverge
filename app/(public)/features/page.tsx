import type { Metadata } from "next";
import { getHomepageSection } from "@/lib/content";
import { PageHeader } from "@/components/site/page-header";
import { FeaturesSection, HowItWorks } from "@/components/home/features";
import { CtaBand } from "@/components/site/cta";
import type { FeatureItem, StepItem } from "@/components/home/features";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Risk-defined setups, multi-market coverage, real-time delivery, and analyst commentary — see what's inside the Pipverge platform.",
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export default async function FeaturesPage() {
  const [whatYouGet, howItWorks] = await Promise.all([
    getHomepageSection("what_you_get"),
    getHomepageSection("how_it_works"),
  ]);

  const features = Array.isArray(asRecord(whatYouGet?.content).features)
    ? (asRecord(whatYouGet?.content).features as FeatureItem[])
    : [];
  const steps = Array.isArray(asRecord(howItWorks?.content).steps)
    ? (asRecord(howItWorks?.content).steps as StepItem[])
    : [];

  return (
    <>
      <PageHeader
        eyebrow="Platform"
        title="Everything you need to act on a market view"
        subtitle="Pipverge turns raw market data into clear, risk-defined trade ideas — structured, explained, and delivered the moment it matters."
      />

      {whatYouGet && (
        <FeaturesSection
          eyebrow={whatYouGet.eyebrow}
          title={whatYouGet.title}
          subtitle={whatYouGet.subtitle}
          features={features}
        />
      )}

      {howItWorks && (
        <HowItWorks
          eyebrow={howItWorks.eyebrow}
          title={howItWorks.title}
          subtitle={howItWorks.subtitle}
          steps={steps}
        />
      )}

      <div className="pb-20 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <CtaBand
            title="See it in action"
            subtitle="Create a free account and get your first structured setup."
            primaryLabel="Start free"
            primaryUrl="/register"
            secondaryLabel="View pricing"
            secondaryUrl="/pricing"
          />
        </div>
      </div>
    </>
  );
}
