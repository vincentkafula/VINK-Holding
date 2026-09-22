import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import request from "supertest";

// Deliberately do NOT set ADMIN_TOKEN — this file runs in its own process
// (Node's test runner forks a subprocess per file), so it doesn't share
// state with api.test.js, which does set one.
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "vink-test-noauth-"));
process.env.NODE_ENV = "test";
process.env.DATA_DIR = tmpDir;
process.env.FRONTEND_URL = "";
delete process.env.ADMIN_TOKEN;

const { app } = await import("../src/app.js");

test("admin endpoints fail closed (503) when ADMIN_TOKEN is not configured, rather than allowing access", async () => {
  const res = await request(app).get("/api/contact/messages");
  assert.equal(res.status, 503);
});
