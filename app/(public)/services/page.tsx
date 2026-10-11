import type { Metadata } from "next";
import { Check } from "lucide-react";
import { getServices } from "@/lib/content";
import { PageHeader } from "@/components/site/page-header";
import { Reveal } from "@/components/site/reveal";
import { ButtonLink } from "@/components/ui/button";
import { CtaBand } from "@/components/site/cta";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Structured signal feed, Expert Advisor suite, market analytics, and trader education — the Pipverge service stack.",
};

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Built for traders who want structure"
        subtitle="From a structured signal feed to full execution automation — pick the layer that fits how you trade."
      />

      <section className="py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          {services.map((service, i) => {
            const features = Array.isArray(service.features)
              ? (service.features as string[])
              : [];
            return (
              <Reveal key={service.id} delay={i * 70}>
                <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-7 transition-colors hover:border-gold/30">
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="font-display text-xl font-semibold text-foreground">
                      {service.name}
                    </h2>
                    {service.price != null && (
                      <span className="shrink-0 rounded-lg border border-gold/30 bg-gold/10 px-3 py-1 text-sm font-semibold text-gold">
                        ${service.price}
                        {service.billingPeriod ? (
                          <span className="font-normal text-gold/70">
                            /{service.billingPeriod}
                          </span>
                        ) : null}
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {service.description}
                  </p>
                  <ul className="mt-5 flex-1 space-y-2.5">
                    {features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm text-foreground/90">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <ButtonLink
                    href={service.ctaUrl ?? "/contact"}
                    variant="secondary"
                    className="mt-6 w-fit"
                  >
                    {service.ctaLabel ?? "Learn more"}
                  </ButtonLink>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      <div className="pb-20 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <CtaBand
            title="Not sure which fits?"
            subtitle="Tell us how you trade and we'll point you to the right layer."
            primaryLabel="Talk to us"
            primaryUrl="/contact"
            secondaryLabel="Compare plans"
            secondaryUrl="/pricing"
          />
        </div>
      </div>
    </>
  );
}
