import { prisma } from "./prisma";

export async function getNavigation(location: "HEADER" | "FOOTER") {
  return prisma.navigationItem.findMany({
    where: { location, isEnabled: true },
    orderBy: { order: "asc" },
  });
}

export async function getHomepageSections() {
  return prisma.homepageSection.findMany({
    where: { isEnabled: true },
    orderBy: { order: "asc" },
  });
}

export async function getHomepageSection(key: string) {
  return prisma.homepageSection.findUnique({ where: { key } });
}

export async function getStats() {
  return prisma.stat.findMany({
    where: { isEnabled: true },
    orderBy: { order: "asc" },
  });
}

export async function getMonthlyReturns(year?: number) {
  return prisma.monthlyReturn.findMany({
    where: year ? { year } : undefined,
    orderBy: [{ year: "asc" }, { month: "asc" }],
  });
}

export async function getServices() {
  return prisma.service.findMany({
    where: { isEnabled: true },
    orderBy: { order: "asc" },
  });
}

export async function getPricingPlans() {
  return prisma.pricingPlan.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });
}

export async function getTestimonials() {
  return prisma.testimonial.findMany({
    where: { isEnabled: true },
    orderBy: { order: "asc" },
  });
}

export async function getFaqs() {
  return prisma.faq.findMany({
    where: { isEnabled: true },
    orderBy: { order: "asc" },
  });
}

export async function getPageBySlug(slug: string) {
  return prisma.page.findFirst({
    where: { slug, status: "PUBLISHED" },
  });
}

export async function getPublishedPages() {
  return prisma.page.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { updatedAt: "desc" },
  });
}
