# Vink Holdings — Corporate Website

Full-stack rebuild of the Vink Holdings landing page: React frontend + Node/Express
backend with real, working functionality (not just static markup).

## Structure

```
vink-holdings/
├── frontend/   React + Vite + Tailwind v4
└── backend/    Node/Express API + JSON data store
```

## What's functional (not just decorative)

- **Multi-page navigation** — Home, About, Our Businesses (+ per-sector detail
  pages), Investors, Sustainability, Careers, News (+ per-article detail
  pages), and Contact are all real routes (React Router), not anchor scrolls.
  Every header, footer, and in-page link points to a working route.
- **Sliding adverts carousel** — an auto-rotating, clickable promo strip
  (`/api/ads`) on every major page, with arrows and dots.
- **Newsletter signup** (footer) — validates the email, persists it to
  `backend/data/subscribers.json`.
- **Contact form** — a full page at `/contact` (plus reusable component),
  persists to `backend/data/messages.json`, returns a reference number.
- **Careers** — real job listings filterable by department, with a working
  "Apply Now" form that persists to `backend/data/applications.json`.
- **News** — filterable by category, with full article detail pages.
- **Investor report downloads** — each report in the Investors section is a real,
  server-generated PDF (`GET /api/investor-reports/:id/download`), not a placeholder alert.
- Sectors, markets, leadership, governance, sustainability pillars, and
  investor reports are all served from the backend rather than hardcoded.

## Running locally

### 1. Backend

```bash
cd backend
npm install
npm start          # http://localhost:4000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev         # http://localhost:5173 (proxies /api to :4000)
```

Open http://localhost:5173 — the dev server proxies `/api/*` requests to the
backend on port 4000, so no extra config is needed locally.

## Building for production

```bash
cd frontend
npm run build        # outputs to frontend/dist
```

Serve `frontend/dist` as a static site, and run `backend/server.js` as its
own Node service. Point the frontend at the deployed API by setting the
`/api` proxy target (e.g. via your hosting platform's rewrite rules, or by
changing the fetch base URL in `frontend/src/api.js` to the full backend URL).

## Environment

- `PORT` — backend port (defaults to `4000`).
- `DATA_DIR` — writable directory for user-submitted data (newsletter subscribers, contact messages, job
  applications). **Set this to a mounted volume path in production** (e.g. `/data`) — without it, this data
  lives on the service's local filesystem and is lost on every redeploy. Falls back to `backend/data/` for
  local development. Reference content (sectors, news, jobs, etc.) always ships with the code regardless of
  this setting.
- `FRONTEND_URL` — restricts CORS to this origin in production. Without it, the API accepts requests from any
  origin (useful for local dev against the Vite server).
- `ADMIN_TOKEN` — required to access `/api/contact/messages`, `/api/newsletter/subscribers`, and
  `/api/careers/applications` (send `Authorization: Bearer <token>`). **These three endpoints return 503 —
  not open access — if this isn't set.** Generate a long random value, e.g. `openssl rand -hex 32`. There is
  no full login system on this site (see Security model below for why, and what upgrading it would involve).
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `NOTIFY_EMAIL` — optional. All five (four creds + the
  destination address) must be set for email notifications on new submissions to fire; if any are missing,
  the feature is silently disabled and submissions still succeed normally. Any standard SMTP provider works
  (Resend, SendGrid, Postmark, etc.) — confirm your provider's host/port/auth details before setting these.

Copy `backend/.env.example` to `backend/.env` and fill in `ADMIN_TOKEN` at minimum before running locally.

## Security model

This site has no user accounts, no payments, and no money movement — it's a corporate marketing/investor-relations
site, not a banking platform, so the controls below are scoped to what actually applies:

- **Admin endpoints** (the three PII-bearing GETs above) are protected by a single shared bearer token, not a
  full login system. That's an intentional minimal starting point for a site with one or two internal readers,
  not a shortcut — if more people need access, or you need per-person audit trails, that's the trigger to build
  real auth (see `docs/content-audit.md`'s sibling audit notes for the reasoning).
- **Rate limiting**: all three public POST endpoints (`/newsletter`, `/contact`, `/careers/apply`) are limited
  to 8 requests per 15 minutes per IP. Admin GETs are limited to 120 per 15 minutes.
- **Input validation**: every field has a server-side max length (see `backend/src/security.js`) in addition to
  client-side `maxLength` attributes — the server never trusts the client's validation alone.
- **Concurrent-write safety**: submissions are serialized per data file (see `backend/src/store.js`) so two
  simultaneous submissions can't race and silently drop one — verified by an automated concurrency test, not
  just reasoned about (see Testing below).
- **Security headers** via `helmet`, **structured request logging** via `morgan` (disabled in tests).
- **CI-enforced**: `npm audit --audit-level=high` runs on every push for both frontend and backend, plus a
  secret-scan (gitleaks) — see `.github/workflows/ci.yml`. Note this reports pass/fail on GitHub but does not
  currently block the Railway auto-deploy, which redeploys on push independent of CI result — wiring that up
  is a known gap (see below).

## Testing

```bash
cd backend && npm test     # node --test — 16 tests: validation, admin auth, rate-limit behavior, PDF
                            # generation, and a concurrency test proving the write-race fix actually works
cd frontend && npm test    # vitest — nav routing + contact form submit/error/prefill behavior
```

## Running locally with Docker Compose

```bash
cp backend/.env.example backend/.env   # fill in ADMIN_TOKEN at minimum
docker compose up --build
```

Backend on http://localhost:4000, frontend on http://localhost:5173. This is an addition on top of the
plain `npm run dev` workflow below, not a replacement — use whichever fits what you're doing.

Note: the Dockerfiles are named `Dockerfile.local` in both `backend/` and `frontend/`, not `Dockerfile` —
this project deploys on Railway via Railpack (buildCommand/startCommand in Railway's service config), and a
file literally named `Dockerfile` gets auto-detected and used by Railway's build step regardless of that
config, which broke the frontend service in production once (see git history around the Phase 1 commit).
`docker-compose.yml` points at `Dockerfile.local` explicitly, so this only matters if you're looking for the
Dockerfiles and wondering why they're not named the usual way.

## Running locally (without Docker)

The photographic imagery from the original design (skyline, boardroom,
sector photos) has been replaced with matching dark-green/gold gradient and
SVG illustrations in the same palette and layout, since the original photos
are licensed stock images. Swap in real photography by replacing the
gradient `<svg>` blocks in `Hero.jsx`, `WhyPartner.jsx`, `BusinessSectors.jsx`,
and `NewsUpdates.jsx` with `<img>` tags.
