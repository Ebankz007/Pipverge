"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import { revalidatePublic } from "@/lib/revalidate";
import {
  pricingPlanSchema,
  serviceSchema,
  statSchema,
} from "@/lib/validators";
import { lines, str, type ActionState } from "@/lib/form";

async function guard() {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("Unauthorized");
  return admin;
}

/* ------------------------------------------------------------------ stats */

export async function saveStatAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const admin = await guard();
  const id = str(formData.get("id"));
  const parsed = statSchema.safeParse({
    label: formData.get("label"),
    value: formData.get("value"),
    suffix: formData.get("suffix") ?? "",
    note: formData.get("note") ?? "",
    order: formData.get("order") ?? 0,
    isEnabled: formData.get("isEnabled") === "on",
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const data = {
    ...parsed.data,
    suffix: parsed.data.suffix || null,
    note: parsed.data.note || null,
  };

  if (id) {
    await prisma.stat.update({ where: { id }, data });
  } else {
    await prisma.stat.create({ data });
  }

  await recordAudit({
    adminId: admin.id,
    action: id ? "UPDATE" : "CREATE",
    entity: "Stat",
    entityId: id || null,
    after: data,
  });
  revalidatePublic();
  revalidatePath("/admin/stats");
  return { ok: true, message: "Stat saved." };
}

export async function deleteStatAction(formData: FormData): Promise<void> {
  const admin = await guard();
  const id = str(formData.get("id"));
  await prisma.stat.delete({ where: { id } }).catch(() => {});
  await recordAudit({ adminId: admin.id, action: "DELETE", entity: "Stat", entityId: id });
  revalidatePublic();
  revalidatePath("/admin/stats");
}

/* -------------------------------------------------------- monthly returns */

export async function saveReturnAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const admin = await guard();
  const id = str(formData.get("id"));
  const year = Number(formData.get("year"));
  const month = Number(formData.get("month"));
  const pct = Number(formData.get("pct"));

  if (!Number.isInteger(year) || year < 2000 || year > 2100) {
    return { ok: false, error: "Enter a valid year." };
  }
  if (!Number.isInteger(month) || month < 1 || month > 12) {
    return { ok: false, error: "Month must be between 1 and 12." };
  }
  if (!Number.isFinite(pct)) {
    return { ok: false, error: "Enter a valid percentage." };
  }

  const data = { year, month, pct, order: month };
  if (id) {
    await prisma.monthlyReturn.update({ where: { id }, data });
  } else {
    await prisma.monthlyReturn.create({ data });
  }

  await recordAudit({
    adminId: admin.id,
    action: id ? "UPDATE" : "CREATE",
    entity: "MonthlyReturn",
    entityId: id || null,
    after: data,
  });
  revalidatePublic();
  revalidatePath("/admin/returns");
  return { ok: true, message: "Return saved." };
}

export async function deleteReturnAction(formData: FormData): Promise<void> {
  const admin = await guard();
  const id = str(formData.get("id"));
  await prisma.monthlyReturn.delete({ where: { id } }).catch(() => {});
  await recordAudit({
    adminId: admin.id,
    action: "DELETE",
    entity: "MonthlyReturn",
    entityId: id,
  });
  revalidatePublic();
  revalidatePath("/admin/returns");
}

/* --------------------------------------------------------------- services */

export async function saveServiceAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const admin = await guard();
  const id = str(formData.get("id"));
  const priceRaw = str(formData.get("price"));

  const parsed = serviceSchema.safeParse({
    slug: formData.get("slug"),
    name: formData.get("name"),
    description: formData.get("description"),
    price: priceRaw ? Number(priceRaw) : null,
    currency: formData.get("currency") ?? "USD",
    billingPeriod: formData.get("billingPeriod") ?? "",
    features: lines(formData.get("features")),
    ctaLabel: formData.get("ctaLabel") ?? "",
    ctaUrl: formData.get("ctaUrl") ?? "",
    isEnabled: formData.get("isEnabled") === "on",
    order: formData.get("order") ?? 0,
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const data = {
    slug: parsed.data.slug,
    name: parsed.data.name,
    description: parsed.data.description,
    price: parsed.data.price ?? null,
    currency: parsed.data.currency,
    billingPeriod: parsed.data.billingPeriod || null,
    features: parsed.data.features as object,
    ctaLabel: parsed.data.ctaLabel || null,
    ctaUrl: parsed.data.ctaUrl || null,
    isEnabled: parsed.data.isEnabled,
    order: parsed.data.order,
  };

  if (id) {
    await prisma.service.update({ where: { id }, data });
  } else {
    await prisma.service.create({ data });
  }

  await recordAudit({
    adminId: admin.id,
    action: id ? "UPDATE" : "CREATE",
    entity: "Service",
    entityId: id || null,
    after: { slug: data.slug, name: data.name },
  });
  revalidatePublic();
  revalidatePath("/admin/services");
  return { ok: true, message: "Service saved." };
}

export async function deleteServiceAction(formData: FormData): Promise<void> {
  const admin = await guard();
  const id = str(formData.get("id"));
  await prisma.service.delete({ where: { id } }).catch(() => {});
  await recordAudit({
    adminId: admin.id,
    action: "DELETE",
    entity: "Service",
    entityId: id,
  });
  revalidatePublic();
  revalidatePath("/admin/services");
}

/* ---------------------------------------------------------------- pricing */

export async function savePlanAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const admin = await guard();
  const id = str(formData.get("id"));
  const parsed = pricingPlanSchema.safeParse({
    name: formData.get("name"),
    price: formData.get("price") ?? 0,
    currency: formData.get("currency") ?? "USD",
    billingPeriod: formData.get("billingPeriod") ?? "month",
    features: lines(formData.get("features")),
    ctaLabel: formData.get("ctaLabel") ?? "Get started",
    ctaUrl: formData.get("ctaUrl") ?? "/register",
    badge: formData.get("badge") ?? "",
    isHighlighted: formData.get("isHighlighted") === "on",
    isActive: formData.get("isActive") === "on",
    order: formData.get("order") ?? 0,
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const data = {
    name: parsed.data.name,
    price: parsed.data.price,
    currency: parsed.data.currency,
    billingPeriod: parsed.data.billingPeriod,
    features: parsed.data.features as object,
    ctaLabel: parsed.data.ctaLabel,
    ctaUrl: parsed.data.ctaUrl,
    badge: parsed.data.badge || null,
    isHighlighted: parsed.data.isHighlighted,
    isActive: parsed.data.isActive,
    order: parsed.data.order,
  };

  if (id) {
    await prisma.pricingPlan.update({ where: { id }, data });
  } else {
    await prisma.pricingPlan.create({ data });
  }

  await recordAudit({
    adminId: admin.id,
    action: id ? "UPDATE" : "CREATE",
    entity: "PricingPlan",
    entityId: id || null,
    after: { name: data.name, price: data.price },
  });
  revalidatePublic();
  revalidatePath("/admin/pricing");
  return { ok: true, message: "Plan saved." };
}

export async function deletePlanAction(formData: FormData): Promise<void> {
  const admin = await guard();
  const id = str(formData.get("id"));
  await prisma.pricingPlan.delete({ where: { id } }).catch(() => {});
  await recordAudit({
    adminId: admin.id,
    action: "DELETE",
    entity: "PricingPlan",
    entityId: id,
  });
  revalidatePublic();
  revalidatePath("/admin/pricing");
}
