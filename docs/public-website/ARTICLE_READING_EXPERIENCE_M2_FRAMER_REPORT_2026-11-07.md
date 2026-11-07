# Article Reading Experience — M2 Scientific Explanation Framer Delivery

**Date:** 2026-11-07  
**Status:** Implemented in the unpublished Framer prototype. Source diagnostics and screenshots verified. **Real Brave runtime/accessibility E2E is not yet complete.**  
**Scope:** Framer only. Web and Studio implementation files, production, DNS and hosting remain unchanged.

## Reference and provenance
- Roadmap: `docs/public-website/ARTICLE_READING_EXPERIENCE_THREE_PHASE_ROADMAP_2026-11-07.md`.
- Milestone one report: `docs/public-website/ARTICLE_READING_EXPERIENCE_M1_FRAMER_REPORT_2026-11-07.md`.
- Unpublished Framer page: https://framer.com/projects/Scientific-Radar--boKLyC3EXgf7Nhs9yoC7-3fySI?node=QDX13iWpW&view=preview
- Code file/export: `ScientificRadarArticleExperienceLab.tsx`, `codeFile/zDUnMAD:default`; original six recent design alternatives and previous article reader demos retained.
- Web fixture: `lib/content/fixtures.ts`; Web `PublicArticle`, `PublicSource`, `ArticleReader` and `CitationInteractions` read-only comparisons.
- Studio README independently records **Smart Knowledge Links (Internal + Wikipedia Popovers)** as working on the Studio side (desktop hover, focus/Escape, mobile tap). This Framer work **explores the public reader appearance** rather than reimplementing Studio's editing or approved data schema.

## M2 implemented

### 1. Knowledge Link preview proof
Three editorially selected anchors in an example spider-silk science article (not global auto-linking):
- `spidroins` → editor-written concise general scientific definition + existing Wikipedia article `https://en.wikipedia.org/wiki/Spidroin`;
- `beta-sheet` → editor-written concept definition + existing Wikipedia article `https://en.wikipedia.org/wiki/Beta_sheet`;
- `alkaline hydrothermal vent explainer` → related ScientificRadar canonical fixture `/article/alkaline-hydrothermal-vents-prebiotic-carbon-fixation`; preview clearly differentiates this **other** proton-gradient context from silk spinning.

Nonmodal contextual popover: desktop hover (fine pointer), keyboard focus and activation, touch/click, close button, outside pointer dismiss, Escape, focus restoration, viewport-clamped positioning, descriptive accessible controls. Excerpts are **curated local demo content**, never represented as live Wikipedia extracts. `React` + `react-dom` portal is used within the existing Framer code component.

The internal article target is intentionally represented by its verified **canonical route slug**, while the prototype link opens the GitHub fixture for validation, not a fabricated production deployment; the actual cross-article navigation is an **integration contract** awaiting Web work.

### 2. Publication/source transparency
An initially collapsed, readable `What underpins this story?` disclosure:
- Distinguishes article's editorial type `Feature` from peer-reviewed publication source classification.
- Makes explicit that the Stage A source entries are illustrative demo synthesis records.
- No verified original study, peer-review classification, DOI or metric is asserted.
- States the production rule: show real evidence type/source URL/DOI only when verified in the live publication dataset; no model trust score.

### 3. Key concept callout
One editorially chosen **why-it-matters** note, not a duplicate of Wikipedia definition:
- Desktop: calm optional right sidebar (no center prose width reduction).
- Tablet/mobile: in-flow after the storage explanation.
- Explains the functional contrast between spidroin storage and assembly; **no global sticky multi-panel overload**.

### 4. Preserved M1
Article type, three concise takeaways, A−/A/A+ prose-only sizing and desktop/compact active section TOC remain in the **same article page**. No reading path was added; M3 is still pending.

## Verified evidence (scope-limited)
- Framer `files.write` returned `diagnostics=[]` after corrections.
- Static responsive screenshots of page frames at **1200, 810, 390, and 320 px** created; desktop right info card and mobile inline card confirmed. One initial mobile CSS visibility conflict was corrected and new 320 screenshot inspected.
- All four responsive frames reference the same `codeFile/zDUnMAD:default`.
- `metadata.noIndex=true` and `metadata.noIndexSite=true`; no Framer publish.
- Source checks confirm: Wikipedia URL ×2, internal canonical slug ×1, source disclosure, keyboard handler, focus restoration guard, outside click dismissal, mobile concept CSS, original M1 controls.

## Open runtime acceptance / known limitations
- **BLOCKED/not yet tested:** Actual Brave Preview hover/touch/focus/Tab/Shift+Tab/Escape/outside-click workflow and source-panel keyboard toggles. Framer diagnostics and static shots do **not** establish real E2E PASS.
- Portal popup focus and outside-click restoration require Codex real browser stress testing, especially when closing via Escape while a trigger was focused.
- 320×568 viewport, root scrollWidth/clientWidth and target visibility require live Playwright DOM validation; static screenshots are not a root overflow assertion.
- Production must integrate existing Studio Knowledge Link approved records; avoid auto-adding links into sanitized citation/KaTeX nodes; no live Wikipedia API fetch on every hover.
- Actual source metadata in Web's Stage A sample are illustrative; source disclosure here intentionally shows the demo constraint, not verified journal references.
- Future combined article must retain figures/citations/equations/tables, actual Web H2/H3 IDs, responsive reading measure and related article routes.

## Milestone state
- **M0 — Roadmap**: complete (docs).
- **M1 — Fundamental reading**: prototype/source/static screenshot verified; live browser QA not yet certified.
- **M2 — Scientific explanation**: prototype/source/static screenshot verified; live browser QA not yet certified.
- **M3 — Editorial reading path**: not started; owner receives M2 report first.
- **M4 — Codex + ChatGPT integrated six-cycle refinement**: after M3.
- **M5 — Web integration decision**: separate owner authorization required.
