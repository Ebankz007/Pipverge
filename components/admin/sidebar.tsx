"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import {
  BarChart3,
  BookOpen,
  FileText,
  Gauge,
  HelpCircle,
  History,
  Image as ImageIcon,
  LayoutTemplate,
  LogOut,
  Mail,
  Menu,
  Navigation,
  Package,
  Settings,
  Star,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/site/logo";
import { adminLogoutAction } from "@/app/admin/actions/auth";

const LINKS = [
  { href: "/admin", label: "Overview", icon: Gauge },
  { href: "/admin/pages", label: "Pages", icon: FileText },
  { href: "/admin/homepage", label: "Homepage", icon: LayoutTemplate },
  { href: "/admin/navigation", label: "Navigation", icon: Navigation },
  { href: "/admin/services", label: "Services", icon: Package },
  { href: "/admin/pricing", label: "Pricing", icon: BookOpen },
  { href: "/admin/stats", label: "Stats", icon: BarChart3 },
  { href: "/admin/returns", label: "Monthly returns", icon: TrendingUp },
  { href: "/admin/testimonials", label: "Testimonials", icon: Star },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
  { href: "/admin/media", label: "Media", icon: ImageIcon },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/audit", label: "Audit log", icon: History },
];

export function AdminSidebar({ adminName }: { adminName: string }) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [lastPath, setLastPath] = React.useState(pathname);

  // Close the mobile drawer whenever navigation lands on a new route.
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  const nav = (
    <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
      {LINKS.map((link) => {
        const active =
          link.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(link.href);
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-gold/10 text-gold"
                : "text-muted hover:bg-elevated hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="glass sticky top-0 z-30 flex items-center justify-between border-b border-border px-4 py-3 lg:hidden">
        <Link href="/admin">
          <Logo />
        </Link>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          className="rounded-lg p-2 text-foreground"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-20 bg-black/60 lg:hidden" onClick={() => setOpen(false)} />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-border bg-surface transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center border-b border-border px-5">
          <Link href="/admin">
            <Logo />
          </Link>
        </div>
        {nav}
        <div className="border-t border-border p-3">
          <p className="px-3 pb-2 text-xs text-faint">
            Signed in as <span className="text-muted">{adminName}</span>
          </p>
          <form action={adminLogoutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-elevated hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
