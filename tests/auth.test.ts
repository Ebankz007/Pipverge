import { describe, it, expect, vi, beforeEach } from "vitest";
import { SignJWT } from "jose";

process.env.AUTH_SECRET = "test-secret-key-for-unit-tests-only";

const cookieStore = vi.hoisted(() => new Map<string, string>());

vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: (name: string) =>
      cookieStore.has(name) ? { name, value: cookieStore.get(name) } : undefined,
    set: (name: string, value: string) => {
      cookieStore.set(name, value);
    },
    delete: (name: string) => {
      cookieStore.delete(name);
    },
  }),
}));

vi.mock("next/navigation", () => ({
  redirect: (url: string) => {
    throw new Error(`REDIRECT:${url}`);
  },
}));

const prismaMock = vi.hoisted(() => ({
  adminSession: {
    findUnique: vi.fn(),
    create: vi.fn(),
    deleteMany: vi.fn(),
  },
  user: {
    findUnique: vi.fn(),
  },
}));

vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }));

import {
  getCurrentUser,
  requireUser,
  createUserSession,
  getCurrentAdmin,
  requireAdmin,
  USER_COOKIE,
  ADMIN_COOKIE,
} from "@/lib/auth";

const secret = () => new TextEncoder().encode(process.env.AUTH_SECRET);

async function makeUserToken(id: string, email = "u@example.com", role = "RETAIL") {
  return new SignJWT({ email, role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(id)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());
}

beforeEach(() => {
  cookieStore.clear();
  vi.clearAllMocks();
});

describe("getCurrentUser", () => {
  it("returns null when there is no cookie", async () => {
    expect(await getCurrentUser()).toBeNull();
  });

  it("returns null for an invalid token", async () => {
    cookieStore.set(USER_COOKIE, "not-a-jwt");
    expect(await getCurrentUser()).toBeNull();
  });

  it("returns the user for a valid token with an ACTIVE status", async () => {
    const token = await makeUserToken("user_1");
    cookieStore.set(USER_COOKIE, token);
    prismaMock.user.findUnique.mockResolvedValue({ id: "user_1", status: "ACTIVE" });

    const user = await getCurrentUser();
    expect(user?.id).toBe("user_1");
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({ where: { id: "user_1" } });
  });

  it("returns null when the user is not ACTIVE", async () => {
    cookieStore.set(USER_COOKIE, await makeUserToken("user_2"));
    prismaMock.user.findUnique.mockResolvedValue({ id: "user_2", status: "SUSPENDED" });
    expect(await getCurrentUser()).toBeNull();
  });

  it("returns null when the user no longer exists", async () => {
    cookieStore.set(USER_COOKIE, await makeUserToken("user_3"));
    prismaMock.user.findUnique.mockResolvedValue(null);
    expect(await getCurrentUser()).toBeNull();
  });
});

describe("createUserSession", () => {
  it("sets the user cookie", async () => {
    await createUserSession({ id: "user_9", email: "x@y.com", role: "RETAIL" });
    expect(cookieStore.has(USER_COOKIE)).toBe(true);
    expect(cookieStore.get(USER_COOKIE)).toMatch(/^[\w-]+\.[\w-]+\.[\w-]+$/);
  });
});

describe("requireUser", () => {
  it("redirects to /login when there is no session", async () => {
    await expect(requireUser()).rejects.toThrow("REDIRECT:/login");
  });

  it("returns the user when authenticated", async () => {
    cookieStore.set(USER_COOKIE, await makeUserToken("user_4"));
    prismaMock.user.findUnique.mockResolvedValue({ id: "user_4", status: "ACTIVE" });
    const user = await requireUser();
    expect(user.id).toBe("user_4");
  });
});

describe("getCurrentAdmin", () => {
  it("returns null when there is no cookie", async () => {
    expect(await getCurrentAdmin()).toBeNull();
  });

  it("returns the admin for a valid, unexpired session", async () => {
    cookieStore.set(ADMIN_COOKIE, "raw-token");
    prismaMock.adminSession.findUnique.mockResolvedValue({
      expiresAt: new Date(Date.now() + 60_000),
      admin: { id: "admin_1", isActive: true },
    });
    const admin = await getCurrentAdmin();
    expect(admin?.id).toBe("admin_1");
  });

  it("returns null when the session has expired", async () => {
    cookieStore.set(ADMIN_COOKIE, "raw-token");
    prismaMock.adminSession.findUnique.mockResolvedValue({
      expiresAt: new Date(Date.now() - 60_000),
      admin: { id: "admin_1", isActive: true },
    });
    expect(await getCurrentAdmin()).toBeNull();
  });

  it("returns null when the admin is inactive", async () => {
    cookieStore.set(ADMIN_COOKIE, "raw-token");
    prismaMock.adminSession.findUnique.mockResolvedValue({
      expiresAt: new Date(Date.now() + 60_000),
      admin: { id: "admin_1", isActive: false },
    });
    expect(await getCurrentAdmin()).toBeNull();
  });
});

describe("requireAdmin", () => {
  it("redirects to /admin/login when there is no session", async () => {
    await expect(requireAdmin()).rejects.toThrow("REDIRECT:/admin/login");
  });
});
