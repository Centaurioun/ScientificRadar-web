import { PublicArticle, SupportedLocale } from "../content/types";

export type RouteMetadataContextType =
  | "home"
  | "article"
  | "topics-directory"
  | "topic-landing"
  | "search"
  | "about"
  | "not-found";

export interface SeoEnvironmentConfig {
  siteUrl?: string;
  enableProductionIndexing?: boolean;
  gscVerificationToken?: string;
}

const DEFAULT_FALLBACK_ORIGIN = "https://scientificradar.example";

/**
 * Reads SEO environment variables safely without enabling public indexing by default.
 */
export function getSeoEnvironmentConfig(
  overrides?: Partial<SeoEnvironmentConfig>
): Required<SeoEnvironmentConfig> {
  const rawSiteUrl =
    overrides?.siteUrl ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.APP_URL ??
    DEFAULT_FALLBACK_ORIGIN;

  const rawIndexing =
    overrides?.enableProductionIndexing !== undefined
      ? overrides.enableProductionIndexing
      : process.env.NEXT_PUBLIC_ENABLE_PRODUCTION_INDEXING === "true";

  const rawGscToken =
    overrides?.gscVerificationToken ??
    process.env.NEXT_PUBLIC_GSC_VERIFICATION_TOKEN ??
    "";

  return {
    siteUrl: normalizeCanonicalOrigin(rawSiteUrl),
    enableProductionIndexing: Boolean(rawIndexing),
    gscVerificationToken: rawGscToken.trim(),
  };
}

/**
 * Verifies whether the configured origin is a real, non-placeholder HTTPS origin
 * eligible for production indexing when the owner explicitly turns on the gate.
 */
export function isVerifiedProductionOrigin(origin: string): boolean {
  try {
    const parsed = new URL(origin);
    if (parsed.protocol !== "https:") return false;
    const host = parsed.hostname.toLowerCase();
    if (
      host === "localhost" ||
      host === "127.0.0.1" ||
      host.endsWith(".local") ||
      host.endsWith(".example") ||
      host.endsWith(".invalid") ||
      host.endsWith(".test") ||
      host.includes("run.app") ||
      host === "my_app_url"
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function normalizeCanonicalOrigin(rawUrl: string): string {
  if (!rawUrl || typeof rawUrl !== "string") {
    return DEFAULT_FALLBACK_ORIGIN;
  }
  const trimmed = rawUrl.trim().replace(/\/+$/, "");
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === "https:" || parsed.protocol === "http:") {
      return `${parsed.protocol}//${parsed.host}`;
    }
    return DEFAULT_FALLBACK_ORIGIN;
  } catch {
    return DEFAULT_FALLBACK_ORIGIN;
  }
}

export function buildCanonicalUrl(pathname: string, origin?: string): string {
  const base = normalizeCanonicalOrigin(origin ?? getSeoEnvironmentConfig().siteUrl);
  // Strip any query string or hash fragment from canonical path
  const cleanPath = (pathname.split("?")[0]?.split("#")[0] ?? "/").trim();
  const normalizedPath = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;
  if (normalizedPath !== "/" && normalizedPath.endsWith("/")) {
    return `${base}${normalizedPath.replace(/\/+$/, "")}`;
  }
  return `${base}${normalizedPath}`;
}

export interface ResolvedRobotsPolicy {
  index: boolean;
  follow: boolean;
  nocache: boolean;
  reason: string;
}

/**
 * Deterministic route-aware robots policy.
 * - Staging, demo, search, 404, draft, and withdrawn pages are ALWAYS noindex.
 * - Production indexing requires BOTH `enableProductionIndexing: true` AND
 *   a verified HTTPS origin (`isVerifiedProductionOrigin(siteUrl)`).
 */
export function resolveRobotsPolicy(
  context: {
    routeType: RouteMetadataContextType;
    article?: Pick<PublicArticle, "status" | "seo">;
    hasDisallowedQueryParams?: boolean;
  },
  envOverrides?: Partial<SeoEnvironmentConfig>
): ResolvedRobotsPolicy {
  const env = getSeoEnvironmentConfig(envOverrides);
  const originVerified = isVerifiedProductionOrigin(env.siteUrl);

  if (context.routeType === "search") {
    return {
      index: false,
      follow: false,
      nocache: true,
      reason: "Internal search results pages are permanently excluded from indexing.",
    };
  }

  if (context.routeType === "not-found") {
    return {
      index: false,
      follow: false,
      nocache: true,
      reason: "HTTP 404 not-found pages are permanently excluded from indexing.",
    };
  }

  if (context.hasDisallowedQueryParams) {
    return {
      index: false,
      follow: false,
      nocache: true,
      reason: "Parameterized preview/comparison query views are excluded from indexing.",
    };
  }

  if (!env.enableProductionIndexing || !originVerified) {
    return {
      index: false,
      follow: false,
      nocache: true,
      reason:
        "Production indexing gate is disabled or siteUrl is not a verified production HTTPS origin.",
    };
  }

  if (context.routeType === "article") {
    if (!context.article) {
      return {
        index: false,
        follow: false,
        nocache: true,
        reason: "Missing article record defaults to noindex.",
      };
    }

    if (context.article.status !== "published") {
      return {
        index: false,
        follow: false,
        nocache: true,
        reason: `Article status "${context.article.status}" is non-indexable (only "published" articles may be indexed).`,
      };
    }

    if (context.article.seo?.noindex) {
      return {
        index: false,
        follow: false,
        nocache: true,
        reason: "Article explicitly sets seo.noindex = true.",
      };
    }
  }

  return {
    index: true,
    follow: true,
    nocache: false,
    reason: "Eligible canonical route with verified production origin and indexing enabled.",
  };
}

/**
 * Builds reciprocal hreflang alternates ONLY when verified translations exist.
 * Never fabricates cross-locale URLs when only a single-locale article exists.
 */
export function buildVerifiedLanguageAlternates(
  translations?: Partial<Record<SupportedLocale, string>>,
  origin?: string
): Record<string, string> | undefined {
  if (!translations) return undefined;
  const entries = Object.entries(translations).filter(
    (entry): entry is [SupportedLocale, string] =>
      (entry[0] === "en" || entry[0] === "tr") &&
      typeof entry[1] === "string" &&
      entry[1].trim().length > 0
  );

  // Reciprocal hreflang requires at least 2 verified locale paths
  if (entries.length < 2) {
    return undefined;
  }

  const result: Record<string, string> = {};
  for (const [locale, path] of entries) {
    result[locale] = buildCanonicalUrl(path, origin);
  }
  return result;
}
