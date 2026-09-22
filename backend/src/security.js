import rateLimit from "express-rate-limit";
import { ADMIN_TOKEN, IS_TEST } from "./env.js";

// --- admin auth ------------------------------------------------------------

/**
 * Protects the internal read endpoints (contact messages, newsletter
 * subscribers, job applications) — all three leak real visitor PII and were
 * previously unauthenticated. See Phase 0 audit, Finding 1.
 *
 * Fails closed: if ADMIN_TOKEN isn't configured on the environment, the
 * endpoint is disabled (503) rather than silently open. An unset token
 * must never mean "no auth required."
 */
export function requireAdmin(req, res, next) {
  if (!ADMIN_TOKEN) {
    return res.status(503).json({ error: "Admin endpoints are not configured on this environment." });
  }
  const header = req.get("authorization") || "";
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || token !== ADMIN_TOKEN) {
    return res.status(401).json({ error: "Unauthorized." });
  }
  next();
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
// bounded so a leaked/brute-forced token can't be used to hammer the API.
export const adminLimiter = limiterOrNoop({
  windowMs: 15 * 60 * 1000,
  limit: 120,
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
