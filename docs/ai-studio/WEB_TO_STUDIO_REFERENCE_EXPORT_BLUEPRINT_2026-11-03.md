# ScientificRadar Web → Studio — Pinned Read-Only Reference Export Blueprint

**Status:** Approved future procedure, **NOT an already created export**. This file lives in the Web repository so the final, verified Web source can later be carried into the separate Studio repository without the Studio AI agent needing cross-repository access.

## Purpose

The owner selected **ScientificRadar Web as the article's visual authority**. The target is not to copy the whole public website into ScientificRadar Studio. The future Studio Google AI Studio job reads this reference bundle and adjusts its *preview and published output* while preserving its existing CKEditor/Tiptap, editorial controls, persistence, revisions, security and approval UX.

**Export timing:** Only after the Web execution mission and final independent tests have been reviewed, and after a particular Web commit SHA has been pinned. Do NOT export moving \`main\` silently.

## Destination to create in Studio later

\`\`\`text
scientificradar-studio/
  docs/
    references/
      scientificradar-web/
        README.md
        SOURCE_MANIFEST.md
        components/
          ArticleReader.tsx.txt
          ArticleHeader.tsx.txt
          ScientificFigure.tsx.txt
          CitationList.tsx.txt
          AuthorProfile.tsx.txt
          [other approved editorial components].tsx.txt
        content-model/
          types.ts.txt
          sanitizer.ts.txt
          math.ts.txt
          [adaptation helpers / renderer tests].ts.txt
        styles/
          globals.css.txt
          tokens.ts.txt
          DESIGN_TOKENS.md
        examples/
          published-article-en.json
          published-article-tr.json
          draft-must-not-leak.json
          rich-scientific-edge-cases.json
        screenshots/
          [desktop-article].png
          [mobile-article].png
          [table-and-figure].png
          [bibliography-and-math].png
        tests/
          [selected-verified-test].spec.ts.txt
\`\`\`

**Example names are illustrative**, not claims that these exact output fixtures/screenshots already exist. The exporter must list only files actually present and verified at the pinned Web revision, and document omitted candidates.

## Why source files have a .txt suffix

Studio's \`tsconfig.json\` includes \`**/*.ts\` and \`**/*.tsx\` files. If Web's sources are copied unchanged under \`docs\`, TypeScript may attempt to type-check them and fail because Web-only imports, CSS and contracts do not exist in Studio.

Save complete text without modification, using:

- \`ArticleReader.tsx\` → \`ArticleReader.tsx.txt\`
- \`types.ts\` → \`types.ts.txt\`
- \`globals.css\` → \`globals.css.txt\`
- \`*.spec.ts\` → \`*.spec.ts.txt\`

These are **references, not runtime modules**. Do not extend Studio's TypeScript pipeline to compile them. Do not rename them back under Studio's \`docs/\` folder. No sources should be placed in public static assets (such as \`public/\`) if their content is not intentionally public.

## File-selection procedure

1. Pin the last passing exact Web commit SHA and capture the final report/test/CI links. Prefer the final production-compatible *reader* implementation, not a stale demo snapshot.
2. Inspect the complete dependency closure of the reader entrypoint: \`app/article/[slug]/page.tsx\`, \`components/editorial/ArticleHeader.tsx\`, \`components/editorial/ArticleReader.tsx\`, \`components/editorial/ScientificFigure.tsx\`, \`components/editorial/CitationList.tsx\`, \`components/editorial/AuthorProfile.tsx\`, \`lib/content/types.ts\`, \`lib/content/sanitizer.ts\`, \`lib/content/math.ts\`, \`lib/design/tokens.ts\`, \`app/globals.css\`, relevant font declarations and critical tests. This is a **candidate selection**, not permission to blindly copy everything. Include any dependencies genuinely needed to understand a chosen component.
3. Exclude or summarize unrelated site header/footer, homepage/newsletter, demo boilerplate, fake metrics and the large original \`lib/content/fixtures.ts\` where a small deterministic example is enough. Preserve representative rich-content examples instead of shipping 70KB+ of unrelated illustration copy.
4. Include the currently accepted design tokens, screenshots with viewport and original Web commit, relevant public publishing contract and representative **source data plus expected rendering**. Keep alt text and accessibility checks observable.
5. Copy exact UTF-8 text; do not strip or rewrite scientific content, comments, imports, security logic, licence details, tests or Unicode. Use source checksums when feasible.
6. Put everything under \`docs/references/scientificradar-web/\` in a **dedicated Studio documentation PR**. Verify that the Studio build/typecheck/tests are unchanged by mere presence of the references before merging. Only then may Studio Google AI Studio import the updated \`main\`.
7. In the later Studio task Markdown, explicitly name this folder and its README, SOURCE_MANIFEST, examples, screenshot baselines and contract. It must implement the Studio adaptation, not claim reference copying is itself feature delivery.

## Required SOURCE_MANIFEST.md schema

Create a real Markdown file at the destination above when exporting. At minimum:

\`\`\`markdown
# ScientificRadar Web Reference Source Manifest
- Source repository: https://github.com/Centaurioun/ScientificRadar-web
- Exact source commit: <FULL_VERIFIED_40_CHAR_SHA>
- Export date: <YYYY-MM-DD>
- Destination repository: https://github.com/Centaurioun/scientificradar-studio
- Purpose: read-only implementation/design reference, NOT an executable code import
- Contract version: <version verified by source and tests>
- Source CI evidence: <URLs and counts, with actual status>

| Original path | Destination .txt path | Purpose | Dependencies | SHA256 / source blob |
|---|---|---|---|---|
| components/editorial/ArticleReader.tsx | components/ArticleReader.tsx.txt | Public reader | type model, sanitizer, tokens, citations | <verified digest> |

## Design invariants
Document typography, heading hierarchy, text measure, figure width, palette, citation/DOI semantics, math, responsive behavior, and how to distinguish the Web article layout from Studio editor chrome.

## Known limitations and deliberately omitted files
Declare every rendering or contract caveat; a missing feature is not implemented just because it appears in a reference.
\`\`\`

Never leave placeholder digests or SHA in a file presented as a verified export.

## Required README.md content

1. Explain that Studio's preview should **match the Web reader** but must not import Web application routes/global CSS into its admin shell without isolation.
2. Give exact file reading order: \`SOURCE_MANIFEST.md\` → design tokens → example JSON → public types/adapter → reader/figure/citation/math → sanitizer → tests/screenshots.
3. State the expected rendering equivalence and the constraints: single H1, headings H2/H3, scientifically faithful tables/figures/DOIs, no arbitrary scripts, no public draft previews.
4. State that .txt files are inert sources to study; only copy/adapt code into Studio's app after deliberate compatibility/security tests.
5. Highlight import differences: Web article is public **projection**; Studio article remains the editable **authoring record**. No loss of CKEditor/Tiptap content, linked sources, or revisions.
6. Include an explicit compatibility acceptance checklist and any previously known mismatches (e.g., HTML vs blocks TOC or math) as verified at final Web revision.
7. Explain refresh procedure: new Web revision → rerun Web checks → compare manifest/code/screenshots → review Studio compatibility → new approved export. No automatic silent vendoring.

## Deliverable acceptance for the future transfer

- Files can be opened as text by Google AI Studio in its imported Studio sandbox, without cross-repository access.
- Sources are pinned and faithful; manifest is complete; screenshots demonstrate expected rendering.
- Studio \`tsc\`, build and its existing regression suite are unaffected by the reference files alone.
- Studio agent has actionable adaptation instructions; never mistake the reference bundle for deployed production integration.
- Reference publication does not leak credentials, unpublished articles, proprietary third-party source code or unlicensed assets.

**Do not perform this transfer yet.** Finish and verify the Web mission first.
