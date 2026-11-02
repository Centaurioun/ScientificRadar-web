import { PublicationStatus } from "../content/types";
import { RouteMetadataContextType } from "../seo/policy";

export type ConsentGrantState = "granted" | "denied" | "pending";

export interface ConsentState {
  analyticsStorage: ConsentGrantState;
  adStorage: ConsentGrantState;
  adUserData: ConsentGrantState;
  adPersonalization: ConsentGrantState;
}

export const DEFAULT_DENIED_CONSENT_STATE: ConsentState = {
  analyticsStorage: "pending",
  adStorage: "pending",
  adUserData: "pending",
  adPersonalization: "pending",
};

export interface GoogleServicesEnvConfig {
  enableGoogleServices: boolean;
  enableAdSense: boolean;
  requireExplicitConsent: boolean;
  ga4MeasurementId: string;
  adSenseClientId: string;
  gscVerificationToken: string;
  adsTxtRecord: string;
}

const GA4_ID_REGEX = /^G-[A-Z0-9]{6,16}$/;
const ADSENSE_CLIENT_REGEX = /^ca-pub-\d{16}$/;
const ADS_TXT_LINE_REGEX =
  /^google\.com,\s*pub-\d{16},\s*(DIRECT|RESELLER),\s*f08c47fec0942fa0$/;

export function isValidGa4MeasurementId(id: string): boolean {
  const trimmed = id.trim();
  if (!trimmed || trimmed.includes("XXXX") || trimmed.startsWith("MY_")) {
    return false;
  }
  return GA4_ID_REGEX.test(trimmed);
}

export function normalizeAdSenseClientId(rawId: string): string {
  const trimmed = rawId.trim();
  if (/^pub-\d{16}$/.test(trimmed)) {
    return `ca-${trimmed}`;
  }
  return trimmed;
}

export function isValidAdSenseClientId(rawId: string): boolean {
  const normalized = normalizeAdSenseClientId(rawId);
  if (!normalized || normalized.includes("00000000") || normalized.startsWith("MY_")) {
    return false;
  }
  return ADSENSE_CLIENT_REGEX.test(normalized);
}

export function isValidAdsTxtRecord(record: string): boolean {
  const trimmed = record.trim();
  if (!trimmed || trimmed.includes("00000000")) return false;
  return ADS_TXT_LINE_REGEX.test(trimmed);
}

/**
 * Reads Google integration configuration from environment variables.
 * Disabled by default unless explicit enable flags AND valid non-placeholder IDs are provided.
 */
export function getGoogleServicesConfig(
  overrides?: Partial<GoogleServicesEnvConfig>
): GoogleServicesEnvConfig {
  const enableGoogleServices =
    overrides?.enableGoogleServices !== undefined
      ? overrides.enableGoogleServices
      : process.env.NEXT_PUBLIC_ENABLE_GOOGLE_SERVICES === "true";

  const enableAdSense =
    overrides?.enableAdSense !== undefined
      ? overrides.enableAdSense
      : process.env.NEXT_PUBLIC_ENABLE_ADSENSE === "true";

  const requireExplicitConsent =
    overrides?.requireExplicitConsent !== undefined
      ? overrides.requireExplicitConsent
      : process.env.NEXT_PUBLIC_REQUIRE_CONSENT !== "false";

  const ga4MeasurementId = (
    overrides?.ga4MeasurementId ??
    process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID ??
    ""
  ).trim();

  const adSenseClientId = normalizeAdSenseClientId(
    overrides?.adSenseClientId ??
      process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ??
      ""
  );

  const gscVerificationToken = (
    overrides?.gscVerificationToken ??
    process.env.NEXT_PUBLIC_GSC_VERIFICATION_TOKEN ??
    ""
  ).trim();

  const adsTxtRecord = (
    overrides?.adsTxtRecord ??
    process.env.NEXT_PUBLIC_ADS_TXT_RECORD ??
    ""
  ).trim();

  return {
    enableGoogleServices,
    enableAdSense,
    requireExplicitConsent,
    ga4MeasurementId,
    adSenseClientId,
    gscVerificationToken,
    adsTxtRecord,
  };
}

export function canLoadAnalyticsScript(
  config: GoogleServicesEnvConfig,
  consent: ConsentState = DEFAULT_DENIED_CONSENT_STATE
): boolean {
  if (!config.enableGoogleServices) return false;
  if (!isValidGa4MeasurementId(config.ga4MeasurementId)) return false;
  if (config.requireExplicitConsent && consent.analyticsStorage !== "granted") {
    return false;
  }
  return consent.analyticsStorage !== "denied";
}

export function canLoadAdSenseScript(
  config: GoogleServicesEnvConfig,
  consent: ConsentState = DEFAULT_DENIED_CONSENT_STATE
): boolean {
  if (!config.enableGoogleServices || !config.enableAdSense) return false;
  if (!isValidAdSenseClientId(config.adSenseClientId)) return false;
  if (config.requireExplicitConsent && consent.adStorage !== "granted") {
    return false;
  }
  return consent.adStorage !== "denied";
}

/**
 * Enforces Google Publisher Policy route eligibility:
 * Never place AdSense slots on 404 pages, internal search results, empty listings,
 * or non-published (demo/draft/withdrawn) articles.
 */
export function isRouteEligibleForAdSense(context: {
  routeType: RouteMetadataContextType;
  articleStatus?: PublicationStatus;
  contentItemCount?: number;
}): boolean {
  if (context.routeType === "search" || context.routeType === "not-found") {
    return false;
  }
  if (
    context.contentItemCount !== undefined &&
    context.contentItemCount <= 0
  ) {
    return false;
  }
  if (context.routeType === "article") {
    return context.articleStatus === "published";
  }
  return true;
}

export interface ScriptDescriptor {
  id: string;
  src: string;
  async: boolean;
  crossOrigin?: "anonymous";
}

/**
 * Generates a deduplicated list of external Google script tags for a page.
 * Guarantees at most one GA4 tag and at most one AdSense tag.
 */
export function resolveDeduplicatedGoogleScripts(
  config: GoogleServicesEnvConfig,
  consent: ConsentState = DEFAULT_DENIED_CONSENT_STATE,
  routeContext?: {
    routeType: RouteMetadataContextType;
    articleStatus?: PublicationStatus;
    contentItemCount?: number;
  }
): ScriptDescriptor[] {
  const scripts = new Map<string, ScriptDescriptor>();

  if (canLoadAnalyticsScript(config, consent)) {
    scripts.set("scirad-ga4-gtag", {
      id: "scirad-ga4-gtag",
      src: `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(config.ga4MeasurementId)}`,
      async: true,
    });
  }

  const routeEligible = routeContext
    ? isRouteEligibleForAdSense(routeContext)
    : true;

  if (routeEligible && canLoadAdSenseScript(config, consent)) {
    scripts.set("scirad-adsense-script", {
      id: "scirad-adsense-script",
      src: `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(config.adSenseClientId)}`,
      async: true,
      crossOrigin: "anonymous",
    });
  }

  return Array.from(scripts.values());
}

/**
 * Generates the exact plain-text body for `/ads.txt`.
 * Never claims an active publisher record unless AdSense is explicitly enabled
 * and a valid `NEXT_PUBLIC_ADS_TXT_RECORD` is configured.
 */
export function buildAdsTxtContent(
  overrides?: Partial<GoogleServicesEnvConfig>
): {
  body: string;
  isAuthorizedRecordActive: boolean;
} {
  const config = getGoogleServicesConfig(overrides);

  if (
    config.enableGoogleServices &&
    config.enableAdSense &&
    isValidAdsTxtRecord(config.adsTxtRecord)
  ) {
    return {
      body: `${config.adsTxtRecord.trim()}\n`,
      isAuthorizedRecordActive: true,
    };
  }

  return {
    body: "# ScientificRadar Web — AdSense monetization is disabled by default in Stage A / unconfigured environments.\n",
    isAuthorizedRecordActive: false,
  };
}
