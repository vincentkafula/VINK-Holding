import express from "express";
import cors from "cors";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "data");
const CONTENT_PATH = path.join(DATA_DIR, "content.json");
const SUBSCRIBERS_PATH = path.join(DATA_DIR, "subscribers.json");
const MESSAGES_PATH = path.join(DATA_DIR, "messages.json");
const APPLICATIONS_PATH = path.join(DATA_DIR, "applications.json");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
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
