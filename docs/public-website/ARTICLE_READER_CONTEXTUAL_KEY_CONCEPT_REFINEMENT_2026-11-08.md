# ScientificRadar Contextual Key Concepts — Owner Refinement and QA

Date: 2026-11-08
Status: Implemented in two unpublished Framer design labs; static visual QA complete; live scroll/focus QA pending.
Design standard updated: ARTICLE_READER_DESIGN_SYSTEM.md.
CMS schema proposal updated: ARTICLE_READER_CMS_EDITORIAL_CONTRACT.md.

## Owner decision
- Replace the always-on right Key Concept panel with brief **section-linked contextual concepts**. The chosen item becomes prominent when its article H2 is active; previous/future items remain faint. When the reader moves beyond relevant sections, the whole panel disappears instead of following the user to Sources or Related Reading.
- No Key Concept thumbnail, isotope illustration, nebula image, Why it matters or Key points section.
- Allow two or three concepts per article when scientifically helpful; never require a fixed number. Each has a short term, scientifically reviewed definition and a stable relevant H2 anchor.
- On tablet/mobile, render definitions *inline* at their section, not as a floating rail.
- Keep existing At a Glance, original figures, new table, Sources/DOI, Related Reading, font controls and Knowledge Link features unchanged.

## Framer reader
Page: https://framer.com/projects/Scientific-Radar--boKLyC3EXgf7Nhs9yoC7-3fySI?node=t6PbsTds_&view=preview
Source: BennuRelatedReadingConcept.tsx; codeFile/ADnxWxr:default.
- Isotope ratio -> section `bennu-isotopes`, Reading a stellar fingerprint.
- Petrography -> section `bennu-alteration`, Water left a patchwork.
- Shared existing scrollspy state selects the context index. Before `bennu-isotopes` / after `bennu-alteration`, right rail has no visible content. During isotope section, isotope is opaque and Petrography upcoming is faded. During alteration section, Petrography is opaque and isotope is faded. CSS opacity transitions are suppressed on prefers-reduced-motion.
- Active concept code is independent of the Knowledge Link popup, which continues to use Wikipedia or reviewed public internal content. A Key Concept is context, never a DOI citation or evidence-grade claim.
- Petrography is an example editor-authored definition tied to material textures; it is not advertised as a new measured result from Nguyen et al.
- No Key Concept image/Why it matters/Key points JSX remains (unused legacy style declarations could be cleaned up in production).

## Framer CMS UX mock
Page: https://framer.com/projects/Scientific-Radar--boKLyC3EXgf7Nhs9yoC7-3fySI?node=Kr4RQUn1q&view=preview
Source: ArticleCMSDesignLab.tsx; codeFile/P0Vi6VZ:default.
- Contextual Key Concepts editor now supports enable/disable, two sample entries, edit title and short description, choose H2 anchor, remove, add a third sample, and responsive preview mapping.
- The underlying real Studio and versioned Web publisher are NOT yet connected or modified. Future fields: an ordered array of `{id,title,definition,afterHeadingId}`, with unique and validated heading anchors. Web owns sticky/fade/opacity and mobile inline behavior.

## Six-cycle miniature design review
1. **Need:** Always-on concept card follows reader even when no longer relevant. **Decision:** section-driven relevance over permanent decoration.
2. **Content economy:** Remove visual, Why it matters, and key points. **Decision:** one term + one short definition, no At a Glance redundancy.
3. **Scientific fit:** Two sample concepts anchored to relevant H2s, not automatically extracted; avoid attaching Petrography to unrelated evidence.
4. **Interaction:** Existing TOC scrollspy drives contextual state; CSS opacity fades active/past/upcoming and hides rail outside both, reduced-motion respected. **Unknown:** real scroll-state timing and false activation in embedded Framer Preview.
5. **CMS ownership:** Editor selects multiple concepts and anchors. No per-story CSS, no AI requirement; existing source/knowledge records remain separate.
6. **Visual QA:** Four reader static breakpoints and two CMS static breakpoints inspected. Narrow widths show two simple inline cards, no supporting concept image or duplicated why/key-point cards. Desktop static screenshot shows no card at the **initial intro scroll position** by design; it is expected to appear after scrolling to the isotope section.

## QA register
| Check | Status | Evidence/limits |
| --- | --- | --- |
| Source compilation on both Framer component writes | PASS | `api.files.write` diagnostics empty |
| Render 1200/810/390/320 reader, 1200/390 CMS | PASS, static only | Screenshots below |
| Context title+definition only | PASS in source/static | No concept thumbnails, why, key points |
| Multi-concept CMS add/remove/H2 assignment | PASS source present | Form runtime interactions not separately exercised |
| Scroll-driven active/previous/future transitions | IMPLEMENTED, NOT LIVE TESTED | Existing scrollspy state, CSS transitions |
| Stop displaying right rail after last mapped section | IMPLEMENTED, NOT LIVE TESTED | Out-of-range active state maps to hidden rail |
| Reduced-motion CSS support | SOURCE PASS, RUNTIME BLOCKED | Media query exists; no emulation run |
| Hover/touch/keyboard/Back and exact DOM overflow | BLOCKED | No capable live interaction/browser QA in this turn |
| Real Studio save/publish/Web rendering | NOT IMPLEMENTED | Standalone Framer mock |

Static screenshots:
- Reader desktop 1200: https://framerusercontent.com/screenshots/on-demand/0ed5e096-c3f6-477b-9693-10a6e307da4e.jpg
- Reader tablet 810: https://framerusercontent.com/screenshots/on-demand/23f76fb5-5f6f-48d7-a02b-42a220cff084.jpg
- Reader phone 390: https://framerusercontent.com/screenshots/on-demand/17232509-e7c3-45fd-b55a-5349a9ca50d5.jpg
- Reader narrow 320: https://framerusercontent.com/screenshots/on-demand/54e88ea0-2b2a-4aef-8f74-a5adcd0a1293.jpg
- CMS desktop 1200: https://framerusercontent.com/screenshots/on-demand/12a09a51-e4c0-4287-9527-280ab536ceae.jpg
- CMS phone 390: https://framerusercontent.com/screenshots/on-demand/47131802-ba60-499b-b978-2251c6175843.jpg

Restrictions: Framer pages remain unpublished and noIndex. Original approved Bennu A `W1F5b_kMS` left untouched. No ScientificRadar Web or Studio app code, production deploy, GitHub PR merge or publication performed.
