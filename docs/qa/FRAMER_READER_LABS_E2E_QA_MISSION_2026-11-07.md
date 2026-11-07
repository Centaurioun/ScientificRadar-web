# ScientificRadar Framer Reader Labs — Codex + Playwright QA Mission
**Date:** 2026-11-07
**Status:** TEST PLAN / HANDOFF ONLY — no authenticated Framer browser test has been executed.
**Repository:** https://github.com/Centaurioun/ScientificRadar-web
**Framer project:** https://framer.com/projects/Scientific-Radar--boKLyC3EXgf7Nhs9yoC7-3fySI

## 1. Mission and strict scope
Conduct independent, evidence-based end-to-end QA of four **existing, unpublished Framer Code Component prototypes**, using **Codex in an authorized local browser environment and Playwright**. Test behaviour first; do not migrate features into ScientificRadar Web or Studio. Do not change production services, DNS, Cloudflare, the public ScientificRadar domain, Framer hosting, billing, or published site. No merges or deployments.

Framer is an optional, disposable design laboratory, not our production architecture. Existing Next.js code, approved public website design specifications, and scientific content models are authoritative. An old Denzel template is currently published at the framer.app base address; **never confuse it with these unpublished labs**.

### Exact Framer preview targets (authenticated editor)
The project uses a normal Framer preview link. Preserve the query parameters, especially the per-page node ID:

| Lab | Framer Code Component | Node ID | Editor-preview URL |
|---|---|---|---|
| Scientific Figure Lab V6 | ScientificFigureLab.tsx | OFNHTB3Jx | https://framer.com/projects/Scientific-Radar--boKLyC3EXgf7Nhs9yoC7-3fySI?node=OFNHTB3Jx&view=preview |
| Citation Interaction Lab V2 | CitationInteractionLab.tsx | sHFu4J1jX | https://framer.com/projects/Scientific-Radar--boKLyC3EXgf7Nhs9yoC7-3fySI?node=sHFu4J1jX&view=preview |
| Mobile Reading Stress Lab V2 | MobileReadingStressLab.tsx | EOyWe1e9E | https://framer.com/projects/Scientific-Radar--boKLyC3EXgf7Nhs9yoC7-3fySI?node=EOyWe1e9E&view=preview |
| Integrated Article Reader Lab V1 | IntegratedArticleReaderLab.tsx | L0EEZeigV | https://framer.com/projects/Scientific-Radar--boKLyC3EXgf7Nhs9yoC7-3fySI?node=L0EEZeigV&view=preview |

The equivalent unpublished route paths are /figure-lab, /citation-lab, /reading-stress-lab and /integrated-reader-lab. **Do not assume they resolve on the currently published framer.app site.** The Framer editor preview may use a nested iframe; discover the actual DOM/frame hierarchy before writing locators.

## 2. Verified baseline vs. unverified functionality

**Verified on 2026-11-07:** All four editable Framer project pages and Code Component sources exist; component source contains the intended controls; the Framer component compiler returned no diagnostics during prior writes; visually rendered previews were produced for desktop, tablet and phones (some at 320 px). This confirms source presence and static renderability **only**.

**Not verified:** Real Playwright clicks, hover/mouse leave, DOM scrolling offsets after region selection, drag/pan, modal focus trapping, touch gestures, browser back/return, focus restoration, keyboard commands, view-mode persistence, and cross-component interference. None of these may be called PASS until executed in the authenticated Framer preview.

An isolated Chromium smoke test with a synthetic local button was completed, but it **does not** validate Framer. This ChatGPT runtime cannot connect to the user's unpublished/authenticated Framer preview; Browser in Chat mode is read-only. Use local Codex/Playwright or authorized Work browser control for actual Framer E2E.

## 3. Local execution setup — Codex

1. Inspect the latest Web repository `main`, the existing `playwright.config.ts`, `tests/e2e/`, and the approved design decisions. Do not overwrite unrelated work. The existing `playwright.config.ts` launches a local Next.js server at 127.0.0.1:4387; **it is not suitable as-is** for Framer E2E. Do not claim `npm run test:responsive` tests Framer.
2. Open the **Framer editor** with an explicitly authorized login in a **separate temporary browser profile**. Never copy the user's ordinary browser profile or commit/save passwords, cookies, sessions, access tokens or `storageState` to GitHub. Use ephemeral local authentication only.
3. Confirm the correct page is loaded in Framer Preview; do not mistake an edit canvas, cached old theme, or generic framer.app page for the lab. Inspect `page.frames()` to find the actual preview's frame. Cross-origin frames are acceptable to Playwright if authorized.
4. Create an **opt-in, local-only** Playwright configuration without a Next.js webServer and a temporary `framer-labs.spec.ts`. Keep it out of the regular CI suite until the actual Framer selectors are inspected. Use the repository's existing `@playwright/test` installation. Test browser widths 1200, 810, 390, and 320, ensuring the **Framer preview viewport**, not merely the outer editor window, is set accordingly.
5. Run the cases below, record actual DOM observations and screenshots/traces. If tests cannot access the authenticated preview, record each as BLOCKED rather than using screenshots or source inspection to claim PASS.
6. Classify failures P0 (core behaviour or accessibility broken), P1 (serious usability), P2 (polish). Recommend minimal fixes **inside Framer only**; separate any code changes from diagnostic results. Do not implement ScientificRadar Web features without the owner separately accepting the findings.
7. Save the QA report under `docs/qa/` on a separate branch and open a draft PR (do not merge). Attach links to screenshots and traces where supported, otherwise give reproducible local paths; do not commit authentication artifacts or private manuscripts.

Suggested evidence for every case: exact viewport, actual Framer node/page, test command, observed behaviour, assertion result, relevant screenshot/trace, and concise failure reproduction.

## 4. Required Playwright acceptance matrix

### F — Scientific Figure Lab
- **F01 / P0:** Initial page displays Figure Lab; no inspector opens until user requests it.
- **F02 / P0:** Click Expand & Inspect: one accessible modal opens; background cannot scroll; Close and Escape close it; focus returns to trigger.
- **F03 / P0:** Slider, +, − and Reset keep zoom within 75–300%, visible value matches zoom and Reset restores 100%.
- **F04 / P0:** Click I / II / III (or press keys 1/2/3) at 390 and 320 px: selected state and text correspond to the clicked region; the relevant region is actually centred within the scrollable image stage, not merely visually highlighted. Inspect `scrollLeft` and capture screenshots at each region.
- **F05 / P1:** Mouse drag pans only when zoomed; touch scroll works; region recentering works after manually dragging then selecting the same region again.
- **F06 / P1:** Caption toggle preserves attribution/provenance when displayed; image alt and illustrative-asset caveat remain present.
- **F07 / P1:** Focus cannot escape the modal with Tab/Shift+Tab; visible focus indication remains legible in dark theme. Test desktop and mobile.
- **F08 / P1:** No horizontal page overflow or control overlap at 320/390/810/1200; permitted panning occurs within the figure, not on the whole article.

### C — Citation Interaction Lab
- **C01 / P0:** Desktop hover on [1]/[2]/[3] shows a non-interactive source preview with corresponding bibliographic metadata; mouse leave closes it, and it does not steal focus.
- **C02 / P0:** Clicking a numbered citation **always** jumps to and highlights the matching reference; no click-triggered tooltip/modal. This is the owner-approved UX decision.
- **C03 / P0:** On a touch/mobile preview, tapping a numbered citation goes directly to the bibliography without requiring hover.
- **C04 / P1:** Back to article citation restores the correct previous reading position; focus behaviour is predictable.
- **C05 / P1:** Hover placement near viewport top, bottom, left and right does not clip content or cause sideways body overflow; Escape closes any transient tooltip.
- **C06 / P0:** Illustrative demo warning is clearly present; no fictitious DOI or misleading publication claim. External link/portal must not be presented as the cited paper when it is only a generic portal.
- **C07 / P1:** Keyboard focus on a citation reveals relevant reference information where pointer hover is supported; tooltips dismiss on blur without trapping keyboard interaction.

### T — Mobile Reading Stress Lab
- **T01 / P0:** On 390 and 320 px, Row focus is the default. Select all five materials and verify that each has all five values and exact units from the original development fixture.
- **T02 / P0:** Data matrix remains accessible at every viewport. Horizontal scroll stays within its region; material name remains sticky where designed; no body-level horizontal overflow.
- **T03 / P0:** At 320 px, compact first-column names wrap and at least one numeric column is simultaneously visible; rows and headers remain meaningfully associated.
- **T04 / P1:** On desktop, both views work and switching does not fabricate/drop numerical data.
- **T05 / P0:** Inspect equation opens one modal; variables and the intact expression are readable at 320/390; Escape and Close work; focus returns to the equation trigger.
- **T06 / P1:** Keyboard can reach and operate table switch, material selector, scrollable table, and equation inspector.
- **T07 / P0:** Numerical values are clearly labelled illustrative, not verified empirical results. Unit changes are not silently introduced by the UI.
- **T08 / P1:** Check long material names, horizontal math scrolling, 320 px width, and zoomed/large-text settings. Avoid relying on visual screenshots alone for overflow assertions.

### I — Integrated Article Reader Lab
- **I01 / P0:** All three interaction families appear together without breaking article width at 1200, 810, 390, 320 px.
- **I02 / P0:** Figure and equation share an exclusive overlay state; no two modal dialogs open simultaneously; page scroll locking and restoration function correctly.
- **I03 / P0:** Citation hover (desktop) and click-to-reference (all devices) still function after opening and closing another inspector.
- **I04 / P0:** Mobile defaults to Row focus; Matrix is available on request; source numerical values and units remain unchanged.
- **I05 / P0:** Figure regions centre correctly within the portal after viewport changes. Escape and focus restoration work for both overlay types.
- **I06 / P1:** After closing a modal, keyboard/pointer focus returns to its own trigger rather than a different inspector or the page top.
- **I07 / P1:** No trapped/hidden actionable controls at 320 px; body has no unintended horizontal scroll.
- **I08 / P0:** Verify provenance text, no invented DOI, no unintended outbound links, and differentiation between illustrative content and scientifically validated published content.

### Cross-cutting
- **X01 / P0:** Test each lab in Framer's own Preview, not only in a screenshot or a reimplementation. Detect old Denzel template and immediately mark wrong-target tests INVALID.
- **X02 / P0:** A11y: semantic button names, visible keyboard focus, Escape, focus trap, focus restore, legible control size, no invalid modal stacking.
- **X03 / P1:** Capture screenshots of key states and Playwright trace/video on failures; include test logs and exact viewport dimensions.
- **X04 / P0:** No DNS/domain changes, no Framer publication, no app code migration, no paid services, no sensitive auth files.
- **X05 / P1:** Compare the best prototype with existing `components/editorial/ArticleReader.tsx` and `components/editorial/ScientificFigure.tsx`, but treat integration as a **separate owner-approved implementation**.

## 5. Scientific data reference for table assertions
Rows (density, modulus, ultimate stress, fracture strain, toughness), reproduced from `lib/content/fixtures.ts`:
- Major Ampullate Dragline Silk: 1.31, 10.5, 1.25, 28.0, 165
- Flagelliform Capture Spiral Silk: 1.30, 0.003, 0.50, 240.0, 150
- Bombyx mori Cocoon Silk: 1.34, 7.0, 0.60, 18.5, 70
- Kevlar 49 Aramid Fiber: 1.44, 130.0, 3.60, 2.7, 50
- High-Tensile Carbon Steel: 7.85, 200.0, 1.50, 1.8, 12

Units: g·cm⁻³, GPa, GPa, %, MJ·m⁻³. This is a **development fixture**, not a scientifically verified measurement set.

## 6. Exit criteria and handoff decisions
Do not declare Framer E2E PASS based only on Framer compilation or screenshots. A run is complete only when:
1. Tests actually execute against the authenticated, correct Framer preview.
2. P0 cases pass, or failures are documented and prioritised.
3. At least desktop 1200, tablet 810, mobile 390 and narrow 320 are covered, with evidence.
4. Failed cases have reproduction steps and screenshots/traces.
5. A draft QA PR contains a results table: case ID, PASS/FAIL/BLOCKED, viewport, evidence, severity and proposed fix.

Until these gates are met, **do not transplant the experimental React components into ScientificRadar Web**. Once verified, recommend features individually and preserve the existing production React/Next.js architecture. No automatic Framer synchronisation or runtime dependency is permitted.

## 7. Ready-to-paste Codex mission
Read this entire document. Inspect the latest ScientificRadar Web repository, its existing E2E tests and Framer lab previews. Use an authorised local browser to execute actual Playwright interactions across all four Framer labs. Do not assume a Framer editor screenshot is a successful end-to-end test. Implement only temporary/opt-in testing infrastructure and minimal Framer-only repairs if evidence demands it. Produce a complete evidence-based QA report under docs/qa on a separate branch, open a draft PR, do not merge, do not alter ScientificRadar production code or domains. Answer in **Turkish** and preserve technical identifiers in English.
