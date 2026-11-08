# Article Reading Experience — M3 Editorial Reading Path (Framer Delivery)

**Date:** 2026-11-07  
**State:** M3 Framer component implemented, compile diagnostics clean, responsive static layouts visually checked. **Real Brave/Playwright interaction validation outstanding.**  
**Scope:** No ScientificRadar Web/Studio application code changes, PR merge, domain, staging/production, or Framer publishing.

## Source of truth
- Public Web fixture: `lib/content/fixtures.ts` `DEMO_ARTICLES` — checked canonical title, ID, slug and `editorialType`.
- Framer project: `boKLyC3EXgf7Nhs9yoC7`; article page node `QDX13iWpW`; unpublished preview:
  https://framer.com/projects/Scientific-Radar--boKLyC3EXgf7Nhs9yoC7-3fySI?node=QDX13iWpW&view=preview
- Same code file/export since M1: `ScientificRadarArticleExperienceLab.tsx` / `codeFile/zDUnMAD:default`.
- Existing historical Framer article-reader and all three previous new labs remain unchanged.

## M3 — Editorial reading pathway
New bottom-of-article section: **Interfaces That Shape Function** with one current article and two deliberately ordered follow-ups. This is an **illustrative proposed editorial sequence**, not a claim of a completed Studio-backed curated collection.

| Order | Existing canonical article | Editorial purpose |
| --- | --- | --- |
| 1 — Current | `art-spider-silk-01` / `spider-silk-hierarchical-protein-mechanics` — *How Spiders Spin Liquid Protein Dope Into a Toughened Nanocomposite Fiber* (Feature, Biology) | Start with biophysical protein assembly in silk production |
| 2 — Next | `art-solid-state-battery-08` / `chemo-mechanical-dendrite-suppression-solid-state-electrolytes` — *Stopping Lithium Filaments at Ceramic Grain Boundaries in Argyrodite Solid-State Batteries* (News, Chemistry) | Compare chemically/mechanically controlled solid-solid interfaces in engineered materials |
| 3 — Further | `art-prebiotic-vents-05` / `alkaline-hydrothermal-vents-prebiotic-carbon-fixation` — *Proton Gradients Before Genes: How Deep-Sea Iron-Sulfide Chimneys May Have Driven Prebiotic Carbon Fixation* (Explainer, Chemistry) | Contrast natural mineral interfaces and hypothesized prebiotic chemical gradients |

**Scientific integrity:** These are analogies about locally important interfaces. The three articles do **not** share one chemical mechanism, make up one body of evidence, or describe prerequisites. The section says so explicitly. No inferred trust scores, progress tracking, user personalization, AI-generated reading paths or invented citations.

## Functionality and responsive layout
- Calm numbered 1–3 vertical progression at the end of the *same* article; current step visibly identified.
- Steps 2 and 3 each have an actionable `Why read this next?` disclosure; React state switches open/closed and maintains `aria-expanded`, `aria-controls` and a persistent identified detail region.
- Expanded context explains the thematic relation and shows **canonical future Web route**. Prototype **does not pretend real cross-article navigation works**; route will be wired in separately authorized Web integration.
- No duplicate "Related Scientific Reading" blocks: the proposed ordered path is deliberately differentiated from Web's existing generally-related-story recommendations.
- CSS scoped to `.srx .path*`; a compact numbered layout at 320px without shrinking article prose.
- M1 Summary, A−/A/A+, article type and scrollspy TOC remain. M2 Knowledge popovers, honest source disclosure and responsive key-concept note remain.
- No new dependency, no new Framer page or component file; only `ScientificRadarArticleExperienceLab.tsx` updated.

## Checks and evidence
- Framer `api.files.write`: `diagnostics=[]`, export unchanged.
- Original `noIndex` and `noIndexSite` remain set to true, no publish.
- Framer static screenshots rendered at 1200 (`C3pOT8SVY`), 810 (`HuBxc4B2Y`), 390 (`FbyKjxoKT`) and 320 (`axAQaTOkS`).
- Visually inspected 1200 and 320 screenshots: ordered cards, long canonical titles, numbering and no obvious title clipping; M1 and M2 visual features still present.
- Confirmed by source: 3 existing article IDs/slugs/titles/types and working code paths for stateful explanation expansion.
- **NOT YET PASS:** Real Preview Enter/Space/Tab clicks, `aria-expanded` transitions, live DOM root scrollWidth/clientWidth, 320×568 short-height scroll, M1 font-size state, M1 scrollspy, M2 popovers/Escape/focus/restoration, source panel keyboard behavior and integrated browser QA. Static screenshots are not substitutes.

## Product caveats
- Reader content is an intentionally short **illustrative excerpt**; this prototype does not yet reproduce every production `bodyHtml` block, figures, citations, tables and KaTeX. Web adaptation must preserve the full real `ArticleReader`.
- M2 internal Knowledge Link preview currently shows canonical slug and, for examination, source fixture; actual Web navigation and existing Studio editorial approval metadata are integration gates.
- 3-step interdisciplinary pathway demonstrates **editor-curated sequencing**, but production should validate actual editorial purpose and availability; do not force reading paths for articles lacking sufficient related content.
- Potential design risk: the end-of-article ordered path may be redundant with existing RelatedStories; dedupe/placement must be decided during integration.
- Existing source and Wikipedia popover behaviors require manual accessible interaction review before certification.

## Next milestone
M4: Codex in real Brave + ChatGPT independently inspect same combined Framer page through **six-cycle refinement**, identify and fix only proven Framer-only issues, re-run scoped regressions; report PASS/FAIL/BLOCKED with DOM evidence. Owner review precedes any Web code, PR merge or production action.
