# ScientificRadar Web — Development Roadmap & Production Launch

**Status:** Planning baseline, 2026-11-03. No product or infrastructure decision is approved by this document.

## Verified baseline

- Web `main` at review: `834deadead45ec5d1a87eed398e440582add2c6c`.
- Original local Web checkout: `/Users/yusuf/Repos/ScientificRadar-web`, `main` at `41a73b49f69c1310eca819d1ad2cdb1c712da89a`, dirty and 32 commits behind the verified `origin/main` SHA above. Its `.gitignore` has an uncommitted modification and several untracked paths (`.agents/`, `.ignore`, `PROJECT.md`, `test-results/`); these were preserved. The local and remote `.gitignore` differ, so fast-forwarding this checkout is unsafe until the local edit is reviewed and resolved. A detached clean worktree at the remote SHA was used for authoritative inspection and planning.
- Next.js 15 App Router; routes: `/`, `/about`, `/search`, `/topics`, `/topics/[slug]`, `/article/[slug]` (`app/`).
- Public content currently comes from in-memory demo fixtures (`lib/content/repository.ts`, `lib/content/fixtures.ts`). Draft articles are excluded. The content contract calls the future Studio adapter Stage C (`docs/design/CONTENT_CONTRACT.md`).
- Article schema covers authors, categories, tags, media credits and rights, citations/DOI, math, tables, locale (`lib/content/types.ts`); this proves model support in Web, not a live Studio transfer.
- Search is server-rendered and query-string driven. Search metadata sets `noindex`; global metadata also sets `noindex` (`app/search/page.tsx`, `app/layout.tsx`).
- Existing checks include unit tests, build, and Playwright workflows (`package.json`, `.github/workflows/`). The repository has no committed package lock; CI currently runs `npm install`.
- Web audit documentation records the Stage A demo and historical browser checks (`docs/WEBSITE_BUILD_AUDIT.md`, `docs/qa/SCIENTIFICRADAR_WEB_PR1_ACCEPTANCE_REPORT.md`). Historical checks do not establish current production readiness.
- Studio remote `main` is `b160accd89c8d24b9e5b726e70158d73cc2176d1`, verified with `git ls-remote` and inspected in a detached clean worktree. The local Studio checkout remains dirty and 83 commits behind and was not used as authoritative evidence.
- Studio `main` includes a substantial client-side editorial prototype: CKEditor/Tiptap article editing; IndexedDB persistence with an in-memory fallback; editorial status transitions, review queue, scheduling UI, revision snapshots/restoration; SEO & Editorial Quality Center and Pre-Publish Quality Gate; SEO title/description/canonical fields; and structured media/figures, sources/citations, tables, and LaTeX support. These features are application-local: the UI labels publication as local demo only, role checks are simulated in the client, media uses local IndexedDB/Object URL/SVG storage, and integration checks report no credentials or external endpoints configured. No public publishing API, server RBAC, external storage adapter, or production Studio–Web publishing integration is verified at this SHA. See `docs/roadmap/PUBLISHING_INTEGRATION_REQUIREMENTS.md` for the evidence inventory.
- No analytics, advertising, sitemap, or robots route/config file appeared in the Web source inventory at this baseline. Recheck on the implementation branch before filing a specific fix.

## Milestones and linked issue backlog

The live, repository-linked GitHub Project and milestone issue list are the source of execution status:

- M0 — Repository Baseline & Project Governance: [issues](https://github.com/Centaurioun/ScientificRadar-web/issues?q=milestone%3A%22M0+Repository+Baseline+%26+Project+Governance%22)
- M1 — Production Architecture & Publishing Contract: [issues](https://github.com/Centaurioun/ScientificRadar-web/issues?q=milestone%3A%22M1+Production+Architecture+%26+Publishing+Contract%22)
- M2 — Technical SEO & Metadata Infrastructure: [issues](https://github.com/Centaurioun/ScientificRadar-web/issues?q=milestone%3A%22M2+Technical+SEO+%26+Metadata+Infrastructure%22)
- M3 — Legacy Website Migration & Search Preservation: [issues](https://github.com/Centaurioun/ScientificRadar-web/issues?q=milestone%3A%22M3+Legacy+Website+Migration+%26+Search+Preservation%22)
- M4 — Google Services, Monetization & Privacy: [issues](https://github.com/Centaurioun/ScientificRadar-web/issues?q=milestone%3A%22M4+Google+Services%2C+Monetization+%26+Privacy%22)
- M5 — Production Infrastructure & Operational Security: [issues](https://github.com/Centaurioun/ScientificRadar-web/issues?q=milestone%3A%22M5+Production+Infrastructure+%26+Operational+Security%22)
- M6 — Comprehensive QA & Release Readiness: [issues](https://github.com/Centaurioun/ScientificRadar-web/issues?q=milestone%3A%22M6+Comprehensive+QA+%26+Release+Readiness%22)
- M7 — Controlled Production Launch & Monitoring: [issues](https://github.com/Centaurioun/ScientificRadar-web/issues?q=milestone%3A%22M7+Controlled+Production+Launch+%26+Monitoring%22)

All initial work is Proposed / Needs Decision until the owner’s strategy session resolves relevant choices. No target dates are set. Do not turn the historical 77 E2E figure or Search Console counts into current acceptance criteria without fresh evidence.

## Sequence

M0 establishes evidence and governance. M1 identifies architecture alternatives and the publication contract. M2/M3 specify public URL, metadata, and migration behavior. M4/M5 keep Google services and hosting decisions separate. M6 defines context-specific release evidence; M7 executes a controlled launch only after owner approval.

## Discussion order

1. Decide the publishing ownership boundary and article transfer contract between Studio and Web.
2. Establish current production domain, hosting, and legacy URL/Search Console evidence.
3. Decide intended indexing and monetization posture, consent requirements, and release acceptance context.
