import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

// Reference content (sectors, news, jobs, etc.) ships with the code — read-only,
// always available regardless of DATA_DIR.
export const CONTENT_DIR = path.join(ROOT, "data");
export const CONTENT_PATH = path.join(CONTENT_DIR, "content.json");

// User-submitted data (newsletter, contact, applications) needs to survive
// redeploys, so it's written to a separate, writable directory. On Railway,
// DATA_DIR should point at a mounted volume (e.g. /data) — without one,
// Railway's filesystem is ephemeral and this directory resets on every
// deploy. Falls back to the local data/ folder for development.
export const WRITABLE_DIR = process.env.DATA_DIR || CONTENT_DIR;

export const PORT = process.env.PORT || 4000;

// Restricts CORS to the deployed frontend origin in production. Without it
// (local dev), any origin is allowed so the Vite dev server and direct API
// testing both work.
export const FRONTEND_URL = process.env.FRONTEND_URL || null;

// Shared-secret token for the admin-only endpoints (contact messages,
// newsletter subscribers, job applications). There is no user login system
// on this site, so a single bearer token is the intentionally minimal
// starting point — see docs/content-audit.md / Phase 0 audit for the
// reasoning and the follow-up options (real login) if that stops being enough.
// TODO(verify): rotate this token periodically and store it in a secrets
// manager rather than a plain Railway variable once that's set up.
export const ADMIN_TOKEN = process.env.ADMIN_TOKEN || null;

// Optional outbound email notification on new submissions. All four must be
// set for notifications to fire; if any are missing, the feature is silently
// disabled and submissions still succeed — email is a notification, not a
// dependency of the core flow.
export const SMTP_HOST = process.env.SMTP_HOST || null;
export const SMTP_PORT = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
export const SMTP_USER = process.env.SMTP_USER || null;
export const SMTP_PASS = process.env.SMTP_PASS || null;
export const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || null;

export const EMAIL_ENABLED = Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS && NOTIFY_EMAIL);

export const IS_TEST = process.env.NODE_ENV === "test";
