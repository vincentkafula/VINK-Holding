import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import request from "supertest";

// Deliberately do NOT set ADMIN_PASSWORD_HASH/JWT_SECRET — this file runs in
// its own process (Node's test runner forks a subprocess per file), so it
// doesn't share state with api.test.js, which does set them.
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "vink-test-noauth-"));
process.env.NODE_ENV = "test";
process.env.DATA_DIR = tmpDir;
process.env.FRONTEND_URL = "";
delete process.env.ADMIN_PASSWORD_HASH;
delete process.env.JWT_SECRET;

const { app } = await import("../src/app.js");

test("admin login fails closed (503) when not configured, rather than allowing access", async () => {
  const res = await request(app).post("/api/admin/login").send({ username: "admin", password: "anything" });
  assert.equal(res.status, 503);
});

test("admin read endpoints fail closed (503) when not configured, rather than allowing access", async () => {
  const res = await request(app).get("/api/contact/messages");
  assert.equal(res.status, 503);
});
