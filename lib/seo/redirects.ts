export type LegacyRedirectStatusCode = 301 | 308 | 404 | 410;

export type LegacyPatternCategory =
  | "canonical-consolidation"
  | "amp-retirement"
  | "php-legacy"
  | "feed-consolidation"
  | "retired-404"
  | "retired-410"
  | "search-trap-blocked";

export interface LegacyRedirectRule {
  id: string;
  sourcePath: string;
  /**
   * Required for 301/308 redirects; must be null for explicit 404/410 retirement
   * or blocked search-query traps.
   */
  targetPath: string | null;
  statusCode: LegacyRedirectStatusCode;
  category: LegacyPatternCategory;
  evidenceStatus: "verified-mapping" | "needs-gsc-export";
  notes: string;
}

export interface LegacyRedirectManifest {
  manifestVersion: "1.0.0";
  updatedAt: string;
  historicalGscBaselineSummary: {
    alternateWithProperCanonicalCount: number;
    soft404Count: number;
    serverError5xxCount: number;
    evidenceNote: string;
  };
  rules: LegacyRedirectRule[];
}

export interface RedirectValidationIssue {
  code:
    | "DUPLICATE_SOURCE_PATH"
    | "INVALID_SOURCE_PATH"
    | "MISSING_TARGET_FOR_REDIRECT"
    | "UNEXPECTED_TARGET_FOR_RETIRED_STATUS"
    | "SELF_REDIRECT_LOOP"
    | "REDIRECT_CYCLE_DETECTED"
    | "REDIRECT_CHAIN_DETECTED"
    | "UNSAFE_CROSS_HOST_TARGET"
    | "HOMEPAGE_FALLBACK_FORBIDDEN"
    | "SEARCH_QUERY_TRAP_TARGET"
    | "CANONICAL_TARGET_CONFLICT";
  ruleId: string;
  sourcePath: string;
  message: string;
}

export interface RedirectValidationResult {
  valid: boolean;
  issues: RedirectValidationIssue[];
  stats: {
    totalRules: number;
    permanentRedirects: number;
    retired404or410: number;
    pendingGscEvidenceCount: number;
  };
}

/**
 * Validates a LegacyRedirectManifest for structural and SEO safety invariants:
 * - No duplicate source paths
 * - No self-redirects or multi-hop cycles (`A -> B -> A`)
 * - No multi-hop chains (`A -> B -> C`)
 * - No lazy homepage fallbacks (`/old-article-slug -> /`) that trigger Google Soft 404s
 * - No cross-host open redirects (`https://...` or `//...`)
 * - No redirects into `/search?q=...` internal search traps
 * - No redirects pointing to a target path that is itself retired (404/410)
 */
export function validateRedirectManifest(
  manifest: LegacyRedirectManifest,
  options?: {
    knownValidCanonicalPaths?: ReadonlySet<string>;
  }
): RedirectValidationResult {
  const issues: RedirectValidationIssue[] = [];
  const sourceMap = new Map<string, LegacyRedirectRule>();
  const retiredPaths = new Set<string>();

  for (const rule of manifest.rules) {
    const src = rule.sourcePath.trim();
    if (!src.startsWith("/") || src.startsWith("//") || src.startsWith("/\\")) {
      issues.push({
        code: "INVALID_SOURCE_PATH",
        ruleId: rule.id,
        sourcePath: rule.sourcePath,
        message: `Source path "${rule.sourcePath}" must be a root-relative path starting with "/".`,
      });
    }

    if (sourceMap.has(src)) {
      issues.push({
        code: "DUPLICATE_SOURCE_PATH",
        ruleId: rule.id,
        sourcePath: src,
        message: `Duplicate redirect rule for sourcePath "${src}".`,
      });
    } else {
      sourceMap.set(src, rule);
    }

    if (rule.statusCode === 404 || rule.statusCode === 410) {
      retiredPaths.add(src);
      if (rule.targetPath !== null) {
        issues.push({
          code: "UNEXPECTED_TARGET_FOR_RETIRED_STATUS",
          ruleId: rule.id,
          sourcePath: src,
          message: `Rule with status ${rule.statusCode} must have targetPath: null.`,
        });
      }
    } else {
      // 301 or 308
      if (!rule.targetPath || !rule.targetPath.trim()) {
        issues.push({
          code: "MISSING_TARGET_FOR_REDIRECT",
          ruleId: rule.id,
          sourcePath: src,
          message: `Redirect rule (${rule.statusCode}) requires a non-empty targetPath.`,
        });
        continue;
      }

      const target = rule.targetPath.trim();

      if (
        !target.startsWith("/") ||
        target.startsWith("//") ||
        target.startsWith("/\\") ||
        /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(target)
      ) {
        issues.push({
          code: "UNSAFE_CROSS_HOST_TARGET",
          ruleId: rule.id,
          sourcePath: src,
          message: `Redirect target "${target}" must be a same-origin root-relative path.`,
        });
      }

      if (target === src) {
        issues.push({
          code: "SELF_REDIRECT_LOOP",
          ruleId: rule.id,
          sourcePath: src,
          message: `Rule redirects "${src}" to itself.`,
        });
      }

      // Reject lazy homepage fallback for deep legacy article/category URLs
      const isDeepLegacySource =
        src !== "/index.html" &&
        src !== "/index.php" &&
        src !== "/home" &&
        src.length > 1;
      if (target === "/" && isDeepLegacySource) {
        issues.push({
          code: "HOMEPAGE_FALLBACK_FORBIDDEN",
          ruleId: rule.id,
          sourcePath: src,
          message: `Redirecting deep legacy URL "${src}" to "/" causes Soft 404 signals in Search Console. Map to an exact canonical equivalent or return 404/410.`,
        });
      }

      if (target.startsWith("/search")) {
        issues.push({
          code: "SEARCH_QUERY_TRAP_TARGET",
          ruleId: rule.id,
          sourcePath: src,
          message: `Redirect target "${target}" points to an internal search route, which is noindex and forbidden as a redirect destination.`,
        });
      }

      if (
        options?.knownValidCanonicalPaths &&
        !options.knownValidCanonicalPaths.has(target)
      ) {
        issues.push({
          code: "CANONICAL_TARGET_CONFLICT",
          ruleId: rule.id,
          sourcePath: src,
          message: `Redirect target "${target}" is not in the known canonical destination set.`,
        });
      }
    }
  }

  // Second pass: detect chains (A -> B -> C), cycles (A -> B -> A), and redirects to retired paths
  for (const rule of manifest.rules) {
    if ((rule.statusCode !== 301 && rule.statusCode !== 308) || !rule.targetPath) {
      continue;
    }

    const src = rule.sourcePath.trim();
    const target = rule.targetPath.trim();

    if (retiredPaths.has(target)) {
      issues.push({
        code: "CANONICAL_TARGET_CONFLICT",
        ruleId: rule.id,
        sourcePath: src,
        message: `Redirect target "${target}" is marked as retired (404/410) in the manifest.`,
      });
      continue;
    }

    const nextRule = sourceMap.get(target);
    if (nextRule && (nextRule.statusCode === 301 || nextRule.statusCode === 308)) {
      // Check if it forms a cycle
      const visited = new Set<string>([src]);
      let cursor: LegacyRedirectRule | undefined = nextRule;
      let isCycle = false;

      while (cursor && cursor.targetPath) {
        const nextTarget = cursor.targetPath.trim();
        if (visited.has(nextTarget)) {
          isCycle = true;
          break;
        }
        visited.add(nextTarget);
        cursor = sourceMap.get(nextTarget);
      }

      if (isCycle) {
        issues.push({
          code: "REDIRECT_CYCLE_DETECTED",
          ruleId: rule.id,
          sourcePath: src,
          message: `Redirect cycle detected starting at "${src}" -> "${target}".`,
        });
      } else {
        issues.push({
          code: "REDIRECT_CHAIN_DETECTED",
          ruleId: rule.id,
          sourcePath: src,
          message: `Multi-hop redirect chain detected: "${src}" -> "${target}" -> "${nextRule.targetPath}". Point "${src}" directly to the final canonical destination.`,
        });
      }
    }
  }

  const permanentRedirects = manifest.rules.filter(
    (r) => r.statusCode === 301 || r.statusCode === 308
  ).length;
  const retired404or410 = manifest.rules.filter(
    (r) => r.statusCode === 404 || r.statusCode === 410
  ).length;
  const pendingGscEvidenceCount = manifest.rules.filter(
    (r) => r.evidenceStatus === "needs-gsc-export"
  ).length;

  return {
    valid: issues.length === 0,
    issues,
    stats: {
      totalRules: manifest.rules.length,
      permanentRedirects,
      retired404or410,
      pendingGscEvidenceCount,
    },
  };
}

/**
 * Default version-controlled redirect preparation manifest for ScientificRadar Web.
 * Contains structural pattern rules (index.php normalization, AMP suffix retirement
 * template, search-query trap rejection) while marking historical Search Console
 * URL buckets as `needs-gsc-export` until the owner provides fresh CSV exports.
 */
export const PREPARED_LEGACY_REDIRECT_MANIFEST: LegacyRedirectManifest = {
  manifestVersion: "1.0.0",
  updatedAt: "2026-11-03",
  historicalGscBaselineSummary: {
    alternateWithProperCanonicalCount: 34,
    soft404Count: 15,
    serverError5xxCount: 4,
    evidenceNote:
      "Historical Search Console counts recorded prior to 2026-11-03. Exact legacy URL CSV export is BLOCKED/UNKNOWN in this sandbox; no speculative article slug redirects are enabled.",
  },
  rules: [
    {
      id: "legacy-index-php-root",
      sourcePath: "/index.php",
      targetPath: "/",
      statusCode: 301,
      category: "php-legacy",
      evidenceStatus: "verified-mapping",
      notes: "Normalize legacy PHP root entrypoint to canonical homepage.",
    },
    {
      id: "legacy-index-html-root",
      sourcePath: "/index.html",
      targetPath: "/",
      statusCode: 301,
      category: "canonical-consolidation",
      evidenceStatus: "verified-mapping",
      notes: "Normalize static index.html entrypoint to canonical homepage.",
    },
    {
      id: "legacy-amp-spider-silk-example",
      sourcePath: "/article/spider-silk-hierarchical-protein-mechanics/amp",
      targetPath: "/article/spider-silk-hierarchical-protein-mechanics",
      statusCode: 301,
      category: "amp-retirement",
      evidenceStatus: "verified-mapping",
      notes: "Retire /amp suffix to canonical responsive article route.",
    },
    {
      id: "legacy-unmapped-php-article-probe",
      sourcePath: "/article.php",
      targetPath: null,
      statusCode: 404,
      category: "retired-404",
      evidenceStatus: "needs-gsc-export",
      notes: "Unmapped legacy PHP script returns explicit 404 until GSC URL export maps specific IDs.",
    },
    {
      id: "legacy-search-query-trap-retirement",
      sourcePath: "/search.php",
      targetPath: null,
      statusCode: 410,
      category: "search-trap-blocked",
      evidenceStatus: "verified-mapping",
      notes: "Retire legacy PHP search endpoint with 410 Gone to prevent crawler search traps.",
    },
  ],
};
