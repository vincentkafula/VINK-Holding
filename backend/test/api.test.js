import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import request from "supertest";
import bcrypt from "bcryptjs";

// Env vars must be set before app.js (and the env.js it imports) is loaded —
// ESM modules read process.env at import time, so this has to come first.
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "vink-test-"));
const TEST_PASSWORD = "test-password-123";

process.env.NODE_ENV = "test";
process.env.DATA_DIR = tmpDir;
process.env.ADMIN_USERNAME = "admin";
process.env.ADMIN_PASSWORD_HASH = bcrypt.hashSync(TEST_PASSWORD, 4); // low cost factor — tests only
process.env.JWT_SECRET = "test-jwt-secret";
process.env.JWT_EXPIRY = "8h";
process.env.FRONTEND_URL = "";

const { app } = await import("../src/app.js");

async function login() {
  const res = await request(app).post("/api/admin/login").send({ username: "admin", password: TEST_PASSWORD });
  assert.equal(res.status, 200, "test setup: login must succeed");
  return res.body.token;
}

test("GET /api/health returns ok", async () => {
  const res = await request(app).get("/api/health");
  assert.equal(res.status, 200);
  assert.equal(res.body.status, "ok");
});

test("GET /api/sectors returns the six sectors from content.json", async () => {
  const res = await request(app).get("/api/sectors");
  assert.equal(res.status, 200);
  assert.ok(Array.isArray(res.body));
  assert.equal(res.body.length, 6);
});

test("GET /api/sectors/:id 404s for an unknown sector", async () => {
  const res = await request(app).get("/api/sectors/not-a-real-sector");
  assert.equal(res.status, 404);
});

test("POST /api/newsletter rejects an invalid email", async () => {
  const res = await request(app).post("/api/newsletter").send({ email: "not-an-email" });
  assert.equal(res.status, 400);
});

test("POST /api/newsletter accepts a valid email, then dedupes a repeat", async () => {
  const email = `subscriber-${Date.now()}@example.com`;
  const first = await request(app).post("/api/newsletter").send({ email });
  assert.equal(first.status, 201);

  const second = await request(app).post("/api/newsletter").send({ email });
  assert.equal(second.status, 200);
  assert.match(second.body.message, /already subscribed/i);
});

test("POST /api/contact rejects a missing name", async () => {
  const res = await request(app)
    .post("/api/contact")
    .send({ email: "a@example.com", message: "hello" });
  assert.equal(res.status, 400);
});

test("POST /api/contact rejects a message over the length limit", async () => {
  const res = await request(app)
    .post("/api/contact")
    .send({ name: "Test User", email: "a@example.com", message: "x".repeat(5001) });
  assert.equal(res.status, 400);
});

test("POST /api/contact succeeds with valid data and returns a reference", async () => {
  const res = await request(app)
    .post("/api/contact")
    .send({ name: "Test User", email: "a@example.com", message: "Hello there" });
  assert.equal(res.status, 201);
  assert.match(res.body.reference, /^VH-\d{5}$/);
});

test("POST /api/admin/login rejects a wrong password", async () => {
  const res = await request(app).post("/api/admin/login").send({ username: "admin", password: "wrong" });
  assert.equal(res.status, 401);
});

test("POST /api/admin/login rejects a wrong username", async () => {
  const res = await request(app).post("/api/admin/login").send({ username: "not-admin", password: TEST_PASSWORD });
  assert.equal(res.status, 401);
});

test("POST /api/admin/login succeeds with correct credentials and returns a usable token", async () => {
  const res = await request(app).post("/api/admin/login").send({ username: "admin", password: TEST_PASSWORD });
  assert.equal(res.status, 200);
  assert.ok(res.body.token);
  assert.ok(res.body.expiresAt);
});

test("GET /api/contact/messages is rejected without a token", async () => {
  const res = await request(app).get("/api/contact/messages");
  assert.equal(res.status, 401);
});

test("GET /api/contact/messages is rejected with a garbage token", async () => {
  const res = await request(app).get("/api/contact/messages").set("Authorization", "Bearer not-a-real-jwt");
  assert.equal(res.status, 401);
});

test("GET /api/contact/messages succeeds with a valid session token and includes the earlier submission", async () => {
  const token = await login();
  const res = await request(app).get("/api/contact/messages").set("Authorization", `Bearer ${token}`);
  assert.equal(res.status, 200);
  assert.ok(res.body.some((m) => m.name === "Test User"));
});

test("an expired token is rejected with a clear message", async () => {
  // Sign a token that's already expired, using the same secret the server trusts.
  const jwt = (await import("jsonwebtoken")).default;
  const expiredToken = jwt.sign({ sub: "admin" }, "test-jwt-secret", { expiresIn: -10 });
  const res = await request(app).get("/api/contact/messages").set("Authorization", `Bearer ${expiredToken}`);
  assert.equal(res.status, 401);
  assert.match(res.body.error, /expired/i);
});

test("POST /api/careers/apply rejects a missing jobTitle", async () => {
  const res = await request(app)
    .post("/api/careers/apply")
    .send({ name: "Applicant", email: "a@example.com" });
  assert.equal(res.status, 400);
});

test("POST /api/careers/apply succeeds and is retrievable via the admin endpoint", async () => {
  const submit = await request(app)
    .post("/api/careers/apply")
    .send({ name: "Applicant", email: "a@example.com", jobTitle: "Credit Risk Analyst" });
  assert.equal(submit.status, 201);
  assert.match(submit.body.reference, /^VH-APP-\d{5}$/);

  const token = await login();
  const list = await request(app).get("/api/careers/applications").set("Authorization", `Bearer ${token}`);
  assert.equal(list.status, 200);
  assert.ok(list.body.some((a) => a.jobTitle === "Credit Risk Analyst"));
});

test("GET /api/investor-reports/:id/download returns a PDF", async () => {
  const reports = await request(app).get("/api/investor-reports");
  const firstId = reports.body[0].id;

  const res = await request(app).get(`/api/investor-reports/${firstId}/download`);
  assert.equal(res.status, 200);
  assert.equal(res.headers["content-type"], "application/pdf");
});

test("concurrent contact submissions don't clobber each other", async () => {
  const submissions = Array.from({ length: 10 }, (_, i) =>
    request(app)
      .post("/api/contact")
      .send({ name: `Concurrent ${i}`, email: "a@example.com", message: `msg ${i}` })
  );
  const results = await Promise.all(submissions);
  for (const res of results) assert.equal(res.status, 201);

  const token = await login();
  const list = await request(app).get("/api/contact/messages").set("Authorization", `Bearer ${token}`);
  const concurrentEntries = list.body.filter((m) => m.name.startsWith("Concurrent "));
  assert.equal(concurrentEntries.length, 10, "all 10 concurrent submissions should be persisted, none lost to a write race");

  const ids = concurrentEntries.map((m) => m.id);
  assert.equal(new Set(ids).size, ids.length, "no two entries should share an id");
});
