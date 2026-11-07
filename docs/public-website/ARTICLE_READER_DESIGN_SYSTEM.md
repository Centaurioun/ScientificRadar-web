# ScientificRadar Article Reader — Design System & Editorial Template

**Status:** Proposed canonical design contract (Framer prototypes reviewed, live Web integration not authorized)  
**Version:** Design baseline 0.1 · 2026-11-08  
**Applies to:** All future ScientificRadar English/Turkish article reader templates, not only Bennu  
**Evidence:** Framer article lab `t6PbsTds_` (`/bennu-related-reading-design-lab`); CMS field lab `Kr4RQUn1q` (`/article-cms-template-lab`).  
**Governance:** This Markdown file specifies design and behavior. It is **not** a runtime configuration file, replacement for Web tokens, or a guarantee existing Studio/Web code implements these capabilities.

## 1. Principles and boundaries
1. **One reader template, many articles.** Article editors select text, taxonomy, references, media, concepts and related stories; they do not design a new layout, set arbitrary CSS, or write React for every article.
2. **Scientific truth above visual polish.** Clearly separate editorial article vs original peer-reviewed source; observations vs scientific inferences; published evidence vs illustrative demo assets; sample-specific quantitative data vs broad assertions.
3. **Progressive disclosure.** Show a concise `At a Glance`, collapsed source-status panel, optional section-linked Key Concepts, and numbered `Sources`; don't duplicate the same editorial summary in multiple sidebars.
4. **Responsive by default.** Scientific measurements, error bars, legends and labels must not be cropped to fit; a 320px device must not force the entire page into horizontal scrolling.
5. **No pretend interactions or publishing.** Only show category/topic or article links when verified destinations exist and are publicly visible. Omit optional features with insufficient approved content.
6. **No AI required for ordinary publishing.** Editor fields and defaults drive every reader module; AI may suggest wording or links, but editorial review and safe publishing are explicit gates.
7. **Source ownership.** Studio stores editable records; publishing serializes a reviewed immutable snapshot. Public Web renders the snapshot using existing reading, citation and sanitizer components. Framer is the visual design reference, not the source of production truth.

## 2. Named layout regions, responsive contracts
| Region | Desktop (approx. 1200+) | Tablet 810 | Phone 390 / narrow 320 | Editor supplied? |
| --- | --- | --- | --- | --- |
| Masthead | Sticky top; Scientific dark wordmark + teal Radar | Same; conserve height | Single compact row | **No** (Web template) |
| Topic chips | Primary category, subcategories; editorial type neutral | Wrap as needed | Wrap; no fake navigation | **Yes:** existing taxonomy/type |
| Header | H1, dek, author/byline, dates, reading time | Full reading column | Fluid headings; single column | **Yes:** metadata |
| A− / A / A+ + text alignment | Compact control strip **above** Figure 1/hero, never occlude scientific image | Same | A−/A/A+ visible, optional alignment hidden; default 17px | **No** (user preference) |
| Hero | Original media with precise caption, source, credit and license | Fluid `contain` | Fluid `contain` | **Yes:** Media Library |
| Left TOC | Sticky rail with **sticky "In this article" title** and H2/H3 scrollspy | Collapsible in content | Collapsible; header remains clear | **No:** derived from heading outline |
| Main prose | ~680px preferred reading measure | Up to ~700px | Width minus safe gutters | **Yes:** body |
| At a Glance | One editorial-summary box | In flow | In flow | **Yes:** existing summary + reviewed takeaways |
| What underpins this story? | Collapsed disclosure, truthfully composed | Same | Same | **Partly:** verified source metadata + editorial caveat |
| Key Concept | Optional **contextual sequence**, typically 1–3 short text-only definitions; desktop right rail emphasizes the concept linked to the current H2 and dims previous/next, then disappears outside relevant sections | Inline adjacent to each linked section; no sticky concept rail | Inline adjacent to each linked section | **Yes:** approved ordered concepts + H2 anchors; **no** per-story styling |
| Knowledge preview | Trigger-anchored popup within viewport; Wikipedia/internal | Same | Tap/focus, constrained popup | **Yes:** reviewed links, **No:** positioning |
| Supporting figure/table | Embedded near related prose, numbered caption/credit and table footnotes | Fluid and accessible | Table region scrolls *inside itself* only | **Yes:** media/table blocks |
| Sources | Compact `Sources` H2, numbered mint badges aligned with source title, full DOI | Same | Long bibliography wraps; no fake DOI | **Yes:** source records |
| Related Reading | 3 visible cards with arrows, counter, horizontal scroll | ~2 cards | 1 plus partial next card | **Yes:** curated relation/Series; **No:** carousel UI |
| Decorative imagery | Optional low-contrast, clearly contextual watermark; not scientific evidence | Reduce prominence | Prefer faint or omit | **Optional:** media with rights approved |

**Breakpoint caution:** Framer article lab begins desktop rails near 1150px and is viewed at 1200. Existing Next.js Web `xl` may be 1280; reconcile with actual Web layouts before merging, testing 1140–1300 widths. Do not infer production dimensions from Framer screenshots.

## 3. Visual language and tokens
Adopt the existing ScientificRadar brand system; reconcile with the existing Web CSS variables rather than hardcoding a second token namespace.

- Wordmark: serif display similar to **Merriweather/Georgia**, dark `Scientific`, teal `Radar`, accent prototype `#15747b` (subject to AA contrast check on actual backgrounds).
- Background: quiet warm white near `#FAFAF8`, ink near `#203b42`; mint accent surfaces; pale dividers/borders instead of colored informational callouts.
- Prose: serif, 17px default, A− 15px, A+ 19px; line-height roughly 1.8–1.9. Reader preferences are user interactions; they are **not** CMS article style fields. Mobile default stays 17px. Use visible label and `aria-pressed`; respect browser text zoom.
- Alignment: **Left default**. Offer `Justified` as optional wider-screen reader preference, never forcibly justify tight mobile columns; captions/tables/citations remain independently aligned.
- Headings: one H1 in article header; semantic H2/H3 in editor; TOC outline derives IDs. Do not use fabricated H2 headings for card visual appearance.
- Links and focus: consistent teal hyperlinks, distinct focus ring, >=44px interactive touch target where feasible. Category pills visually distinguish interactive (valid route) from neutral metadata.
- Icons: use a consistent small icon vocabulary only when helpful; **no decorative icon** preceding `At a Glance` or `Sources` in the approved design.
- Right Key Concept: compact **text-only** definitions, no thumbnail, illustration, background image, Why it matters or Key points. The desktop card rail appears only during relevant H2 sections; currently relevant concept is fully opaque, previous and upcoming entries subdued. The next concept takes emphasis on scroll; after the final concept’s section the rail disappears. The left TOC stays independent. Mobile cards appear inline exactly at their respective editorial section.
- Scientific figures: `object-fit:contain` and meaningful accessible alt; enlargements display complete figure, not cropped. Photo-based decorative art must never be mislabeled as the experimental figure.
- Relative asset paths must be resolved through the publishing media contract. External URL reliance in Framer is not final Web hosting policy.

## 4. Stable article sequence
1. Sticky top header / wordmark.
2. Taxonomy chips (primary category, subcategory) and neutral editorial type.
3. H1 + standfirst/dek + byline/dates/reading time.
4. Compact A−/A/A+ and optional alignment strip immediately **above** hero.
5. Hero image and full scientific caption/credit.
6. Single `At a Glance` summary; no duplicate Summary/Why it matters/Key points elsewhere.
7. Collapsible `What underpins this story?` derived from reviewed evidence.
8. Text with in-flow H2/H3, citations, figures, tables, math and optional inline Knowledge Links. Desktop left TOC stays visible with its **heading**, right contextual Key Concepts only while their corresponding sections are current; narrow screens show individual concept descriptions in flow.
9. `Sources` bibliography with verified DOI and correction entries.
10. `Related Reading`, collection identity displayed only where applicable; omit entirely with no suitable public article destinations.

## 5. Behavioral contracts
### Section TOC
- Clicking or keyboard-activating a section scrolls smoothly with appropriate sticky-header offset; reduced-motion preferences use immediate movement.
- **Mobile:** close disclosure first, commit React layout, then scroll and focus heading when needed. Do not `scrollIntoView` before the menu collapses.
- Active heading updates from scrollspy. Preserve native URL fragment/deep-link/Back semantics in the actual Web reader; Framer Preview host can interfere.
- Include scroll targets for H2 and H3 as appropriate. Keep "In this article" label sticky with its list, not disconnected.

### Knowledge Link: Wikipedia / ScientificRadar
- Only editor-approved links are rendered; prefer a **published ScientificRadar article** when it is a precise internal match, else verified Wikipedia entry; do not auto-link every repetition.
- Text is semantically an accessible button/link with focus and touch. On desktop fine-pointer hover, show popup **anchored beside the trigger** using real DOM rectangles, flip above/below as space dictates, clamp to viewport and allow internal popup scroll if necessary.
- Escape and explicit Close return focus to trigger without reopening. Outside pointer or intentional page scroll can dismiss. Clean listeners/timers/portals on close/unmount.
- Wikipedia preview excerpt is curated/stored with attribution/locale, not an unverified live excerpt; no network request on every hover. Display and validate actual Wikimedia HTTPS URL. Internal preview uses approved public article ID → current public slug/title, never a demo or draft.
- A Knowledge Link is context, **not** a scholarly claim citation; sources remain in `Sources`.

### Figure, media and tables
- Editor selects a verified MediaAsset and inserts it at the proper prose position; figures receive sequential Figure N, caption, credit, URL/DOI and license; original images with separate restrictions must not be assumed reusable from an article-wide license.
- Figure lightbox closes by backdrop, Close Figure or Escape. Clicks inside figure/caption do not dismiss. Focus trap when modal; restore opening trigger on close; lock underlying scroll; respect keyboard navigation.
- Scientific charts do not crop labels/scales/error bars; figures should have sufficient source-method context, and table numbers must preserve units, subgroups and uncertainties.
- Table has an accessible caption and column headings; on mobile the inner table region scrolls, never the whole document; do not invent a table based on unverified findings.
- Source DOI belongs to the original research, not the ScientificRadar editorial article. Preserve Author Correction/erratum as a separate source ledger item.

### Sources and source status
- Citation number left badge at baseline of the bibliographic heading; don't insert number on a separate full-width row.
- Display authors, title, publication/year, and available volume/issue/pages/article number; show validated DOI as `https://doi.org/<DOI>` with descriptive accessible name. Omit missing identifiers, do not synthesize them.
- [n] in-text jump ↔ bibliography return should preserve the specific occurrence and use smooth/reduced-motion navigation with focus and native fragment semantics.
- `What underpins this story?` describes **journalism type**, linked research source status, correction and relevant evidence limitation. It is generated from verified records + optional editorial caveat; no self-declared peer-review or AI trust score.

### Related Reading
- General headline: **Related Reading**, not `Thematic Reading Trail`. If article is in an approved Series/Collection, show a smaller collection label, not an entirely different card design.
- Prioritize explicit reviewed recommendations, then public articles in same Series, then suitable published related category/tag matches (needs editorial constraints; do not show random filler). Exclude current, unpublished, withdrawn, duplicate and blocked records.
- Carousel desktop ~3 cards, tablet ~2, phone one + peek. Prev/Next buttons, visible counter and native horizontal/swipe navigation; keyboard focus and reduced-motion support; **never auto-advance**. A stable `relatedIds` order should be preserved from editorial review.
- If no suitable published recommendation exists, hide this module rather than linking to concepts, DOI-only research records or unpublished articles. The Framer lab cards that open a research DOI are **not** intended production recommendations.

## 6. Conditional / optional feature policy
| Feature | Standard? | When to show |
| --- | --- | --- |
| Article title, taxonomy, prose, responsive typography | Yes | Every public article |
| At a Glance | Default when reviewed summary exists | Don't synthesize unreviewed bullet points |
| Hero | Preferred | Only verified licensed asset; omit if none |
| Key Concept | Optional, typically 1–3 unique section-linked definitions | Short, editor-reviewed term and definition with a stable H2 section anchor; **no** concept imagery, Why it matters or Key points; hide the desktop rail outside mapped sections |
| Knowledge Links | Optional, sparse | ReviewStatus approved, valid locale and target |
| What underpins this story? | Yes for sourced scientific journalism; may collapse | Source ledger and metadata provide grounded explanation |
| Additional figure/table | As needed | Only meaningful evidence, caption and rights/units |
| Related Reading | Conditional | Only approved public destination articles |
| Decorative footer/side image | Optional | Relevant asset with verified license; avoid harming contrast/reading |

### Section-linked contextual Key Concepts (owner-approved refinement, 2026-11-08)
- A scientific article may contain **zero, one, two, or three** curated Key Concepts by default. Do not fabricate or automatically fill slots. Keep each concept to a concise name plus a short, scientifically reviewed definition.
- Every selected concept must have a stable, unique and contextually appropriate H2 anchor in the canonical article body. The examples are `Isotope ratio` at `bennu-isotopes` and `Petrography` at `bennu-alteration`; the latter is explanatory context, not an additional claimed finding from the study.
- **Desktop:** the concept rail is absent before the first mapped section; when the first mapped section becomes current, it shows the active concept prominently and a subdued preview of the next. Upon transition the previous fades and the second becomes prominent. Once the page reaches an unmapped later section, the entire rail fades and becomes non-interactive/non-announced. The rail must not stay pinned for the whole article.
- **Tablet and mobile:** no floating, sticky or animated right rail. Each concept definition is inserted once adjacent to its relevant H2/paragraph. Do not duplicate the same content visibly or to assistive technology.
- Visual transitions use opacity only, avoid layout shifts, and honor `prefers-reduced-motion`. Ensure inactive/hidden concept cards do not capture pointer or keyboard focus.
- Studio's future editable article concept list stores `{id, title, definition, afterHeadingId}` per item. It must not add per-article animation, styling, image, Why it matters, or Key points fields to this feature. Knowledge Links (Wikipedia vs internal hover previews) remain an independent feature and are not themselves Key Concept cards.
- The published serializer validates stable H2 IDs and unique anchor mapping and preserves article order. If an anchor is deleted, the editor should flag it for repair rather than silently reassign a concept. Real-browser scrollspy/fade tests are required before production approval.

## 7. Governance and acceptance
- Every visual/interaction change should go through one template component and token-level review, never article-specific random styling.
- Web's `ArticleReader`, `ArticleHeader`, `CitationInteractions`, `CitationList`, `RelatedStories`, sanitizer, KaTeX/scientific tables and media-provenance logic remain source components. **Adapt** them; do not paste the Framer demo wholesale.
- Review at **320, 390, 810, 1200, and the Web 1200–1280 transition**, including 320×568/390×667. Run real click/keyboard/hover/touch/reduced-motion with capable tooling; source-only `diagnostics=[]` and screenshots are not live PASS.
- Scientific fact verification and reusable image licenses must be separately checked before real publishing. Sample A data and licensing do not automatically transfer to B/C.
- This rulebook itself cannot create CMS fields or change immutable publication snapshots. Implement such changes only in approved, separately tested Studio/Web PRs; no current production authorization.
