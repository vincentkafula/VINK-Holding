# Runbook

Practical steps for the scenarios that actually apply to a site at this scale — not a generic incident
response template. If something isn't listed here, it hasn't come up yet; add it when it does.

## The site is down

1. Check Railway: both services should show **Online** with no pending/applying work.
   `environment-status` (if you're working with Claude) or the Railway dashboard.
2. Check the deploy logs for the failing service. Two failure modes have actually happened on this project:
   - **A file literally named `Dockerfile` in `frontend/` or `backend/`** gets auto-picked-up by Railway's
     build step even though the service is configured for Railpack, and the resulting container fails to
     start. This happened once — see the "Hotfix: rename Dockerfiles" commit. If you ever add a real
     Dockerfile to either service, name it `Dockerfile.local` and keep the `dockerfilePath` config unset.
   - **A bad env var** — e.g. `DATA_DIR` pointing somewhere the volume isn't mounted. Check
     `get-service-config` against what's actually set.
3. If the backend is down: the frontend will still load (it's a static build) but every API-backed section
   will show its loading/error state. Contact/newsletter/careers forms will show "Something went wrong."
4. If the frontend is down: the backend API still works directly (`curl` it), but the public site is
   inaccessible. This is the higher-severity case.
5. Rollback: Railway keeps prior successful deployments — redeploy the last known-good one from the
   dashboard, or `git revert` the bad commit and push (triggers a fresh deploy).

## Lost or need to rotate the admin token

The admin token isn't stored anywhere recoverable by design — it's a Railway environment variable, not a
password with a reset flow.

1. Generate a new one: `python3 -c "import secrets; print(secrets.token_hex(32))"` (or `openssl rand -hex 32`).
2. Set it as `ADMIN_TOKEN` on the `vink-holding-backend` service in Railway. This redeploys the backend
   automatically.
3. The old token stops working immediately on redeploy. Update it in `/admin` (the browser will ask again
   since it's stored in `sessionStorage`, not persisted across a token change).
4. If you rotate and don't have the old one to compare, that's fine — there's no migration step, it's a
   stateless bearer check.

## Recovering submission data (contact messages, subscribers, applications)

This data lives only on the Railway volume mounted at `/data` on the backend service — it is **not** in git,
**not** in `content.json`, and has no automatic backup configured (see "Known gaps" below).

- **To read it**: use `/admin` on the live site, or `curl` the three admin endpoints directly with the token.
- **If the volume is somehow lost** (Railway outage, accidental deletion): there is currently no backup to
  restore from. This is the single biggest operational gap in the project — see below.

## Checking whether email notifications are working

Notifications are silently disabled unless all five `SMTP_*`/`NOTIFY_EMAIL` vars are set (Phase 1 design —
a missing notification should never block a real submission). If you've set them and aren't getting emails:

1. Confirm all five vars are set on the backend service (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`,
   `NOTIFY_EMAIL`) — partial config means the feature stays off, silently, by design.
2. Check the deploy logs for `[mailer] notification failed:` — the mailer never throws to the user-facing
   request, so a bad SMTP config shows up only in logs, not in a failed form submission.
3. Test independently of the site: the submission still succeeds and is retrievable via `/admin` even if
   email delivery is broken.

## Getting alerted when something breaks (you have to opt in — I can't do this part for you)

Railway sends email + in-app notifications on deployment failures/crashes, but it's an **account-level
setting**, not something settable via the API/MCP tools used to build this project:

1. Railway dashboard → Account Settings → Notifications → enable email notifications for deployment status
   changes.
2. Optional: Railway → Project → Settings → Webhooks, to also forward alerts to Slack/Discord. This needs an
   incoming webhook URL from whichever tool you're forwarding to (e.g. a Slack "Incoming Webhook" app) —
   nothing here has that configured.

Reference: https://docs.railway.com/guides/alerts-crashes-failed-deploys

## Known gaps (deliberately not fixed — see reasoning in each linked doc)

- **No backup of the submissions volume.** If it's lost, submitted contact messages/subscribers/applications
  are gone. At current volume (a handful of submissions a week) this is a real but low-probability-low-impact
  gap — worth fixing before this data matters more than it does today.
- **CI doesn't gate the Railway deploy.** `.github/workflows/ci.yml` reports pass/fail on GitHub, but pushing
  to `main` deploys immediately regardless. Fixing this properly means switching to a PR-based workflow
  (branch protection + required status checks), which is a real process change, not just a settings toggle —
  deliberately left as your call rather than imposed. See `docs/architecture.md`'s migration plan.
- **Single shared admin token, not per-person login.** Fine for one or two people checking submissions
  occasionally; revisit if that changes. See `docs/architecture.md`.
- **In-process write lock, not distributed.** The concurrency fix (Phase 1) only protects against races
  within one running instance. If this backend ever runs with more than one replica, two replicas could
  still race each other. Not a concern today (single replica, confirmed in the Railway service config).
