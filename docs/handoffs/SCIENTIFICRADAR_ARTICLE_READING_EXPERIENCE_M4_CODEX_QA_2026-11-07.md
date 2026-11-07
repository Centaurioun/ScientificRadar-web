# Codex Handoff — ScientificRadar Article Reading Experience M1+M2+M3 Integrated QA

**Date:** 2026-11-07  
**Owner boundary:** Framer lab only. No ScientificRadar Web/Studio implementation changes, GitHub PR creation/merge, production, DNS, publish. Keep old labs and the six A/B variants intact.

## Target
Framer project `boKLyC3EXgf7Nhs9yoC7`, page `QDX13iWpW`, source `ScientificRadarArticleExperienceLab.tsx`; preview:
https://framer.com/projects/Scientific-Radar--boKLyC3EXgf7Nhs9yoC7-3fySI?node=QDX13iWpW&view=preview

The unified article includes:
- M1 editorial Feature label, 3-item Stage A summary, prose-only A−/A/A+ (nominal 15/17/19px), desktop sticky active H2/H3 scrollspy, compact TOC.
- M2 2 Wikipedia and 1 internal canonical Knowledge Link preview, an honestly labelled Demo source disclosure, one context box desktop rail/mobile inline.
- M3 ordered 3-step editorial reading pathway; current article and two follow-ups with expanding rationale and canonical route labels.

**Do not start with a broad redesign.** Reproduce and isolate real faults; implement minimal Framer-only fixes. M1 and M2 have source/static screenshot checks, **not live browser E2E certification**. Previous QA of separate Homepage/Topic/Search labs does not certify this new page.

## Six-cycle QA / refinement process

### D1 Baseline & duplication audit
- Verify Framer source export unchanged; old integrated reader not overwritten; all 4 frames 1200/810/390/320 reference new component.
- Inspect existing Web `ArticleReader.tsx` and Studio Knowledge Link baseline. No second knowledge-store or duplicate Key Takeaways in future adapter.
- Record actual main-prose dimensions, element DOM ids and current section list; avoid hallucinated PR or feature completion.

### D2 Scientific integrity
- Check canonical M1 title, `Feature` type, hero alt and caption against Web fixture.
- Check each M3 ID/slug/title/type matches `DEMO_ARTICLES`; step 3 "may have" hedge retained.
- No fake journal DOI, publication status, editorial approval, trust scoring, auto-generated summary, or synthetic source links.
- M2 Wikipedia links are exact editor-selected targets; internal route only a future contract. Demo metadata clearly labelled.

### D3 Interaction & accessibility (real Brave)
- At 320 & 1200, click each A−/A/A+ (test computed `.prose` font size, headings remain stable). Check `aria-pressed` and keyboard Tab focus.
- Scroll actual content progressively. Compare active `aria-current=location` with viewport heading. Click a middle and final TOC item; scroll reaches right section without stealing focus; reduced-motion emulate **if supported**, else BLOCKED.
- At 320/390, toggle compact TOC with Enter/Space; `aria-controls` target persists, navigation correctly closes menu.
- Knowledge hover on a pointer-fine viewport, keyboard focus and activation, click/touch at 320, Escape, outside-click, close button: test card content/position/scroll behavior, focus restoration. Host Escape interception needs explicit BLOCKED rather than false FAIL.
- Expand/collapse `What underpins this story?` through keyboard; verify status is not falsely peer-reviewed.
- M3 steps 2/3: actual click and Enter/Space, correct expansion/collapse, one active explanation, `aria-expanded`, target id and visible content, article slugs, root scroll width.
- Confirm M3 does not create inert “Read article” buttons or broken links. If a link is wired, its target must exist.

### D4 Responsive & geometry
- 320/390/810/1200 widths and short 320×568, 390×667; documentElement clientWidth/scrollWidth, screenshot, content bounding rects incl popup right/left clipping, long titles on path cards, inline key concept.
- Mouse/focus halo not cut; horizontal root scroll = zero. Focus and scroll during text resizing and active section navigation.
- Verify original image, captions, quotes; note that full tables/math/citations are absent from illustrative M1 excerpt, not “PASS” for Web parity.

### D5 Cost/performance/integration gap review
- Confirm no new dependencies, network calls triggered by every knowledge hover, unsafe HTML injection, global event listener leaks, and double stacked sticky panels.
- Source review `PublicArticle`, `ArticleReader`, Studio knowledge link schema and `RelatedStories` for Web adapter; contentRepository public-only.
- Record relative cost, mobile density and likely hydration/CLS risk; no invented performance numbers.

### D6 Integrated critique and targeted refinement
- Inspect all three phases together on the *same* 320/390/1200 article; prioritize the strongest usability/accessibility flaw, not new features.
- Run real 6-cycle pass with one scoped fix at a time, minimal regressions (initial state, selected next step, popup open, scroll, return).
- Mark PASS/FAIL/BLOCKED; distinguish source-only from measured DOM/browser evidence and from production readiness.
- Handoff final owner-facing visual comparison, recommended Web adapter work breakdown and explicit authorization gate.

## Reporting
Send ChatGPT a brief result for each of six passes with IDs, viewport, exact DOM evidence, severity, source change scope, Framer diagnostics, and residual caveats. Ask ChatGPT for independent critique after each pass. Owner need not be consulted for *Framer-only* technical corrections already allowed; do not publish/merge. The branch `docs/article-reading-experience-three-phase-roadmap-20261107` is documentation only; PR #54 is draft.

## Expected first action
Open the Framer page in real Brave, test **M1 font size & TOC active state**, **M2 popover focus/close**, and **M3 step2 expansion** at 320 and 1200. Provide a baseline PASS/FAIL/BLOCKED table before proposing any changes.
