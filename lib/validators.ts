import { z } from "zod";

export const emailField = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email({ message: "Enter a valid email address" }))
  .pipe(z.string().max(200));

export const passwordField = z
  .string()
  .min(8, { message: "Password must be at least 8 characters" })
  .max(200, { message: "Password is too long" });

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, { message: "Password is required" }),
});

export const registerSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, { message: "Please enter your name" })
    .max(120),
  email: emailField,
  password: passwordField,
  role: z.enum(["RETAIL", "IB", "REFERRAL"]).default("RETAIL"),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2, { message: "Please enter your name" }).max(120),
  email: emailField,
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  subject: z.string().trim().max(160).optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(10, { message: "Please tell us a little more" })
    .max(4000),
  // honeypot — real users never see or fill this; bots do.
  // Accept any value so validation passes and the route can silently discard
  // the submission (returning 400 would tell the bot it was detected).
  company: z.string().max(200).optional().or(z.literal("")),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ContactInput = z.infer<typeof contactSchema>;

/* ------------------------------------------------------------------ admin */

export const adminLoginSchema = z.object({
  email: emailField,
  password: z.string().min(1, { message: "Password is required" }),
});

export const pageSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: "Use lowercase letters, numbers, and hyphens only",
    }),
  title: z.string().trim().min(1).max(200),
  content: z.string().max(100_000),
  metaTitle: z.string().trim().max(200).optional().or(z.literal("")),
  metaDescription: z.string().trim().max(400).optional().or(z.literal("")),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
});

export const faqSchema = z.object({
  question: z.string().trim().min(3).max(300),
  answer: z.string().trim().min(3).max(5000),
  order: z.coerce.number().int().min(0).default(0),
  isEnabled: z.coerce.boolean().default(true),
});

export const testimonialSchema = z.object({
  name: z.string().trim().min(2).max(120),
  role: z.string().trim().max(120).optional().or(z.literal("")),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  quote: z.string().trim().min(10).max(2000),
  order: z.coerce.number().int().min(0).default(0),
  isEnabled: z.coerce.boolean().default(true),
});

export const pricingPlanSchema = z.object({
  name: z.string().trim().min(1).max(120),
  price: z.coerce.number().min(0),
  currency: z.string().trim().max(8).default("USD"),
  billingPeriod: z.string().trim().max(40).default("month"),
  features: z.array(z.string().trim().min(1)).default([]),
  ctaLabel: z.string().trim().max(60).default("Get started"),
  ctaUrl: z.string().trim().max(300).default("/register"),
  badge: z.string().trim().max(60).optional().or(z.literal("")),
  isHighlighted: z.coerce.boolean().default(false),
  isActive: z.coerce.boolean().default(true),
  order: z.coerce.number().int().min(0).default(0),
});

export const serviceSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  name: z.string().trim().min(1).max(160),
  description: z.string().trim().min(1).max(4000),
  price: z.coerce.number().min(0).optional().nullable(),
  currency: z.string().trim().max(8).default("USD"),
  billingPeriod: z.string().trim().max(40).optional().or(z.literal("")),
  features: z.array(z.string().trim().min(1)).default([]),
  ctaLabel: z.string().trim().max(60).optional().or(z.literal("")),
  ctaUrl: z.string().trim().max(300).optional().or(z.literal("")),
  isEnabled: z.coerce.boolean().default(true),
  order: z.coerce.number().int().min(0).default(0),
});

export const statSchema = z.object({
  label: z.string().trim().min(1).max(120),
  value: z.string().trim().min(1).max(40),
  suffix: z.string().trim().max(12).optional().or(z.literal("")),
  note: z.string().trim().max(200).optional().or(z.literal("")),
  order: z.coerce.number().int().min(0).default(0),
  isEnabled: z.coerce.boolean().default(true),
});

export const navItemSchema = z.object({
  label: z.string().trim().min(1).max(80),
  url: z.string().trim().min(1).max(300),
  location: z.enum(["HEADER", "FOOTER"]).default("HEADER"),
  order: z.coerce.number().int().min(0).default(0),
  isEnabled: z.coerce.boolean().default(true),
  isExternal: z.coerce.boolean().default(false),
});

export const settingsSchema = z.object({
  siteName: z.string().trim().min(1).max(80),
  tagline: z.string().trim().max(200),
  logoUrl: z.string().trim().max(300),
  faviconUrl: z.string().trim().max(300),
  contactEmail: z.string().trim().max(200),
  contactPhone: z.string().trim().max(60),
  whatsapp: z.string().trim().max(300),
  telegram: z.string().trim().max(300),
  footerText: z.string().trim().max(1000),
  copyright: z.string().trim().max(300),
  defaultSeoTitle: z.string().trim().max(200),
  defaultSeoDescription: z.string().trim().max(400),
  gaId: z.string().trim().max(40),
  riskNotice: z.string().trim().max(1000),
  primaryColor: z.string().trim().max(20),
  socials: z
    .object({
      x: z.string().trim().max(300).optional().or(z.literal("")),
      linkedin: z.string().trim().max(300).optional().or(z.literal("")),
      youtube: z.string().trim().max(300).optional().or(z.literal("")),
      instagram: z.string().trim().max(300).optional().or(z.literal("")),
    })
    .default({}),
});

export const homepageSectionSchema = z.object({
  key: z.string().trim().min(1).max(60),
  eyebrow: z.string().trim().max(200).optional().or(z.literal("")),
  title: z.string().trim().min(1).max(300),
  subtitle: z.string().trim().max(2000).optional().or(z.literal("")),
  content: z.string().optional(),
  order: z.coerce.number().int().min(0).default(0),
  isEnabled: z.coerce.boolean().default(true),
});
