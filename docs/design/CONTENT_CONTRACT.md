# ScientificRadar Web — Public Content Model & Future Studio Adapter Contract

## 1. Architectural Separation (Stage A vs. Stage C)

- **Stage A (Current Standalone Website):** `ScientificRadar Web` consumes an isolated, strongly typed in-memory demonstration repository (`lib/content/repository.ts` backed by `lib/content/fixtures.ts`). It has zero runtime or build-time coupling to `ScientificRadar Studio`'s browser `IndexedDB`, CKEditor, or Tiptap packages.
- **Stage C (Future Server-Authenticated Publishing):** When authorized by the project owner, `InMemoryDemoContentRepository` can be replaced by a server-side `PublishedContentRepository` implementation that reads immutable, sanitized published article snapshots from a versioned publishing API.

## 2. Content Invariants Enforced in Code

1. **Draft Exclusion (`isPubliclyVisibleArticle`)**: Any record with `status: "draft"` is strictly filtered out from `listPublicArticles`, `getPublicArticle`, and `getRelatedArticles`. Requesting a draft slug returns HTTP 404.
2. **Single-H1 Semantic Hierarchy**: The article route renders `<main id="main-content"><article>` with exactly one `<h1>` in `ArticleHeader`. Section headings inside `ArticleReader` use `<h2>` and `<h3>` exclusively. `sanitizeCanonicalBodyHtml` automatically demotes any accidental `<h1>` inside raw `bodyHtml` snapshots to `<h2>`.
3. **Citation & DOI Integrity**: Every inline citation renders `<a data-citation-source-id="..." id="cite-..." href="#ref-...">` linked to the corresponding `#ref-...` item in `CitationList` with a back-link anchor. Demonstration fixtures never fabricate synthetic DOIs (`doi` is `undefined` and `isIllustrativeDemo: true`).
4. **Scientific Figures & Tables**: Figures preserve explicit `width`, `height`, `alt`, `caption`, `credit`, and `license`. Wide figures (`layout: "wide"`) expand up to `--sr-figure-max` (`1100px`) on desktop while remaining 100% fluid within mobile viewports (`390px` and `320px`). Tables wrap in an independent `overflow-x-auto` container with `tabular-nums`.
