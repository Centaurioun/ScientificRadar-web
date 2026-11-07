# ScientificRadar Article Reader — CMS Editorial & Publication Contract

Date: 2026-11-08
Status: Design proposal and read-only repository audit. No Web/Studio code change.
Visual standard: docs/public-website/ARTICLE_READER_DESIGN_SYSTEM.md
Interactive mock: Framer /article-cms-template-lab (Kr4RQUn1q) — NOT connected to Studio.

## A. Fundamental design decision

An editor creates a science article by filling content fields and selecting vetted assets/relations, WITHOUT specifying per-article fonts, colors, hover positions, responsive layout, carousel or sticky navigation behavior. The Web reader renders these automatically. The user can complete routine publishing without AI assistance once the future CMS extensions are implemented.

## B. Actual Studio model versus missing fields

| Reader region | Already present in Studio (verified on GitHub main) | Future requirement |
| --- | --- | --- |
| H1, dek, summary, byline, date | Article.title/dek/summary/authorId/publishedAt | None for core metadata; enforce authentic editorial authors |
| Astromaterials / Planetary Science | Article.primaryCategoryId/categoryIds, Category.slug/parentId | Resolve valid category/subcategory Web routes |
| Feature/News/Explainer | Article.editorialType | Do not pretend Feature is a category URL |
| Collection | Article.seriesId; Series.title/slug/articleIds | Add optional public Series context to snapshot |
| At a Glance | Article.summary and Web ArticleBlock.key-takeaways | Derive ONE reviewed summary, avoid repeating concept points |
| Contextual Key Concepts (0–3 by default) | Existing KnowledgeLink library contains reusable context, but no per-article ordered concept/anchor list | Add ordered article concepts with approved `id`, short `title`, `definition`, and unique stable `afterHeadingId`; **no** image, Why it matters or Key points; desktop scrollspy and mobile inline placement are Web behaviors |
| Wikipedia/Internal preview | KnowledgeLink.term/targetType/targetUrl/targetArticleId/locale/previewTitle/previewExcerpt/sourceAttribution/reviewStatus/demo flag | Explicit link occurrences in the article and vetted public-only snapshot records |
| What underpins this story? | editorialType + linked ScientificSource.sourceType/verificationStatus/humanClaimVerified + review notes | Render from verified source metadata, plus optional reviewed evidence caveat |
| Hero and inline scientific figure | Article.featuredMediaId, MediaAsset.altText/caption/credit/licence/sourceUrl/layout/rightsApproval, TipTap body | Ensure immutable published rights metadata and proper figure numbering, noncrop |
| Scientific table | Sanitized editor HTML includes table tags; Web ArticleBlock.table exists | Verify rich editor insertion/edit + publication roundtrip; preserve headings, units, uncertainties |
| Sources / DOI | Article.sourceIds, ScientificSource.title/authors/journal/year/doi/url/type/verification | Add optional volume/issue/pages/articleNumber/correctionOf; render clickable validated DOI and return anchors |
| Related Reading | Studio Series IDs; Web PublicArticle.relatedIds, existing RelatedStories component | **Critical gap**: Studio serializeStudioArticleToSnapshotV1 currently writes relatedIds: [] regardless of Series; add editor-approved relation and published-only serializer |
| Reader size, alignment, TOC, popup, carousel | Global Web UI behavior | No CMS field: standardize component once; test focus/scroll/reduced-motion |
| Decorative asteroid/nebula | Media Library asset rights | Optional selected thematic art, no claim of experimental evidence |

A present model field is NOT proof the end-to-end editor → publish → live Web reader flow already works.

## C. Editor workflow to build an article without AI

1. Open Studio Articles → New. Enter headline, dek, article text, byline, categories, type, summary, author, SEO, optional Series. Same approved Web page template appears for every story.
2. At a Glance displays the reviewed summary and chosen takeaways (if authored); only one summary block.
3. In optional Article Insights, add one or more **Contextual Key Concepts** (usually up to three), each with a reviewed term, short definition and precisely selected H2 section. Reorder or remove them as needed; validate anchors after article heading edits. No concept thumbnails, Why it matters, Key points, or arbitrary per-story CSS. Desktop active/faded transitions and mobile inline placement happen automatically in the Web reader.
4. In existing Knowledge Links library, add term, Wikipedia HTTPS page or internal PUBLIC ScientificRadar article ID, locale, editor-written preview, source attribution, reviewStatus=approved. Associate it with one explicit meaningful body occurrence. Internal-first, then trusted Wikipedia; no automatic linking of every term or hover network requests. Wikipedia concept preview is context, not scientific evidence.
5. In existing Media Library, upload/select each scientific figure with credit, source DOI/URL, figure description/alt text, license, rights approval and 'experimental' vs 'contextual' distinction. Insert into article body. For a table, provide caption, units, semantic column headers, rows, uncertainty and data DOI; Web renders a bounded horizontal table scroll at 320px.
6. Select ScientificSource records, verify DOI, journal, year and bibliographic details. Distinguish Author Correction as a separate source. Show a full Sources bibliography and citation-to-entry and Return-to-Text per occurrence. Never invent missing DOI.
7. What underpins this story? derives editorial vs original publication type and any verified correction/source limitations; optionally append an approved evidence note. Don't create a manual self-certified peer-reviewed or AI score checkbox.
8. Choose optional reviewed related article IDs or Series; fallback to curated public related category/tag matches, filtering self, duplicates, drafts, archived, withdrawn, wrong locale and non-public records. If none, hide Related Reading. Layout automatically displays 3 desktop / 2 tablet / 1+peek mobile, arrows and no autoplay.
9. Preview with accessibility/rights/DOI guards, then publish immutable versioned record only after scientific and editorial review.

## D. Illustrative additive schema and contract gate

Conceptual NEW optional fields — not actual current schema:

- Article.contextualConcepts: ordered `{ id, title, definition, afterHeadingId }` array (default empty, typically up to 3). Approved definitions and unique live H2 references required. No per-concept imagery, Why it matters, or Key points in this feature.
- Article.knowledgeOccurrences: selected approved KnowledgeLink IDs + stable target text occurrence anchors.
- Article.relatedArticleIds: ordered explicit reviewed public article IDs; preserve/extend Series mapping.
- Article.evidenceNote: reviewed evidence caveat, separate from editorial type or publication peer-review status.
- ScientificSource.volume, issue, pages, articleNumber, correctionOfSourceId: optional, verified citation metadata.
- PublishedSnapshotVNext: sanitized public-only ordered `contextualConcepts`, knowledgePreviews, series context, evidenceNote and relatedIds, with explicit versioning and heading-anchor validation.

**Do not silently append fields to PUBLICATION_CONTRACT_VERSION 1.0.0.** Coordinate Studio producer, Web consumer, sanitizer and source/URL validator, versioned migration/backward-compatibility tests. Source URL rules: Wikipedia proper HTTPS domain and page; internal article resolves by published ID to current canonical slug; DOI normalized to https://doi.org/ with no fabricated identifiers. Exclude review drafts and demo-only data from genuine production releases. Treat image-license approval as separate from good alt text.

## E. Implementation slices to authorize later

1. Owner reviews this UX field model and the two Framer labs.
2. Studio Article Insights panel, **multi-concept list editor** (add/edit/remove/select unique H2 anchor, optional 0–3), plus distinct Knowledge Link occurrences, using existing libraries.
3. Studio figure/table editing and optional complete source metadata; retention through revisions, sanitizer and publication.
4. Studio reviewed relation editor and Web contract vNext serializer/validator. Fix the verified relatedIds: [] gap.
5. Web existing ArticleHeader/ArticleReader/ScientificFigure/CitationList/CitationInteractions visual adaption; no full-code Framer copy/paste.
6. Web Knowledge Link anchored popovers and published-only RelatedStories carousel, preserve full bodyHtml/figure/table/math support.
7. End-to-end launch QA: 320/390/810/1200/1280, real keyboard/mouse/touch/reduced-motion, hash and Back, source rights, LCP/CLS/INP, snapshot consumer parity.

**Current boundary:** The Framer CMS tabbed editor is only an interactive UX mock. It does NOT save to Studio, persist values, update GitHub application source, change published Web content, or implement permissions. No PR merge/deployment/publish.

## Contextual concept authoring refinement — 2026-11-08
The Framer CMS editor prototype `ArticleCMSDesignLab.tsx` now supports a list of Key Concepts, a title and concise definition for each, H2 placement selection, add/remove controls and a three-entry demonstration cap. The public reader prototype maps **Isotope ratio → Reading a stellar fingerprint** and **Petrography → Water left a patchwork**, promoting the matching definition in the desktop right rail, dimming its neighbor, and hiding the whole rail when outside mapped sections. On narrow widths the definitions are independent inline cards. It does not imply the actual Studio form or immutable Web snapshot has been changed.

The standalone Knowledge Links library still supports Wikipedia and published internal articles and can display hover/focus previews; it is independent of Contextual Key Concepts. Do not conflate concepts in a sidebar with in-text knowledge previews or source/DOI citations.

## F. Evidence references
- scientificradar-studio/lib/types.ts, lib/publishing/web-contract-v1.ts, app/knowledge-links/page.tsx, app/media/page.tsx, app/series/page.tsx (verified with GitHub code search).
- ScientificRadar-web/lib/content/types.ts and components/editorial/RelatedStories.tsx.
- Existing public contract v1.0.0 includes ArticleBlock figure/table/key-takeaways and PublicArticle.relatedIds. The Studio serializer explicitly produces relatedIds: [].
