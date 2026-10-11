import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { AdminHeader } from "@/components/admin/admin-header";
import { ActionForm } from "@/components/admin/action-form";
import { Checkbox, Input, Label, Textarea } from "@/components/ui/field";
import { DangerButton } from "@/components/admin/danger-button";
import { deletePlanAction, savePlanAction } from "@/app/admin/actions/catalog";

function featuresText(value: unknown) {
  return Array.isArray(value) ? (value as string[]).join("\n") : "";
}

export default async function AdminPricingPage() {
  await requireAdmin();
  const plans = await prisma.pricingPlan.findMany({ orderBy: { order: "asc" } });

  return (
    <>
      <AdminHeader
        title="Pricing plans"
        description="Plans shown on the Pricing page and homepage. One feature per line."
      />

      <div className="mb-8 rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-4 font-display text-base font-semibold text-foreground">
          Add plan
        </h2>
        <ActionForm action={savePlanAction} submitLabel="Create plan">
          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <Label>Name</Label>
              <Input name="name" required />
            </div>
            <div>
              <Label>Price (USD)</Label>
              <Input name="price" type="number" step="0.01" defaultValue={0} required />
            </div>
            <div>
              <Label>Billing period</Label>
              <Input name="billingPeriod" defaultValue="month" />
            </div>
          </div>
          <div>
            <Label>Features (one per line)</Label>
            <Textarea name="features" rows={4} />
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <Label>CTA label</Label>
              <Input name="ctaLabel" defaultValue="Get started" />
            </div>
            <div>
              <Label>CTA URL</Label>
              <Input name="ctaUrl" defaultValue="/register" />
            </div>
            <div>
              <Label>Badge</Label>
              <Input name="badge" placeholder="Most popular" />
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <Checkbox name="isHighlighted" label="Highlighted" />
            <Checkbox name="isActive" defaultChecked label="Active" />
          </div>
          <input type="hidden" name="order" value={plans.length} />
        </ActionForm>
      </div>

      <div className="space-y-3">
        {plans.map((plan) => (
          <details key={plan.id} className="rounded-2xl border border-border bg-card">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5">
              <div>
                <p className="font-medium text-foreground">{plan.name}</p>
                <p className="mt-0.5 text-xs text-faint">
                  ${plan.price}/{plan.billingPeriod}
                  {plan.isHighlighted ? " · highlighted" : ""}
                </p>
              </div>
              <span className="text-xs text-faint">
                {plan.isActive ? "active" : "inactive"}
              </span>
            </summary>
            <div className="border-t border-border p-5">
              <ActionForm action={savePlanAction} submitLabel="Save plan">
                <input type="hidden" name="id" value={plan.id} />
                <div className="grid gap-5 sm:grid-cols-3">
                  <div>
                    <Label>Name</Label>
                    <Input name="name" defaultValue={plan.name} required />
                  </div>
                  <div>
                    <Label>Price (USD)</Label>
                    <Input name="price" type="number" step="0.01" defaultValue={plan.price} required />
                  </div>
                  <div>
                    <Label>Billing period</Label>
                    <Input name="billingPeriod" defaultValue={plan.billingPeriod} />
                  </div>
                </div>
                <div>
                  <Label>Features (one per line)</Label>
                  <Textarea name="features" rows={5} defaultValue={featuresText(plan.features)} />
                </div>
                <div className="grid gap-5 sm:grid-cols-3">
                  <div>
                    <Label>CTA label</Label>
                    <Input name="ctaLabel" defaultValue={plan.ctaLabel} />
                  </div>
                  <div>
                    <Label>CTA URL</Label>
                    <Input name="ctaUrl" defaultValue={plan.ctaUrl ?? ""} />
                  </div>
                  <div>
                    <Label>Badge</Label>
                    <Input name="badge" defaultValue={plan.badge ?? ""} />
                  </div>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <Label>Order</Label>
                    <Input name="order" type="number" defaultValue={plan.order} />
                  </div>
                  <div className="flex items-end gap-6 pb-2.5">
                    <Checkbox name="isHighlighted" defaultChecked={plan.isHighlighted} label="Highlighted" />
                    <Checkbox name="isActive" defaultChecked={plan.isActive} label="Active" />
                  </div>
                </div>
              </ActionForm>
              <form action={deletePlanAction} className="mt-3">
                <input type="hidden" name="id" value={plan.id} />
                <DangerButton message={`Delete “${plan.name}”?`} />
              </form>
            </div>
          </details>
        ))}
      </div>
    </>
  );
}
