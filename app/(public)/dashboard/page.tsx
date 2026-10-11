import type { Metadata } from "next";
import { Activity, BarChart3, ShieldCheck, Sparkles } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogoutButton } from "@/components/auth/logout-button";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your Pipverge dashboard.",
};

const ROLE_LABEL: Record<string, string> = {
  RETAIL: "Retail trader",
  IB: "Introducing broker",
  REFERRAL: "Referrer",
};

export default async function DashboardPage() {
  const user = await requireUser();

  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 sm:pt-32 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
            Welcome, {user.fullName.split(" ")[0]}
          </h1>
          <p className="mt-1.5 flex items-center gap-2 text-sm text-muted">
            <Badge tone="gold">{ROLE_LABEL[user.role] ?? user.role}</Badge>
            <span>{user.email}</span>
          </p>
        </div>
        <LogoutButton />
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-gold" />
              Today&apos;s setups
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted">
              Your structured setups will appear here. Each includes entry,
              stop, target, and a short rationale.
            </p>
            <p className="mt-4 text-xs text-faint">
              Live feed connection is pending — this is a preview state.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-gold" />
              Your performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted">
              Track results, win rate, and drawdown once you connect a trading
              account or log your fills.
            </p>
            <p className="mt-4 text-xs text-faint">No data yet.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-gold" />
              Plan & access
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted">
              You&apos;re on the free tier. Upgrade to unlock real-time premium
              setups and analyst commentary.
            </p>
            <p className="mt-4 flex items-center gap-2 text-xs text-faint">
              <Activity className="h-3.5 w-3.5" />
              Free trial of the daily feed active
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-10 rounded-2xl border border-warning/25 bg-warning/5 p-5">
        <p className="text-xs leading-relaxed text-muted">
          <span className="font-semibold text-warning">Risk notice: </span>
          Trading involves substantial risk of loss. Nothing on this platform is
          financial advice. Never trade with capital you cannot afford to lose.
        </p>
      </div>
    </section>
  );
}
