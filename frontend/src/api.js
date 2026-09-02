const BASE = "/api";

async function handle(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "Something went wrong. Please try again.");
  }
  return data;
}

export async function getSectors() {
  const res = await fetch(`${BASE}/sectors`);
  return handle(res);
}

export async function getStats() {
  const res = await fetch(`${BASE}/stats`);
  return handle(res);
}

export async function getNews() {
  const res = await fetch(`${BASE}/news`);
  return handle(res);
}

export async function subscribeNewsletter(email) {
  const res = await fetch(`${BASE}/newsletter`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return handle(res);
}

export async function submitContact(payload) {
  const res = await fetch(`${BASE}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handle(res);
}
