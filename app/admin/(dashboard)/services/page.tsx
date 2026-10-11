import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { AdminHeader } from "@/components/admin/admin-header";
import { ActionForm } from "@/components/admin/action-form";
import { Checkbox, Input, Label, Textarea } from "@/components/ui/field";
import { DangerButton } from "@/components/admin/danger-button";
import {
  deleteServiceAction,
  saveServiceAction,
} from "@/app/admin/actions/catalog";

function featuresText(value: unknown) {
  return Array.isArray(value) ? (value as string[]).join("\n") : "";
}

export default async function AdminServicesPage() {
  await requireAdmin();
  const services = await prisma.service.findMany({ orderBy: { order: "asc" } });

  return (
    <>
      <AdminHeader
        title="Services"
        description="Service cards shown on the Services page and homepage. One feature per line."
      />

      <div className="mb-8 rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-4 font-display text-base font-semibold text-foreground">
          Add service
        </h2>
        <ActionForm action={saveServiceAction} submitLabel="Create service">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label>Name</Label>
              <Input name="name" required />
            </div>
            <div>
              <Label>Slug</Label>
              <Input name="slug" placeholder="signal-feed" required />
            </div>
          </div>
          <div>
            <Label>Description</Label>
            <Textarea name="description" rows={3} required />
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <Label>Price (blank = free)</Label>
              <Input name="price" type="number" step="0.01" />
            </div>
            <div>
              <Label>Billing period</Label>
              <Input name="billingPeriod" placeholder="month" />
            </div>
            <div>
              <Label>Order</Label>
              <Input name="order" type="number" defaultValue={0} />
            </div>
          </div>
          <div>
            <Label>Features (one per line)</Label>
            <Textarea name="features" rows={4} />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label>CTA label</Label>
              <Input name="ctaLabel" placeholder="View plans" />
            </div>
            <div>
              <Label>CTA URL</Label>
              <Input name="ctaUrl" placeholder="/pricing" />
            </div>
          </div>
          <Checkbox name="isEnabled" defaultChecked label="Enabled" />
        </ActionForm>
      </div>

      <div className="space-y-3">
        {services.map((service) => (
          <details key={service.id} className="rounded-2xl border border-border bg-card">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5">
              <div>
                <p className="font-medium text-foreground">{service.name}</p>
                <p className="mt-0.5 text-xs text-faint">
                  <code>{service.slug}</code>
                  {service.price != null ? ` · $${service.price}` : " · free"}
                </p>
              </div>
              <span className="text-xs text-faint">
                {service.isEnabled ? "enabled" : "hidden"}
              </span>
            </summary>
            <div className="border-t border-border p-5">
              <ActionForm action={saveServiceAction} submitLabel="Save service">
                <input type="hidden" name="id" value={service.id} />
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <Label>Name</Label>
                    <Input name="name" defaultValue={service.name} required />
                  </div>
                  <div>
                    <Label>Slug</Label>
                    <Input name="slug" defaultValue={service.slug} required />
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea name="description" rows={3} defaultValue={service.description} required />
                </div>
                <div className="grid gap-5 sm:grid-cols-3">
                  <div>
                    <Label>Price</Label>
                    <Input
                      name="price"
                      type="number"
                      step="0.01"
                      defaultValue={service.price ?? ""}
                    />
                  </div>
                  <div>
                    <Label>Billing period</Label>
                    <Input name="billingPeriod" defaultValue={service.billingPeriod ?? ""} />
                  </div>
                  <div>
                    <Label>Order</Label>
                    <Input name="order" type="number" defaultValue={service.order} />
                  </div>
                </div>
                <div>
                  <Label>Features (one per line)</Label>
                  <Textarea name="features" rows={4} defaultValue={featuresText(service.features)} />
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <Label>CTA label</Label>
                    <Input name="ctaLabel" defaultValue={service.ctaLabel ?? ""} />
                  </div>
                  <div>
                    <Label>CTA URL</Label>
                    <Input name="ctaUrl" defaultValue={service.ctaUrl ?? ""} />
                  </div>
                </div>
                <Checkbox name="isEnabled" defaultChecked={service.isEnabled} label="Enabled" />
              </ActionForm>
              <form action={deleteServiceAction} className="mt-3">
                <input type="hidden" name="id" value={service.id} />
                <DangerButton message={`Delete “${service.name}”?`} />
              </form>
            </div>
          </details>
        ))}
      </div>
    </>
  );
}
