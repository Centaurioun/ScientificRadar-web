# ScientificRadar Article Reader & Studio CMS — Historical Design Audit and Current Handoff

**Reviewed:** 2026-11-08  
**Scope:** Connected Framer source and four static reader + four CMS screenshots; GitHub `main` from both ScientificRadar repositories; Nature Astronomy article and NASA SVS image attribution; PR #54 docs branch.  
**Historical audit disposition (before the combined implementation work):** design and Framer review only; not evidence of production readiness. The owner subsequently authorized implementation and cross-application validation through the combined PRs #31 and #58. See the current status addendum at the top of this document.

## Current status addendum — 2026-11-08

- Studio PR #31 candidate head: `b8ecce006f8cbb75f130f8bd5c6aa781741bd4ce` (latest GitHub checks passed).
- Web application head exercised in the cross-app test: `8583ede2648d47be963dbf7c863cf716343b9d28`. Exact current PR #58 head: `9d6f0d79dfffc8cdb62330eebe02d0adf2d4c508`, a test-harness-only follow-up that isolates the empty-catalog spec.
- The two repositories remain separate. These are combined implementation candidates; do not treat this documentation PR or the historical Framer proposals as application-code authority.
- Cross-repository local E2E passed 1/1 on Studio `b8ecce006f8cbb75f130f8bd5c6aa781741bd4ce` plus Web `8583ede2648d47be963dbf7c863cf716343b9d28` using temporary SQLite and real HTTP: save/reload/recovery, role-separated review and approval, publish, Web server-rendered article/search/topic/home/sitemap, withdrawal exclusion, restoration visibility, and confirmation that public responses exclude private `editorDraft` data. Web `9d6f0d7` changes only the Playwright/CI harness, not the application code exercised in this lifecycle.
- Web checks on Node.js 24.22.2: clean `npm ci`; ESLint, TypeScript, 64/64 unit tests and Next.js 16.4.5 production build passed; `npm audit` reported 0 vulnerabilities. With the local harness follow-up, the standard Playwright suite passed 98 tests with the dedicated regression skipped, and the isolated published-catalog test passed 1/1.
- Web used Node 24 `next dev` in `stage-a-demo` for the local cross-app lifecycle because production mode requires a verified HTTPS origin and rejects the test’s loopback HTTP. Web production build and smoke tests passed separately. This does not establish HTTPS deployment or live-server acceptance.
- GitHub Studio #31 checks passed on `b8ecce0`. GitHub Web #58 checks passed on exact head `9d6f0d7`: both responsive Playwright jobs, quality and GitGuardian security checks are green. The earlier `8583ede` run had failed responsive jobs because the empty-catalog regression ran against demo fixtures; `9d6f0d7` isolates it under a published-snapshot server configuration.
- The prior sections below preserve the design/Framer audit chronology. Findings marked historical are superseded by this addendum where noted; preserve the Framer source captures, owner decisions, QA observations and design references as historical evidence.

## 0. Project boundary recorded by the historical audit

The historical audit recorded two separate repositories, which remain the owner’s architecture decision:
- `Centaurioun/ScientificRadar-web`: Next.js public scientific magazine and reader.
- `Centaurioun/scientificradar-studio`: admin CMS for articles, KnowledgeLink, ScientificSource, Series, media, and a versioned publication snapshot producer.

Their integration is an **editorial publication contract** (Studio producer → Web consumer), not a shared ad hoc Framer/JSX file. The Framer CMS template lab remains *not* integrated, saved, authenticated or deployed. PR #54 is documentation only; the application implementation is in PRs #31 and #58.

## 1. Current Framer targets and reproducible snapshots

**Reader:** `/bennu-related-reading-design-lab` node `t6PbsTds_`, component `BennuRelatedReadingConcept.tsx` / export `codeFile/ADnxWxr:default`.  
**Studio UX proposal:** `/article-cms-template-lab` node `Kr4RQUn1q`, `ArticleCMSDesignLab.tsx` / `codeFile/P0Vi6VZ:default`.  
**Historical approved A:** `/bennu-presolar-stardust` node `W1F5b_kMS`, `BennuPresolarEditorial.tsx` / `codeFile/Xi1YsKp:default`. Its scientific prose has older values/denominators; use updated reader lab and primary paper for factual verification.

All three Framer pages remain `visible=false`, `noIndex=true`, `noIndexSite=true`. The two current components have four breakpoints each (1200, 810, 390, 320) pointing to their respective single export. **Exact Framer source snapshots** were committed as inert `.tsx.txt` files under `docs/public-website/framer-reference/`; no Next/TypeScript compilation scope was changed.

Visual screenshots captured *after* the fixes:
| Step | Screenshot | What it supports |
| --- | --- | --- |
| Reader desktop 1200 | https://framerusercontent.com/screenshots/on-demand/727da567-8ee9-4f77-acb3-ea6add3bfb61.jpg | Hero, TOC, At a Glance, NASA Figure 2, table, bibliography and Related Reading visually render |
| Reader mobile 390 | https://framerusercontent.com/screenshots/on-demand/0fb1a378-b3c8-4c1e-a74c-2af48c6d65f1.jpg | Compact typography, inline concepts, mobile table affordance and carousel partial next tile |
| Reader narrow 320 | https://framerusercontent.com/screenshots/on-demand/6d199951-b013-4530-9dfc-dcb27db6b843.jpg | Additional constrained layout; **not** a DOM overflow measurement |
| CMS desktop 1200 | https://framerusercontent.com/screenshots/on-demand/942056a9-4522-4059-a16c-4b8907e9ed4f.jpg | Field/preview layout and explicit not-connected label |
| CMS mobile 390 | https://framerusercontent.com/screenshots/on-demand/0cf45a4e-dd16-4b14-a94e-8c93c4b9b5fc.jpg | Stacked responsive editor/preview, no visibly clipped headline |

Screenshots show only the initial scroll/tab state. They do **not** establish a pass for sticky rail behavior at isotope/petrography sections or for CMS form mutations.

## 2. Confirmed improvements applied during this independent audit

| Issue / risk | Scope | Fix | Verification |
| --- | --- | --- | --- |
| Multiple Key Concepts could be assigned to the **same H2 section** in CMS prototype | P2 *authoring integrity risk* | Guarded `changeConcept` against duplicate anchors; disabled H2 options already assigned elsewhere, preserving existing selection | Framer `files.write` diagnostics `[]`; code inspection. **Real form clicks not retested** |
| Scrollspy recalculated all H2 rectangles and set React active state on every raw scroll event | P3 performance/UX risk | One `requestAnimationFrame`-throttled scroll/resize computation, previous-state check, proper cleanup | Framer diagnostics `[]`; code inspection, static screenshot. **No INP/CLS claim** |
| NASA Figure 2 credits did not follow official SVS wording | P2 **scientific provenance** issue | Caption and enlarged-image credit now explicitly say NASA's Scientific Visualization Studio; data NASA/University of Arizona/CSA/York University/MDA; visualization by Kel Elkins | Verified against NASA SVS item 4857 credits (2020); caption visibly rendered |
| Mobile table had horizontally hidden columns without a clear visual cue | P3 discoverability risk | Added visible `Scroll sideways to view all columns →` on narrow widths; only table region, not page, is scrollable | Rendered on screenshot 390; actual touch/keyboard scrolling **not tested** |
| Unused old `isotopeVisual` JSX persisted after design simplification | P3 maintainability | Removed dead React element (legacy CSS still present and can be cleaned in Web implementation) | Source inspection; no build diagnostics |

No material redesign, editorial source replacement, publishing or app-code changes.

## 3. Verified scientific/source facts (selective audit)

The publisher article DOI `10.1038/s41550-025-02688-3` states: angular particles' SiC `55 (+12/−10) ppm`; combined analyzed sample matrices and clasts `45 (+7/−6) ppm`; angular O-rich grain abundance `2 (+4/−1) ppm`; most other matrices/clasts excluding S-rich clasts 1–3 `4±2 ppm`; three S-rich clasts O-rich mean `87 (+26/−20) ppm`. `72%` concerns all 25 O-rich grains across three analyzed particles, while `75%` refers to the hummocky sample's O-rich subset. The current lab copy/table preserves this distinction. This is **not** full scientific/peer review of every editorial sentence, every figure pixel, or supplementary material.

Figure 1 is based on the publisher research image; its actual image-specific license/third-party rights remain a release check. **Figure 2** is NASA SVS item 4857, a Bennu 3D visualization derived from OSIRIS-REx imagery and 20 cm altimetry. It is contextual, **not** the laboratory sample micrograph. Source: https://svs.gsfc.nasa.gov/4857/. An additional decorative watermark references that NASA visual; all asset credits, rights and hosting policy must be validated before Web release.

DOI correction `10.1038/s41550-026-02811-y` is a separate bibliographic item, not an editorial article DOI. Do not confuse original scholarly authors with ScientificRadar editorial authors.

## 4. Six-cycle independent design/architecture critique

1. **Inventory:** Web already has `ArticleHeader`, `ArticleReader`, `CitationList`, `CitationInteractions`, `RelatedStories` and `PublicArticle`. Studio already has article/type/taxonomy/series/sources/media and KnowledgeLink records. **Do not rebuild/redefine duplicate systems.**
2. **Information architecture:** One At a Glance, one optional source-status disclosure, contextual 0–3 short Key Concepts, Sources, and conditional Related Reading are coherent. Avoid forcing unrelated topic links or duplicate source summaries.
3. **Science and provenance:** Correct subgroup denominators, source DOI vs editorial title, Author Correction, figure rights, DOI validation and license manifests are all release gates. Add robust media/source records rather than placing arbitrary reference HTML in article body.
4. **Interaction:** Existing code illustrates mobile TOC menu-close→layout-commit→scroll, anchored portal hover, figure modal, table-region scroll and Related Reading snap-carousel. Source inspection found opportunities, but **real hover/keyboard/Escape/touch/hash/Back/scroll transitions remain BLOCKED** in this review.
5. **CMS ownership:** Global reader handles typography, alignment, sticky navigation, carousel, popover and responsive behavior. Studio editor controls per-article H2-linked short concept list, vetted media and source records, taxonomy, byline, series and editorial relations. The in-memory Framer CMS is not a persistence layer.
6. **Whole-page review:** Four reader widths and CMS 1200/390 examined. Current 320/390 page is long but structurally understandable; scientific figures and table require careful mobile content review. **Never assume visual screenshot equals actual DOM overflow PASS.** No confirmed P1/P2 user-visible failure was observed in captured *static states*, but that is narrower than a QA certificate.

## 5. Historical blocker assessment and current disposition

| Historical finding from the design-only baseline | Current disposition at the candidate heads above |
| --- | --- | --- |
| “Studio → Web integration absent” | Superseded: local cross-app lifecycle passed 1/1 on Studio #31 `b8ecce0` and Web #58 `8583ede`; see addendum. Framer itself remains disconnected. | Do not use this historical row as a current blocker. |
| “Public related IDs are empty” | Superseded: Studio Article has editable `relatedIds`; the V1 serializer copies it. Web resolves explicit relations only from its active public catalog, then same-series/category candidates. | No `relatedIds: []` hard-code remains in the verified candidate source. |
| DOI detail and media rights | Source volume/issue/pages/article-number fields and rights evidence are represented in the current candidate contract. The local lifecycle is not exhaustive rights/legal review. | Preserve per-asset rights verification and verify real licensed materials before public release. |
| Framer interactions and visual states | Historical Framer screenshots/source checks cover static states only; they do not prove real mouse, keyboard, touch, modal, hash/Back, performance or device behavior. | Keep these as unverified Framer design-reference observations; they are separate from the local publication lifecycle result. |
| CMS authoring integrity | Candidate Studio implements Key Concepts and relation fields; V1 validates/serializes them. | Verify current publish validation and actual edits in the app-specific hosted suites; do not infer all edge cases from the lifecycle run. |
| Horizontal scroll, focus and responsiveness | Historical screenshots alone remain insufficient for DOM/assistive-technology claims. Web’s existing/updated Playwright suites passed, but do not claim they cover every proposed Framer transition. | Keep scope-specific test claims separate. |
| Demo cards in Framer Related Reading | Historical Framer mock contains illustrative sample content; Web resolves candidates against currently public articles. | Do not treat Framer sample cards as published articles. |
| Reference component size, breakpoints and telemetry | Framer-specific maintainability and layout observations; live LCP/INP/CLS/network telemetry remains unmeasured. | Keep as design/performance follow-up evidence, not an application release failure proven by this audit. |

**Special source warning:** The earlier `BennuPresolarEditorial.tsx` Framer snapshot is kept for baseline comparison only. Do **not** use its old numerical phrasing when drafting scholarly claims. The newer `BennuRelatedReadingConcept.tsx` lab contains the corrected sample-specific expressions.

## 6. Historical Codex investigation plan (superseded)

This was the pre-implementation proposal. The owner’s later execution directive superseded its read-only and approval-gate framing; PRs #31 and #58 now contain the authorized application work. The tasks remain as chronology only, not a current action queue.

**C0 (READ-ONLY first):** Read this audit and `framer-reference/README.md` plus both contracts, inspect both repos at latest main and current PR #54. Report any drift, conflicts and unverified assumptions before recommending code changes. Do not trust old M1/M2/M3 label defaults over current owner decisions.

**C1 (real Framer QA):** With actual Brave preview on current node `t6PbsTds_`, test 320×568, 390×667, 810 and 1200 (plus 1280): mobile first/middle/last TOC target top and `aria-current`; desktop isotope→petrography→end rail transitions and hidden state; keyboard/tab/scrollspy, Knowledge popover Wikipedia HTTPS & Escape/focus, Figure 1/2 backdrop vs interior, DOI navigation, Back/hash, table keyboard scroll and carousel 6-card progression. Explicit PASS/FAIL/BLOCKED with DOM values and screenshots. Repeat CMS concept add/remove/duplicate-anchor validation.

**C2 (source, science and legal review):** Compare figure 1 to corrected publisher original, verify NASA credit and image rights/remote hosting policy, test real DOI destinations and correction text, review numeric subgroup precision. No fake citations or editorial peer-review claims.

**C3 (historical contract plan):** The old proposal suggested additional Article Insights fields and a v1→vNext transition before current schemas were inspected. The candidates now carry `keyConcepts`, `relatedIds`, `seriesId`, notices and optional source/rights metadata in V1; a VNext transition is not part of the current contract or required by this verification.

**C4 (historical approval gate):** This proposal anticipated new owner approval. The owner subsequently authorized the combined implementation PRs #31 and #58 and the local cross-app tests recorded above. Do not treat this old gate as current.

**Historical authorization note:** At the time this audit was drafted, the work was limited to Framer design and documentation QA. The owner’s later execution directive superseded that boundary and authorized the current application implementation and validation in PRs #31 and #58.

## 7. PR and visual references

- Web docs draft PR: https://github.com/Centaurioun/ScientificRadar-web/pull/54
- Studio CMS docs draft PR: https://github.com/Centaurioun/scientificradar-studio/pull/28
- Current Framer reader: https://framer.com/projects/Scientific-Radar--boKLyC3EXgf7Nhs9yoC7-3fySI?node=t6PbsTds_&view=preview
- Current Framer CMS UX mock: https://framer.com/projects/Scientific-Radar--boKLyC3EXgf7Nhs9yoC7-3fySI?node=Kr4RQUn1q&view=preview
- Canonical design: `ARTICLE_READER_DESIGN_SYSTEM.md`
- CMS/publication model: `ARTICLE_READER_CMS_EDITORIAL_CONTRACT.md`
- Exact Framer source snapshots: `framer-reference/README.md`

**Historical handoff boundary:** Do not treat this old Framer handoff as authorization to publish Framer or deploy to production. It does not supersede the owner’s later authorization for ordinary reviewed merges of PRs #31 and #58 after the required checks pass.

## 8. Historical handoff verification snapshot — 2026-11-07

- Re-read **all four** current Framer source files and independently retrieved the four committed `.tsx.txt` snapshots: **character-for-character identical** (current unified reader 63,848 chars; CMS mock 16,678; historical A 31,911; original M1–M3 lab 33,676). This establishes a reliable *point-in-time source handoff*, not any guarantee against future Framer edits.
- GitHub Web **PR #54**: `OPEN`, `DRAFT`, `merged=false`; **20 changed paths, all beneath `docs/`**.
- GitHub Studio **PR #28**: `OPEN`, `DRAFT`, `merged=false`; **1 changed path, beneath `docs/`**.
- Both PRs remain explicitly **read-only handoffs / implementation proposals**, with **zero application-code changes**. No Framer publication and no Web/Studio production integration.
- Existing source-only Framer diagnostics were empty; exact live browser events, generated CSS reconciliation with Next.js, editor persistence, and production publication contract tests remain BLOCKED/NOT IMPLEMENTED.

