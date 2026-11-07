# ScientificRadar Article Reader & Studio CMS — Codex-ready Independent Audit

**Reviewed:** 2026-11-08  
**Scope:** Connected Framer source and four static reader + four CMS screenshots; GitHub `main` from both ScientificRadar repositories; Nature Astronomy article and NASA SVS image attribution; PR #54 docs branch.  
**Disposition:** **Ready for independent Codex investigation and owner review — NOT a validated production implementation.**  
**No Web/Studio application code, Framer publishing, GitHub merge, or production deploy executed.**

## 0. Project boundary (critical)

Two separate repositories exist and **have not been merged**:
- `Centaurioun/ScientificRadar-web`: Next.js public scientific magazine and reader.
- `Centaurioun/scientificradar-studio`: admin CMS for articles, KnowledgeLink, ScientificSource, Series, media, and a versioned publication snapshot producer.

Their intended integration is an **editorial publication contract** (Studio producer → Web consumer), not a shared ad hoc Framer/JSX file. The Framer CMS template lab is *not* integrated, saved, authenticated or deployed. PR #54 is deliberately **docs-only and draft**.

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

## 5. Remaining integration and correctness blockers

| Severity / gate | Evidence | Codex check or future owner decision |
| --- | --- | --- |
| **P1 release gate** — real Studio → public Web integration absent | Two separate applications; Framer CMS only memory state; no save or publish | Keep separate repos, design/test a versioned publication adapter and synchronized schema changes |
| **P1 release gate** — public related IDs are empty | Studio `lib/publishing/web-contract-v1.ts` serializer **hardcodes `relatedIds: []`**; Web exposes `relatedIds` and `RelatedStories` | Editor-reviewed public-only relation selection / Series mapping and snapshot validator; don't expose drafts |
| **P1 release gate** — complete DOI bibliography and media rights | Studio `ScientificSource` and Web `PublicSource` include DOI but lack full volume/issue/page fields; third-party figure rights require review | Add only vetted optional bibliographic fields + safe DOI; figure per-asset rights provenance |
| **P2 QA gate** — unproven interactions | Scrollspy contextual fade/visibility, mobile TOC focus, anchored hover, figure modal trap/Escape, body/history hash, carousel arrows, touch/keyboard, reduced motion not re-tested live | Real Brave on actual Framer preview, and **again on integrated Next.js site**, 320/390/810/1200/1280 |
| **P2 design/code gate** — CMS authoring integrity | Framer concept H2 uniqueness is now guarded, but real Studio headings can be deleted/renamed, leaving stale references | Stable H2 IDs, sanitize and validate on publish, detect missing heading and duplicate anchor |
| **P2 visual/accessibility gate** — horizontal scroll and focus | Table scroll hint added. Static 320/390 screenshots only. | Measure `clientWidth/scrollWidth`, table scroller keyboard focus, document root overflow, 320×568 modal clamp |
| **P2 content gate** — demo cards masquerading as public articles | Framer Related Reading shows research DOI external links and four explicitly hypothetical editorial cards | Production `RelatedStories` must use **published editorial article URLs only**; omit if no relevant public articles |
| **P3 maintainability** — reference component 63KB monolith | Layered CSS constants and a self-contained Framer component for a single fixture | In Web adapt existing components/token system, not copy one 63KB file as production component |
| **P3 responsive** — desktop layout threshold differs | Framer rails start around 1150; actual Web `xl` breakpoint may be 1280 | Evaluate 1150, 1200, 1279 and 1280 transitions explicitly |
| **Performance gate** — telemetry not measured | No real LCP/INP/CLS/network trace | Measure real assets and production-like Next runtime after integration |

**Special source warning:** The earlier `BennuPresolarEditorial.tsx` Framer snapshot is kept for baseline comparison only. Do **not** use its old numerical phrasing when drafting scholarly claims. The newer `BennuRelatedReadingConcept.tsx` lab contains the corrected sample-specific expressions.

## 6. Codex task sequence when allowance returns

**C0 (READ-ONLY first):** Read this audit and `framer-reference/README.md` plus both contracts, inspect both repos at latest main and current PR #54. Report any drift, conflicts and unverified assumptions before recommending code changes. Do not trust old M1/M2/M3 label defaults over current owner decisions.

**C1 (real Framer QA):** With actual Brave preview on current node `t6PbsTds_`, test 320×568, 390×667, 810 and 1200 (plus 1280): mobile first/middle/last TOC target top and `aria-current`; desktop isotope→petrography→end rail transitions and hidden state; keyboard/tab/scrollspy, Knowledge popover Wikipedia HTTPS & Escape/focus, Figure 1/2 backdrop vs interior, DOI navigation, Back/hash, table keyboard scroll and carousel 6-card progression. Explicit PASS/FAIL/BLOCKED with DOM values and screenshots. Repeat CMS concept add/remove/duplicate-anchor validation.

**C2 (source, science and legal review):** Compare figure 1 to corrected publisher original, verify NASA credit and image rights/remote hosting policy, test real DOI destinations and correction text, review numeric subgroup precision. No fake citations or editorial peer-review claims.

**C3 (contract plan):** Design actual Studio Article Insights fields, verified link occurrences, public-only related IDs/Series adapter and complete Sources fields. Describe optional/backwards-compatible publication snapshot transition v1→vNext with tests, no merge.

**C4 (only after a new owner approval):** Propose small Studio and Web app-code PRs, independently testable and protecting current sanitizer, figures/tables/math, source ledger and security, and add end-to-end runtime QA. Do not publish/deploy/merge by default.

Owner authorization at this moment covers **Framer design and documentation QA only**, not application implementation. The user will explicitly signal when Codex allowance resets.

## 7. PR and visual references

- Web docs draft PR: https://github.com/Centaurioun/ScientificRadar-web/pull/54
- Current Framer reader: https://framer.com/projects/Scientific-Radar--boKLyC3EXgf7Nhs9yoC7-3fySI?node=t6PbsTds_&view=preview
- Current Framer CMS UX mock: https://framer.com/projects/Scientific-Radar--boKLyC3EXgf7Nhs9yoC7-3fySI?node=Kr4RQUn1q&view=preview
- Canonical design: `ARTICLE_READER_DESIGN_SYSTEM.md`
- CMS/publication model: `ARTICLE_READER_CMS_EDITORIAL_CONTRACT.md`
- Exact Framer source snapshots: `framer-reference/README.md`

**Do not merge, make the PR ready-for-review, publish or deploy as an implied follow-up.**
