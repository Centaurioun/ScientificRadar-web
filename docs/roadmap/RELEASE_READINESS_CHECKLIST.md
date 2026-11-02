# ScientificRadar Web — Controlled Launch Readiness Checklist & Preflight Gates (M7)

Evaluated programmatically by `evaluateProductionLaunchReadiness()` in `lib/config/launch-preflight.ts`.

## 1. Web-Owned Technical Gates (Verified in Repository)

- [x] **G1 — SEO Metadata, Sitemap & Robots Gate (`lib/seo/*`, `app/robots.ts`, `app/sitemap.ts`):**
  - Single deterministic metadata builder per route (`buildPageMetadata`).
  - Zero duplicate `<meta name="description">`, `og:type`, `twitter:title`, or `twitter:description` tags.
  - Safe `noindex, nofollow, nocache` default on all routes in Stage A; `/search` and `404` permanently `noindex`.
  - Legacy redirect manifest validator (`validateRedirectManifest`) blocks loops, chains, homepage fallbacks, and search traps.
- [x] **G2 — Publication Contract v1 & Reader Parity (`lib/content/contract-v1.ts`, `components/editorial/ArticleReader.tsx`):**
  - `PUBLICATION_CONTRACT_VERSION = "1.0.0"` schema, validator, and adapter supporting `en`/`tr` locales, immutable `articleId`/`revisionId`, and `draft`/`withdrawn` exclusion.
  - Unified TOC extraction (`resolveArticleHeadings`), KaTeX math (`output: "htmlAndMathml"`, `trust: false`), and citation back-links across both `blocks` and `bodyHtml` representations.
- [x] **G3 — Security & Sanitization Gate (`lib/content/sanitizer.ts`, `lib/config/diagnostics.ts`):**
  - Parser-based DOMPurify allowlist, inner `H1 -> H2` demotion, `blob:`/`data:`/`javascript:` URL rejection, and diagnostic log redaction.
- [x] **G4 — Accessibility & Responsive UX Gate (`tests/e2e/*`):**
  - Single `<h1>` per page, keyboard navigation (`Enter`, `Space`, `Escape` with focus return), and zero horizontal overflow across `1440×900`, `1024×768`, `768×1024`, `390×844`, and `320×700`.
- [x] **G5 — Environment Schema & Google Services Gate (`lib/config/env.ts`, `lib/integrations/google-services.ts`, `app/ads.txt/route.ts`):**
  - Fail-closed environment validation; GA4 and AdSense disabled by default; consent-gated and deduplicated script descriptors; `/ads.txt` plain-text route handler.

## 2. External Operational Dependencies (Currently `BLOCKED` — Do Not Bypass)

- [ ] **G6 — Studio -> Web Server Publishing Pipeline (`BLOCKED`):**
  - `ScientificRadar Studio` currently uses browser-local `IndexedDB` persistence (`b160accd89c8d24b9e5b726e70158d73cc2176d1`). A server-authenticated publishing API or artifact pipeline must be provisioned and connected before switching `SCIRAD_CONTENT_ADAPTER` to `"published-snapshots"`.
- [ ] **G7 — Production Domain, Hosting & Search Console Legacy Exports (`BLOCKED`):**
  - Production DNS/hosting (`scientificradar.com`), live Search Console ownership verification, and dated CSV exports for the historical coverage counts (34 canonical alternates, 15 Soft 404s, 4 5xx URLs) must be supplied by the owner.
- [ ] **G8 — Explicit Owner Launch Approval (`BLOCKED`):**
  - Final owner sign-off is required before enabling `NEXT_PUBLIC_ENABLE_PRODUCTION_INDEXING="true"` or deploying to production.
