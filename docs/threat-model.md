# Threat Model (STRIDE)

Scoped to what this system actually is: a public content site with three write endpoints and no
authentication system beyond an admin login for three internal endpoints. Entries below are the ones that apply — STRIDE
categories with no real attack surface here (e.g. most Elevation of Privilege scenarios, which need a
privilege hierarchy this system doesn't have) are noted as such rather than padded out.

| # | Category | Threat | Mitigation | Status |
|---|---|---|---|---|
| 1 | Spoofing | Someone submits a form claiming to be someone else's email | Not mitigated — no email verification step exists. Low severity here: nothing downstream *acts* on the email being correct (no password reset, no account) | **Accepted risk** — see note below |
| 2 | Spoofing | Someone brute-forces the admin password | Rate-limited to 5 attempts/15min; password is bcrypt-hashed (cost 12), never stored or logged in plaintext | Mitigated |
| 2b | Spoofing | Someone steals a valid session token (JWT) | Tokens are signed (HS256, random 48-byte secret) and expire after 8h; transmitted only over HTTPS, never logged | Mitigated |
| 3 | Tampering | Concurrent writes to the same JSON file corrupt or drop data | Per-file promise-chain lock + atomic write-then-rename (Phase 1) | Mitigated, tested |
| 4 | Tampering | A crash mid-write leaves a truncated/corrupt JSON file | Write-to-temp-file-then-rename is atomic on the same filesystem | Mitigated |
| 5 | Repudiation | A visitor denies submitting a contact form / application | Every submission is timestamped and returns a reference number (`VH-#####`) client-side. No stronger non-repudiation (e.g. signed receipts) — not warranted for this system | **Accepted, proportionate** |
| 6 | Information Disclosure | The three admin endpoints leak visitor PII to unauthenticated requests | **This was Phase 0 Finding 1** — now requires a logged-in session (`Authorization: Bearer <JWT>` from `POST /admin/login`), fails closed (503) if login isn't configured | Mitigated, tested |
| 7 | Information Disclosure | Stack traces / internal errors leaked to clients on unexpected failure | Centralized Express error-handling middleware returns a generic message; the real error is only `console.error`'d server-side | Mitigated |
| 8 | Information Disclosure | Secrets committed to git history | `.env` gitignored on both services; verified no PII or secrets in any tracked file or prior commit (Phase 0 audit); CI runs gitleaks on every push | Mitigated |
| 9 | Denial of Service | Spam/scripted flood of form submissions | Rate limiting: 8 req/15min per IP on all public POST routes | Mitigated, tested |
| 10 | Denial of Service | Oversized request bodies exhaust memory/disk | `express.json({ limit: "100kb" })` at the app level, plus per-field max-length validation server-side | Mitigated |
| 11 | Denial of Service | A leaked session token used to hammer the read endpoints | Separate, higher rate limit (120/15min) still applies even with a valid token, and the token expires within 8h regardless | Mitigated |
| 12 | Elevation of Privilege | N/A — no privilege hierarchy exists (visitor vs. the one admin account, nothing in between) | — | Not applicable |
| 13 | Elevation of Privilege | CORS misconfigured, allowing a malicious site to make authenticated-looking requests on a visitor's behalf | `FRONTEND_URL` scopes CORS to the real frontend origin in production; note this doesn't protect the admin endpoints since they don't use cookies — the JWT is attached manually in a header, not automatically by the browser, so CSRF-style attacks don't apply to them | Mitigated by design (header-based bearer auth, not cookie auth) |

## Note on #1 (email spoofing / no verification)

Accepted, not fixed, and worth being explicit about why: this system never uses the submitted email for
anything privileged (no password reset, no account access, no automated action beyond "a human reads it and
maybe replies"). Adding email verification (confirmation link, OTP) would add real friction to legitimate
investor/partner/candidate enquiries for a threat that doesn't have a meaningful payoff here — nobody gains
anything by submitting a contact form as "you." If that assumption changes (e.g. the newsletter subscription
is ever used to gate access to something), this should be revisited.

## What's deliberately out of scope

Card data, KYC/AML, ledger integrity, maker-checker approval flows, biometric auth, certificate pinning,
root/jailbreak detection — all from the original banking template, none applicable. There is no money, no
mobile app, and no regulated financial activity on this system.
