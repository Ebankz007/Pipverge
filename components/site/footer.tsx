import Link from "next/link";
import { Logo } from "./logo";
import type { SiteSettings } from "@/lib/settings";

type NavItem = { id: string; label: string; url: string; isExternal: boolean };

export function Footer({
  settings,
  items,
}: {
  settings: SiteSettings;
  items: NavItem[];
}) {
  const socials = Object.entries(settings.socials ?? {}).filter(
    ([, url]) => url,
  ) as [string, string][];

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo siteName={settings.siteName} />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
              {settings.footerText}
            </p>
            <div className="mt-5 space-y-1 text-sm text-muted">
              {settings.contactEmail && (
                <p>
                  <a
                    href={`mailto:${settings.contactEmail}`}
                    className="transition-colors hover:text-gold"
                  >
                    {settings.contactEmail}
                  </a>
                </p>
              )}
              {settings.contactPhone && <p>{settings.contactPhone}</p>}
            </div>
            {socials.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-3">
                {socials.map(([name, url]) => (
                  <a
                    key={name}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-border px-3 py-1.5 text-xs capitalize text-muted transition-colors hover:border-gold/40 hover:text-gold"
                  >
                    {name}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Explore</h3>
            <ul className="mt-4 space-y-2.5">
              {items.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.url}
                    className="text-sm text-muted transition-colors hover:text-gold"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Account</h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link href="/login" className="text-sm text-muted transition-colors hover:text-gold">
                  Sign in
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-sm text-muted transition-colors hover:text-gold">
                  Create account
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-sm text-muted transition-colors hover:text-gold">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted transition-colors hover:text-gold">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 rounded-2xl border border-border bg-card/60 p-4">
          <p className="text-xs leading-relaxed text-faint">
            <span className="font-semibold text-muted">Risk notice: </span>
            {settings.riskNotice}
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-xs text-faint sm:flex-row">
          <p>{settings.copyright}</p>
          <p>{settings.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
