# ScientificRadar Web — Operational Readiness, Cache Contract & Rollback Runbook (M5)

## 1. Environment Schema & Fail-Closed Validation (`lib/config/env.ts`)

`validateWebEnvironment()` enforces runtime separation between Stage A (standalone demonstration mode) and Stage C (production mode):

- **Default Mode (`SCIRAD_RUNTIME_MODE="stage-a-demo"`, `SCIRAD_CONTENT_ADAPTER="demo-fixtures"`):**
  - Search engine indexing is disabled (`NEXT_PUBLIC_ENABLE_PRODUCTION_INDEXING="false"`).
  - `/robots.txt` disallows all paths (`Disallow: /`); `/sitemap.xml` returns `[]`.
  - Google Analytics (`GA4`) and AdSense remain completely disabled (`NEXT_PUBLIC_ENABLE_GOOGLE_SERVICES="false"`).
- **Production Mode Invariants (`SCIRAD_RUNTIME_MODE="stage-c-production"`):**
  - Fails closed if `NEXT_PUBLIC_SITE_URL` is not a verified HTTPS production domain.
  - Fails closed if `SCIRAD_CONTENT_ADAPTER` is left on `"demo-fixtures"`.
  - Fails closed if any server-only secret (`GEMINI_API_KEY`, `SCIRAD_REVALIDATION_SECRET`, etc.) is exposed with a `NEXT_PUBLIC_` prefix.

## 2. Server Cache Tag & Revalidation Contract (`lib/config/diagnostics.ts`)

When Stage C server-authenticated snapshot publishing is connected:
- Each published article route associates with deterministic cache tags via `getArticleCacheTags(slug, categorySlug, revisionId)`:
  - `scirad:articles:all`
  - `scirad:article:<slug>`
  - `scirad:category:<categorySlug>`
  - `scirad:sitemap`
  - `scirad:revision:<revisionId>`
- Incoming revalidation requests are validated by `validateRevalidationPayload(payload, authHeader, process.env.SCIRAD_REVALIDATION_SECRET)`:
  - Rejects requests if `SCIRAD_REVALIDATION_SECRET` is unset or shorter than 16 characters (fail-closed).
  - Requires exact `Bearer <SCIRAD_REVALIDATION_SECRET>` header match and `contractVersion: "1.0.0"` payload.

## 3. Non-Sensitive Diagnostics & Redaction (`createRedactedDiagnosticEvent`)

- All diagnostic events pass through `createRedactedDiagnosticEvent()`, which automatically scrubs keys matching `/(secret|token|password|authorization|cookie|api[-_]?key|credential|session)/i`, `Bearer ...` tokens, and sensitive URL query parameters (`?token=`, `?key=`, `?secret=`).

## 4. Rollback & Incident Response Procedure

1. **Immediate Indexing Kill-Switch:** Set `NEXT_PUBLIC_ENABLE_PRODUCTION_INDEXING="false"` and redeploy or restart; all pages immediately emit `noindex, nofollow, nocache`, `/robots.txt` switches to `Disallow: /`, and `/sitemap.xml` empties.
2. **Article Withdrawal / Revision Rollback:** Mark the snapshot `status: "withdrawn"` (with `withdrawnAt` and `withdrawalReason`) or restore the prior `revisionId` snapshot (`PublicationSnapshotV1`), then trigger tag revalidation for `scirad:article:<slug>` and `scirad:sitemap`.
3. **Third-Party Script Disablement:** Set `NEXT_PUBLIC_ENABLE_GOOGLE_SERVICES="false"` and `NEXT_PUBLIC_ENABLE_ADSENSE="false"` to immediately strip all external Google tags without code modification.
