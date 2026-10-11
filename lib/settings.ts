import { prisma } from "./prisma";

export type SocialLinks = {
  x?: string;
  linkedin?: string;
  youtube?: string;
  instagram?: string;
};

export type SiteSettings = {
  siteName: string;
  tagline: string;
  logoUrl: string;
  faviconUrl: string;
  contactEmail: string;
  contactPhone: string;
  whatsapp: string;
  telegram: string;
  socials: SocialLinks;
  footerText: string;
  copyright: string;
  defaultSeoTitle: string;
  defaultSeoDescription: string;
  gaId: string;
  riskNotice: string;
  primaryColor: string;
};

export const defaultSettings: SiteSettings = {
  siteName: "Pipverge",
  tagline: "Intelligent trading. Smarter decisions. Better execution.",
  logoUrl: "/brand/pipverge-logo.svg",
  faviconUrl: "/favicon.ico",
  contactEmail: "hello@pipverge.com",
  contactPhone: "",
  whatsapp: "",
  telegram: "",
  socials: {},
  footerText:
    "Pipverge is a trading-intelligence platform providing market analysis, signals, and automation tools.",
  copyright: `© ${new Date().getFullYear()} Pipverge. All rights reserved.`,
  defaultSeoTitle:
    "Pipverge — Intelligent trading. Smarter decisions. Better execution.",
  defaultSeoDescription:
    "Structured market signals, automated strategies, and performance analytics for forex, gold, and index traders.",
  gaId: "",
  riskNotice:
    "Trading involves substantial risk of loss. Past performance does not guarantee future results. Nothing on this site is financial advice.",
  primaryColor: "#D4AF37",
};

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const rows = await prisma.siteSetting.findMany();
    const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    return { ...defaultSettings, ...map } as SiteSettings;
  } catch {
    return defaultSettings;
  }
}
