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

## Lost admin password, or need to rotate it

The password isn't stored anywhere recoverable by design — it only ever existed as plaintext for a moment
when it was generated, then only its bcrypt hash lives in Railway.

1. Generate a new password + hash together, so they're guaranteed to match:
   ```bash
   node -e "
   const bcrypt = require('bcryptjs');
   const crypto = require('crypto');
   const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
   let password = '';
   for (let i = 0; i < 24; i++) password += alphabet[crypto.randomInt(alphabet.length)];
   console.log('password:', password);
   console.log('hash:', bcrypt.hashSync(password, 12));
   "
   ```
2. Set the new hash as `ADMIN_PASSWORD_HASH` on the `vink-holding-backend` service in Railway. This
   redeploys the backend automatically.
3. Every existing session is invalidated immediately on redeploy (the old password no longer verifies against
   anything, and any live session tokens are still valid until they naturally expire within 8h — rotate
   `JWT_SECRET` too if you need to invalidate active sessions immediately, not just block new logins).
4. Log in again at `/admin` with the new password.
5. If backups are configured (`BACKUP_ADMIN_PASSWORD` GitHub Actions secret), update it there too, or the
   nightly backup workflow will start failing its login step.

## Recovering submission data (contact messages, subscribers, applications)

This data lives on the Railway volume mounted at `/data` on the backend service — it is **not** in git,
**not** in `content.json`. A nightly snapshot is also committed to the `data-backups` branch (see
`.github/workflows/backup.yml`); if the volume is lost, that branch is the recovery path (up to 24h of data
loss at worst, not total loss).

## Checking or manually running the backup

The backup workflow runs nightly (03:17 UTC) and can also be triggered manually:

1. GitHub → Actions tab → "Backup submission data" → "Run workflow" to trigger it on demand.
2. Check the `data-backups` branch for `snapshots/<date>/` — three JSON files per day
   (`contact-messages.json`, `newsletter-subscribers.json`, `careers-applications.json`).
3. If a run fails, it's almost always one of: the `BACKUP_ADMIN_PASSWORD` GitHub Actions secret is stale
   (see the password-rotation steps above), or the backend URL changed. Both are set as repository secrets
   (`BACKUP_ADMIN_USERNAME`, `BACKUP_ADMIN_PASSWORD`, `BACKUP_BACKEND_URL`) under Settings → Secrets and
   variables → Actions — values aren't viewable once set, only replaceable.
4. **To restore from a snapshot**: the JSON files are in the same shape the admin API returns them in
   (an array for messages/applications, `{ count, subscribers }` for the newsletter list) — there's no
   automated restore script, since restoring means deciding how to merge that snapshot with whatever's
   currently on the live volume rather than blindly overwriting it.

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

- **In-process write lock, not distributed.** The concurrency fix (Phase 1) only protects against races
  within one running instance. If this backend ever runs with more than one replica, two replicas could
  still race each other. Not a concern today (single replica, confirmed in the Railway service config).
