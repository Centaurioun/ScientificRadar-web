# ScientificRadar Web — Route, Canonical, Indexing & Locale Policy (M2)

## 1. Canonical Route Inventory

| Route Pattern | Context Type | Default Stage A / Staging Robots | Production Robots (When Explicitly Enabled on Verified HTTPS Origin) | Sitemap Eligibility |
| --- | --- | --- | --- | --- |
| `/` | `home` | `noindex, nofollow, nocache` | `index, follow` | Eligible when >=1 `published` article exists |
| `/article/[slug]` | `article` | `noindex, nofollow, nocache` | `index, follow` ONLY if `article.status === "published"` and `!article.seo?.noindex` | Eligible ONLY for `status === "published"` |
| `/topics` | `topics-directory` | `noindex, nofollow, nocache` | `index, follow` | Eligible when production indexing is enabled |
| `/topics/[slug]` | `topic-landing` | `noindex, nofollow, nocache` | `index, follow` (base path `/topics/[slug]`; `?sub=` filter canonicalizes to `/topics/[slug]`) | Base category URL eligible |
| `/search` (`?q=...`) | `search` | `noindex, nofollow, nocache` | `noindex, nofollow, nocache` (PERMANENTLY EXCLUDED) | Never included |
| `/about` | `about` | `noindex, nofollow, nocache` | `index, follow` | Eligible when production indexing is enabled |
| Unknown / Draft / Withdrawn slugs | `not-found` (HTTP 404) | `noindex, nofollow, nocache` | `noindex, nofollow, nocache` | Never included |

## 2. Environment-Gated Production Indexing Policy

- Controlled by `lib/seo/policy.ts` (`resolveRobotsPolicy`, `isVerifiedProductionOrigin`) and `lib/seo/sitemap-robots.ts` (`buildRobotsManifest`, `buildSitemapEntries`).
- **Default state (Fail-Closed):** `NEXT_PUBLIC_ENABLE_PRODUCTION_INDEXING` is unset/`false`. Every route renders `<meta name="robots" content="noindex, nofollow, nocache">`, `/robots.txt` serves `Disallow: /`, and `/sitemap.xml` returns an empty entry list (`[]`).
- **Requirements to enable production indexing:**
  1. `NEXT_PUBLIC_ENABLE_PRODUCTION_INDEXING="true"`
  2. `NEXT_PUBLIC_SITE_URL` set to a verified HTTPS production domain (rejects `localhost`, `127.0.0.1`, `.example`, `.run.app`, and `http://`).
  3. Articles must have `status: "published"` (demonstration fixtures with `status: "demo"`, drafts with `status: "draft"`, and retired records with `status: "withdrawn"` remain `noindex` and excluded from `/sitemap.xml`).

## 3. Multilingual (`en` / `tr`) & Reciprocal `hreflang` Policy

- `lib/content/types.ts` and `lib/content/contract-v1.ts` support `locale: "en" | "tr"` and `translationGroupId`.
- `buildVerifiedLanguageAlternates` in `lib/seo/policy.ts` emits `alternates.languages` (`hreflang`) **only** when a verified translation pair (`en` and `tr` canonical paths) is explicitly supplied. It never fabricates unverified translated URLs for single-language articles.
