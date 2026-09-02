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

## Notes on the design

The photographic imagery from the original design (skyline, boardroom,
sector photos) has been replaced with matching dark-green/gold gradient and
SVG illustrations in the same palette and layout, since the original photos
are licensed stock images. Swap in real photography by replacing the
gradient `<svg>` blocks in `Hero.jsx`, `WhyPartner.jsx`, `BusinessSectors.jsx`,
and `NewsUpdates.jsx` with `<img>` tags.
