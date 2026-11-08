# ScientificRadar Bennu Reader — Owner UX Decisions & Targeted Corrections
Date: 2026-11-07
Status: Owner feedback confirmed; **approved design direction, implementation and testing pending**.
Scope: The unpublished Framer A article `W1F5b_kMS` (`/bennu-presolar-stardust`), source `BennuPresolarEditorial.tsx`; later reuse for B/C. The shared ScientificRadar wordmark is approved for eventual Web integration but **Web app code must be changed in a separate reviewed PR**, not in this docs branch. No merge, publish, DNS or production updates authorized.

## Owner's requests and product decisions

| Issue | Approved design and UX contract |
|---|---|
| Scientific figure enlargement | Clicking the backdrop outside figure **and** caption dismisses the dialog. Clicking inside the figure, caption, close control does not accidentally dismiss. Explicit Close Figure and Escape remain; focus returns to originating image button. Initial focus, keyboard focus containment, and scroll-lock are required when the dialog is open. Keep short source/attribution caption visible. |
| References | In-text `[1]` / `[2]` anchors smoothly navigate to the right bibliography entry, and each Return to Text navigates smoothly back to the **specific originating citation** (multiple occurrences of `[1]` stay individually reachable). Honor `prefers-reduced-motion` by using instant navigation and do not lose keyboard focus or permanent hash/deep-link semantics when integrating Next.js. Framer preview host may constrain hash/history; report separately. |
| Text alignment | Owner likes justified typography. Add optional **Left / Justified** reading setting on sufficiently wide layouts, with **Left default** for accessibility. Keep mobile left aligned; do not justify headings, captions, tables or citations. Use `hyphens:auto` only for the appropriate language and check spacing. WCAG 1.4.8 AAA guidance prefers an available non-justified mode. Do not silently force justified on all users. |
| Key Concept | Move `Key concept · Isotope ratio` from center/in-flow to the existing desktop right rail in context with the section it explains. On tablet/mobile it remains inline at its relevant paragraph. Keep the central prose ~680px and no duplicate visible/accessible concept boxes. Avoid adding an unrelated permanent sidebar. |
| Branding | Owner explicitly selected the **text wordmark** from `Dust from Dying Stars`: dark/black `Scientific` and teal-green `Radar`, currently in Framer `.bn .brand` with Merriweather/Georgia serif and accent `#15747b` and tight letterspacing. Record this as the ScientificRadar Web header/wordmark direction; implement as accessible responsive text/link component, not raster screenshot. Check existing site header and global font system; create separate small reviewed **Web branding PR** when Web implementation phase is permitted. Don't replace other existing brand placements without a component audit. |
| Topic kicker | In Framer `Astromaterials / Planetary Science` and `Feature` are currently plain spans (not navigable). In Web, link category and subcategory to **verified existing** topic routes. `Feature` is editorial type metadata, not a category; link only if a real and tested editorial-type listing/filter exists. Otherwise keep it non-clickable, never fake an interactive link. Existing Web `ArticleHeader.tsx` already links primary category `/topics/${article.categorySlug}` while subcategory and type labels are plain text. |
| Mobile font | Keep the current default **17px** body type and A−/A/A+ 15/17/19px choices; no automatic one-step smaller font on 390/320. Respect browser text zoom and accessibility settings. Record outcome of short-viewport tests rather than assuming proximity to phone makes small text accessible. |

## Independently verified Framer implementation facts (before modification)
- `BennuPresolarEditorial.tsx` currently renders a figure lightbox `<div className="modal" role="dialog" aria-modal="true">` without outside-click dismissal, keyboard focus trap, or explicit initial focus.
- `cite()` renders native `href="#ref-1"` and source `r.back` uses `href="#<cite-id>"`: current behavior is instant anchor navigation, not controlled reduced-motion-aware smooth scrolling.
- `.bn .concept` appears inside `<article className="prose">`, not in the right rail. `.bn .columns` already reserves a 180px right rail on desktop, with a 680px center reader.
- `.bn .brand` is rendered as text `Scientific<b>Radar</b>`, serif (Merriweather/Georgia), dark first word, `#15747b` last word.
- The A page's mobile TOC uses `setMenu(false)` immediately before `scrollIntoView(smooth)`. **This may reintroduce the proven P2 collapse/geometry failure**; copy the corrected M1–M3 post-commit scroll and focus restoration pattern before cloning A to B/C.
- A Knowledge Link explainer is currently fixed to bottom-right with no Escape focus-return to trigger; verify short viewports, dismissal and focus in real browser.
- Bibliography and DOI display are already demoed in A; do not change the scientific paper's DOI when changing the editorial article.

## Acceptance checklist (actual real-browser tests, not screenshot-only)
1. 320×568, 390×667, 810, 1200: opening figure; backdrop click closes; clicking figure/caption doesn't close; close button and Escape work; opening trigger regains focus; no background scroll or accidental modal clipping.
2. 320/390: first, middle and final mobile TOC H2 via click and Enter; post-close target remains in viewport with correct `aria-current` and focus; root `scrollWidth=clientWidth`.
3. 320/390/1200: citation to bibliography and each individual Return to Text (click and Enter); smooth behavior where motion allowed; instant if reduced-motion can be emulated; target alignment, focus and visibility after scroll; no duplicated IDs.
4. A−/A/A+ retains 15/17/19 behavior; left/justified toggle affects only paragraphs and persists appropriately during that reading session; mobile starts 17px left-aligned.
5. Responsive concept placement in right rail at wide widths and in flow at narrow widths, without compressing prose or double screen-reader announcement.
6. ScientificRadar wordmark colors/font/spacing match the A design. Web branding is **not implemented by this document**; track as separate Web PR and verify navigation/contrast responsive behavior.
7. Kicker topic links work only when real routes are available. Test page navigation rather than simply inspecting `href`.
8. No regressions for source disclosure, full bibliography/DOIs, scientific image credit/license, Thematic Reading Trail, figures/captions or existing scientific integrity disclaimers.
9. Framer `api.files.write` diagnostics empty. Real hover/touch/reduced-motion/INP/LCP/CLS may remain BLOCKED unless measured; no invented PASS.

## Work orchestration
- Codex owns changes to the active Framer A component, not parallel ChatGPT writes; use smallest targeted patches.
- Share A's before/after runtime screenshots and PASS/FAIL/BLOCKED before cloning into B/C.
- Keep GitHub PR #54 draft/docs-only and unmerged; save this owner decision and QA evidence there.
- Treat the Web wordmark request as a decision for the eventual Web UI; the implementation must be isolated to a separate reviewed app-code PR. No production deployment or merging by default.
