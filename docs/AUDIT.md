# Reference Website Audit — tradeiq.tech

> Conducted 2026-10-11 by Kairos. Source: live render + raw HTML/CSS/JS bundle inspection
> (Cloudflare-hosted, Lovable/Vite SPA). This is an audit of *structure and experience*,
> not a licence to copy code or assets.

## 1. What the reference actually is

- **Product:** a forex/gold **signal service + EA (Expert Advisor) shop**, delivered via Telegram.
- **Built on:** Lovable (Vite + React + TypeScript + Tailwind + shadcn/ui). Hosted on Cloudflare
  with an SPA fallback (every unknown path returns the app shell with HTTP 200).
- **Reality check:** there is **no real backend**. Payments are in **test mode** (Lovable banner),
  auth is a **client-side mock**, the dashboard/IB routes just bounce to `/auth`, and all four
  legal pages are `[LEGAL TEXT PENDING REVIEW]` placeholders. The "verified Myfxbook" track record
  is hard-coded marketing copy.

## 2. Routes discovered (from the router bundle, not the sitemap)

The `sitemap.xml` lists **only `/`**. The bundle reveals more:

| Route | What it is | Notes |
|---|---|---|
| `/` | Marketing homepage (single scroll) | the real product surface |
| `/pricing` | Full pricing page | monthly/annual toggle; 2 signal plans + 3 EAs |
| `/auth` | Sign up / Sign in | role selector (Retail / IB / Refer), Google button — mocked |
| `/dashboard` | Post-login dashboard | auth-gated → redirects to `/auth` when signed out |
| `/ib` | Introducing Broker area | auth-gated → `/auth` |
| `/checkout/return` | Payment return page | "No session information found" |
| `/risk-disclosure` | Legal | placeholder |
| `/privacy` | Legal | placeholder |
| `/terms` | Legal | placeholder |
| `/refund-policy` | Legal | placeholder |
| `*` | 404 | |

**Conclusion:** the only genuinely built surface is the **marketing site** (`/` + `/pricing`).
Everything behind `/auth` is a mock.

## 3. Homepage — section order (the scroll journey)

1. **Header** — logo + brand; nav anchors (`Track Record`, `What You Get`, `How It Works`, `FAQ`);
   CTA `Join Telegram`. Glass/sticky.
2. **Hero** — eyebrow "Live signals — delivered to Telegram"; H1 "Precision trade signals, built on
   Smart Money Concepts."; sub-paragraph; two CTAs (`Join Free on Telegram`, `Subscribe to EA Bot`);
   tertiary link `See the track record`; **symbol chip row** (EUR/USD · GBP/USD · USD/JPY · XAU/USD ·
   NAS100 · US30 · BTC/USD).
3. **Live Market** — "Real-time market pulse"; **TradingView embeds** (ticker tape, forex cross-rates,
   currency heat map).
4. **Track Record** — eyebrow "Verified Performance"; **6 stat cards** (72.4% win rate, +380 avg pips/wk,
   8.6% max DD, +18.2% best month, 2.31 profit factor, active since 2022); **monthly-returns bar chart**
   (12 bars, J–D, +/- values) with `+98.7% YTD compounded`; legend; risk note.
5. **What You Get** — 4 feature cards (Entry/SL/TP; majors+gold+indices; real-time delivery; commentary).
6. **How It Works** — 3 numbered steps.
7. **Pricing (home)** — discount banner; 3 cards (Standard $49/mo, VIP $149/mo "Most Popular",
   EA Bot License $249 one-time); strike-through pricing + save badges; footnote to broker promo.
8. **EA Bot** — feature list + an **animated code-block** mock (`TradeIQ_EA.mq5`, typed SMC entry);
   CTAs.
9. **Broker Promo** — "1 month VIP free"; 3 steps; `Register with GTC` referral link + Telegram claim.
10. **Testimonials** — "What members are saying"; 3 **placeholder** quotes.
11. **FAQ** — 5 accordion items (answers hidden in the render).
12. **Final CTA** — "Ready to trade with structure?" + `Join Free on Telegram`.
13. **Footer** — logo; legal links (Risk/Privacy/Terms); copyright; risk disclaimer line.
+ Lovable "Edit with" badge (their platform artifact — not reproduced).

## 4. Design system (extracted from the CSS bundle)

**Theme:** dark, navy-based, single cyan/azure accent.

| Token | Value |
|---|---|
| background | `hsl(222 47% 5%)` ≈ `#070B14` |
| card | `hsl(222 47% 8%)` |
| muted | `hsl(222 30% 12%)` |
| border / input | `hsl(222 30% 18%)` |
| foreground | `hsl(210 40% 98%)` |
| **primary / accent** | `hsl(192 95% 55%)` (cyan-azure) |
| gradient-primary | `linear-gradient(135deg, cyan → hsl(210 100% 60%))` |
| text-gradient | white → `hsl(192 95% 75%)` |
| glow | radial cyan, `0 0 60px cyan/20%` |
| radius | `0.75rem` (12px) |

**Typography:** `Inter` (body), `Space Grotesk` (display headings), system mono (code).
**UI kit:** shadcn/ui (Radix primitives), `lucide` icons, `sonner` toasts, `tailwindcss-animate`, `zod`.
**Animation:** IntersectionObserver reveal-on-scroll; CSS transitions; animated number counters
(`requestAnimationFrame`); hover lifts/glows; `prefers-reduced-motion` referenced. No Framer Motion
in the production bundle.
**Responsive:** mobile-first single column → multi-column grids at `md`/`lg`; chip rows wrap; nav
collapses to a mobile sheet.

## 5. Interaction inventory

- Sticky glass header + mobile sheet nav; smooth-scroll anchor links.
- Pricing **monthly/annual toggle** (`/pricing`) and **discount badges** (home).
- **Animated counters** for the stat cards; **scroll-reveal** for sections/cards.
- **Bar chart** with hover tooltips for monthly returns.
- **Typed/looping code block** in the EA section.
- FAQ **accordion**.
- Auth tabs (Create account / Sign in) + role selector; form validation (zod).
- Toasts (sonner) for form feedback.

## 6. Compliance flags (important)

The reference makes **hard financial-performance claims** ("72.4% win rate", "verified Myfxbook",
"+98.7% YTD", "profit factor 2.31") and runs a **broker referral promo** (GTC, `ref=238473`).
For a live Pipverge site these are the highest-risk elements: they must be **CMS-controlled**,
**disclaimed**, and never presented as guaranteed. See PLAN §Compliance.

## 7. What "clone and rebrand" means here

Clone the **marketing experience** (structure, rhythm, sections, interactions, responsiveness) with
**original code, original copy, an original logo, and a gold/black palette**. Do **not** copy the
reference's source, images, logo, or its Lovable artifacts. The **admin CMS + database + real auth**
are **net-new** — the reference has none.
