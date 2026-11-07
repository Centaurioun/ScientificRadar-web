# Framer Reader Labs — QA Preflight Evidence and Open Gates
**Checked 2026-11-07.** This is a static and configuration check, **NOT** an E2E test report.

## Inventory read from the connected Framer project

| Page | Source file | Status in this check |
|---|---|---|
| /figure-lab | ScientificFigureLab.tsx | Editable source found (19,348 characters); code contains zoom range, region buttons, Escape, focus return and provenance |
| /citation-lab | CitationInteractionLab.tsx | Editable source found (13,276 characters); code contains hover/mouse leave, click-to-bibliography, mobile hover gate, return-to-citation and non-modal tooltip |
| /reading-stress-lab | MobileReadingStressLab.tsx | Editable source found (17,992 characters); code contains Row focus, native data table, material selector, math dialog and illustrative-value caveat |
| /integrated-reader-lab | IntegratedArticleReaderLab.tsx | Editable source found (31,181 characters); code contains a single figure/equation overlay state, hover/click citations, table modes, portal focus styles and illustrative provenance |

All four preview pages exist inside Framer project `boKLyC3EXgf7Nhs9yoC7`, are marked noIndex, and use Framer's existing Design Lab. Figure/Citation have desktop, tablet and phone breakpoints; Reading Stress/Integrated also have a 320px variant.

**Methodology limitation:** Presence of source code and a successfully rendered Framer screenshot cannot establish whether clicks, dragging, keyboard focus, scrolling or hover work in a real browser. None of the acceptance cases in the accompanying mission is marked PASS at this stage.

## Test runner inspection
- The public website repository already depends on `@playwright/test` version 1.64.1.
- Its `playwright.config.ts` runs a local standalone Next.js server at `http://127.0.0.1:4387`, with test files under `tests/e2e/`.
- Existing tests include `responsive-scientific-content.spec.ts`, `responsive-article-toc.spec.ts`, `scientific-content-integrity.spec.ts` and others. These are site tests, not Framer preview tests.
- In this isolated ChatGPT runtime Python Playwright and Chromium are installed. A self-contained synthetic button click in headless Chromium succeeded (browser version 144.0.7559.96). **This only verifies that the local test runner launches.**
- A network request to the old public `invigorated-technology-885071.framer.app` hostname failed DNS resolution in this isolated runtime. In any event, that published site is the old theme, not the four unpublished labs.
- The connected Browser tool in Chat mode exposes tabs for read-only inspection, not interactive control. An authenticated Playwright session against Framer Preview was not available.

## Remaining verification gates

| Gate | Status | Required executor |
|---|---|---|
| Confirm correct logged-in Framer preview and iframe | BLOCKED HERE | Local Codex/browser with owner-authorized Framer login |
| Figure zoom, region scrolling, pan and focus | NOT RUN | Playwright against real Framer preview |
| Citation hover-away and click-to-jump | NOT RUN | Playwright against real Framer preview |
| Table selection, sticky first column, 320px | NOT RUN | Playwright against real Framer preview |
| Integrated modal exclusivity and returning focus | NOT RUN | Playwright against real Framer preview |
| Provenance, no invented DOI, viewport overflow | SOURCE/SNAPSHOT CHECK ONLY | Full browser DOM assertions |
| QA result report with test logs/traces/screens | NOT RUN | Local Codex after E2E execution |

## Candidate risks, not confirmed defects
1. Framer Preview may embed the Code Component in an iframe: frame selection and viewport setup must be verified in Playwright.
2. React Portals render the inspector in the frame's document body, so modal focus scope and scroll-lock restoration need live keyboard verification.
3. Tooltip anchoring near the edges or editor viewport can differ from static screenshots.
4. Programmatic scroll centring uses scroll width and region anchors; visually selected region does not prove the exact scroll position. Inspect scroll offsets and take evidence screenshots.
5. Wide scientific tables are deliberately scrollable; tests must distinguish **component-local** horizontal scrolling from unwanted **document** overflow.
6. The equation examples use demonstrative typesetting, not production KaTeX/MathML semantics; test a11y before any recommendation to integrate.
7. The fixture values are illustrative; their presence in a prototype does not validate scientific accuracy.

## Decision
**No claim of E2E success.** No application code modified, no GitHub merge, no Framer publish, no Cloudflare/DNS change, and no paid subscriptions. Execute the companion E2E QA mission in a local authorized Codex/Playwright environment first. After receiving evidence, individually decide whether Figure Inspector, hover citations, Row focus, and equation inspection merit implementation in the actual Next.js reader.

See: [Full acceptance plan](./FRAMER_READER_LABS_E2E_QA_MISSION_2026-11-07.md).
