import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Admin login for the portal. Passwords are PBKDF2-SHA256 with a random
// per-admin salt; session tokens are random 192-bit hex with a 7-day TTL.
// The first account is bootstrapped explicitly via `npx convex run
// auth:createAdmin '{"email":"...","password":"..."}'`.

const PBKDF2_ITERATIONS = 100_000;

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function sha256Hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return toHex(new Uint8Array(digest));
}

async function pbkdf2Hex(
  password: string,
  salt: Uint8Array,
  iterations: number,
): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: salt as BufferSource, iterations, hash: "SHA-256" },
    key,
    256,
  );
  return toHex(new Uint8Array(bits));
}

async function hashPassword(password: string): Promise<string> {
  const salt = new Uint8Array(16);
  crypto.getRandomValues(salt);
  const hash = await pbkdf2Hex(password, salt, PBKDF2_ITERATIONS);
  return `pbkdf2$${PBKDF2_ITERATIONS}$${toHex(salt)}$${hash}`;
}

async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  const parts = stored.split("$");
  if (parts.length !== 4 || parts[0] !== "pbkdf2") return false;
  const iterations = Number(parts[1]);
  const salt = new Uint8Array(
    parts[2].match(/.{2}/g)!.map((h) => parseInt(h, 16)),
  );
  return (await pbkdf2Hex(password, salt, iterations)) === parts[3];
}

function randomToken(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return toHex(bytes);
}

export async function requireAdmin(ctx: any, token: string) {
  const session = await ctx.db
    .query("adminSessions")
    .withIndex("by_token", (q: any) => q.eq("token", token))
    .first();
  if (!session || session.expiresAt <= Date.now()) {
    throw new Error("Unauthorized: log in again");
  }
}

// Bootstrap: creates the first admin, or upgrades a legacy SHA-256 row
// (format: 64-hex, no prefix) when the supplied password matches it.
export const createAdmin = mutation({
  args: { email: v.string(), password: v.string() },
  handler: async (ctx, { email, password }) => {
    if (password.length < 8) {
      throw new Error("Password must be at least 8 characters");
    }
    const admins = await ctx.db.query("admins").collect();
    if (admins.length > 0) {
      const legacy = admins.find(
        (a) => !a.passwordHash.startsWith("pbkdf2$"),
      );
      if (
        legacy &&
        legacy.email === email &&
        legacy.passwordHash === (await sha256Hex(password))
      ) {
        await ctx.db.patch(legacy._id, {
          passwordHash: await hashPassword(password),
        });
        return { created: false, upgraded: true };
      }
      return { created: false };
    }
    await ctx.db.insert("admins", {
      email,
      passwordHash: await hashPassword(password),
    });
    return { created: true };
  },
});

export const login = mutation({
  args: { email: v.string(), password: v.string() },
  handler: async (ctx, { email, password }) => {
    const admin = await ctx.db
      .query("admins")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();
    if (!admin || !(await verifyPassword(password, admin.passwordHash))) {
      return { ok: false as const };
    }
    const token = randomToken();
    await ctx.db.insert("adminSessions", {
      token,
      expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
    });
    return { ok: true as const, token };
  },
});

export const changePassword = mutation({
  args: {
    token: v.string(),
    email: v.string(),
    currentPassword: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, { token, email, currentPassword, newPassword }) => {
    await requireAdmin(ctx, token);
    if (newPassword.length < 8) {
      throw new Error("Password must be at least 8 characters");
    }
    const admin = await ctx.db
      .query("admins")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();
    if (!admin || !(await verifyPassword(currentPassword, admin.passwordHash))) {
      throw new Error("Current password is incorrect");
    }
    await ctx.db.patch(admin._id, {
      passwordHash: await hashPassword(newPassword),
    });
    // Force re-login everywhere on password change.
    const sessions = await ctx.db.query("adminSessions").collect();
    for (const s of sessions) await ctx.db.delete(s._id);
    return { ok: true };
  },
});

export const validate = query({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    const session = await ctx.db
      .query("adminSessions")
      .withIndex("by_token", (q) => q.eq("token", token))
      .first();
    return !!session && session.expiresAt > Date.now();
  },
});

export const logout = mutation({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    const session = await ctx.db
      .query("adminSessions")
      .withIndex("by_token", (q) => q.eq("token", token))
      .first();
    if (session) await ctx.db.delete(session._id);
    return { ok: true };
  },
});
