# Pipverge — Implementation Plan & Architecture

> Derived from `AUDIT.md`. This is the build contract: scope, stack, data model, routes,
> security, and the decisions that need Henry's sign-off.

## 0. The frame (now locked)

**Pipverge** is a trading-intelligence brand: a marketing site + content-managed CMS for a
forex/gold/index **signal service and EA (Expert Advisor) shop**, positioned around *"Intelligent
trading. Smarter decisions. Better execution."* Gold/black premium-fintech identity.

**What we clone:** the reference's public marketing structure, journey, and interactions.
**What we add (net-new, the brief's real emphasis):** PostgreSQL + a complete admin CMS + secure
auth, so the site is edited without touching code.

## 1. Stack (locked)

| Layer | Choice |
|---|---|
| Framework | **Next.js 15** (App Router, RSC) |
| Language | **TypeScript** (strict) |
| UI | **React 19** + **Tailwind CSS** + custom component library (shadcn-style, hand-rolled) |
| Icons | `lucide-react` |
| Animation | CSS transitions + IntersectionObserver (respects `prefers-reduced-motion`); no heavy lib |
| DB | **PostgreSQL 16** (local instance on `:5433`) |
| ORM | **Prisma** + migrations |
| Validation | **Zod** (shared client/server schemas) |
| Auth | Custom secure sessions — `bcrypt` password hashing + DB-backed session tokens in **httpOnly** cookies (HS256 signed). No secrets in client code. |
| Email | Pluggable; password-reset tokens logged/queued in dev (no SMTP required to run) |
| Toasts | `sonner` |
| Media | Local disk store under `public/uploads` (pluggable interface for S3 later) |

> Note: the brief mentions `NEXTAUTH_SECRET`. I will ship a **custom, revocable DB-session auth**
> instead of NextAuth — it gives clean ADMIN vs USER role separation, server-side revocation, and
> no hidden coupling. Env var `AUTH_SECRET` is kept NextAuth-compatible in spirit; documented in README.

## 2. Route map (Pipverge)

### Public
```
/                       Home (all sections DB-driven)
/about                  About
/features               Features
/services               Services / products
/pricing                Pricing (monthly/annual toggle, plans + EAs)
/faq                    FAQ
/contact                Contact (writes contact_messages)
/login                  Sign in
/register               Sign up (role selector: Retail / IB / Referral)
/dashboard              User area (auth-gated)
/risk-disclosure        Legal (DB-backed page)
/privacy                Legal
/terms                  Legal
/cookie-policy          Legal
/[slug]                 CMS-created pages (catch-all, PUBLISHED only)
not-found (404) / error (500)
```

### Admin CMS (auth-gated under `/admin`)
```
/admin/login            Admin sign-in (rate-limited)
/admin                  Dashboard (stats, recent activity, recent messages)
/admin/homepage         Homepage manager (hero, sections, stats, ordering)
/admin/navigation       Navigation manager (add/edit/delete/reorder/enable)
/admin/pages            Pages manager (CRUD, slug, SEO, publish/unpublish)
/admin/services         Services manager
/admin/pricing          Pricing manager
/admin/testimonials     Testimonials manager
/admin/faq              FAQ manager (reorder/enable)
/admin/media            Media library (upload/validate/delete/copy URL)
/admin/messages         Contact inbox (read/unread/archive/delete)
/admin/settings         Site settings (name, logo, favicon, contacts, socials, SEO, analytics)
/admin/audit            Audit log
/admin/account          Profile + password change
```

### API (Route Handlers under `/api`)
- `auth/*` (login, logout, register, me, password reset)
- `admin/*` (all CMS resources — Zod-validated, authz-checked, audited)
- `contact` (public, rate-limited)
- `media/upload`
- `content` (public read of published content, cached/revalidated)

## 3. Data model (Prisma → PostgreSQL)

```
admins            id, email(uniq), passwordHash, name, role(SUPERADMIN|EDITOR), isActive,
                  lastLoginAt, createdAt, updatedAt
admin_sessions    id, adminId→admins, tokenHash(uniq), expiresAt, ip, userAgent, createdAt
password_resets   id, email, tokenHash(uniq), expiresAt, usedAt, createdAt
users             id, email(uniq), passwordHash, fullName, role(RETAIL|IB|REFERRAL),
                  status(ACTIVE|SUSPENDED), createdAt, updatedAt
pages             id, slug(uniq), title, content(Json/markdown), metaTitle, metaDescription,
                  ogImage, status(DRAFT|PUBLISHED), publishedAt, createdAt, updatedAt
navigation_items  id, label, url, location(HEADER|FOOTER), order, isEnabled, isExternal,
                  createdAt, updatedAt
homepage_sections id, key(uniq), type, eyebrow, title, subtitle, content(Json),
                  order, isEnabled, updatedAt
stats             id, label, value, suffix, note, order, isEnabled   (track-record cards)
monthly_returns   id, month(1-12), year, pct, order                  (bar chart)
services          id, slug(uniq), name, description, price, currency, billingPeriod,
                  features(Json), ctaLabel, ctaUrl, isEnabled, order, createdAt, updatedAt
pricing_plans     id, name, price, currency, billingPeriod, features(Json), ctaLabel, ctaUrl,
                  isHighlighted, badge, isActive, order, createdAt, updatedAt
testimonials      id, name, role, company, quote, avatarMediaId→media?, isEnabled, order,
                  createdAt, updatedAt
faqs              id, question, answer, isEnabled, order, createdAt, updatedAt
media             id, filename, originalName, mimeType, size, width, height, url, alt, createdAt
contact_messages  id, name, email, phone, subject, message, status(NEW|READ|ARCHIVED),
                  createdAt
site_settings     key(uniq), value(Json), updatedAt
audit_logs        id, adminId→admins?, action, entity, entityId, before(Json), after(Json),
                  ip, createdAt
```

**Principles:** real relationships + FKs; indexes on hot lookups (`slug`, `status`, `order`,
`email`); `order` columns for reordering; `status`/`isEnabled`/`isActive` gates; JSON columns only
for genuinely list-shaped content (features, hero content), never as a dumping ground.

## 4. Content pipeline — Draft → Preview → Publish

- Editable entities carry `status` (DRAFT|PUBLISHED) + `publishedAt`.
- Admin edits a **draft**; `/admin/preview/...` renders unpublished state to the logged-in admin.
- **Publish** flips status + triggers `revalidatePath` so the public site reflects it immediately.
- **Public reads only ever see PUBLISHED rows.** (Hard rule, enforced in the query layer.)

## 5. Security (production requirements)

- Passwords: `bcrypt` (cost 12). Never stored or logged in plaintext.
- Sessions: 256-bit random token; **hash stored** in DB; delivered as `httpOnly`, `SameSite=Lax`,
  `Secure` (prod) cookie; server-side revocation on logout; expiry + sliding refresh.
- CSRF: `SameSite` cookies + origin checks on mutations; no token in JS-readable storage.
- Validation: Zod on **every** API input (server) + client mirror. 
- AuthZ: middleware protects `/admin/*`; each API handler re-checks role (defense in depth — a
  guard that reads state must be preceded by the guard that sets it).
- Rate limiting: in-memory token bucket on `/admin/login`, `/login`, `/register`, `/api/contact`,
  `/api/media/upload`.
- Uploads: MIME + extension + size + dimension validation; randomized filenames; no execution.
- Headers: CSP, HSTS, X-Content-Type-Options, Referrer-Policy, frame-ancestors via `next.config`.
- Secrets: only in `.env` (gitignored); `.env.example` committed with placeholders.
- Errors: typed API errors; no raw DB/stack ever returned to a client.

## 6. SEO

Per-page metadata (title/description/canonical/OG/Twitter) from DB where the page is CMS-managed;
`app/sitemap.ts` (dynamic, DB-driven) + `app/robots.ts`; JSON-LD `Organization` on the home page;
admin-editable SEO defaults in `site_settings`.

## 7. Compliance (non-negotiable for this vertical)

- All performance figures (win rate, pips, drawdown, monthly returns) are **CMS-controlled sample
  data**, labelled as **illustrative / past performance**, never "guaranteed" or "verified" unless
  a real verified account is linked.
- Persistent **Risk Disclosure** link + footer risk line on every page.
- Broker-referral promo is CMS-driven and clearly marked as a referral offer with a risk note.
- Ship four legal pages: Risk Disclosure, Terms, Privacy, Cookie Policy — with **reviewable**
  baseline copy (clearly marked "review by counsel"), not fake "reviewed" claims.

## 8. Build order (phases)

1. **Scaffold** — Next.js 15 + TS + Tailwind; base design tokens (gold/black); fonts; layout.
2. **Public site** — component library + all sections/pages wired to seed data (then to DB).
3. **DB** — Prisma schema, migration, seed with realistic Pipverge content; provision `pipverge` DB.
4. **Auth** — admin + user auth, sessions, middleware, rate limiting, password reset.
5. **Admin CMS** — all modules, CRUD, reorder, media, messages, settings, audit.
6. **Wire end-to-end** — publish → public reflects (revalidate); preview.
7. **Polish** — SEO, security headers, error/loading/empty states, a11y, responsive at 8 breakpoints.
8. **Verify** — build, typecheck, lint, tests, live smoke; final report (`docs/REPORT.md`).

## 9. Decisions needing Henry (see chat)

1. **Scope of public user accounts** — build real `/login` `/register` `/dashboard` (+IB) mirroring
   the reference, or marketing + admin CMS only?
2. **Performance numbers** — ship the track-record section with clearly-labelled **sample** data
   (recommended), or omit the numbers entirely until real verified data exists?
3. **Broker promo** — include a CMS-driven referral block, or drop it?
4. **Database** — OK to create a dedicated `pipverge` role + DB on the local PG16 (`:5433`)?

## 10. Explicitly out of scope (unless asked)

- Real payment processing (the reference is test-mode only).
- Real TradingView *data* beyond the public embeddable widgets.
- Email delivery (reset tokens are queued/logged; SMTP pluggable later).
- Multi-tenant / multi-site.
