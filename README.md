# Pipverge

A premium trading-intelligence website **and** admin CMS — built to the structure and user
experience of the reference site `tradeiq.tech`, rebranded to **Pipverge** with a gold/black
identity, on an original implementation.

**Status:** planning locked (2026-10-11). Build in progress. See `docs/`.

```
docs/
  AUDIT.md    audit of the reference site (routes, sections, design tokens, interactions)
  PLAN.md     stack, routes, data model, security, build order
  CONCEPT.md  the product frame
  REPORT.md   final deliverable report (on completion)
```

### What this will be

- **Public site** — Home, About, Features, Services, Pricing, FAQ, Contact, Login/Register, legal.
- **Admin CMS** — every meaningful word/price/plan/page/setting is editable from `/admin`,
  with Draft → Preview → Publish.
- **Stack** — Next.js 15 · React 19 · TypeScript · Tailwind · PostgreSQL · Prisma · Zod.
- **Security** — hashed passwords, revocable DB sessions in httpOnly cookies, rate limiting,
  validated uploads, protected admin routes, audit log.

> Trading involves risk. Nothing on this site is financial advice. Past performance does not
> guarantee future results.

---

*Kairos :: frame before code.*
