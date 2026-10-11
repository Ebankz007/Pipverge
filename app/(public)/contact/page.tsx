import type { Metadata } from "next";
import { Mail, MessageCircle, Send } from "lucide-react";
import { getSiteSettings } from "@/lib/settings";
import { PageHeader } from "@/components/site/page-header";
import { Reveal } from "@/components/site/reveal";
import { ContactForm } from "@/components/site/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with the Pipverge team — questions about signals, automation, or partner offers.",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();

  const channels = [
    settings.contactEmail && {
      icon: Mail,
      label: "Email",
      value: settings.contactEmail,
      href: `mailto:${settings.contactEmail}`,
    },
    settings.telegram && {
      icon: Send,
      label: "Telegram",
      value: settings.telegram.replace(/^https?:\/\//, ""),
      href: settings.telegram,
    },
    settings.whatsapp && {
      icon: MessageCircle,
      label: "WhatsApp",
      value: settings.whatsapp,
      href: settings.whatsapp,
    },
  ].filter(Boolean) as {
    icon: typeof Mail;
    label: string;
    value: string;
    href: string;
  }[];

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Talk to the Pipverge team"
        subtitle="Questions about the signal feed, the Expert Advisor, or a partner-broker offer? Send us a message."
      />

      <section className="py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.4fr_1fr] lg:px-8">
          <Reveal>
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
              <h2 className="font-display text-xl font-semibold text-foreground">
                Send a message
              </h2>
              <p className="mt-1.5 text-sm text-muted">
                We typically reply within one business day.
              </p>
              <div className="mt-6">
                <ContactForm />
              </div>
            </div>
          </Reveal>

          <Reveal delay={100} className="space-y-4">
            {channels.map((c) => {
              const Icon = c.icon;
              return (
                <a
                  key={c.label}
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-gold/40"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gold/25 bg-gold/10 text-gold">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-xs uppercase tracking-wider text-faint">
                      {c.label}
                    </span>
                    <span className="block text-sm font-medium text-foreground">
                      {c.value}
                    </span>
                  </span>
                </a>
              );
            })}

            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="text-sm font-semibold text-foreground">
                Before you write
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted">
                Pipverge does not provide personalised financial advice. For
                account-specific questions, contact your broker directly.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
