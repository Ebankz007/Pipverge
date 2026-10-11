import type { Metadata } from "next";
import { getStats } from "@/lib/content";
import { PageHeader } from "@/components/site/page-header";
import { Reveal } from "@/components/site/reveal";
import { StatCard } from "@/components/site/stat-card";
import { CtaBand } from "@/components/site/cta";

export const metadata: Metadata = {
  title: "About",
  description:
    "Pipverge builds trading intelligence for people who want structure — risk-defined setups, transparent performance, and tools that respect the risk.",
};

const VALUES = [
  {
    title: "Structure over noise",
    body: "Every idea ships with an entry, a stop, and a target — plus the reasoning. If we can't define the risk, we don't publish the trade.",
  },
  {
    title: "Transparency, not screenshots",
    body: "We publish our stats and label what's illustrative. Trust is earned by showing the process, not by curating the highlight reel.",
  },
  {
    title: "Risk is the product",
    body: "Position sizing, drawdown control, and defined risk-to-reward aren't features bolted on — they're the core of everything we build.",
  },
];

export default async function AboutPage() {
  const stats = await getStats();

  return (
    <>
      <PageHeader
        eyebrow="About"
        title="We build tools for traders who respect risk"
        subtitle="Pipverge exists to replace guesswork with structure. Clear setups, honest performance, and automation that behaves like a disciplined trader."
      />

      <section className="py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          {VALUES.map((v, i) => (
            <Reveal key={v.title} delay={i * 80}>
              <div className="h-full rounded-2xl border border-border bg-card p-7">
                <h2 className="font-display text-lg font-semibold text-foreground">
                  {v.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted">{v.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {stats.length > 0 && (
        <section className="border-y border-border bg-surface/60 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <h2 className="font-display text-2xl font-bold text-foreground">
                By the numbers
              </h2>
              <p className="mt-2 text-sm text-muted">
                Illustrative sample figures — see our Risk Disclosure for detail.
              </p>
            </Reveal>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {stats.map((s, i) => (
                <StatCard
                  key={s.id}
                  delay={i * 60}
                  stat={{
                    id: s.id,
                    label: s.label,
                    value: s.value,
                    suffix: s.suffix,
                    prefix: null,
                    description: s.note,
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <CtaBand
            title="Trade with structure"
            subtitle="Join Pipverge and get your next risk-defined setup the moment it forms."
            primaryLabel="Create your account"
            primaryUrl="/register"
            secondaryLabel="Contact us"
            secondaryUrl="/contact"
          />
        </div>
      </div>
    </>
  );
}
