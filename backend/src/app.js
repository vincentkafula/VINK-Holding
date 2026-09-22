import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import PDFDocument from "pdfkit";

import { FRONTEND_URL, IS_TEST } from "./env.js";
import { ensureStore, readJSON, appendEntry, loadContent, SUBSCRIBERS_PATH, MESSAGES_PATH, APPLICATIONS_PATH } from "./store.js";
import {
  requireAdmin,
  submissionLimiter,
  adminLimiter,
  loginLimiter,
  attemptLogin,
  emailRegex,
  LIMITS,
  cleanString,
  cleanOptionalString,
} from "./security.js";
import { ADMIN_AUTH_CONFIGURED } from "./env.js";
import { notify } from "./mailer.js";

ensureStore();

export const app = express();

app.use(helmet());
app.use(cors({ origin: FRONTEND_URL || true }));
app.use(express.json({ limit: "100kb" })); // generous for form payloads, tight against abuse
if (!IS_TEST) {
  app.use(morgan("combined"));
}

// --- content routes (read-only, public) -------------------------------------

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "vink-holdings-api", time: new Date().toISOString() });
});

app.get("/api/company", async (req, res) => {
  try {
    const content = await loadContent();
    res.json(content.company);
  } catch (err) {
    res.status(500).json({ error: "Unable to load company profile." });
  }
});

app.get("/api/sectors", async (req, res) => {
  try {
    const content = await loadContent();
    res.json(content.sectors);
  } catch (err) {
    res.status(500).json({ error: "Unable to load business sectors." });
  }
});

app.get("/api/sectors/:id", async (req, res) => {
  try {
    const content = await loadContent();
    const sector = content.sectors.find((s) => s.id === req.params.id);
    if (!sector) return res.status(404).json({ error: "Sector not found." });
    res.json(sector);
  } catch (err) {
    res.status(500).json({ error: "Unable to load sector." });
  }
});

app.get("/api/markets", async (req, res) => {
  try {
    const content = await loadContent();
    res.json(content.markets);
  } catch (err) {
    res.status(500).json({ error: "Unable to load markets." });
  }
});

app.get("/api/ads", async (req, res) => {
  try {
    const content = await loadContent();
    res.json(content.ads);
  } catch (err) {
    res.status(500).json({ error: "Unable to load promotions." });
  }
});

app.get("/api/leadership", async (req, res) => {
  try {
    const content = await loadContent();
    res.json({ leadership: content.leadership, governance: content.governance });
  } catch (err) {
    res.status(500).json({ error: "Unable to load leadership." });
  }
});

app.get("/api/sustainability", async (req, res) => {
  try {
    const content = await loadContent();
    res.json(content.sustainability);
  } catch (err) {
    res.status(500).json({ error: "Unable to load sustainability content." });
  }
});

app.get("/api/jobs", async (req, res) => {
  try {
    const content = await loadContent();
    res.json(content.jobs);
  } catch (err) {
    res.status(500).json({ error: "Unable to load open roles." });
  }
});

app.get("/api/jobs/:id", async (req, res) => {
  try {
    const content = await loadContent();
    const job = content.jobs.find((j) => String(j.id) === req.params.id);
    if (!job) return res.status(404).json({ error: "Role not found." });
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: "Unable to load role." });
  }
});

app.get("/api/investor-reports", async (req, res) => {
  try {
    const content = await loadContent();
    const sorted = [...content.investorReports].sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json(sorted);
  } catch (err) {
    res.status(500).json({ error: "Unable to load investor reports." });
  }
});

app.get("/api/investor-reports/:id/download", async (req, res) => {
  try {
    const content = await loadContent();
    const report = content.investorReports.find((r) => String(r.id) === req.params.id);
    if (!report) return res.status(404).json({ error: "Report not found." });

    const filename = `${report.title.replace(/[^a-z0-9]+/gi, "-")}.pdf`;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    const doc = new PDFDocument({ size: "A4", margin: 56 });
    doc.pipe(res);

    const gold = "#b8863f";
    const dark = "#1a1a1a";

    doc.fillColor(gold).fontSize(10).font("Helvetica-Bold").text("VINK GROUP", { characterSpacing: 2 });
    doc.moveDown(1.2);
    doc.fillColor(dark).fontSize(22).font("Helvetica-Bold").text(report.title);
    doc.moveDown(0.3);
    doc.fillColor("#666").fontSize(11).font("Helvetica").text(
      `${report.type} · Published ${new Date(report.date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })}`
    );
    doc.moveDown(1.5);
    doc.strokeColor(gold).lineWidth(1).moveTo(56, doc.y).lineTo(539, doc.y).stroke();
    doc.moveDown(1.5);

    doc.fillColor(dark).fontSize(11).font("Helvetica").text(
      `${content.company.description}\n\n` +
        `This document is a placeholder export generated on request from the Investors section of ` +
        `vinkholdings.com. It stands in for the group's real ${report.type.toLowerCase()} until final financial ` +
        `statements are published and this endpoint is wired to the group's actual disclosure documents.\n\n` +
        `For the group's current financial performance, headline stats, and sector-level detail, see the ` +
        `Investors and Our Businesses sections of the site.`,
      { align: "left", lineGap: 4 }
    );

    doc.moveDown(2);
    doc.fillColor("#999").fontSize(9).text(
      `Generated ${new Date().toLocaleString("en-US")} · VINK Group Pty Ltd, Stand No. 1234, Independence Ave, Lusaka, Zambia`
    );

    doc.end();
  } catch (err) {
    res.status(500).json({ error: "Unable to generate report." });
  }
});

app.get("/api/stats", async (req, res) => {
  try {
    const content = await loadContent();
    res.json(content.stats);
  } catch (err) {
    res.status(500).json({ error: "Unable to load stats." });
  }
});

app.get("/api/news", async (req, res) => {
  try {
    const content = await loadContent();
    const sorted = [...content.news].sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json(sorted);
  } catch (err) {
    res.status(500).json({ error: "Unable to load news." });
  }
});

app.get("/api/news/:id", async (req, res) => {
  try {
    const content = await loadContent();
    const item = content.news.find((n) => String(n.id) === req.params.id);
    if (!item) return res.status(404).json({ error: "Article not found." });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: "Unable to load article." });
  }
});

// --- newsletter subscription (public, rate-limited) --------------------------

app.post("/api/newsletter", submissionLimiter, async (req, res) => {
  try {
    const emailField = cleanString(req.body?.email, LIMITS.email);
    if (!emailField.ok || !emailRegex.test(emailField.value)) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }
    const normalized = emailField.value.toLowerCase();

    const subscribers = await readJSON(SUBSCRIBERS_PATH);
    if (subscribers.some((s) => s.email === normalized)) {
      return res.status(200).json({ message: "You're already subscribed. Thanks for staying connected!" });
    }

    await appendEntry(SUBSCRIBERS_PATH, () => ({
      email: normalized,
      subscribedAt: new Date().toISOString(),
    }));

    notify("New newsletter subscriber", `${normalized} just subscribed to VINK Group updates.`);

    res.status(201).json({ message: "Thanks for subscribing to VINK Group updates." });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

// --- contact form (public, rate-limited) --------------------------------------

app.post("/api/contact", submissionLimiter, async (req, res) => {
  try {
    const name = cleanString(req.body?.name, LIMITS.name);
    const email = cleanString(req.body?.email, LIMITS.email);
    const message = cleanString(req.body?.message, LIMITS.message);
    const phone = cleanOptionalString(req.body?.phone, LIMITS.phone);
    const subject = cleanOptionalString(req.body?.subject, LIMITS.subject);

    if (!name.ok) return res.status(400).json({ error: "Please enter your name." });
    if (!email.ok || !emailRegex.test(email.value)) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }
    if (!message.ok) return res.status(400).json({ error: "Please enter a message (up to 5,000 characters)." });
    if (!phone.ok) return res.status(400).json({ error: "Phone number is too long." });
    if (!subject.ok) return res.status(400).json({ error: "Subject is too long." });

    const entry = await appendEntry(MESSAGES_PATH, (id) => ({
      id,
      name: name.value,
      email: email.value.toLowerCase(),
      phone: phone.value,
      subject: subject.value || "General Enquiry",
      message: message.value,
      submittedAt: new Date().toISOString(),
    }));

    notify(
      `New contact enquiry: ${entry.subject}`,
      `From: ${entry.name} <${entry.email}>\nPhone: ${entry.phone || "—"}\n\n${entry.message}`
    );

    res.status(201).json({
      message: "Thank you for contacting VINK Group. Our team will respond within 2 business days.",
      reference: `VH-${entry.id.toString().padStart(5, "0")}`,
    });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

// --- job applications (public, rate-limited) ----------------------------------

app.post("/api/careers/apply", submissionLimiter, async (req, res) => {
  try {
    const name = cleanString(req.body?.name, LIMITS.name);
    const email = cleanString(req.body?.email, LIMITS.email);
    const jobTitle = cleanString(req.body?.jobTitle, LIMITS.jobTitle);
    const phone = cleanOptionalString(req.body?.phone, LIMITS.phone);
    const coverNote = cleanOptionalString(req.body?.coverNote, LIMITS.coverNote);
    const jobId = req.body?.jobId ?? null;

    if (!name.ok) return res.status(400).json({ error: "Please enter your name." });
    if (!email.ok || !emailRegex.test(email.value)) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }
    if (!jobTitle.ok) return res.status(400).json({ error: "Please specify which role you're applying for." });
    if (!phone.ok) return res.status(400).json({ error: "Phone number is too long." });
    if (!coverNote.ok) return res.status(400).json({ error: "Cover note is too long (max 5,000 characters)." });

    const entry = await appendEntry(APPLICATIONS_PATH, (id) => ({
      id,
      jobId,
      jobTitle: jobTitle.value,
      name: name.value,
      email: email.value.toLowerCase(),
      phone: phone.value,
      coverNote: coverNote.value,
      submittedAt: new Date().toISOString(),
    }));

    notify(
      `New application: ${entry.jobTitle}`,
      `From: ${entry.name} <${entry.email}>\nPhone: ${entry.phone || "—"}\n\n${entry.coverNote || "(no cover note)"}`
    );

    res.status(201).json({
      message: `Thank you for applying for ${entry.jobTitle}. Our talent team will be in touch if there's a fit.`,
      reference: `VH-APP-${entry.id.toString().padStart(5, "0")}`,
    });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

// --- admin auth + admin-only read endpoints -----------------------------------
// The three read endpoints below expose real visitor PII and are protected
// by a signed session token issued at login. See Phase 0 audit, Finding 1,
// and docs/architecture.md for why this replaced an earlier static token.

app.post("/api/admin/login", loginLimiter, async (req, res) => {
  if (!ADMIN_AUTH_CONFIGURED) {
    return res.status(503).json({ error: "Admin login is not configured on this environment." });
  }
  const username = cleanString(req.body?.username, 100);
  const password = typeof req.body?.password === "string" ? req.body.password : "";

  if (!username.ok || !password) {
    return res.status(400).json({ error: "Username and password are required." });
  }

  const session = await attemptLogin(username.value, password);
  if (!session) {
    return res.status(401).json({ error: "Invalid username or password." });
  }
  res.json(session);
});

app.get("/api/careers/applications", adminLimiter, requireAdmin, async (req, res) => {
  try {
    const applications = await readJSON(APPLICATIONS_PATH);
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: "Unable to load applications." });
  }
});

app.get("/api/contact/messages", adminLimiter, requireAdmin, async (req, res) => {
  try {
    const messages = await readJSON(MESSAGES_PATH);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Unable to load messages." });
  }
});

app.get("/api/newsletter/subscribers", adminLimiter, requireAdmin, async (req, res) => {
  try {
    const subscribers = await readJSON(SUBSCRIBERS_PATH);
    res.json({ count: subscribers.length, subscribers });
  } catch (err) {
    res.status(500).json({ error: "Unable to load subscribers." });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: "Not found." });
});

// Express error-handling middleware (4 args) — catches anything that throws
// synchronously or calls next(err), so a bug never leaks a stack trace to
// the client.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("[unhandled]", err);
  res.status(500).json({ error: "Something went wrong. Please try again." });
});
