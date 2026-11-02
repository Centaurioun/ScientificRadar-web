# SEO and Legacy Migration Plan

## Verified Web state

`app/layout.tsx` defines site-wide title, description, Open Graph, Twitter cards, and `robots: noindex,nofollow,nocache`. `app/search/page.tsx` independently sets search-page metadata and `noindex`. There is no `app/robots.ts`, `app/sitemap.ts`, or redirect manifest in the reviewed file inventory. This is source inventory, not a live crawl.

`docs/WEBSITE_BUILD_AUDIT.md` documents demo isolation and historical noindex verification. Do not remove noindex until the owner approves public indexing and staging/production domains are known.

## Required evidence before migration fixes

Obtain dated Search Console exports and live HTTP checks for the historical reports: 34 alternative canonicals, 15 Soft 404s, 4 5xx URLs, indexed/crawled internal search URLs, AMP routes, RSS, and old PHP route patterns. These counts are historical and may have changed.

## Planned checks

- Define one canonical metadata source per public route and verify rendered HTML has exactly one description, `og:type`, `twitter:title`, and `twitter:description`.
- Set route-specific indexing policy: editorial pages, internal search, demo/staging, drafts, and removed content.
- Verify actual HTTP status and redirect destinations; distinguish 404 from 410 only after content-retirement policy is decided.
- Publish a sitemap only from eligible canonical published pages; test no search-query URLs, drafts, or demo content leak into it.
- Inventory old URLs, `/amp`, RSS, query parameters, and PHP routes; approve explicit mapping before redirects.
- Decide locale URLs and reciprocal `hreflang` only once locale strategy is approved.
- Gate any indexability change on production host/domain verification and Search Console ownership evidence.
