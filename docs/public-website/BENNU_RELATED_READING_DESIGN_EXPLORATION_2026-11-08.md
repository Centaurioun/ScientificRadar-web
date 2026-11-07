# ScientificRadar — Related Reading Design Exploration (Framer-only)

**Date:** 2026-11-08  
**Status:** Isolated visual implementation complete; live-browser carousel activation/keyboard interaction not yet certified.

## Product goal
Replace the universal use of the misleading "Thematic Reading Trail" with a single reader-friendly **Related Reading** recommendation area. Articles that belong to a curated collection can show a small collection-context label; articles without a collection can use the same component with independently reviewed related articles. Existing Web `RelatedStories.tsx` is a three-column grid and `PublicArticle.relatedIds` already expresses related article IDs. The new design is **presentation research, not a new recommendation engine**.

## Framer output
- Unpublished page node: `t6PbsTds_`, route `/bennu-related-reading-design-lab`, metadata `noIndex=true`, `noIndexSite=true`.
- Code file: `BennuRelatedReadingConcept.tsx`, exported `codeFile/ADnxWxr:default`.
- Existing approved Bennu A page `W1F5b_kMS` and `BennuPresolarEditorial.tsx` were **not modified**.
- Same component in all 4 frames at 1200/810/390/320.
- `api.files.write` diagnostics `[]` after changes.
- Static screenshot captured via Framer API at all four widths; inspected desktop/390/320.
- **Not tested live:** actual click/drag/touch/keyboard, arrow-disable state transitions, root DOM overflow, accessible carousel narration, reduced motion and performance. Code-backed behaviors are not equivalent to runtime PASS.

## Visual decisions built into isolated lab
1. **At a glance** retained as-is, with small document glyph; no extra Summary/Why it matters/Key points copy added elsewhere.
2. **Key Concept** kept optional, responsive right-rail/inline placement, with a self-contained original decorative carbon isotope illustration. No experimental image or observational data is implied by the graphic.
3. **Sources** renamed from long bibliography heading; citation number badges shown in pale teal at the left of the bibliographic title, DOI links and return links unchanged.
4. **Related Reading** added as a full-width, bottom-of-article horizontal scroll rail rather than a narrow middle-column trail. Desktop shows ~3 cards, tablet ~2, mobile a card and a partial next card. Prev/Next buttons, a visible counter, native pointer/keyboard scrolling and CSS scroll snap are implemented. Never auto-advance. `prefers-reduced-motion` prevents scripted smooth motion.
5. **Mixed recommendation provenance:** The first two tiles link transparently to source research DOIs and say "Read original study". Four extra tiles are **illustrative unpublished editorial concepts**, deliberately without fake links. Production must show only reviewed, public, real editorial destinations (not these concepts).
6. **Topic tags** rendered as clear colored pills for visual assessment, but are **not falsely interactive** without verified category/subcategory routes. "Feature" remains editorial type metadata, not an unsupported browse route.
7. Existing **ScientificRadar black/teal wordmark**, typography, font controls, real Figure 1, citation source metadata and front-end interactions are preserved. A restrained sticky header appearance is an experiment, not approved production behavior.

## UX critique and tradeoffs
- The user's visual reference offers a stronger card/image hierarchy than the existing text-only end-of-article paragraph. The proposed full-width rail is less cramped than placing three image cards in 680px prose.
- Carousel discoverability: the next card peek, counter and previous/next arrows are all necessary; otherwise cards 4–6 may be missed. Test focus management, swipe, keyboard and reduced-motion in a browser before reusing.
- Prefer transparent curated relatedness; do not imply a causal scientific sequence or synthetic machine-personalization. If no suitable published recommendations exist, hide the section rather than filling it with unrelated articles.
- A "Collection" field/type would require editorial ownership in the Studio publication contract. The existing `relatedIds` field handles ordinary related articles today; don't break it, duplicate its algorithm or bypass public-visibility filtering.
- The right Key Concept remains narrow, even with an illustration; treat density as an owner-review choice, not a proven functional fault.
- New conceptual thumbnails are decorative original vector/CSS art, **not observational Bennu images** and not licensed figures from Nature. No fabricated research metadata used.
- Unrelated pending A scientific-text corrections on source-specific 55ppm / oxygen-rich abundance subgroup values remain a blocker to publishing or duplicating editorial copy; don't treat the concept lab as scientific fact approval.

## Web follow-on (separately authorized)
Reuse `RelatedStories.tsx` / `EditorialCard.tsx`, moving from grid to an accessible scroll-snap presentation only after owner approves it. Show collection label conditionally from approved editorial metadata if/when schema supports it. Do not publish, deploy, merge PRs or change Web/Studio application source as a consequence of this lab.

## Owner review
Compare original Bennu A page with unpublished experiment. Approve/reject: full-width scroll rail, partial-card mobile peek, three visible desktop cards, icon- and image-supported Key Concept, compact Sources badge styling, sticky masthead and pill appearance. Then run actual browser interactions before carrying into other Bennu editorials.
