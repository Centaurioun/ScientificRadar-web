import type { Metadata } from "next";
import { PublicArticle, PublicCategory, SupportedLocale } from "../content/types";
import {
  buildCanonicalUrl,
  buildVerifiedLanguageAlternates,
  getSeoEnvironmentConfig,
  resolveRobotsPolicy,
  RouteMetadataContextType,
  SeoEnvironmentConfig,
} from "./policy";

export const SITE_BRAND_NAME = "ScientificRadar";
export const DEFAULT_SITE_TITLE =
  "ScientificRadar — Science Journalism, Explainers & Research Digests";
export const DEFAULT_SITE_DESCRIPTION =
  "Independent scientific publication delivering long-form features, mechanistic explainers, and transparent research digests across physics, biology, chemistry, and earth sciences.";

export interface PageMetadataInput {
  routeType: RouteMetadataContextType;
  pathname: string;
  title?: string;
  description?: string;
  keywords?: string[];
  article?: PublicArticle;
  category?: PublicCategory;
  verifiedTranslations?: Partial<Record<SupportedLocale, string>>;
  hasDisallowedQueryParams?: boolean;
}

/**
 * Central, deterministic metadata builder for all ScientificRadar Web routes.
 * Ensures that `<title>`, `<meta name="description">`, `og:title`, `og:description`,
 * `og:type`, `twitter:title`, `twitter:description`, canonical URL, and `robots`
 * are derived from a single source of truth without duplicate or mismatched tags.
 */
export function buildPageMetadata(
  input: PageMetadataInput,
  envOverrides?: Partial<SeoEnvironmentConfig>
): Metadata {
  const env = getSeoEnvironmentConfig(envOverrides);
  const canonicalUrl =
    input.article?.seo?.canonicalUrl
      ? buildCanonicalUrl(input.article.seo.canonicalUrl, env.siteUrl)
      : buildCanonicalUrl(input.pathname, env.siteUrl);

  const robotsPolicy = resolveRobotsPolicy(
    {
      routeType: input.routeType,
      article: input.article,
      hasDisallowedQueryParams: input.hasDisallowedQueryParams,
    },
    env
  );

  let resolvedTitle = input.title?.trim() || DEFAULT_SITE_TITLE;
  let resolvedDescription = input.description?.trim() || DEFAULT_SITE_DESCRIPTION;
  let ogType: "website" | "article" = "website";
  let keywords: string[] | undefined = input.keywords;

  if (input.routeType === "article" && input.article) {
    resolvedTitle =
      input.article.seo?.title?.trim() || input.article.title.trim();
    resolvedDescription =
      input.article.seo?.description?.trim() ||
      input.article.summary.trim() ||
      input.article.dek.trim();
    ogType = "article";
    if (!keywords && input.article.tagSlugs.length > 0) {
      keywords = Array.from(new Set(input.article.tagSlugs));
    }
  } else if (input.routeType === "topic-landing" && input.category) {
    resolvedTitle = `${input.category.name} — Science Stories & Explainers`;
    resolvedDescription = input.category.description.trim();
    if (!keywords) {
      keywords = [
        input.category.name,
        ...input.category.subcategories.map((s) => s.name),
      ];
    }
  } else if (input.routeType === "topics-directory") {
    resolvedTitle =
      input.title?.trim() || "Topics & Scientific Disciplines Directory";
    resolvedDescription =
      input.description?.trim() ||
      "Explore ScientificRadar articles across Physics, Biology, Medicine & Health, Chemistry, Technology, Earth & Climate, and Society & Research.";
  } else if (input.routeType === "search") {
    resolvedTitle =
      input.title?.trim() || "Search Articles & Scientific Archive";
    resolvedDescription =
      input.description?.trim() ||
      "Search across ScientificRadar features, mechanistic explainers, and research digests.";
  } else if (input.routeType === "about") {
    resolvedTitle =
      input.title?.trim() || "About ScientificRadar & Editorial Standards";
    resolvedDescription =
      input.description?.trim() ||
      "Original mission, editorial typography system, scientific publishing integrity rules, and reader architecture for ScientificRadar Web.";
  } else if (input.routeType === "not-found") {
    resolvedTitle = input.title?.trim() || "Page Not Found";
    resolvedDescription =
      input.description?.trim() ||
      "The requested article or topic route could not be found in the ScientificRadar archive.";
  }

  const socialTitle =
    input.routeType === "home"
      ? DEFAULT_SITE_TITLE
      : resolvedTitle.includes(SITE_BRAND_NAME)
        ? resolvedTitle
        : `${resolvedTitle} | ${SITE_BRAND_NAME}`;

  const languageAlternates = buildVerifiedLanguageAlternates(
    input.verifiedTranslations,
    env.siteUrl
  );

  const metadata: Metadata = {
    title:
      input.routeType === "home"
        ? {
            default: DEFAULT_SITE_TITLE,
            template: `%s | ${SITE_BRAND_NAME}`,
          }
        : resolvedTitle,
    description: resolvedDescription,
    ...(keywords && keywords.length > 0 ? { keywords } : {}),
    alternates: {
      canonical: canonicalUrl,
      ...(languageAlternates ? { languages: languageAlternates } : {}),
    },
    robots: {
      index: robotsPolicy.index,
      follow: robotsPolicy.follow,
      nocache: robotsPolicy.nocache,
    },
    openGraph: {
      title: socialTitle,
      description: resolvedDescription,
      type: ogType,
      siteName: SITE_BRAND_NAME,
      url: canonicalUrl,
      locale: input.article?.locale === "tr" ? "tr_TR" : "en_US",
      ...(ogType === "article" && input.article
        ? {
            publishedTime: input.article.publishedAt,
            modifiedTime:
              input.article.updatedAt ?? input.article.publishedAt,
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: resolvedDescription,
    },
    ...(env.gscVerificationToken
      ? {
          verification: {
            google: env.gscVerificationToken,
          },
        }
      : {}),
  };

  return metadata;
}
