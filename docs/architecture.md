# Architecture

Scope note: this is a corporate marketing/investor-relations site — no user accounts, no money movement,
no complex relational data. The diagrams and models below are sized to that, not padded to look like a
bigger system than it is.

## C4 — Level 1: System Context

```mermaid
C4Context
    Person(visitor, "Site visitor", "Investor, partner, candidate, journalist, or general public")
    Person(admin, "Vink Holdings admin", "Reads submissions via the admin-token-gated endpoints")

    System(site, "Vink Holdings site", "React SPA + Express API — content, forms, PDF reports")

    System_Ext(railway, "Railway", "Hosting: two services, one persistent volume")
    System_Ext(smtp, "SMTP provider", "Optional — email notification on new submissions")
    System_Ext(github, "GitHub Actions", "CI: lint, test, build, dependency audit, secret scan")

    Rel(visitor, site, "Browses content, submits forms", "HTTPS")
    Rel(admin, site, "Reads submissions", "HTTPS + Bearer token")
    Rel(site, smtp, "Sends notification email", "SMTP, optional")
    Rel(github, site, "Builds & tests on push", "N/A — reports only, does not gate deploy")
    Rel(site, railway, "Deployed on", "Git push -> auto-deploy")
```

## C4 — Level 2: Containers

```mermaid
C4Container
    Person(visitor, "Site visitor")

    Container_Boundary(site, "Vink Holdings site") {
        Container(spa, "Frontend", "React 19 + Vite + React Router", "10 routed pages, static build served by 'serve'")
        Container(api, "Backend API", "Node 22 + Express", "22 routes: 19 public reads/writes, 3 session-gated admin reads")
        ContainerDb(content, "content.json", "Reference data, ships with the code", "sectors, news, jobs, markets, leadership, etc. — read-only at runtime")
        ContainerDb(volume, "Railway volume (/data)", "JSON files", "subscribers.json, messages.json, applications.json — the only writable state")
    }

    Rel(visitor, spa, "HTTPS")
    Rel(spa, api, "fetch() to VITE_API_URL", "JSON over HTTPS")
    Rel(api, content, "readJSON()", "read-only")
    Rel(api, volume, "appendEntry() via per-file lock", "read-modify-write, serialized")
```

## Data model

No relational database — three shapes, all flat JSON arrays. This is the actual schema (not aspirational):

**`subscribers.json`** — newsletter
```
{ email: string, subscribedAt: ISO8601 }
```

**`messages.json`** — contact form
```
{ id: int, name: string, email: string, phone: string|null, subject: string, message: string, submittedAt: ISO8601 }
```

**`applications.json`** — job applications
```
{ id: int, jobId: string|null, jobTitle: string, name: string, email: string, phone: string|null, coverNote: string|null, submittedAt: ISO8601 }
```

`content.json` holds the reference data (`company`, `markets`, `sectors`, `stats`, `ads`, `leadership`,
`governance`, `sustainability`, `jobs`, `investorReports`, `news`) — see the file itself for shapes; it's
hand-edited, not user-submitted, so it isn't part of the write path or the threat model below.

**Why no real database yet**: at this traffic level (a handful of form submissions a day, not a day-one
concern), flat JSON-on-a-volume with per-file write locking (see Phase 1) is correct and boring, which is
preferable to Postgres-for-three-tiny-tables complexity. The trigger to migrate isn't a specific number —
it's the first time you need to query across submissions in a way `Array.filter` can't do reasonably, or the
first time you need more than one backend instance running concurrently (the current lock is in-process
memory, not distributed — two backend replicas would each have their own lock and could race each other).

## Migration plan

There's no big-bang rewrite needed. Phase 1 closed the original security gap; a later pass closed the
remaining two deferred items:

1. ~~CI doesn't gate the Railway deploy.~~ **Resolved**: branch protection on `main` requires the CI workflow
   to pass before merging a PR, with `enforce_admins: false` so the repo owner can still push directly for
   genuinely urgent fixes — a deliberate middle ground, since a hard block would have broken the
   direct-push-to-main workflow every deploy on this project has used, and a required check can never pass
   for a commit that hasn't had it run yet.
2. ~~Single shared admin token vs. real login.~~ **Resolved**: `POST /api/admin/login` verifies a
   bcrypt-hashed password and issues a short-lived signed JWT (`backend/src/security.js`). The isolation this
   doc originally described (auth logic contained to one file) is exactly what made the swap low-risk in
   practice — nothing outside `security.js` and the login route changed shape.
3. **No backup of the submissions volume — resolved differently than the two above**: rather than adding
   infrastructure (a managed backup service, external object storage), `.github/workflows/backup.yml` logs
   into the live admin API on a daily schedule and commits a dated JSON snapshot to a dedicated
   `data-backups` branch. Free, versioned, and durable via git itself — proportionate to three small JSON
   files, not scaled up to a general backup system this site doesn't need yet.

**Still an open trade-off, not urgent**: the write lock in `backend/src/store.js` is in-process, not
distributed — correct for the current single-replica deployment, and the thing to revisit first if this
backend ever runs with more than one instance.

Everything else in the original template's Phase 2-7 (mobile completion, KYC, ledger, card tokenization,
maker-checker approvals) doesn't apply — there's no mobile app, no payments, and no money to move.
