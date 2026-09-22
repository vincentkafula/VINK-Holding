import rateLimit from "express-rate-limit";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ADMIN_USERNAME, ADMIN_PASSWORD_HASH, JWT_SECRET, JWT_EXPIRY, ADMIN_AUTH_CONFIGURED, IS_TEST } from "./env.js";

// --- admin auth --------------------------------------------------------------
// Username/password login issuing a short-lived signed JWT, replacing the
// earlier single-shared-bearer-token scheme. Protects the internal read
// endpoints (contact messages, newsletter subscribers, job applications) —
// all three leak real visitor PII and were originally unauthenticated
// entirely. See Phase 0 audit, Finding 1, and docs/architecture.md for why
// this is a login system now rather than a static token.

/**
 * Verifies credentials and returns a signed session token, or null if the
 * credentials are wrong. Fails closed if ADMIN_PASSWORD_HASH/JWT_SECRET
 * aren't configured — caller is responsible for checking ADMIN_AUTH_CONFIGURED
 * first and returning 503 in that case.
 */
export async function attemptLogin(username, password) {
  if (username !== ADMIN_USERNAME) return null;
  const valid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
  if (!valid) return null;
  const token = jwt.sign({ sub: username }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
  const decoded = jwt.decode(token);
  return { token, expiresAt: new Date(decoded.exp * 1000).toISOString() };
}

/**
 * Fails closed: if admin auth isn't configured on the environment, every
 * protected endpoint is disabled (503) rather than silently open. An unset
 * config must never mean "no auth required."
 */
export function requireAdmin(req, res, next) {
  if (!ADMIN_AUTH_CONFIGURED) {
    return res.status(503).json({ error: "Admin endpoints are not configured on this environment." });
  }
  const header = req.get("authorization") || "";
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "Unauthorized." });
  }
  try {
    req.admin = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    const message = err.name === "TokenExpiredError" ? "Session expired. Please log in again." : "Unauthorized.";
    return res.status(401).json({ error: message });
  }
}

// --- rate limiting -----------------------------------------------------------

// Disabled during tests so the test suite isn't rate-limited by its own
// repeated requests; express-rate-limit's memory store is per-process anyway
// so this never affects production behavior.
const noopLimiter = (req, res, next) => next();

function limiterOrNoop(options) {
  if (IS_TEST) return noopLimiter;
  return rateLimit({
    windowMs: options.windowMs,
    limit: options.limit,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: options.message || "Too many requests. Please try again shortly." },
  });
}

// Public submission endpoints: generous enough for a real visitor to retry
// after a typo, tight enough to blunt basic spam/scripted abuse.
export const submissionLimiter = limiterOrNoop({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  message: "Too many submissions from this connection. Please try again in a few minutes.",
});

// Admin read endpoints: much higher ceiling (legitimate polling), but still
// bounded so a stolen/expired-but-replayed token can't be used to hammer the API.
export const adminLimiter = limiterOrNoop({
  windowMs: 15 * 60 * 1000,
  limit: 120,
});

// Login attempts: tight. This is the one endpoint an attacker would actually
// want to brute-force (guess the password), unlike the read endpoints above
// which need a valid token already.
export const loginLimiter = limiterOrNoop({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: "Too many login attempts. Please try again in 15 minutes.",
});

// --- validation --------------------------------------------------------------

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const LIMITS = {
  name: 200,
  email: 254, // RFC 5321 max
  phone: 40,
  subject: 200,
  message: 5000,
  jobTitle: 200,
  coverNote: 5000,
};

/**
 * Trims a string and rejects it (returns { ok: false }) if it's empty or
 * exceeds the given max length, instead of silently truncating — truncating
 * user input server-side hides data loss from the person submitting it.
 */
export function cleanString(value, maxLength) {
  if (typeof value !== "string") return { ok: false };
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > maxLength) return { ok: false };
  return { ok: true, value: trimmed };
}

/**
 * Same as cleanString, but distinguishes "not provided" (valid — field is
 * optional) from "provided but invalid" (e.g. too long), so callers can
 * still reject a genuinely bad value instead of silently dropping it.
 */
export function cleanOptionalString(value, maxLength) {
  if (value === undefined || value === null || value === "") {
    return { ok: true, value: null };
  }
  return cleanString(value, maxLength);
}
