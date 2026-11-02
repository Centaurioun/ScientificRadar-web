# ScientificRadar Web — Google AI Studio Complete Web-Side M1–M7 Mission

> **Owner-approved execution direction · 2026-11-03 · ScientificRadar Web ONLY**
>
> **For the Google AI Studio agent:** Read this ENTIRE file from the imported repository. Inspect the actual source and tests, then implement and verify the feasible **Web-owned** scope from M1 through M7 **in one substantive Google AI Studio run**, proceeding through the numbered delivery slices internally. Do not require another long chat prompt or separate owner confirmation for ordinary local Web work. Do not fabricate results or bypass the explicit production/credential approval gates below.
>
> **Short invocation after importing GitHub main:** "Read \`docs/ai-studio/SCIENTIFICRADAR_WEB_COMPLETE_M1_M7_MISSION_2026-11-03.md\` in full. Execute its Web-owned tasks and acceptance tests, preserve current design, report verified results and blockers; do not touch the Studio repository or deploy production."
>
> This is an **implementation mission, not evidence of implementation**. Merely importing this Markdown is not completing M1–M7.

## 0. Goal and unambiguous ownership

Improve the EXISTING reader-facing ScientificRadar Web application until it is robust, editorially faithful, SEO-capable, accessible and locally testable for later integration with ScientificRadar Studio. Preserve the existing owner-approved article presentation. Use the Web application as the **visual authority** for the future Studio preview. The two applications remain in separate GitHub repositories and separate Google AI Studio apps.

- **Web repository:** \`https://github.com/Centaurioun/ScientificRadar-web\`
- **Studio repository (context ONLY; do not write, import wholesale, synchronize or push here):** \`https://github.com/Centaurioun/scientificradar-studio\`
- **Central project:** \`https://github.com/users/Centaurioun/projects/3\`
- **Last known Web planning baseline at authoring:** \`e15d0b559fec18a124764de32fb8f40998c083f6\` (the merged roadmap PR #46); this is NOT a substitute for verifying the newly imported HEAD.
- **Primary existing contract:** \`docs/design/CONTENT_CONTRACT.md\`
- **Web style authority:** \`docs/design/DESIGN_TOKENS.md\`, \`docs/design/OWNER_VISUAL_BASELINE_AND_KNOWLEDGE_LINKS.md\`, current article components and tests.
- **M1–M7 planning documents:** \`docs/roadmap/*.md\`; use them as requirements and issue links, but distinguish proposed work from completed code.
- **Future Web→Studio reference-transfer procedure:** \`docs/ai-studio/WEB_TO_STUDIO_REFERENCE_EXPORT_BLUEPRINT_2026-11-03.md\`. Do NOT copy reference files into Studio yet.

### Ownership split

| Responsibility | This mission in Web | Later Studio mission | Later real cross-app integration |
|---|---|---|---|
| Reader-facing page, typography, figures, formulae, bibliography, TOC | Implement/verify | Use as preview visual target | Compare actual render parity |
| Public projection and versioned snapshot consumer | Implement/verify via deterministic fixture/mock adapter | Produce the compatible versioned payload | Authenticated transport, persistence, delivery, invalidation |
| Authoring editor, approvals, roles, source-of-truth manuscript store | Do NOT reimplement | Implement/verify | Enforce real server auth and integration |
| Metadata, indexing controls, sitemap, redirects | Web implementation and tests | Supply correct editorial fields | Verify public URL/data against publishing contract |
| Analytics, AdSense, ads.txt, consent | Web-side configurable capability, OFF by default | Settings/ownership UX | Real account configuration and compliance |
| Domain, live DB, DNS, provider credentials, public deployment | No live changes | No live changes | Separate, owner-authorized rollout |

**One Google AI Studio run does not mean one giant unverified edit.** Work internally through small, testable slices in the given order. Continue to the next feasible slice after recording a checkable result. If external accounts, current hosting choices or production secrets are needed, implement safe adapters/configuration and document the precise blocker; continue on independent local tasks.

## 1. Source-of-truth and baseline preflight — FIRST

1. Verify the loaded repository's Git remote, active branch/commit and project identity. Refuse to proceed if it is Studio, a different repo, an obsolete snapshot unintentionally overwriting newer commits, or a partial import missing core source.
2. Before coding, read, in order: this file; \`docs/design/CONTENT_CONTRACT.md\`; \`docs/design/DESIGN_TOKENS.md\`; \`docs/design/OWNER_VISUAL_BASELINE_AND_KNOWLEDGE_LINKS.md\`; \`docs/roadmap/SCIENTIFICRADAR_WEB_MASTER_ROADMAP.md\`; \`docs/roadmap/PUBLISHING_INTEGRATION_REQUIREMENTS.md\`; \`docs/roadmap/SEO_AND_LEGACY_MIGRATION_PLAN.md\`; \`docs/roadmap/GOOGLE_SERVICES_AND_ADSENSE_PLAN.md\`; \`docs/roadmap/PRODUCTION_RELEASE_GATES.md\`; actual source and tests.
3. Inspect \`app/\`, \`components/editorial/\`, \`components/site/\`, \`lib/content/\`, \`lib/design/\`, \`tests/e2e/\`, \`package.json\`, \`.github/workflows/\` and any later files now present. Read real source **before** declaring a feature absent. Prefer current tested code over stale audit descriptions.
4. Establish baseline checks (adjust only when package scripts actually differ): \`npm install --no-audit --no-fund\`; \`npm run lint\`; \`npm run typecheck\`; \`npm run test:unit\`; \`npm run build\`; \`npx playwright test\` after browser installation as needed. Separate genuine baseline failures from your changes. Do not claim a test passed unless executed and counted.
5. Record a scoped progress/verification report at \`docs/google-ai-reports/SCIENTIFICRADAR_WEB_M1_M7_EXECUTION_REPORT.md\`; create directory only if necessary. Include imported SHA, actual features, changed files, commands/results, limitations and GitHub sync status. Do not overwrite unrelated older reports.

**Current source facts to preserve, subject to revalidation:** Next.js App Router, React/TypeScript, Tailwind, DOMPurify-based HTML sanitizer, KaTeX rendering, a demo \`PublishedContentRepository\`, public \`PublicArticle\` types, scientific figures/tables/citations, single article H1, compact reader design, 700/600/560px reading measures, a responsive TOC, and responsive Playwright suite (historical 77 hosted tests). Neither existing fixture data nor historical CI proves public publishing integration.

## 2. Non-negotiable preservation and safety

- **Web is the visual source of truth.** Keep the currently accepted article page, editorial typography and original publication identity: Merriweather for editorial prose/headlines, Inter for UI, restrained teal/neutral palette, compact default story header, ~700px reading prose, ~880px title area, ~1100px wide figures and current responsive behavior. Do not redesign the magazine or replace it with a dashboard.
- **Scientific integrity:** preserve actual author/source attribution, numerals, units, Greek/Turkish/Unicode, equations, superscripts/subscripts, table structures, figure numbers/captions/credits/licences, citation anchors and bibliography semantics. Never invent DOI records, journal metadata, findings, funding, licences, copyright permissions or synthetic research as genuine content.
- **HTML and media security:** keep parser-based allowlist sanitization and URL/attribute restrictions. No regex-only trust gates; no executable HTML, JS URLs, unsafe remote image injection or raw untrusted \`dangerouslySetInnerHTML\`. Do not weaken existing regression tests merely to get a green run.
- **Public page semantics:** one rendered H1 = article title, article body headings only H2/H3. Draft, review, scheduled, withdrawn, archived and authenticated preview content must not leak into anonymous public listings, sitemap, metadata or search.
- **Stage separation:** existing Web content is a demo; existing Studio IndexedDB and client role switcher are NOT production sources. Do not create fake "Connected", "Published to live site", "AdSense approved", "GA4 tracking", or "Search Console indexed" claims.
- **No live changes:** no DNS, Cloudflare, existing PHP site, \`scientificradar.com\`, real data, credentials, Google accounts, consent vendor, paid services or live deployment. No production indexing activation. No changes to the Studio repo.
- **GitHub sync discipline:** AI Studio may push directly to Web \`main\`; before syncing confirm exact \`origin/main\` and that no competing writer changed it, preserve a recoverable commit and ensure local tests complete. A sandbox preview is not GitHub CI; report remote URL/SHA and CI separately. Never force push, reset away newer commits, or claim success without evidence.

## 3. Shared publication contract v1 — design now, live connection later (M1 issues #8–#12)

The Web **public presentation** is authoritative, but that does NOT mean copying \`PublicArticle\` as Studio's authoring database model. Studio retains an editable rich manuscript (currently Tiptap JSON + sanitized HTML and linked records); Web consumes a stable **versioned public projection**.

### Required invariants

- Article ID: immutable identifier, independent of title, URL slug and locale.
- Published revision: separate immutable ID/version with timestamp and audit provenance; explicit previous-revision recovery in the future server interface.
- Author/person IDs do NOT equal Studio login-account IDs. Keep author profiles and credentials independent from editorial roles.
- Public visibility: only a **server-confirmed published revision** may be served anonymously. \`demo\` is allowed only in isolated non-indexed demo mode. Do not pretend changing a UI status publishes remotely.
- Preserve \`locale\` (\`en\`/\`tr\`), canonical slug, article type, title, dek/summary, category/subcategory/tag slugs, featured media, scientific sources, figure rights and SEO fields. Do not infer approved bilingual paths or fabricate \`hreflang\` before URL policy is settled.
- Include stable media/source/block IDs and explicit reference mappings. No implicit "first author", orphan citations, synthetic DOI or silently removed unsupported nodes.
- The future boundary is a **versioned, authenticated server-side publishing API or equivalent verified service** delivering immutable public snapshots. Web must be able to consume it through a replaceable server adapter; the live service itself is NOT this mission's responsibility.
- Support deterministic input validation, schema-version rejection/compatibility, safe handling of malformed payloads and revision conflicts, idempotent publication receipts in the future contract (specified, not faked as already deployed).
- Media should use durable, rights-verified URLs or an injectable trusted media resolver at integration time; never use Studio browser \`blob:\`/IndexedDB object URLs as public production media.

### Crucial existing representation issue: HTML versus blocks

Current \`components/editorial/ArticleReader.tsx\` selects \`article.bodyHtml\` instead of the \`ArticleBlock[]\` renderer when HTML is present. Yet its TOC derives headings from \`article.blocks\`; in the HTML path some interactive figure/math/citation semantics need not be identical. This is a real compatibility gap to investigate and close without destroying existing working renderers.

**Implementation contract:** Choose and document **one canonical rich public-body representation for newly published Web snapshots**, plus derived TOC/media/source metadata. Preserve backwards compatibility with existing demo \`blocks\` records. When projecting \`bodyHtml\`, build the TOC from the canonical rendered HTML or its validated semantic outline—not an unrelated stale blocks list. Ensure published formulas use controlled KaTeX rendering, scientific figure/table semantics and citation back-links survive sanitization. If a Studio editor node cannot be represented without loss, fail validation with an actionable error rather than stripping it. No double rendering or security shortcuts.

### M1 deliverables in this Web repo

- [ ] A versioned public snapshot/contract and fixture with realistic **clearly labeled synthetic** rich scientific content (TR and EN), published/draft/withdrawn examples, real semantics and explicitly illustrative sources.
- [ ] Validating Web-side adapter/interface capable of consuming fixture snapshots without external endpoints; keep/demo-gate existing repository behavior and avoid a fake "production connected" state.
- [ ] Rich article renderer and public metadata remain faithful across supported HTML/structured content, with one source of truth for body/outline/citation relationships.
- [ ] Contract/unit/E2E tests for canonical rich text (emphasis, links, sub/superscript), equations, tables, figures/captions/rights, DOI/reference linking, language/Unicode, TOC, stable IDs, broken references, unsupported markup and nonpublic statuses.
- [ ] A documented exportable interface for the later Studio producer and cross-repo consumer contract tests. Document exact schema version and sample payload locations rather than inventing an endpoint or credentials.

Prefer coherent, focused modules under \`lib/content/\`. Do not introduce a new CMS, database, GraphQL framework or third-party network dependency solely for a demo adapter.

## 4. Technical SEO and indexability (M2 issues #13–#17)

Implement Web-side SEO behavior and locally verifiable tests while honoring the current demo/staging **noindex** policy.

- [ ] Central, deterministic metadata builder for homepage, article, topic, search, about and not-found contexts. Generate appropriate unique titles/descriptions, canonical when a verified host is configured, Open Graph and Twitter metadata; prevent duplicate/conflicting rendered meta tags, including the historical \`description\`, \`keywords\`, \`og:type\`, \`twitter:title\`, \`twitter:description\`.
- [ ] Route-aware robots policy. Search/query pages, all drafts/previews/fixture demos, unknown routes and staging must remain noindex as appropriate. Production indexability must be an **explicit approved environment gate** tied to a verified origin, never enabled by default in an AI Studio sandbox.
- [ ] Sitemap and robots infrastructure (\`app/sitemap.ts\`/\`app/robots.ts\` or verified framework-appropriate equivalents). Include only authorized public canonical, indexable pages on a confirmed production host; do not emit a credible-looking production sitemap from demo fixtures. No query-search URLs or staging URLs.
- [ ] Correct HTTP 404 for missing articles/categories and sensible server status handling for withdrawn content. Model 410 only when explicitly supported by the decided retirement policy; do not return 200/HTML "not found" soft 404s.
- [ ] Assess how English/Turkish locale variants and slugs are represented. Build a route-policy decision doc and tests for the agreed existing paths; only add reciprocal hreflang when real locale destinations are implemented and canonical.
- [ ] Verify **server-rendered HTTP response + DOM**, not solely admin SEO fields or React developer-console assumptions. Tests for duplicate metadata, noindex isolation, canonical targets and internal search exclusion.

Do not remove the current global \`noindex\` until production environment verification and owner release approval; adding configuration and unit tests is authorized, live indexing is not.

## 5. Legacy URL migration preparation (M3 issues #18, #20, #22)

Independent Web-side planning, tooling and **dry-run** validation may be completed. Actual old-to-new mapping requires dated production evidence and owner review.

- [ ] Define a structured, version-controlled redirect manifest format: source URL/path, verified destination, 301/308 choice, locale, source evidence, approval state, retirement policy and date.
- [ ] Implement deterministic validators/tests to catch duplicate source routes, redirect loops, chained redirects, accidental homepage fallbacks, unsafe cross-host targets, canonical conflicts and known search-query traps.
- [ ] Build a dry-run report for legacy PHP/article URLs, \`/amp\`, RSS and query-parameter forms. Populate only entries backed by actual legacy URL evidence. Missing GSC exports must be marked BLOCKED/UNKNOWN, not guessed.
- [ ] Prepare sitemap/redirect integration hooks for approved mappings. Do NOT enable mass redirects or modify the existing PHP site/DNS from this run.
- [ ] Keep historical Search Console counts (34 alternative canonicals, 15 soft 404, 4 5xx) labeled historical, not verified present-day statistics.

## 6. Google services, AdSense, analytics and privacy — Web portion (M4 issues #24, #26, #28)

Implement optional, centralized, **disabled-by-default** Web modules; no account-level or live-site actions.

- [ ] Central typed, environment-gated configuration for public GA4 measurement ID, consent settings, AdSense client ID and public site verification, with no secrets in client bundles. Strictly separate Google Ads campaign features from AdSense monetization.
- [ ] GA4 script/event integration supporting once-only loading, route transitions where necessary, no duplicate page views and consent-sensitive activation according to the approved privacy model. If legal/consent policy is not approved, keep it disabled and document the decision.
- [ ] AdSense script integration with one loader, configurable eligible placement surfaces, layout-stability safeguards and a disabled/offline mode. No auto-generated ad clicks, policy bypass, hidden ad requests, fake approval claims or unapproved live advertising.
- [ ] Root \`/ads.txt\` delivery mechanism with authorized, config-driven records and tests for exact plain-text response, status and content type. Historical publisher record \`google.com, pub-8558636886209631, DIRECT, f08c47fec0942fa0\` is **evidence to validate**, not automatic permission to publish it unchanged. Only enable with verified account/domain ownership.
- [ ] Search Console site ownership verification capability (non-secret supported method), and honest configuration/status display or documentation. An installed verification tag does not equal accepted ownership or search indexing.
- [ ] Document consent/accessibility/performance implications; avoid implementing a deceptive consent banner or interpreting unsupported consent choices as valid. When policy/provider choice remains unresolved, provide disabled integration adapters and clear follow-up steps.
- [ ] Unit/E2E checks for duplicate scripts, disabled-state behavior, route gating, consent refusal and \`ads.txt\` output.

Never initiate AdSense review or assert approval, account compliance, monetization revenue or tracking effectiveness.

## 7. Web-side infrastructure and operational readiness (M5 issues #30, #32, #34)

- [ ] Verify actual app runtime assumptions (Next.js dynamic/server behavior, \`generateMetadata\`, search, sitemap, caching, images) against present source and current package versions. Do not pick Vercel, Cloudflare, Firebase or another provider just from a dev dependency.
- [ ] Define env schema and \`.env.example\` containing only placeholders; fail closed for unsupported production modes. Client-accessible configuration must contain only intended public IDs; publishing credentials are server-side only and NOT provisioned here.
- [ ] Improve dependency reproducibility **only after assessing the existing package manager setup**. Existing Web CI uses \`npm install\` because no lockfile was committed. If generating a lockfile, verify stable install and align CI accordingly, without broad version upgrades.
- [ ] Design safe server cache/update behavior for future published revisions, explicit invalidation contract and no stale authorized/withdrawn content. Keep a fixture adapter until actual backend is approved.
- [ ] Add non-sensitive error reporting and runtime diagnostics hooks with no sensitive content logs; prepare observability/backup/rollback runbooks without pretending an external service exists.
- [ ] No live provider account/project creation, DNS, Cloudflare changes, storage bucket, database, paid integrations, secrets or deployment.

## 8. Quality, accessibility, regression and security (M6 issues #36, #38, #40)

Preserve existing web app behavior and **all previously passing Playwright scenarios**. Extending test coverage must not erase 77 existing passing hosted checks; if test counts legitimately change, explain why and verify the new total on actual code.

- [ ] Lint, TypeScript, unit tests, production build and real Chromium Playwright E2E on the final combined sandbox tree.
- [ ] New contract tests: invalid schema, nonpublic visibility, rich content preservation, sanitization, Unicode, figure layout, citation/DOI integrity and TOC.
- [ ] New SEO tests: rendered metadata uniqueness, robots, sitemap, canonical, redirects, missing/withdrawn route status.
- [ ] New integrations tests: GA4/AdSense default disabled, no duplicates, consent gate, authorized ads.txt output.
- [ ] Accessibility: visible focus, responsive menu/TOC keyboard operation, semantics, heading order, skip link, table captions, figure alternate text, representative screen reader manual review checklist.
- [ ] Performance: evaluate representative long-form pages, large tables/math/figures, web font loading and layout shift on mobile/desktop. Report measured context and limitations; never invent Core Web Vitals field data or thresholds.
- [ ] Security: XSS payload regression, href/src allowlist, unsafe inline SVG, code/HTML source rendering, staging noindex and no leaked server credentials.
- [ ] Produce a concise test matrix identifying exact test files, commands, outcomes and unresolved external-only scenarios.

Do not silently skip expensive tests or downgrade asserted behavior. If the AI Studio environment cannot run Playwright or full build, label the tests UNVERIFIED and provide reproducible commands; do not write "77/77 pass" from an old CI run as a current claim.

## 9. Controlled launch readiness — local work ONLY (M7 issues #42, #44)

- [ ] Add a Web-specific release-readiness checklist: domain and staging verification, public content and author rights, preview isolation, metadata/robots, sitemap, legacy redirect map, 404/410, performance, responsive/accessibility, GA4/AdSense/privacy, incident owner, rollbacks, restore procedures and post-launch Search Console monitoring.
- [ ] Provide staging smoke scripts/checklists that are safe to run locally with fixtures and future environment placeholders.
- [ ] Define a preflight that **blocks live launch** when production domain, storage, publishing auth/API, legacy mapping or Google-policy approvals remain unresolved.
- [ ] Do not deploy to \`scientificradar.com\`, change the legacy site or request account reviews. The owner will authorize real rollout separately after Studio–Web integration and verification.

## 10. Execution slices and acceptance gates — complete all feasible slices in THIS ONE RUN

Avoid one massive rewrite. Execute the following sequence with targeted tests for each:

1. **Baseline & source reconciliation:** imported HEAD, read actual code/docs, run available baseline tests; record blockers.
2. **Contract and rich-reader compatibility (M1):** versioned snapshot contract, fixture adapter, TOC/HTML/blocks fidelity and tests; retain existing Web article visual identity.
3. **SEO and migration foundations (M2–M3):** metadata builder, robots/sitemap safeguards, real 404, redirect manifest validation and focused tests.
4. **Optional Google integrations (M4):** centralized env-driven, default-OFF Analytics/AdSense/ads.txt and appropriate consent gating/tests; never use live accounts.
5. **Operational readiness (M5):** env schema, reproducible install if safe, config/security/caching/runbooks.
6. **Full QA (M6):** rerun unit/lint/type/build/Playwright and new semantic tests on the final tree. Verify both 320/390px and larger viewports without arbitrary redesign.
7. **Launch gate documentation (M7):** operational checklist, residual risks and no-production-deploy confirmation.
8. **Report and sync:** write \`docs/google-ai-reports/SCIENTIFICRADAR_WEB_M1_M7_EXECUTION_REPORT.md\`, record exact source commit, file diff, test outcomes, unresolved items per issue, any exported/pushed HEAD and GitHub CI links ONLY if actually verified.

After each slice, verify the changed surface before proceeding. Complete all locally feasible independent work without requiring a new owner prompt at every slice. If an external dependency is impossible to configure without permission/credentials, isolate it and proceed with other slices; never replace real work with a fake completed UI. Tasks that cannot be validated in this session remain explicitly OPEN/UNVERIFIED.

### Required deliverables

- Functioning Web application preserving existing reader-first design and all existing public routes.
- Verified rich scientific article rendering and versioned fixture-driven public contract.
- Tested Web SEO/indexability/redirect foundations, correctly gated by environment.
- Disabled-by-default Web Google services adapters (no unauthorized network calls).
- Web runtime configuration, quality gates and release runbook.
- Execution report with exact evidence, commands, limitations, source revision, GitHub sync status.
- A clearly identified **reference-export candidate revision** for the subsequent Studio task. Do not export or copy a final Web→Studio source bundle before final Web code/CI evidence has been reviewed.

## 11. Future Studio reference bundle handoff — NOT a Web implementation shortcut

**AFTER** this Web scope has passed agreed final verification, an independent controlled transfer will copy selected source into \`scientificradar-studio/docs/references/scientificradar-web/\` as **read-only text**:

- \`ArticleReader.tsx\` → \`ArticleReader.tsx.txt\`
- \`ArticleHeader.tsx\` → \`ArticleHeader.tsx.txt\`
- \`types.ts\` → \`types.ts.txt\`
- \`globals.css\` → \`globals.css.txt\`
- Other actual reader, figure, citations, styles, sanitizer, tokens, example JSON, acceptance tests and screenshots selected from a **pinned final commit**.

Add \`SOURCE_MANIFEST.md\` (source repo, exact SHA, paths, purpose, checksums/selection and dependencies), \`README.md\` (reading order and no-copy restrictions), examples and representative screenshots. \`.tsx.txt\`/\`.ts.txt\`/\`.css.txt\` are deliberately non-compiling reference files. Never put raw \`.tsx\`/\`.ts\` in Studio's docs where its \`tsconfig.json\` includes \`**/*.ts\`/\`**/*.tsx\`.

**Future Studio target:** reproduce the *Web reader's actual output* in Studio's preview without overwriting the CMS editor/persistence, while exporting a compatible published document representation. This is not authorization to import Web's Next.js page/app shell into Studio directly. Refer to \`WEB_TO_STUDIO_REFERENCE_EXPORT_BLUEPRINT_2026-11-03.md\`.

## 12. Six-cycle self-review and final evidence matrix

Before concluding, perform six distinct, brief self-review passes; record resulting fixes, not six cosmetic claims:

1. **Source truth:** no implemented feature marked missing; no stale audit presented as present evidence.
2. **Scientific fidelity:** real content preserved across the rich body, citations, math, figures, media and translations.
3. **Security and privacy:** no public draft leak, XSS, secrets, fake consent or unsafe Google script state.
4. **SEO/migration:** correct rendering, noindex gate, canonical/robots/sitemap, redirects/404 evidence and no invented GSC metrics.
5. **Integration readiness:** Web/Studio responsibilities separated, public contract version explicit, fixtures and validation testable.
6. **Final deliverability:** tests and changes verified, CI clearly distinguished, report accurate, code export reversible, future reference-export pin recorded.

Final report must contain a table for every milestone M1–M7 with columns **Web-owned implemented**, **verified tests**, **blocked/pending external integration**, **relevant files**, and **related GitHub issue(s)**. Do not automatically close whole milestones because only Web-side work completed. Do not merge or deploy on behalf of the owner outside the established AI Studio sync workflow.

**Stop only after completing all feasible local Web-owned slices, or an honest documented platform blocker. Do not ask the user to supply API secrets or connect paid services to keep local work moving.**
