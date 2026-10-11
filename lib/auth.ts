import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import type { Admin, User } from "@/lib/generated/prisma/client";
import { prisma } from "./prisma";
import { generateToken, hashToken } from "./tokens";

export const ADMIN_COOKIE = "pv_admin";
export const USER_COOKIE = "pv_user";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

const isProd = process.env.NODE_ENV === "production";

function secretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET is not set. Add it to your environment.");
  }
  return new TextEncoder().encode(secret);
}

const cookieBase = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: isProd,
  path: "/",
};

/* --------------------------------------------------------------- admin --- */

export async function createAdminSession(
  adminId: string,
  meta: { ip?: string | null; userAgent?: string | null } = {},
): Promise<string> {
  const token = generateToken(32);
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await prisma.adminSession.create({
    data: {
      adminId,
      tokenHash: hashToken(token),
      expiresAt,
      ip: meta.ip ?? null,
      userAgent: meta.userAgent ?? null,
    },
  });

  const jar = await cookies();
  jar.set(ADMIN_COOKIE, token, { ...cookieBase, expires: expiresAt });
  return token;
}

export async function getCurrentAdmin(): Promise<Admin | null> {
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE)?.value;
  if (!token) return null;

  const session = await prisma.adminSession.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { admin: true },
  });

  if (!session || session.expiresAt < new Date() || !session.admin.isActive) {
    return null;
  }
  return session.admin;
}

export async function requireAdmin(): Promise<Admin> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}

export async function requireSuperAdmin(): Promise<Admin> {
  const admin = await requireAdmin();
  if (admin.role !== "SUPERADMIN") redirect("/admin?error=forbidden");
  return admin;
}

export async function destroyAdminSession(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE)?.value;
  if (token) {
    await prisma.adminSession.deleteMany({
      where: { tokenHash: hashToken(token) },
    });
  }
  jar.delete(ADMIN_COOKIE);
}

/* ---------------------------------------------------------------- users -- */

export async function createUserSession(user: {
  id: string;
  email: string;
  role: User["role"];
}): Promise<void> {
  const token = await new SignJWT({ email: user.email, role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey());

  const jar = await cookies();
  jar.set(USER_COOKIE, token, {
    ...cookieBase,
    expires: new Date(Date.now() + SESSION_TTL_MS),
  });
}

export async function getCurrentUser(): Promise<User | null> {
  const jar = await cookies();
  const token = jar.get(USER_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secretKey());
    const id = payload.sub;
    if (!id) return null;
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user || user.status !== "ACTIVE") return null;
    return user;
  } catch {
    return null;
  }
}

export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function destroyUserSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(USER_COOKIE);
}
