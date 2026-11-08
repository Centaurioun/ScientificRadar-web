# Bennu Related Reading — Owner-approved Framer Refinement

**Date:** 2026-11-08  
**Status:** Framer source diagnostics clean; 1200/810/390/320 static screenshots rendered and visually reviewed; *real browser interaction verification outstanding*.  
**Scope:** Only unpublished Framer lab `/bennu-related-reading-design-lab` (`t6PbsTds_`), code `BennuRelatedReadingConcept.tsx` / `codeFile/ADnxWxr:default`. Original published-code reference `BennuPresolarEditorial.tsx` and Framer A page `W1F5b_kMS` unchanged. ScientificRadar Web and Studio app code untouched.

## Owner changes implemented in the isolated lab
- **Key Concept** reduced to one meaningful card, based on the approved illustrated reference. Header `Key Concept`, compact original CSS-based `¹²C/¹³C` illustration beside `Isotope ratio` and concise scientific explanation, a quiet optional nebula-like decorative footer. **No redundant "Why It Matters" or "Key Points" modules** inside the card. Desktop right rail, tablet/mobile inline copy; CSS hides the inactive alternative.
- **At a glance** remains the single three-item summary, unchanged. Removed incidental heading glyph from both `At a glance` and `Sources`.
- **Toolbar** moved before the original Figure 1 (outside image pixels, so it does **not** cover scientific data); removed visible label `Article text size`, retained accessible A−/A/A+ group and compact desktop/tablet Left/Justified group. Mobile remains left aligned; corrected mobile typography rule so the font-size buttons affect body paragraphs.
- **Desktop TOC**: maintained the `In this article` heading as a sticky element within the scrollable left rail, beneath the sticky top masthead. `href` default action is prevented before the React post-commit `scrollIntoView(smooth)`, preventing the prior *instant anchor jump*. Scroll-margin increased to account for header. On `prefers-reduced-motion`, JS navigates without animation. **Actual smooth animation not yet measured in browser.**
- **Knowledge Link**: desk fine-pointer hover opens a selected definition and user click pins it, keyboard/button click still works. Escape, popup close and outside pointer dismiss with focus restoration source behavior maintained. Hover auto-dismiss delay and cleanup implemented. **Real hover/touch browser QA pending.**
- **Related Reading** unchanged from last owner's approval: carousel 3 desktop cards, 2 tablet, 1+partial next phone, explicit arrows and counter. Unpublished hypothetical cards remain labeled; only genuine source research DOI links appear for first two. No false editorial publication routes.
- **Decorative asteroid watermark**: low-contrast CSS sketch at bottom-left of related section, `aria-hidden` by CSS decoration and does not obscure text or represent scientific observation.
- **Scientific correction only in the *lab*:** corrected SiC 55 (+12/-10) ppm to two angular particles vs combined 45 (+7/-6) ppm; O-rich 2 (+4/-1) ppm angular vs 4±2 ppm across other measured matrices/clasts excluding S-rich 1–3; clarified 72% of all 25 O-rich vs 75% within hummocky sample. Verified against primary Nature Astronomy article `https://doi.org/10.1038/s41550-025-02688-3`. The original Bennu A source must be corrected in its **own follow-on editorial QA**, since this isolated lab was not used to overwrite A.

## Evidence
- `api.files.write("BennuRelatedReadingConcept.tsx")` returned `diagnostics=[]`.
- All four page frames link to same export; page remains `visible=false`, metadata `noIndex=true` and `noIndexSite=true`, no Framer publishing.
- Static images (final):
  - 1200: https://framerusercontent.com/screenshots/on-demand/9f9f7c51-e1e4-4427-a6c8-5fb0d443f8db.jpg
  - 810: https://framerusercontent.com/screenshots/on-demand/fbf38df6-77c4-4a97-a0e6-ebf1e16fb05d.jpg
  - 390: https://framerusercontent.com/screenshots/on-demand/3ebee7cd-4c2a-46f8-b7cd-9324cc97ed38.jpg
  - 320: https://framerusercontent.com/screenshots/on-demand/cc1afc34-4a3c-4f74-acfd-85215ae27acb.jpg
- Visual review confirmed no obvious horizontal clipping, original figure unobscured, source badges and related cards retained, single visible concept box per breakpoint, controls above figure, compact mobile layout.

## Remaining test and product gates
- **BLOCKED / not independently performed:** real mouse hover for Knowledge Link, popup focus/dismiss sequence, exact root `scrollWidth/clientWidth`, TOC actual smooth/instant behavior, reduced-motion runtime behavior, document history, carousel click/drag/touch/keyboard, actual LCP/INP/CLS.
- The top category pills remain non-clickable until actual topic routes are verified. `Feature` is article type metadata; avoid dummy links.
- This Framer lab includes planned editorial cards, **not real published ScientificRadar links**. Production related reading should resolve public-only related IDs via existing `RelatedStories` contract; collection should be conditional editorial metadata, not a new always-on recommendation engine.
- Do not migrate this example as a wholesale article component. Real Web must preserve sanitized `bodyHtml`, scientific tables, figures, equations, citations, DOI records, metadata and content publication contract.
- No PR merge, Framer publish, Web or Studio implementation or production action authorized.

## Owner review
Preview: https://framer.com/projects/Scientific-Radar--boKLyC3EXgf7Nhs9yoC7-3fySI?node=t6PbsTds_&view=preview

The objective is to review the **design**, then run live browser interaction QA before authorizing transfer to other article pages.
