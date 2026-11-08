# ScientificRadar Article Reader — Six-Cycle Iterative Refinement & Handoff

Date: 2026-11-08
Scope: Framer-only design labs and documentary research; no Web/Studio app-code changes, no publication.
Framer Reader: /bennu-related-reading-design-lab, page t6PbsTds_, source BennuRelatedReadingConcept.tsx, export codeFile/ADnxWxr:default.
Framer CMS UX: /article-cms-template-lab, page Kr4RQUn1q, source ArticleCMSDesignLab.tsx, export codeFile/P0Vi6VZ:default.
Original Bennu A editorial: /bennu-presolar-stardust, page W1F5b_kMS and source BennuPresolarEditorial.tsx — deliberately not changed.

## Evidence and methodology
The installed Product Design plugin's audit/research criteria were read to inform our review; **the full Work-mode Product Design flow was NOT run in this chat**. We instead independently inspected connected real GitHub Studio/Web source and Framer source, rendered Framer screenshots, examined them visually, and iteratively patched an isolated Framer lab.

**Verification limits:** Framer files.write completed with diagnostics=[] for final source versions; four responsive screenshots of article and at least two CMS screen widths captured and read. Actual live Brave mouse/hover, keyboard/tab focus, touch, narrow DOM scrollWidth, PDF source-to-figure pixel parity, reduced motion, real external DOI navigation, LCP/INP/CLS, CMS persistence and public Web publishing were **NOT** verified. Do not convert these into PASS.

## Cycle 1 — Baseline and real-system inventory
**Question:** Are we solving an existing CMS problem with a parallel hard-coded system?
- Inspected Studio Article, Series, KnowledgeLink, ScientificSource and MediaAsset model, public snapshot adapter, Web PublicArticle and RelatedStories.
- Confirmed existing categories, editorialType, source IDs/DOIs, Series membership, knowledge link library, media metadata and article rich text.
- Found crucial integration gaps: article-attached selected Key Concept, Knowledge occurrences, full citation fields, public Series, and serializer currently outputs relatedIds: [].
**Decision:** Reuse current libraries; plan additive contract, not a second manual template engine. Global visual behavior stays in Web.

## Cycle 2 — Information architecture / removal of redundancy
**Question:** Does concept context duplicate article summary and weaken reading?
- Preserved a single At a Glance summary.
- Designed a self-contained Key Concept: title + isotope thumbnail, definition, concept-specific Why it matters and Key points; right rail desktop, in-flow mobile.
- Collapsed source-status disclosure derived from actual bibliography; retained distinct Sources section and Related Reading.
**Decision:** Concept is optional; default at most one curated card. Do not put generic article Summary into concept details.

## Cycle 3 — Science, metadata and rights
**Question:** Can editors add a second image and real numerical table without losing fidelity?
- Framer added second Bennu image, a NASA Scientific Visualization Studio global visualization distinct from the original research Figure 1, with source/credit and enlarge UI.
- Added editorial Table 1 with five groups and source DOI (two angular SiC 55 +12/-10; overall SiC 45 +7/-6; angular O-rich 2 +4/-1; most non-S-rich matrices 4±2; S-rich mean 87 +26/-20 ppm). This is a compiled editorial table from the real study, not a copied figure.
- Maintained Nguyen et al. original research DOI 10.1038/s41550-025-02688-3 and separate correction DOI 10.1038/s41550-026-02811-y.
- Corrected 72% total O-rich vs 75% hummocky subgroup wording in **lab only**; do not propagate the original A's old erroneous subgroup descriptions.
- Helix Nebula decorative image from NASA SVS with credit and explicit **rights review required**. Bennu-themed footer watermark is an original layout treatment of a separately sourced NASA visual, also not experimental evidence. Image-specific right-to-reuse and third-party credit review remain publication gates.
**Decision:** Source, sample, units, uncertainty and license travel with figure/table blocks through CMS and published snapshot.

## Cycle 4 — Interaction and responsive design
**Question:** Do the requested microinteractions make sense in context, at mobile/desktop?
- Hover popup formerly fixed to viewport corner: now a React portal anchored to the hovered/focused Knowledge trigger, measured with DOMRects and clamped to viewport. Wikipedia preview uses a verified encyclopedic destination and an editor-authored short description. No hover network calls.
- Kept desktop TOC title sticky, mobile collapse→layout-commit→smooth scroll/focus logic, and accessible reader font controls above hero (not overlaying evidence).
- Related Reading is 3/2/1+peek carousel, click/scroll code, counts, public content guard in specification; does not auto-scroll or invent published editorial links.
- Framer image and numerical table visually rendered in 1200/810/390/320. Table uses independent inner scroll, not page-wide overflow.
**Observed:** Code diagnostics=[]; screenshots show no obvious clipping. **BLOCKED:** actual anchored popup focus/hover, menu scroll, figures, table keyboard scroll, root overflow and reduced-motion behavior in a live browser.

## Cycle 5 — CMS authoring demonstration and publisher architecture
**Question:** Can a non-technical editor reproduce the design without AI?
- Created separate interactive Framer CMS **design mock** with tabs: Article / Key Concept / Evidence / Related; inputs update a mock reader preview, plus add/remove in-memory example figure/table.
- Demonstrated Article type/category/series/summary; optional concept Why & Key points; Wikipedia/Internal choice; source/DOI and table/media insertion; conditional Related Reading.
- Compared actual existing Studio fields vs gaps. Created a separate CMS editorial contract doc covering publishing, schema version, visibility safety, reviewed sources, metadata, rights and code ownership.
- No actual Studio save or renderer integration was attempted.
**Decision:** Editor stores content; Web template automatically owns CSS/scrolling/popup/font/carousel. Contract extension is future separate PR(s), with owner permission.

## Cycle 6 — Independent whole-page visual and scope critique
**Question:** Is the page coherent with real content, or a collection of decorative experiments?
- Captured and visually reviewed article lab screenshots at **1200, 810, 390 and 320 px**, and CMS mock at 1200 and 390.
- Checked hierarchy: categories→headline→controls→Figure 1→At a Glance→in-flow text/figure/table→Sources→Related Reading; optional concept appears in right rail on desktop/in flow on mobile.
- The high-density 320 phone view remains long (scientific article with one additional figure and table); that is realistic content, not reason to automatically shrink font below 17px.
- The right concept card and photo footer can feel tall; maintain optional feature policy and image-specific credits, hide missing fields. No compulsory decorative art on every story.
- Current related card images are **concept mock illustrations**, not published article thumbnails. First two point to original scientific paper DOIs, not fabricated public ScientificRadar story URLs. Public implementation MUST link published editorial pages and hide drafts.
- Original approved A source was preserved; it still has earlier sample subgroup wording that should be corrected before any genuine publication.
**Verdict:** Framer design and CMS authoring approach are ready for OWNER UX review; production implementation and compliance readiness are NOT established. No confirmed P1/P2 was observed in static screenshots, but that is NOT a clean live E2E certificate.

## Final artifacts
1. Reader: https://framer.com/projects/Scientific-Radar--boKLyC3EXgf7Nhs9yoC7-3fySI?node=t6PbsTds_&view=preview
2. Mock CMS: https://framer.com/projects/Scientific-Radar--boKLyC3EXgf7Nhs9yoC7-3fySI?node=Kr4RQUn1q&view=preview
3. Design standard: docs/public-website/ARTICLE_READER_DESIGN_SYSTEM.md
4. Editorial mapping: docs/public-website/ARTICLE_READER_CMS_EDITORIAL_CONTRACT.md

Screenshots captured 2026-11-08:
- Article 1200: https://framerusercontent.com/screenshots/on-demand/c5fe0176-c0fa-482b-92e3-4fbbb699222a.jpg
- Article 810: https://framerusercontent.com/screenshots/on-demand/77e4f874-fedf-4f7a-b97a-9c315d354cce.jpg
- Article 390: https://framerusercontent.com/screenshots/on-demand/6dc12d3e-6187-40ec-9f1a-a2aa703d7976.jpg
- Article 320: https://framerusercontent.com/screenshots/on-demand/4bbe290b-d3df-416e-993d-a31ec66b6535.jpg
- CMS 1200: https://framerusercontent.com/screenshots/on-demand/9ca4d425-032a-40fe-89ab-f18fd997fd4e.jpg
- CMS 390: https://framerusercontent.com/screenshots/on-demand/4af3e724-5e5b-4b68-b1df-a491150a0a7f.jpg

## PASS / BLOCKED register
| Property | Status | Evidence |
| --- | --- | --- |
| Final Framer code export and compilation | PASS (source only) | files.write diagnostics=[] |
| Unpublished / noIndex Framer pages, original A preserved | PASS | Framer tree IDs, flags, source length and exports |
| Reader rendering at 1200/810/390/320 | PASS (static) | screenshots above |
| CMS mock rendering at 1200/390 | PASS (static) | screenshots above |
| Real NASA context visual, table, concept blocks in DOM source | PASS (source/static) | source and screenshots |
| Actual Wikipedia hover/focus/touch/Escape & popup geometry | BLOCKED | real browser interaction not performed |
| TOC smooth scroll/keyboard focus/history | BLOCKED | real browser interaction not performed |
| Figure 2 modal trap, backdrop click & keyboard | BLOCKED | real browser interaction not performed |
| Table real keyboard horizontal scroll & DOM root overflow | BLOCKED | actual DOM measurements unavailable |
| Carousel drag/swipe/arrows & screen reader behavior | BLOCKED | not live tested |
| Full NASA/ESA asset rights/copyright verification | REVIEW REQUIRED | attribution noted; permissions not fully cleared for publishing |
| CMS create→save→reload→publish→Web | NOT IMPLEMENTED | Framer mock intentionally isolated |
| Web/Studio versioned contract vNext | NOT IMPLEMENTED | planned only |
| LCP / INP / CLS / reduced motion | BLOCKED | no measured browser evidence |

## Future owner decisions
- Approve overall article system, concept card and editor mapping, or request refinements.
- Authorize separate repo app-code PRs, or remain Framer/docs only.
- Require independent scientific copy, figure license, and actual editor-to-Web contract QA before public release.
- Never merge PR #54, publish Framer, or deploy production as part of this design/report task.
