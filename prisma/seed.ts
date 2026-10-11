/**
 * Pipverge seed — realistic content, idempotent.
 * Run: pnpm db:seed   (or: pnpm prisma db seed)
 */
import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required to seed.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function seedAdmin() {
  const email = (process.env.ADMIN_EMAIL ?? "admin@pipverge.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "ChangeMe-Admin-123!";
  const name = process.env.ADMIN_NAME ?? "Pipverge Admin";
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.admin.upsert({
    where: { email },
    update: { name, role: "SUPERADMIN", isActive: true },
    create: { email, name, role: "SUPERADMIN", passwordHash, isActive: true },
  });
  console.log(`  admin: ${email}`);
}

async function seedSettings() {
  const settings: Record<string, unknown> = {
    siteName: "Pipverge",
    tagline: "Intelligent trading. Smarter decisions. Better execution.",
    logoUrl: "/brand/pipverge-logo.svg",
    faviconUrl: "/favicon.ico",
    contactEmail: "hello@pipverge.com",
    contactPhone: "+1 (000) 000-0000",
    whatsapp: "",
    telegram: "https://t.me/pipverge",
    socials: {
      x: "https://x.com/pipverge",
      linkedin: "https://linkedin.com/company/pipverge",
      youtube: "",
      instagram: "",
    },
    footerText:
      "Pipverge is a trading-intelligence platform. We provide market analysis, signals, and automation tools for educational and informational purposes.",
    copyright: `© ${new Date().getFullYear()} Pipverge. All rights reserved.`,
    defaultSeoTitle:
      "Pipverge — Intelligent trading. Smarter decisions. Better execution.",
    defaultSeoDescription:
      "Structured market signals, automated strategies, and performance analytics for forex, gold, and index traders.",
    gaId: "",
    riskNotice:
      "Trading involves substantial risk of loss and is not suitable for every investor. Past performance does not guarantee future results. Nothing on this site is financial advice.",
    primaryColor: "#D4AF37",
  };

  for (const [key, value] of Object.entries(settings)) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value: value as object },
      create: { key, value: value as object },
    });
  }
  console.log(`  site settings: ${Object.keys(settings).length}`);
}

async function seedNavigation() {
  await prisma.navigationItem.deleteMany({});
  const header = [
    { label: "Features", url: "/features", order: 1 },
    { label: "Services", url: "/services", order: 2 },
    { label: "Pricing", url: "/pricing", order: 3 },
    { label: "About", url: "/about", order: 4 },
    { label: "FAQ", url: "/faq", order: 5 },
    { label: "Contact", url: "/contact", order: 6 },
  ];
  const footer = [
    { label: "About", url: "/about", order: 1 },
    { label: "Features", url: "/features", order: 2 },
    { label: "Services", url: "/services", order: 3 },
    { label: "Pricing", url: "/pricing", order: 4 },
    { label: "FAQ", url: "/faq", order: 5 },
    { label: "Contact", url: "/contact", order: 6 },
    { label: "Risk Disclosure", url: "/risk-disclosure", order: 7 },
    { label: "Privacy Policy", url: "/privacy", order: 8 },
    { label: "Terms of Service", url: "/terms", order: 9 },
    { label: "Cookie Policy", url: "/cookie-policy", order: 10 },
  ];
  for (const item of header) {
    await prisma.navigationItem.create({
      data: { ...item, location: "HEADER", isEnabled: true },
    });
  }
  for (const item of footer) {
    await prisma.navigationItem.create({
      data: { ...item, location: "FOOTER", isEnabled: true },
    });
  }
  console.log(`  navigation: ${header.length + footer.length}`);
}

async function seedHomepage() {
  const sections = [
    {
      key: "hero",
      eyebrow: "Live market intelligence — delivered in real time",
      title: "Trade with structure, not guesswork.",
      subtitle:
        "Pipverge turns raw market data into clear, risk-defined trade ideas across forex majors, gold, and indices. Every setup ships with an entry, a stop, and a target — plus the reasoning behind it.",
      order: 1,
      content: {
        badge: "Signals · Automation · Analytics",
        primaryCtaLabel: "Start free",
        primaryCtaUrl: "/register",
        secondaryCtaLabel: "Explore the platform",
        secondaryCtaUrl: "/features",
        tertiaryLabel: "See how it works",
        tertiaryUrl: "/#how-it-works",
        symbols: [
          "EUR/USD",
          "GBP/USD",
          "USD/JPY",
          "XAU/USD",
          "NAS100",
          "US30",
          "BTC/USD",
        ],
      },
    },
    {
      key: "market",
      eyebrow: "Live Market",
      title: "Real-time market pulse",
      subtitle:
        "Cross rates, currency strength, and live pricing — the same context our analysts work from, streamed straight to the page.",
      order: 2,
      content: { symbols: ["EUR/USD", "GBP/USD", "XAU/USD", "NAS100"] },
    },
    {
      key: "track_record",
      eyebrow: "Transparent Performance",
      title: "A track record you can inspect",
      subtitle:
        "We publish our stats instead of screenshots. Risk-defined entries, controlled drawdown, and a process that stays the same in every market condition.",
      order: 3,
      content: {
        ytdLabel: "Trailing 12-month growth (sample)",
        note: "10 of 12 months positive · Risk per trade capped at 1.5%",
        disclaimer:
          "Figures shown are illustrative sample data for demonstration and will be replaced with a live, verifiable account history. Past performance does not guarantee future results.",
        sampleData: true,
      },
    },
    {
      key: "what_you_get",
      eyebrow: "Inside the platform",
      title: "What you get",
      subtitle:
        "Everything you need to act on a market view — structured, explained, and delivered the moment it matters.",
      order: 4,
      content: {
        features: [
          {
            icon: "target",
            title: "Entry, stop & target on every idea",
            body: "Exact levels with defined risk-to-reward. No vague calls, no moving targets.",
          },
          {
            icon: "globe",
            title: "Majors, gold & indices",
            body: "Coverage across EUR/USD, GBP/USD, USD/JPY, XAU/USD, NAS100, US30, and BTC/USD.",
          },
          {
            icon: "zap",
            title: "Real-time delivery",
            body: "Setups reach your dashboard and channel within seconds — the same feed our analysts trade.",
          },
          {
            icon: "message-square",
            title: "Context & commentary",
            body: "Short breakdowns explain the why behind each setup, so you learn as you trade.",
          },
        ],
      },
    },
    {
      key: "how_it_works",
      eyebrow: "Get started in minutes",
      title: "How it works",
      subtitle: "Three steps from sign-up to your first structured setup.",
      order: 5,
      content: {
        steps: [
          {
            title: "Create your account",
            body: "Register in under a minute. Choose your path — retail trader, introducing broker, or referrer.",
          },
          {
            title: "Receive structured setups",
            body: "Every idea arrives with entry, stop, target, and a short rationale — on the dashboard and your preferred channel.",
          },
          {
            title: "Execute on your platform",
            body: "Trade the setups on any broker or platform you already use, or let the Pipverge EA handle execution.",
          },
        ],
      },
    },
    {
      key: "pricing",
      eyebrow: "Plans & pricing",
      title: "Pricing",
      subtitle:
        "Straightforward pricing on signal plans and the automation suite. Cancel anytime.",
      order: 6,
      content: {
        banner: "Launch offer — 50% off your first term",
        note: "Prefer to start small? Every plan begins with a free trial of the daily feed.",
      },
    },
    {
      key: "ea_bot",
      eyebrow: "Automation",
      title: "Put your execution on autopilot",
      subtitle:
        "The Pipverge Expert Advisor runs the same risk-defined logic automatically — so you never miss a setup to screen time.",
      order: 7,
      content: {
        fileName: "Pipverge_EA.mq5",
        codeLines: [
          "// Setup detected — structure confirmed",
          'SYMBOL = "XAUUSD"',
          "ENTRY  = 2384.50",
          "STOP   = 2379.80",
          "TARGET = 2396.20",
          "// Risk: 1.0%  •  R:R = 1:2.5",
          "→ Order placed",
        ],
        features: [
          "MetaTrader 4 & 5 compatible",
          "Runs 24/5 on your VPS or PC",
          "Built-in position sizing & risk limits",
          "Free updates and setup support",
        ],
        ctaLabel: "Request access",
        ctaUrl: "/contact",
      },
    },
    {
      key: "promo",
      eyebrow: "Partner offer",
      title: "Start with a funded account",
      subtitle:
        "Open and fund an account with a Pipverge partner broker and unlock a complimentary term of premium signals.",
      order: 8,
      content: {
        broker: "a partner broker",
        steps: [
          { step: "Step 1", title: "Register with a partner broker", body: "We'll share the direct link when you request it." },
          { step: "Step 2", title: "Fund your account", body: "Deposit the qualifying minimum using any method the broker supports." },
          { step: "Step 3", title: "Unlock premium signals", body: "Send proof of deposit and we activate your complimentary access." },
        ],
        ctaLabel: "Request the link",
        ctaUrl: "/contact",
        disclaimer:
          "Referral offer subject to partner verification. One offer per new client. Trading involves risk — see our Risk Disclosure.",
      },
    },
    {
      key: "testimonials",
      eyebrow: "Community",
      title: "What members are saying",
      subtitle: "Real feedback from traders using Pipverge day to day.",
      order: 9,
      content: {},
    },
    {
      key: "faq",
      eyebrow: "FAQ",
      title: "Answers, upfront",
      subtitle: "The questions we hear most, answered plainly.",
      order: 10,
      content: {},
    },
    {
      key: "final_cta",
      eyebrow: "",
      title: "Ready to trade with structure?",
      subtitle:
        "Join Pipverge and get your next risk-defined setup the moment it forms.",
      order: 11,
      content: { ctaLabel: "Create your account", ctaUrl: "/register" },
    },
  ];

  for (const s of sections) {
    await prisma.homepageSection.upsert({
      where: { key: s.key },
      update: {
        eyebrow: s.eyebrow,
        title: s.title,
        subtitle: s.subtitle,
        content: s.content as object,
        order: s.order,
        isEnabled: true,
      },
      create: {
        key: s.key,
        eyebrow: s.eyebrow,
        title: s.title,
        subtitle: s.subtitle,
        content: s.content as object,
        order: s.order,
        isEnabled: true,
      },
    });
  }
  console.log(`  homepage sections: ${sections.length}`);
}

async function seedStats() {
  await prisma.stat.deleteMany({});
  const stats = [
    { label: "Win rate", value: "68.5", suffix: "%", note: "Trailing 12 months", order: 1 },
    { label: "Avg. pips / week", value: "+420", suffix: "", note: "Rolling 90-day average", order: 2 },
    { label: "Max drawdown", value: "7.9", suffix: "%", note: "Risk-controlled entries", order: 3 },
    { label: "Best month", value: "+16.4", suffix: "%", note: "Rolling 12 months", order: 4 },
    { label: "Profit factor", value: "2.18", suffix: "", note: "Gross win ÷ gross loss", order: 5 },
    { label: "Operating since", value: "2021", suffix: "", note: "Live account history", order: 6 },
  ];
  for (const s of stats) await prisma.stat.create({ data: s });
  console.log(`  stats: ${stats.length}`);
}

async function seedMonthlyReturns() {
  await prisma.monthlyReturn.deleteMany({});
  const values = [5.2, 8.1, 15.7, 3.9, 10.4, -1.8, 7.6, 12.9, 4.7, 11.1, -1.2, 9.4];
  for (let i = 0; i < values.length; i++) {
    await prisma.monthlyReturn.create({
      data: { year: 2025, month: i + 1, pct: values[i], order: i },
    });
  }
  console.log(`  monthly returns: ${values.length}`);
}

async function seedServices() {
  const services = [
    {
      slug: "signal-feed",
      name: "Structured Signal Feed",
      description:
        "Risk-defined trade ideas across forex majors, gold, and indices — each with entry, stop, target, and a short rationale.",
      price: 49,
      billingPeriod: "month",
      features: ["Daily setups", "Entry / SL / TP", "Dashboard + channel delivery", "Risk-management guide"],
      ctaLabel: "View plans",
      ctaUrl: "/pricing",
      order: 1,
    },
    {
      slug: "expert-advisors",
      name: "Expert Advisor Suite",
      description:
        "Automation tools that execute the same risk-defined logic on MetaTrader 4 and 5, with built-in position sizing.",
      price: 249,
      billingPeriod: "one-time",
      features: ["MT4 & MT5", "Lifetime license", "Risk controls", "Free updates"],
      ctaLabel: "Request access",
      ctaUrl: "/contact",
      order: 2,
    },
    {
      slug: "market-analytics",
      name: "Market Analytics",
      description:
        "Live cross rates, currency strength, and performance tracking so you can see the market — and your results — clearly.",
      price: null,
      billingPeriod: null,
      features: ["Live cross rates", "Currency strength", "Performance tracking", "Weekly outlook"],
      ctaLabel: "Explore",
      ctaUrl: "/features",
      order: 3,
    },
    {
      slug: "trader-education",
      name: "Trader Education",
      description:
        "Practical breakdowns of market structure and risk so you understand the why, not just the entry.",
      price: null,
      billingPeriod: null,
      features: ["Market-structure notes", "Risk framework", "Setup walkthroughs", "Community Q&A"],
      ctaLabel: "Learn more",
      ctaUrl: "/about",
      order: 4,
    },
  ];
  for (const s of services) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: { ...s, features: s.features as object, isEnabled: true },
      create: { ...s, features: s.features as object, isEnabled: true },
    });
  }
  console.log(`  services: ${services.length}`);
}

async function seedPricing() {
  await prisma.pricingPlan.deleteMany({});
  const plans = [
    {
      name: "Standard",
      price: 49,
      billingPeriod: "month",
      features: [
        "Daily forex & gold signals",
        "Entry, stop & target on every call",
        "Dashboard delivery",
        "Basic risk-management guide",
      ],
      ctaLabel: "Start with Standard",
      ctaUrl: "/register",
      badge: null,
      isHighlighted: false,
      order: 1,
    },
    {
      name: "Pro",
      price: 149,
      billingPeriod: "month",
      features: [
        "Everything in Standard",
        "Real-time premium setups",
        "Analyst commentary & live sessions",
        "Priority support",
        "Weekly market outlook",
      ],
      ctaLabel: "Go Pro",
      ctaUrl: "/register",
      badge: "Most popular",
      isHighlighted: true,
      order: 2,
    },
    {
      name: "EA License",
      price: 249,
      billingPeriod: "one-time",
      features: [
        "Pipverge EA (MT4 / MT5)",
        "Lifetime license — 1 account",
        "Free updates",
        "Setup support included",
      ],
      ctaLabel: "Get the EA",
      ctaUrl: "/contact",
      badge: null,
      isHighlighted: false,
      order: 3,
    },
  ];
  for (const p of plans) {
    await prisma.pricingPlan.create({ data: { ...p, features: p.features as object } });
  }
  console.log(`  pricing plans: ${plans.length}`);
}

async function seedTestimonials() {
  await prisma.testimonial.deleteMany({});
  const items = [
    {
      name: "Daniel R.",
      role: "Retail trader",
      company: "London",
      quote:
        "The structure is what sold me. Every setup has a stop and a target before I take it — that alone changed how I trade.",
      order: 1,
    },
    {
      name: "Priya S.",
      role: "Swing trader",
      company: "Singapore",
      quote:
        "I use Pipverge for context more than signals now. The commentary explains the market structure I was missing.",
      order: 2,
    },
    {
      name: "Marcus T.",
      role: "Introducing broker",
      company: "Dubai",
      quote:
        "Clean dashboard, clear plans, and the analytics keep my clients engaged. It's a platform I'm comfortable recommending.",
      order: 3,
    },
  ];
  for (const t of items) await prisma.testimonial.create({ data: { ...t, isEnabled: true } });
  console.log(`  testimonials: ${items.length}`);
}

async function seedFaqs() {
  await prisma.faq.deleteMany({});
  const items = [
    {
      question: "Is Pipverge financial advice?",
      answer:
        "No. Pipverge provides market analysis, signals, and automation tools for educational and informational purposes. Nothing we publish is personalised financial advice, and you are responsible for your own decisions.",
      order: 1,
    },
    {
      question: "Which markets and instruments are covered?",
      answer:
        "Forex majors (EUR/USD, GBP/USD, USD/JPY and more), gold (XAU/USD), and major indices such as NAS100 and US30, plus BTC/USD.",
      order: 2,
    },
    {
      question: "How are setups delivered?",
      answer:
        "Every idea lands on your dashboard, with optional delivery to your preferred channel. Each includes entry, stop, target, and a short rationale.",
      order: 3,
    },
    {
      question: "Do I need a specific broker?",
      answer:
        "No. You can execute on any broker or platform you already use. Our partner-broker offer is optional and simply unlocks a promotional benefit.",
      order: 4,
    },
    {
      question: "Can I automate execution?",
      answer:
        "Yes. The Pipverge Expert Advisor runs the same risk-defined logic on MetaTrader 4 and 5, with built-in position sizing and risk limits.",
      order: 5,
    },
    {
      question: "What does it cost?",
      answer:
        "Plans start at $49/month, with a Pro tier at $149/month and a one-time EA license. You can change or cancel your plan at any time.",
      order: 6,
    },
  ];
  for (const f of items) await prisma.faq.create({ data: { ...f, isEnabled: true } });
  console.log(`  faqs: ${items.length}`);
}

async function seedPages() {
  const pages = [
    {
      slug: "risk-disclosure",
      title: "Risk Disclosure",
      metaTitle: "Risk Disclosure · Pipverge",
      metaDescription:
        "Understand the risks of trading and how Pipverge approaches risk management and disclosure.",
      content: [
        "## Risk Disclosure",
        "",
        "*Last updated: 2026. This document is a reviewable baseline and should be reviewed by qualified counsel before publication.*",
        "",
        "Trading foreign exchange, contracts for difference, and other leveraged instruments carries a high level of risk and may not be suitable for all investors. You could sustain a loss of some or all of your capital.",
        "",
        "### No financial advice",
        "Pipverge provides market analysis, signals, and automation tools for educational and informational purposes only. Nothing we publish constitutes personalised investment advice or a recommendation to buy or sell any instrument.",
        "",
        "### Past performance",
        "Past performance is not indicative of future results. Any performance figures shown on this site are illustrative unless explicitly stated to be from a live, verifiable account.",
        "",
        "### Your responsibility",
        "You are solely responsible for your trading decisions, position sizing, and risk management. Never trade with capital you cannot afford to lose.",
        "",
        "### Automation risk",
        "Expert Advisors and automated strategies can malfunction due to connectivity, broker execution, or market conditions. Always supervise automated trading.",
      ].join("\n"),
    },
    {
      slug: "privacy",
      title: "Privacy Policy",
      metaTitle: "Privacy Policy · Pipverge",
      metaDescription: "How Pipverge collects, uses, and protects your personal data.",
      content: [
        "## Privacy Policy",
        "",
        "*Last updated: 2026. Reviewable baseline — confirm against applicable data-protection law before publication.*",
        "",
        "### What we collect",
        "We collect the information you provide when you register or contact us — such as your name, email address, and message — and limited technical data required to operate the site securely.",
        "",
        "### How we use it",
        "We use your information to provide the service, respond to enquiries, and improve the platform. We do not sell your personal data.",
        "",
        "### Cookies",
        "We use essential cookies to keep you signed in and to secure the platform. See our Cookie Policy for details.",
        "",
        "### Your rights",
        "You may request access to, correction of, or deletion of your personal data by contacting us.",
        "",
        "### Contact",
        "For privacy enquiries, email hello@pipverge.com.",
      ].join("\n"),
    },
    {
      slug: "terms",
      title: "Terms of Service",
      metaTitle: "Terms of Service · Pipverge",
      metaDescription: "The terms governing your use of the Pipverge platform.",
      content: [
        "## Terms of Service",
        "",
        "*Last updated: 2026. Reviewable baseline — confirm with counsel before publication.*",
        "",
        "### Acceptance",
        "By accessing or using Pipverge, you agree to these terms. If you do not agree, do not use the platform.",
        "",
        "### Eligibility",
        "You must be of legal age in your jurisdiction to use the platform. It is your responsibility to ensure your use complies with local law.",
        "",
        "### No advice",
        "Pipverge provides information and tools, not financial advice. You are responsible for your own decisions.",
        "",
        "### Acceptable use",
        "You agree not to misuse the platform, attempt to disrupt it, or redistribute its content without permission.",
        "",
        "### Limitation of liability",
        "To the maximum extent permitted by law, Pipverge is not liable for trading losses or damages arising from your use of the platform.",
      ].join("\n"),
    },
    {
      slug: "cookie-policy",
      title: "Cookie Policy",
      metaTitle: "Cookie Policy · Pipverge",
      metaDescription: "How Pipverge uses cookies and similar technologies.",
      content: [
        "## Cookie Policy",
        "",
        "*Last updated: 2026. Reviewable baseline — confirm with counsel before publication.*",
        "",
        "### What cookies we use",
        "We use strictly necessary cookies to keep you signed in and to protect the platform against abuse. We may use analytics cookies to understand how the site is used.",
        "",
        "### Managing cookies",
        "You can control cookies through your browser settings. Disabling essential cookies may prevent parts of the platform from working.",
      ].join("\n"),
    },
  ];

  for (const p of pages) {
    await prisma.page.upsert({
      where: { slug: p.slug },
      update: {
        title: p.title,
        content: p.content,
        metaTitle: p.metaTitle,
        metaDescription: p.metaDescription,
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
      create: {
        slug: p.slug,
        title: p.title,
        content: p.content,
        metaTitle: p.metaTitle,
        metaDescription: p.metaDescription,
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
    });
  }
  console.log(`  pages: ${pages.length}`);
}

async function main() {
  console.log("Seeding Pipverge…");
  await seedAdmin();
  await seedSettings();
  await seedNavigation();
  await seedHomepage();
  await seedStats();
  await seedMonthlyReturns();
  await seedServices();
  await seedPricing();
  await seedTestimonials();
  await seedFaqs();
  await seedPages();
  console.log("Seed complete.");
}

main()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
