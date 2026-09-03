import express from "express";
import cors from "cors";
import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import { fileURLToPath } from "url";
import PDFDocument from "pdfkit";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Reference content (sectors, news, jobs, etc.) ships with the code — read-only.
const CONTENT_DIR = path.join(__dirname, "data");
const CONTENT_PATH = path.join(CONTENT_DIR, "content.json");

// User-submitted data (newsletter, contact, applications) needs to survive
// redeploys, so it's written to a separate, writable directory. On Railway,
// set DATA_DIR to a mounted volume path (e.g. /data) so this data isn't lost
// every time the service redeploys — without a volume, Railway's filesystem
// is ephemeral and this directory resets on every deploy. Falls back to the
// local data/ folder for development, where persistence isn't a concern.
const WRITABLE_DIR = process.env.DATA_DIR || CONTENT_DIR;
const SUBSCRIBERS_PATH = path.join(WRITABLE_DIR, "subscribers.json");
const MESSAGES_PATH = path.join(WRITABLE_DIR, "messages.json");
const APPLICATIONS_PATH = path.join(WRITABLE_DIR, "applications.json");

// Ensure the writable directory and its files exist before anything tries to
// read them — critical on first boot against a fresh, empty volume.
if (!fsSync.existsSync(WRITABLE_DIR)) {
  fsSync.mkdirSync(WRITABLE_DIR, { recursive: true });
}
for (const filePath of [SUBSCRIBERS_PATH, MESSAGES_PATH, APPLICATIONS_PATH]) {
  if (!fsSync.existsSync(filePath)) {
    fsSync.writeFileSync(filePath, "[]", "utf-8");
  }
}

const app = express();
const PORT = process.env.PORT || 4000;

// In production, restrict CORS to the deployed frontend origin via
// FRONTEND_URL. Without it set (local dev), allow any origin so the Vite
// dev server and direct API testing both work.
const allowedOrigin = process.env.FRONTEND_URL || true;
app.use(cors({ origin: allowedOrigin }));
app.use(express.json());

// --- helpers -------------------------------------------------------------

async function readJSON(filePath) {
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw);
}

async function writeJSON(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// --- content routes --------------------------------------------------------

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "vink-holdings-api", time: new Date().toISOString() });
});

app.get("/api/company", async (req, res) => {
  try {
    const content = await readJSON(CONTENT_PATH);
    res.json(content.company);
  } catch (err) {
    res.status(500).json({ error: "Unable to load company profile." });
  }
});

app.get("/api/sectors", async (req, res) => {
  try {
    const content = await readJSON(CONTENT_PATH);
    res.json(content.sectors);
  } catch (err) {
    res.status(500).json({ error: "Unable to load business sectors." });
  }
});

app.get("/api/sectors/:id", async (req, res) => {
  try {
    const content = await readJSON(CONTENT_PATH);
    const sector = content.sectors.find((s) => s.id === req.params.id);
    if (!sector) return res.status(404).json({ error: "Sector not found." });
    res.json(sector);
  } catch (err) {
    res.status(500).json({ error: "Unable to load sector." });
  }
});

app.get("/api/markets", async (req, res) => {
  try {
    const content = await readJSON(CONTENT_PATH);
    res.json(content.markets);
  } catch (err) {
    res.status(500).json({ error: "Unable to load markets." });
  }
});

app.get("/api/ads", async (req, res) => {
  try {
    const content = await readJSON(CONTENT_PATH);
    res.json(content.ads);
  } catch (err) {
    res.status(500).json({ error: "Unable to load promotions." });
  }
});

app.get("/api/leadership", async (req, res) => {
  try {
    const content = await readJSON(CONTENT_PATH);
    res.json({ leadership: content.leadership, governance: content.governance });
  } catch (err) {
    res.status(500).json({ error: "Unable to load leadership." });
  }
});

app.get("/api/sustainability", async (req, res) => {
  try {
    const content = await readJSON(CONTENT_PATH);
    res.json(content.sustainability);
  } catch (err) {
    res.status(500).json({ error: "Unable to load sustainability content." });
  }
});

app.get("/api/jobs", async (req, res) => {
  try {
    const content = await readJSON(CONTENT_PATH);
    res.json(content.jobs);
  } catch (err) {
    res.status(500).json({ error: "Unable to load open roles." });
  }
});

app.get("/api/jobs/:id", async (req, res) => {
  try {
    const content = await readJSON(CONTENT_PATH);
    const job = content.jobs.find((j) => String(j.id) === req.params.id);
    if (!job) return res.status(404).json({ error: "Role not found." });
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: "Unable to load role." });
  }
});

app.get("/api/investor-reports", async (req, res) => {
  try {
    const content = await readJSON(CONTENT_PATH);
    const sorted = [...content.investorReports].sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json(sorted);
  } catch (err) {
    res.status(500).json({ error: "Unable to load investor reports." });
  }
});

app.get("/api/investor-reports/:id/download", async (req, res) => {
  try {
    const content = await readJSON(CONTENT_PATH);
    const report = content.investorReports.find((r) => String(r.id) === req.params.id);
    if (!report) return res.status(404).json({ error: "Report not found." });

    const filename = `${report.title.replace(/[^a-z0-9]+/gi, "-")}.pdf`;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    const doc = new PDFDocument({ size: "A4", margin: 56 });
    doc.pipe(res);

    const gold = "#b8863f";
    const dark = "#1a1a1a";

    doc.fillColor(gold).fontSize(10).font("Helvetica-Bold").text("VINK HOLDINGS", { characterSpacing: 2 });
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
      `Generated ${new Date().toLocaleString("en-US")} · Vink Holdings, Stand No. 1234, Independence Ave, Lusaka, Zambia`
    );

    doc.end();
  } catch (err) {
    res.status(500).json({ error: "Unable to generate report." });
  }
});

app.get("/api/stats", async (req, res) => {
  try {
    const content = await readJSON(CONTENT_PATH);
    res.json(content.stats);
  } catch (err) {
    res.status(500).json({ error: "Unable to load stats." });
  }
});

app.get("/api/news", async (req, res) => {
  try {
    const content = await readJSON(CONTENT_PATH);
    const sorted = [...content.news].sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json(sorted);
  } catch (err) {
    res.status(500).json({ error: "Unable to load news." });
  }
});

app.get("/api/news/:id", async (req, res) => {
  try {
    const content = await readJSON(CONTENT_PATH);
    const item = content.news.find((n) => String(n.id) === req.params.id);
    if (!item) return res.status(404).json({ error: "Article not found." });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: "Unable to load article." });
  }
});

// --- newsletter subscription ------------------------------------------------

app.post("/api/newsletter", async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email || typeof email !== "string" || !emailRegex.test(email.trim())) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }
    const normalized = email.trim().toLowerCase();
    const subscribers = await readJSON(SUBSCRIBERS_PATH);

    if (subscribers.some((s) => s.email === normalized)) {
      return res.status(200).json({ message: "You're already subscribed. Thanks for staying connected!" });
    }

    subscribers.push({ email: normalized, subscribedAt: new Date().toISOString() });
    await writeJSON(SUBSCRIBERS_PATH, subscribers);
    res.status(201).json({ message: "Thanks for subscribing to Vink Holdings updates." });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

// --- contact form ------------------------------------------------------------

app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body || {};

    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Please enter your name." });
    }
    if (!email || !emailRegex.test(email.trim())) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }
    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Please enter a message." });
    }

    const messages = await readJSON(MESSAGES_PATH);
    const entry = {
      id: messages.length ? messages[messages.length - 1].id + 1 : 1,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : null,
      subject: subject ? subject.trim() : "General Enquiry",
      message: message.trim(),
      submittedAt: new Date().toISOString(),
    };
    messages.push(entry);
    await writeJSON(MESSAGES_PATH, messages);

    res.status(201).json({
      message: "Thank you for contacting Vink Holdings. Our team will respond within 2 business days.",
      reference: `VH-${entry.id.toString().padStart(5, "0")}`,
    });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

// --- job applications ---------------------------------------------------

app.post("/api/careers/apply", async (req, res) => {
  try {
    const { jobId, jobTitle, name, email, phone, coverNote } = req.body || {};

    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Please enter your name." });
    }
    if (!email || !emailRegex.test(email.trim())) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }
    if (!jobTitle || !jobTitle.trim()) {
      return res.status(400).json({ error: "Please specify which role you're applying for." });
    }

    const applications = await readJSON(APPLICATIONS_PATH);
    const entry = {
      id: applications.length ? applications[applications.length - 1].id + 1 : 1,
      jobId: jobId || null,
      jobTitle: jobTitle.trim(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : null,
      coverNote: coverNote ? coverNote.trim() : null,
      submittedAt: new Date().toISOString(),
    };
    applications.push(entry);
    await writeJSON(APPLICATIONS_PATH, applications);

    res.status(201).json({
      message: `Thank you for applying for ${entry.jobTitle}. Our talent team will be in touch if there's a fit.`,
      reference: `VH-APP-${entry.id.toString().padStart(5, "0")}`,
    });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

app.get("/api/careers/applications", async (req, res) => {
  try {
    const applications = await readJSON(APPLICATIONS_PATH);
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: "Unable to load applications." });
  }
});

// Simple admin-style read endpoints (no auth layer — internal use only)
app.get("/api/contact/messages", async (req, res) => {
  try {
    const messages = await readJSON(MESSAGES_PATH);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Unable to load messages." });
  }
});

app.get("/api/newsletter/subscribers", async (req, res) => {
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

app.listen(PORT, () => {
  console.log(`Vink Holdings API listening on port ${PORT}`);
});
