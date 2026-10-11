import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";
import { TestimonialCard } from "@/components/site/testimonial-card";
import { Accordion } from "@/components/ui/accordion";

export type TestimonialData = {
  id: string;
  quote: string;
  author: string;
  role?: string | null;
  rating?: number;
};

export function TestimonialsSection({
  eyebrow,
  title,
  subtitle,
  items,
}: {
  eyebrow?: string | null;
  title: string;
  subtitle?: string | null;
  items: TestimonialData[];
}) {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {items.map((t, i) => (
            <Reveal key={t.id} delay={i * 80}>
              <TestimonialCard
                quote={t.quote}
                author={t.author}
                role={t.role}
                rating={t.rating ?? 5}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FaqSection({
  eyebrow,
  title,
  subtitle,
  items,
}: {
  eyebrow?: string | null;
  title: string;
  subtitle?: string | null;
  items: { id: string; question: string; answer: string }[];
}) {
  return (
    <section className="border-t border-border bg-surface/60 py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} />
        <Reveal className="mt-10">
          <Accordion items={items} />
        </Reveal>
      </div>
    </section>
  );
}
