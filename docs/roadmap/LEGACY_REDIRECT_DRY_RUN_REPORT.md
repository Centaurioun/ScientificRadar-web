# ScientificRadar Web — Legacy URL Migration Dry-Run & Redirect Validator Report (M3)

**Status:** Web-side manifest schema and deterministic validator implemented (`lib/seo/redirects.ts`, `lib/seo/seo.test.ts`). Live legacy URL CSV export from Google Search Console remains **BLOCKED / UNKNOWN** pending owner export.

## 1. Historical Search Console Baseline (Recorded as Historical Context Only)

Per `docs/roadmap/SEO_AND_LEGACY_MIGRATION_PLAN.md`:
- **Alternate page with proper canonical tag:** 34 (historical count)
- **Soft 404:** 15 (historical count)
- **Server error (5xx):** 4 (historical count)

*Evidence rule:* These counts are historical reference observations, not current live crawl measurements. No speculative article-slug redirects have been invented without the actual exported URL table.

## 2. Deterministic Redirect Validator Rules (`validateRedirectManifest`)

Implemented in `lib/seo/redirects.ts` and verified in `lib/seo/seo.test.ts`:
1. **Duplicate Source Path Rejection (`DUPLICATE_SOURCE_PATH`):** Every `sourcePath` in the manifest must be unique.
2. **Self-Redirect & Loop Prevention (`SELF_REDIRECT_LOOP`, `REDIRECT_CYCLE_DETECTED`):** Rejects `A -> A` and multi-hop cycles `A -> B -> A`.
3. **Multi-Hop Chain Prevention (`REDIRECT_CHAIN_DETECTED`):** Rejects `A -> B -> C` and requires `A -> C` directly so crawlers resolve in a single hop.
4. **Anti-Soft-404 Homepage Fallback Rule (`HOMEPAGE_FALLBACK_FORBIDDEN`):** Forbids redirecting deep legacy article/category URLs (e.g., `/2023/10/old-article.php`) to `/`. Deep URLs without a 1:1 canonical article equivalent must return explicit `404` or `410`.
5. **Cross-Host Open-Redirect Prevention (`UNSAFE_CROSS_HOST_TARGET`):** Requires all `targetPath` values to be same-origin root-relative paths starting with `/`.
6. **Search-Query Trap Prevention (`SEARCH_QUERY_TRAP_TARGET`):** Forbids redirecting any legacy URL into `/search` or `/search?q=...`.
7. **Canonical Target Conflict Check (`CANONICAL_TARGET_CONFLICT`):** Prevents redirecting to a path that is itself marked `404`/`410` or absent from the verified canonical destination set.

## 3. Dry-Run Summary on `PREPARED_LEGACY_REDIRECT_MANIFEST`

- **Manifest Version:** `1.0.0`
- **Total Prepared Pattern Rules:** 5 (`3` permanent `301` normalizations, `1` explicit `404` unmapped PHP probe, `1` explicit `410` retired `/search.php` endpoint)
- **Validation Status:** `PASS` (`0` structural issues)
- **Pending External Dependency:** Owner export of Search Console coverage tables (`34` canonical alternates, `15` Soft 404s, `4` 5xx URLs) to populate 1:1 article slug mappings before production cutover.
