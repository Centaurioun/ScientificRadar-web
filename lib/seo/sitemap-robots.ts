import type { MetadataRoute } from "next";
import { PublicArticle, PublicCategory } from "../content/types";
import {
  buildCanonicalUrl,
  getSeoEnvironmentConfig,
  isVerifiedProductionOrigin,
  SeoEnvironmentConfig,
} from "./policy";

/**
 * Generates a deterministic robots.txt manifest (`MetadataRoute.Robots`).
 * - When production indexing is disabled (default for Stage A demo, preview,
 *   local dev, and unverified domains), disallows all crawling (`disallow: "/"`).
 * - When production indexing is explicitly enabled on a verified HTTPS origin,
 *   allows public editorial routes while disallowing `/search`, `/api/`, and
 *   review/preview query parameters.
 */
export function buildRobotsManifest(
  envOverrides?: Partial<SeoEnvironmentConfig>
): MetadataRoute.Robots {
  const env = getSeoEnvironmentConfig(envOverrides);
  const canIndex =
    env.enableProductionIndexing && isVerifiedProductionOrigin(env.siteUrl);

  if (!canIndex) {
    return {
      rules: [
        {
          userAgent: "*",
          disallow: "/",
        },
      ],
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/search",
          "/search?*",
          "/api/",
          "/*?designReview=*",
          "/*?measure=*",
          "/*?hero=*",
        ],
      },
    ],
    sitemap: `${env.siteUrl}/sitemap.xml`,
    host: env.siteUrl,
  };
}

/**
 * Generates canonical sitemap entries (`MetadataRoute.Sitemap`).
 * - Returns an empty array `[]` whenever production indexing is disabled or
 *   the origin is unverified, ensuring Stage A demo fixtures are never emitted
 *   as a live production sitemap.
 * - Even when production indexing is enabled, strictly filters articles to
 *   `status === "published"` and `!article.seo?.noindex`. Demo (`status: "demo"`),
 *   draft (`status: "draft"`), and withdrawn (`status: "withdrawn"`) records
 *   and `/search` routes are never emitted.
 */
export function buildSitemapEntries(
  articles: PublicArticle[],
  categories: PublicCategory[],
  envOverrides?: Partial<SeoEnvironmentConfig>
): MetadataRoute.Sitemap {
  const env = getSeoEnvironmentConfig(envOverrides);
  const canIndex =
    env.enableProductionIndexing && isVerifiedProductionOrigin(env.siteUrl);

  if (!canIndex) {
    return [];
  }

  const publishedEligibleArticles = articles.filter(
    (a) => a.status === "published" && !a.seo?.noindex
  );

  // Do not emit an empty shell sitemap if no real published articles exist yet
  if (publishedEligibleArticles.length === 0) {
    return [];
  }

  const entries: MetadataRoute.Sitemap = [
    {
      url: buildCanonicalUrl("/", env.siteUrl),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: buildCanonicalUrl("/topics", env.siteUrl),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: buildCanonicalUrl("/about", env.siteUrl),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  for (const category of categories) {
    entries.push({
      url: buildCanonicalUrl(`/topics/${category.slug}`, env.siteUrl),
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  for (const article of publishedEligibleArticles) {
    const canonicalPath =
      article.seo?.canonicalUrl ?? `/article/${article.slug}`;
    entries.push({
      url: buildCanonicalUrl(canonicalPath, env.siteUrl),
      lastModified: article.updatedAt ?? article.publishedAt,
      changeFrequency: "monthly",
      priority: 0.9,
    });
  }

  return entries;
}
