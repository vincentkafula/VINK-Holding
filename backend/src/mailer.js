import nodemailer from "nodemailer";
import { EMAIL_ENABLED, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, NOTIFY_EMAIL } from "./env.js";

// TODO(verify): this uses a generic SMTP transport so it works with any
// provider (Resend, SendGrid, Postmark, plain SMTP, etc.) via standard SMTP
// credentials. No provider is assumed or hardcoded — confirm your provider's
// SMTP host/port/auth details before setting the env vars in production.
let transporter = null;
if (EMAIL_ENABLED) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

/**
 * Fire-and-forget notification email. Never throws — a notification failure
 * must never fail the user-facing request (the submission is already saved
 * by the time this runs). If email isn't configured, this is a no-op.
 */
export async function notify(subject, text) {
  if (!EMAIL_ENABLED || !transporter) return;
  try {
    await transporter.sendMail({
      from: `"VINK Group Site" <${SMTP_USER}>`,
      to: NOTIFY_EMAIL,
      subject,
      text,
    });
  } catch (err) {
    // Logged, not thrown — see function doc above.
    console.error("[mailer] notification failed:", err.message);
  }
}
