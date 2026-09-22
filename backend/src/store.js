import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import { WRITABLE_DIR, CONTENT_PATH } from "./env.js";

export const SUBSCRIBERS_PATH = path.join(WRITABLE_DIR, "subscribers.json");
export const MESSAGES_PATH = path.join(WRITABLE_DIR, "messages.json");
export const APPLICATIONS_PATH = path.join(WRITABLE_DIR, "applications.json");

// Ensure the writable directory and its files exist before anything tries to
// read them — critical on first boot against a fresh, empty volume.
export function ensureStore() {
  if (!fsSync.existsSync(WRITABLE_DIR)) {
    fsSync.mkdirSync(WRITABLE_DIR, { recursive: true });
  }
  for (const filePath of [SUBSCRIBERS_PATH, MESSAGES_PATH, APPLICATIONS_PATH]) {
    if (!fsSync.existsSync(filePath)) {
      fsSync.writeFileSync(filePath, "[]", "utf-8");
    }
  }
}

export async function readJSON(filePath) {
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw);
}

async function writeJSON(filePath, data) {
  // Write to a temp file then rename, so a crash mid-write never leaves a
  // truncated/corrupt JSON file behind — rename is atomic on the same volume.
  const tmpPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(tmpPath, JSON.stringify(data, null, 2), "utf-8");
  await fs.rename(tmpPath, filePath);
}

// Per-file write queues. Without this, two concurrent requests can both
// read the array, both append their own entry, and both write — the second
// write wins and the first submission silently disappears. Each file gets
// its own promise chain so a slow write to one file never blocks another.
const locks = new Map();

function withLock(filePath, task) {
  const previous = locks.get(filePath) || Promise.resolve();
  const next = previous.then(task, task); // run task even if the previous chain rejected
  // Keep the chain alive but never let a rejection here block future writes.
  locks.set(
    filePath,
    next.catch(() => {})
  );
  return next;
}

/**
 * Atomically append an entry to a JSON array file: read, assign the next id,
 * push, write — all serialized per file so concurrent submissions can't
 * race each other. Returns the entry as stored (with its assigned id).
 */
export function appendEntry(filePath, buildEntry) {
  return withLock(filePath, async () => {
    const current = await readJSON(filePath);
    const nextId = current.length ? current[current.length - 1].id + 1 : 1;
    const entry = buildEntry(nextId);
    current.push(entry);
    await writeJSON(filePath, current);
    return entry;
  });
}

export async function loadContent() {
  return readJSON(CONTENT_PATH);
}
