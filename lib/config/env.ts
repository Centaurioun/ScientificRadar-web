import { isVerifiedProductionOrigin } from "../seo/policy";
import {
  isValidAdSenseClientId,
  isValidAdsTxtRecord,
  isValidGa4MeasurementId,
} from "../integrations/google-services";

export type RuntimeOperatingMode = "stage-a-demo" | "stage-c-production";
export type ContentAdapterMode = "demo-fixtures" | "published-snapshots";

export interface WebEnvironmentValidationIssue {
  severity: "blocker" | "warning";
  variable: string;
  message: string;
}

export interface WebEnvironmentValidationResult {
  valid: boolean;
  mode: RuntimeOperatingMode;
  adapter: ContentAdapterMode;
  studioPublishingUrl: string | null;
  allowLoopbackHttpMediaOrigin: boolean;
  issues: WebEnvironmentValidationIssue[];
}

const FORBIDDEN_PUBLIC_SECRET_VARS = [
  "NEXT_PUBLIC_GEMINI_API_KEY",
  "NEXT_PUBLIC_API_KEY",
  "NEXT_PUBLIC_SCIRAD_REVALIDATION_SECRET",
  "NEXT_PUBLIC_PUBLISHING_API_SECRET",
  "NEXT_PUBLIC_DATABASE_URL",
] as const;

/**
 * Validates the runtime and build-time environment configuration for
 * ScientificRadar Web. Fails closed whenever production mode or production
 * indexing is requested without verified origins, non-demo content adapters,
 * or valid integration credentials.
 */
export function validateWebEnvironment(
  env: Record<string, string | undefined> = process.env
): WebEnvironmentValidationResult {
  const issues: WebEnvironmentValidationIssue[] = [];

  const rawMode = (env.SCIRAD_RUNTIME_MODE ?? "stage-a-demo").trim();
  const mode: RuntimeOperatingMode =
    rawMode === "stage-c-production" ? "stage-c-production" : "stage-a-demo";

  const rawAdapter = (env.SCIRAD_CONTENT_ADAPTER ?? "demo-fixtures").trim();
  const adapter: ContentAdapterMode =
    rawAdapter === "published-snapshots"
      ? "published-snapshots"
      : "demo-fixtures";
  if (rawAdapter !== "demo-fixtures" && rawAdapter !== "published-snapshots") {
    issues.push({
      severity: "blocker",
      variable: "SCIRAD_CONTENT_ADAPTER",
      message: "SCIRAD_CONTENT_ADAPTER must be exactly \"demo-fixtures\" or \"published-snapshots\".",
    });
  }

  const studioPublishing = resolveStudioPublishingUrl(env, mode, adapter, issues);

  const siteUrl = (env.NEXT_PUBLIC_SITE_URL ?? env.APP_URL ?? "").trim();
  const enableIndexing = env.NEXT_PUBLIC_ENABLE_PRODUCTION_INDEXING === "true";
  const enableGoogle = env.NEXT_PUBLIC_ENABLE_GOOGLE_SERVICES === "true";
  const enableAdSense = env.NEXT_PUBLIC_ENABLE_ADSENSE === "true";

  // 1. Check that server-only secrets are never exposed via NEXT_PUBLIC_*
  for (const forbiddenKey of FORBIDDEN_PUBLIC_SECRET_VARS) {
    if (env[forbiddenKey] && env[forbiddenKey]!.trim().length > 0) {
      issues.push({
        severity: "blocker",
        variable: forbiddenKey,
        message: `Server-only secret "${forbiddenKey}" must never be prefixed with NEXT_PUBLIC_.`,
      });
    }
  }

  // 2. Production mode & indexing invariants
  if (mode === "stage-c-production" || enableIndexing) {
    if (!isVerifiedProductionOrigin(siteUrl)) {
      issues.push({
        severity: "blocker",
        variable: "NEXT_PUBLIC_SITE_URL",
        message:
          "Production mode or indexing requires NEXT_PUBLIC_SITE_URL to be a verified HTTPS production domain.",
      });
    }

    if (adapter === "demo-fixtures") {
      issues.push({
        severity: "blocker",
        variable: "SCIRAD_CONTENT_ADAPTER",
        message:
          'Production mode or indexing cannot run against "demo-fixtures". Set SCIRAD_CONTENT_ADAPTER="published-snapshots" only after Studio publishing integration is verified.',
      });
    }
  }

  // 3. Google Services & AdSense invariants
  if (enableGoogle) {
    const ga4 = (env.NEXT_PUBLIC_GA4_MEASUREMENT_ID ?? "").trim();
    if (ga4 && !isValidGa4MeasurementId(ga4)) {
      issues.push({
        severity: "blocker",
        variable: "NEXT_PUBLIC_GA4_MEASUREMENT_ID",
        message:
          "NEXT_PUBLIC_GA4_MEASUREMENT_ID has an invalid or placeholder format (expected G-XXXXXXXXXX).",
      });
    }
  }

  if (enableAdSense) {
    if (!enableGoogle) {
      issues.push({
        severity: "blocker",
        variable: "NEXT_PUBLIC_ENABLE_GOOGLE_SERVICES",
        message:
          "NEXT_PUBLIC_ENABLE_ADSENSE=true requires NEXT_PUBLIC_ENABLE_GOOGLE_SERVICES=true.",
      });
    }

    const clientId = (env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ?? "").trim();
    if (!isValidAdSenseClientId(clientId)) {
      issues.push({
        severity: "blocker",
        variable: "NEXT_PUBLIC_ADSENSE_CLIENT_ID",
        message:
          "NEXT_PUBLIC_ENABLE_ADSENSE=true requires a valid NEXT_PUBLIC_ADSENSE_CLIENT_ID (ca-pub-XXXXXXXXXXXXXXXX).",
      });
    }

    const adsTxt = (env.NEXT_PUBLIC_ADS_TXT_RECORD ?? "").trim();
    if (!isValidAdsTxtRecord(adsTxt)) {
      issues.push({
        severity: "blocker",
        variable: "NEXT_PUBLIC_ADS_TXT_RECORD",
        message:
          "NEXT_PUBLIC_ENABLE_ADSENSE=true requires a verified NEXT_PUBLIC_ADS_TXT_RECORD.",
      });
    }
  }

  const hasBlockers = issues.some((i) => i.severity === "blocker");

  return {
    valid: !hasBlockers,
    mode,
    adapter,
    studioPublishingUrl: studioPublishing.url,
    allowLoopbackHttpMediaOrigin: studioPublishing.allowLoopbackHttpMediaOrigin,
    issues,
  };
}

function resolveStudioPublishingUrl(
  env: Record<string, string | undefined>,
  mode: RuntimeOperatingMode,
  adapter: ContentAdapterMode,
  issues: WebEnvironmentValidationIssue[]
): { url: string | null; allowLoopbackHttpMediaOrigin: boolean } {
  const raw = (env.SCIENTIFICRADAR_STUDIO_PUBLISHING_URL ?? "").trim();
  if (adapter !== "published-snapshots") return { url: null, allowLoopbackHttpMediaOrigin: false };
  if (!raw) {
    issues.push({
      severity: "blocker",
      variable: "SCIENTIFICRADAR_STUDIO_PUBLISHING_URL",
      message: "Published snapshot mode requires the public Studio API origin.",
    });
    return { url: null, allowLoopbackHttpMediaOrigin: false };
  }

  try {
    const parsed = new URL(raw);
    const isLoopback = ["localhost", "127.0.0.1", "::1", "[::1]"].includes(parsed.hostname);
    const production = mode === "stage-c-production" ||
      env.NODE_ENV === "production" ||
      env.NEXT_PUBLIC_ENABLE_PRODUCTION_INDEXING === "true";
    const allowLoopbackHttpMediaOrigin = parsed.protocol === "http:" && isLoopback && !production;
    if (
      (parsed.protocol !== "https:" && !allowLoopbackHttpMediaOrigin) ||
      (production && isLoopback) ||
      parsed.username || parsed.password || parsed.pathname !== "/" || parsed.search || parsed.hash
    ) {
      throw new Error("invalid public origin");
    }
    return { url: parsed.origin, allowLoopbackHttpMediaOrigin };
  } catch {
    issues.push({
      severity: "blocker",
      variable: "SCIENTIFICRADAR_STUDIO_PUBLISHING_URL",
      message: "Studio public URL must be an HTTPS origin (or a loopback HTTP origin in non-production mode) with no path, credentials, query, or fragment.",
    });
    return { url: null, allowLoopbackHttpMediaOrigin: false };
  }
}
