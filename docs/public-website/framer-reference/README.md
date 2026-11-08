# ScientificRadar — Framer source snapshots for Codex review

**Source-of-truth warning:** These are exact text snapshots exported from an unpublished Framer project on **2026-11-08**. The live Framer project is authoritative if edited later. These `.tsx.txt` files deliberately sit beneath `docs/` as **text**, so Next.js/TypeScript won't treat them as application source. Do **not** import these directly into ScientificRadar Web/Studio.

| Snapshot | Framer original | Purpose | Notes |
| --- | --- | --- | --- |
| [BennuRelatedReadingConcept.tsx.txt](./BennuRelatedReadingConcept.tsx.txt) | `BennuRelatedReadingConcept.tsx`; `codeFile/ADnxWxr:default`; page `t6PbsTds_` | **Current preferred** unified article reader design | Contextual multiple Key Concepts, responsive TOC, hover previews, 2 figures/table, source ledger, related carousel. Standalone Framer fixture, not Web-ready. |
| [ArticleCMSDesignLab.tsx.txt](./ArticleCMSDesignLab.tsx.txt) | `ArticleCMSDesignLab.tsx`; `codeFile/P0Vi6VZ:default`; page `Kr4RQUn1q` | Current interactive **CMS UX proposal** | Contains in-memory form only; no Studio save/publish or server logic. Duplicate H2 anchor choices now guarded. |
| [BennuPresolarEditorial.tsx.txt](./BennuPresolarEditorial.tsx.txt) | `BennuPresolarEditorial.tsx`; `codeFile/Xi1YsKp:default`; page `W1F5b_kMS` | Original accepted Bennu A baseline | **NOT the source for scientific numerical claims.** Original A has some older ambiguous subgroup wording; current reader lab corrects it. |
| [ScientificRadarArticleExperienceLab.tsx.txt](./ScientificRadarArticleExperienceLab.tsx.txt) | `ScientificRadarArticleExperienceLab.tsx` | Earlier M1–M3 baseline | Historical component; some old label/UX decisions superseded by current design standard. |

## Governing contracts

- **Current design:** `../ARTICLE_READER_DESIGN_SYSTEM.md`.
- **CMS → Web field and publication contract:** `../ARTICLE_READER_CMS_EDITORIAL_CONTRACT.md`.
- **Current independent QA / Codex handoff:** `../ARTICLE_READER_CODEX_READY_AUDIT_2026-11-08.md`.
- **Scientific comparison:** Nguyen et al., *Nature Astronomy* (2025), DOI `10.1038/s41550-025-02688-3`, and 2026 Author Correction, DOI `10.1038/s41550-026-02811-y`.
- **NASA figure:** NASA Scientific Visualization Studio, [OSIRIS-REx – Detailed Global Views of Asteroid Bennu](https://svs.gsfc.nasa.gov/4857/), image `bennu_spin_v3_02.1000_print.jpg`, official credits including NASA SVS and NASA/University of Arizona/CSA/York University/MDA. Full image rights/attribution check remains a publishing gate.

## Review protocol

1. Read current design and CMS contracts, then compare both primary source snapshots.
2. Match Framer code to actual Web `ArticleHeader`, `ArticleReader`, `CitationList`, `CitationInteractions`, `RelatedStories`, `PublicArticle` types, and Studio `Article`, `KnowledgeLink`, `ScientificSource`, `Series`, `MediaAsset`, `web-contract-v1.ts`.
3. Verify runtime with actual Brave against **the exact current Framer node IDs**, not screenshot render alone; 320/390/810/1200 plus 1200–1280 Web layout boundary.
4. Do not mistake source-authored Framer illustrations, research DOI cards and in-memory CMS form for live/public editorial articles or integrated product capabilities.
5. Do not modify Studio or Web application code, merge, publish, or deploy until owner authorizes a separate implementation phase.

**All files in this folder are review artifacts, not deployable packages.**
