# ScientificRadar Article Reader — CMS Editorial & Publication Contract

Date: 2026-11-08
Status: Operational contract aligned to the current combined implementation candidates. The Framer mock remains a design reference; implementation and test evidence is recorded below.
Visual standard: docs/public-website/ARTICLE_READER_DESIGN_SYSTEM.md
Interactive mock: Framer /article-cms-template-lab (Kr4RQUn1q) — NOT connected to Studio.

**Verified candidate heads:** Studio PR #31 `b8ecce006f8cbb75f130f8bd5c6aa781741bd4ce`; Web PR #58 `9d6f0d79dfffc8cdb62330eebe02d0adf2d4c508`. Both remain separate applications in separate repositories. The Web head adds only the isolated empty-catalog Playwright/CI harness to the application candidate at `8583ede2648d47be963dbf7c863cf716343b9d28`.

## A. Fundamental design decision

An editor creates a science article by filling the current Studio fields and selecting vetted assets/relations, WITHOUT specifying per-article fonts, colors, hover positions, responsive layout, carousel or sticky navigation behavior. The Web reader renders these automatically. Publishing follows the normal review, authorization and publication lifecycle; no AI assistance is required for routine field entry.

## B. Current Studio/Web schema and remaining boundaries

| Reader region | Current Studio PR #31 schema/producer | Current Web PR #58 consumer / remaining boundary |
| --- | --- | --- |
| H1, dek, summary, byline, date | `Article.title/dek/summary/authorId/publishedAt`; serialized author identity is included in the snapshot | Web renders these snapshot values. The cross-app lifecycle exercised role-separated review/approval and publish; it did not authenticate public requests as editorial authors. |
| Taxonomy and editorial type | `primaryCategoryId/categoryIds`, `Category.slug/parentId`, `editorialType` | Web resolves category/subcategory routes and keeps editorial type separate from taxonomy URLs. |
| Series | `Article.seriesId`; `Series.title/slug/articleIds` | `seriesId` is optional in V1. Web Related Reading resolves public same-series articles, then same-category candidates. |
| At a Glance | Reviewed `summary`; Web structured `key-takeaways` block | Keep the summary singular and avoid repeating key-concept content. |
| Contextual Key Concepts | `Article.keyConcepts[]` stores ordered `{ title, definition, headingId }`; the Studio workspace edits and saves this list | V1 snapshot and Web `PublicArticle` carry `keyConcepts`; Web controls placement. The Framer mock’s `afterHeadingId` naming is illustrative and differs from the shipped `headingId` field. |
| Knowledge Links | Studio retains the approved KnowledgeLink library; producer accepts serialized public `knowledgeLinks` | Web V1 can validate and render public KnowledgeLink records. Per-occurrence body anchors are not part of this snapshot contract. |
| Editorial notices | `Article.editorialNotices[]` supports correction, retraction and updated-information notices | V1 snapshot and Web render notices; linked targets resolve only through public articles. |
| Hero and inline scientific figure | `featuredMediaId`, media rights metadata, body HTML and rights evidence flow into the producer | V1 validates public media and rights evidence; Web sanitizes and renders figures. Preserve rights checks and figure semantics. |
| Scientific tables and math | Sanitized editor HTML / serialized blocks; Web block types include tables and math | The local cross-app lifecycle exercised save/publish/render, but was not an exhaustive fidelity audit of every editor element. |
| Sources / DOI | `sourceIds`; source metadata includes DOI and optional volume, issue, pages and article number | Those optional fields serialize in V1. Editorial correction notices are separate from source bibliographic records; `correctionOfSourceId` is not a current V1 field. |
| Related Reading | `Article.relatedIds[]` is an editable field and the V1 serializer copies it; `seriesId` also serializes | Web resolves explicit relations only against active public articles, then public same-series and same-category articles, filtering self and locale mismatches. The prior `relatedIds: []` hard-code finding is superseded. |
| Reader size, alignment, TOC, popup, carousel | Global Web behavior | No per-article layout fields are required. Real device/screen-reader and performance work remains outside the local publication lifecycle test. |
| Decorative asteroid/nebula | Media Library asset rights | Treat decorative art as contextual and do not present it as experimental evidence. |

The current snapshot remains `PUBLICATION_CONTRACT_VERSION` 1.0.0. Studio producer and Web consumer are separate; the exact local lifecycle evidence and its limits are in Section G.

## C. Editor workflow and publication contract

1. Open Studio Articles → New. Enter headline, dek, article text, byline, categories, type, summary, author, SEO and optional Series. The same Web page template appears for every story.
2. At a Glance displays the reviewed summary and chosen takeaways (if authored); only one summary block.
3. In Article Insights, add, order or remove **Key Concepts**, each with a reviewed title, concise definition and selected H2 `headingId`. The current Studio record and V1 snapshot store these values; Web handles desktop/mobile placement. Do not add concept thumbnails, “Why it matters”, “Key points”, or per-story CSS.
4. Maintain approved Knowledge Links in the existing library with a safe Wikipedia HTTPS page or internal public article target, locale, editor-written preview, source attribution and review status. The V1 snapshot can carry approved public KnowledgeLink records; it does not model a specific in-text occurrence anchor. Do not imply automatic linking or Wikipedia fetches.
5. In existing Media Library, upload/select each scientific figure with credit, source DOI/URL, figure description/alt text, license, rights approval and 'experimental' vs 'contextual' distinction. Insert into article body. For a table, provide caption, units, semantic column headers, rows, uncertainty and data DOI; Web renders a bounded horizontal table scroll at 320px.
6. Select ScientificSource records, verify DOI, journal, year and bibliographic details. Distinguish Author Correction as a separate source. Show a full Sources bibliography and citation-to-entry and Return-to-Text per occurrence. Never invent missing DOI.
7. Reflect publication type and any published correction/retraction notice from the serialized metadata. V1 has no separate `evidenceNote`; do not add a self-certified peer-review or AI score field.
8. Choose reviewed related article IDs or a Series. The producer serializes the article’s explicit `relatedIds` and `seriesId`; Web filters candidates against its current public article list, excludes self and locale mismatches, then fills from same-series and same-category articles. If none qualify, Related Reading is empty/hidden.
9. Preview with accessibility/rights/DOI guards, then publish immutable versioned record only after scientific and editorial review.

## D. Current V1 snapshot fields and unsupported extensions

The current candidate implementation uses `PUBLICATION_CONTRACT_VERSION` 1.0.0 and carries these fields:

- `keyConcepts`: ordered `{ title, definition, headingId }` items.
- `relatedIds` and optional `seriesId`.
- `editorialNotices` for corrections, retractions and updated information.
- Optional KnowledgeLink records, source volume/issue/pages/article number, and rights evidence.

No `knowledgeOccurrences`, `evidenceNote`, or `correctionOfSourceId` field exists in V1; these remain outside the present contract. The implementation does not require or define a `PublishedSnapshotVNext`. Keep changes to the existing V1 contract coordinated between the Studio producer, Web consumer, sanitizer and validator, with backward-compatibility coverage. The producer must not expose review drafts or demo-only records. Rights approval remains separate from alt text.

## E. Historical proposal (superseded as a work queue)

This section records the original design proposal. The owner later authorized the combined implementation work in PRs #31 and #58; completed fields and local evidence are summarized in Sections B, D and G. Do not treat the old implementation slices as pending authorization.

1. Owner reviews this UX field model and the two Framer labs.
2. Studio Article Insights panel, **multi-concept list editor** (add/edit/remove/select unique H2 anchor, optional 0–3), plus distinct Knowledge Link occurrences, using existing libraries.
3. Studio figure/table editing and optional complete source metadata; retention through revisions, sanitizer and publication.
4. Studio reviewed relation editor and V1 serializer/validator. This slice is implemented in the current candidate; it does not imply another schema migration.
5. Web existing ArticleHeader/ArticleReader/ScientificFigure/CitationList/CitationInteractions visual adaption; no full-code Framer copy/paste.
6. Web Knowledge Link anchored popovers and published-only RelatedStories carousel, preserve full bodyHtml/figure/table/math support.
7. End-to-end launch QA: 320/390/810/1200/1280, real keyboard/mouse/touch/reduced-motion, hash and Back, source rights, LCP/CLS/INP, snapshot consumer parity.

**Current boundary:** The Framer CMS tabbed editor remains an interactive UX mock and is not connected to Studio or Web. Equivalent `keyConcepts`, `relatedIds`, notices and publication fields exist independently in current Studio/Web candidates. The local lifecycle test below does not represent deployment or live-server acceptance.

## Contextual concept authoring refinement — 2026-11-08
The Framer CMS editor prototype `ArticleCMSDesignLab.tsx` supports a list of Key Concepts and H2 placement as a design example. Its demo mapping (**Isotope ratio → Reading a stellar fingerprint** and **Petrography → Water left a patchwork**) is separate from the actual Studio form and candidate snapshot, which use the V1 `keyConcepts` fields documented above. The Framer mock remains disconnected.

The standalone Knowledge Links library still supports Wikipedia and published internal articles and can display hover/focus previews; it is independent of Contextual Key Concepts. Do not conflate concepts in a sidebar with in-text knowledge previews or source/DOI citations.

## F. Evidence references
- Studio PR #31 `lib/types.ts`, `lib/publishing/web-contract-v1.ts`, `components/editor/article-workspace.tsx`, `app/knowledge-links/page.tsx`, `app/media/page.tsx`, and `app/series/page.tsx`.
- Web PR #58 `lib/content/types.ts`, `lib/content/contract-v1.ts`, `lib/content/published-snapshot-repository.ts`, and `components/editorial/RelatedStories.tsx`.
- Studio serializer copies `relatedIds` and `seriesId`; the Web consumer resolves explicit targets and same-series/category suggestions from its active public catalog.

## G. Current integration verification — 2026-11-08

- Studio PR #31 candidate: `b8ecce006f8cbb75f130f8bd5c6aa781741bd4ce` (latest GitHub checks passed).
- Web application candidate exercised in integration: `8583ede2648d47be963dbf7c863cf716343b9d28`; final PR #58 head adds test-harness-only commit `9d6f0d79dfffc8cdb62330eebe02d0adf2d4c508`.
- Web was validated on Node.js 24.22.2: clean `npm ci`; `npm run check` passed ESLint, TypeScript, 64/64 unit tests and a Next.js 16.4.5 production build; `npm audit` reported 0 vulnerabilities. With the isolated test harness, the normal Playwright suite passed 98 with 1 regression deliberately skipped; the dedicated published-catalog configuration passed that regression 1/1.
- Cross-repository local E2E passed 1/1 on Studio `b8ecce006f8cbb75f130f8bd5c6aa781741bd4ce` plus Web `8583ede2648d47be963dbf7c863cf716343b9d28` using temporary SQLite and real HTTP: save/reload/recovery; reviewer/approver role separation; publish; Web SSR article/search/topic/home/sitemap; withdraw and confirm exclusion; restore and confirm visibility; public responses exclude private `editorDraft` data. Web `9d6f0d7` changes the test harness only, not the application code used in this lifecycle.
- For this local lifecycle, Web ran under Node 24 `next dev` in `stage-a-demo` because local HTTP is rejected by production-mode verified-HTTPS requirements. Production build and smoke tests were run separately. This does not certify production HTTPS, deployed infrastructure, or live-server operation.
- GitHub Studio #31 checks passed on `b8ecce0`. GitHub Web #58 checks passed on exact head `9d6f0d7`: both responsive Playwright jobs, quality, and GitGuardian security checks are green. The earlier `8583ede` run had failed responsive jobs because the new regression used demo fixtures; `9d6f0d7` isolates that test under a published-snapshot server configuration.
