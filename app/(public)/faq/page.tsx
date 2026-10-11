import type { Metadata } from "next";
import { getFaqs, getHomepageSection } from "@/lib/content";
import { PageHeader } from "@/components/site/page-header";
import { FaqSection } from "@/components/home/social";
import { CtaBand } from "@/components/site/cta";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers to the questions we hear most about Pipverge signals, automation, brokers, and pricing.",
};

export default async function FaqPage() {
  const [faqs, faqSection] = await Promise.all([
    getFaqs(),
    getHomepageSection("faq"),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="FAQ"
        title="Answers, upfront"
        subtitle="The questions we hear most, answered plainly. Still stuck? Reach out and a human will reply."
      />

      {faqs.length > 0 ? (
        <FaqSection
          eyebrow={null}
          title="Common questions"
          subtitle={null}
          items={faqs.map((f) => ({
            id: f.id,
            question: f.question,
            answer: f.answer,
          }))}
        />
      ) : (
        <section className="py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <EmptyState
              title="No FAQs yet"
              description="Questions will appear here once they're published from the admin console."
            />
          </div>
        </section>
      )}

      <div className="pb-20 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <CtaBand
            title={faqSection?.title ?? "Still have questions?"}
            subtitle="Send us a message and we'll get back to you."
            primaryLabel="Contact us"
            primaryUrl="/contact"
            secondaryLabel="View pricing"
            secondaryUrl="/pricing"
          />
        </div>
      </div>
    </>
  );
}
