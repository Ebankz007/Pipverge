import { CtaBand } from "@/components/site/cta";

export function FinalCta({
  title,
  subtitle,
  ctaLabel,
  ctaUrl,
}: {
  title: string;
  subtitle?: string | null;
  ctaLabel: string;
  ctaUrl: string;
}) {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <CtaBand
          title={title}
          subtitle={subtitle}
          primaryLabel={ctaLabel}
          primaryUrl={ctaUrl}
          secondaryLabel="Talk to us"
          secondaryUrl="/contact"
        />
      </div>
    </section>
  );
}
