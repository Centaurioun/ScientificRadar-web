# ScientificRadar Article Reading Experience — M1 Framer Delivery
**Date:** 2026-11-07  
**Status:** Framer prototype implemented; source and static responsive screenshots verified. Interactive browser QA pending; no production integration.

## Links
- Framer unpublished reader page: [ScientificRadar Article Reading Experience Lab](https://framer.com/projects/Scientific-Radar--boKLyC3EXgf7Nhs9yoC7-3fySI?node=QDX13iWpW&view=preview)
- Framer code component: `ScientificRadarArticleExperienceLab.tsx` (`codeFile/zDUnMAD:default`)
- Roadmap: `docs/public-website/ARTICLE_READING_EXPERIENCE_THREE_PHASE_ROADMAP_2026-11-07.md`
- Previous reader baseline intentionally preserved: `IntegratedArticleReaderLab.tsx`, existing original page `/integrated-reader-lab`.

## Scope implemented on one integrated page
1. Editorial `Feature` label displayed separately from research/source publication status.
2. `At a glance` panel has three manually written demo synthesis statements derived from ScientificRadar Stage A spider silk `key-takeaways`; avoids fictitious paper/DOI or unsupported publication claim.
3. `A− / A / A+` control: three React state modes map to 15/17/19 CSS px for **prose only**; article headings, hero SVG and reader chrome do not inherit this scaling. Accessible button group, `aria-pressed` and focus-visible styles.
4. Six heading entries with desktop left sticky TOC and current-section styling; one nested H3. `requestAnimationFrame`-throttled scroll listener detects current heading relative to 160px top threshold; user selection performs `scrollIntoView` and obeys `prefers-reduced-motion`. Mobile/tablet TOC is collapsible and keyboard reachable, and current link has `aria-current=location`.
5. Original ScientificRadar spider-silk SVG, canonical title/dek from Web fixture; prose is a **shortened, clearly labeled illustrative adaptation**, not a substitute for the full production article.
6. Future M2/M3 space is structurally reserved without shipping knowledge previews, invented sources or fake paths.

## Static QA evidence
- Framer `api.files.create`: diagnostics `[]`, detected export `ScientificRadarArticleExperienceLab`.
- Isolated Framer page `QDX13iWpW`, path `/article-reading-experience-lab`, `metadata.noIndex=true`, `metadata.noIndexSite=true`, unpublished.
- Page responsive frames: 1200 `C3pOT8SVY`, 810 `HuBxc4B2Y`, 390 `FbyKjxoKT`, 320 `axAQaTOkS`. Each references the new `codeFile/zDUnMAD:default`, not old integrated reader.
- Four Framer screenshot renders inspected. At 1200: left TOC, central summary/tools/prose, right reserved area; at <=1150: in-flow mobile TOC and single reading column; long canonical heading remains visible at 320.
- Code/structure guards: one demo page, existing 7 labs unchanged; styles scoped under `.srx`, no new dependencies, no Framer publish.

## Remaining validation / risks
- **NOT YET RUNTIME VERIFIED:** Actual A−/A/A+ click behavior, computed font sizes, Tab order, heading click scroll, scrollspy after manual scroll, focus and reduced-motion emulation in live Brave. Source-level implementation is not equivalent to real E2E PASS.
- Static screenshots do not certify DOM root horizontal `scrollWidth` or short viewport 320×568; Codex must measure on live Preview at integrated QA checkpoint or earlier if M1 review requests.
- Desktop break is configured at 1150px for prototype visibility at 1200; real Web `xl` left rail starts at 1280px. Production adapter must preserve actual Web breakpoint unless separately approved.
- No evidence-based user task time improvements claimed.
- Layout excerpt omits equations/tables/citations intentionally; production requires full reader compatibility regression, not removal/replacement of them.

## Next gates
- Owner sees M1 as a working unpublished Framer proposal; source/static visual evidence as above.
- M2 extends **this exact page and component** after owner response; M3 then adds reading path to same page.
- After M3, Codex and ChatGPT run independent live browser QA and six-cycle iterative refinement, then separately seek owner approval for any Web implementation.
