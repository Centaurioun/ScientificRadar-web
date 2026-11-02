import React from "react";
import {
  ConsentState,
  DEFAULT_DENIED_CONSENT_STATE,
  getGoogleServicesConfig,
  GoogleServicesEnvConfig,
  isRouteEligibleForAdSense,
  canLoadAdSenseScript,
  resolveDeduplicatedGoogleScripts,
} from "@/lib/integrations/google-services";
import { PublicationStatus } from "@/lib/content/types";
import { RouteMetadataContextType } from "@/lib/seo/policy";

interface GoogleServicesGateProps {
  configOverrides?: Partial<GoogleServicesEnvConfig>;
  consent?: ConsentState;
  routeType?: RouteMetadataContextType;
  articleStatus?: PublicationStatus;
}

/**
 * Environment-gated, consent-aware script gate.
 * Renders nothing (`null`) by default when Google services are disabled or
 * when explicit user consent has not been granted.
 */
export function GoogleServicesGate({
  configOverrides,
  consent = DEFAULT_DENIED_CONSENT_STATE,
  routeType = "home",
  articleStatus,
}: GoogleServicesGateProps) {
  const config = getGoogleServicesConfig(configOverrides);
  const scripts = resolveDeduplicatedGoogleScripts(config, consent, {
    routeType,
    articleStatus,
  });

  if (scripts.length === 0) {
    return null;
  }

  return (
    <div data-testid="google-services-script-gate" hidden aria-hidden="true">
      {scripts.map((s) => (
        <script
          key={s.id}
          id={s.id}
          src={s.src}
          async={s.async}
          crossOrigin={s.crossOrigin}
        />
      ))}
    </div>
  );
}

interface AdSenseSlotProps {
  slotId: string;
  routeType: RouteMetadataContextType;
  articleStatus?: PublicationStatus;
  contentItemCount?: number;
  minHeightPx?: number;
  configOverrides?: Partial<GoogleServicesEnvConfig>;
  consent?: ConsentState;
}

/**
 * Policy-safe, CLS-guarded AdSense slot container.
 * Renders `null` when AdSense is disabled (default), when consent is not granted,
 * or when the route is ineligible (search, 404, empty state, demo/draft/withdrawn article).
 */
export function AdSenseSlot({
  slotId,
  routeType,
  articleStatus,
  contentItemCount,
  minHeightPx = 250,
  configOverrides,
  consent = DEFAULT_DENIED_CONSENT_STATE,
}: AdSenseSlotProps) {
  const config = getGoogleServicesConfig(configOverrides);
  const eligible = isRouteEligibleForAdSense({
    routeType,
    articleStatus,
    contentItemCount,
  });

  if (!eligible || !canLoadAdSenseScript(config, consent)) {
    return null;
  }

  return (
    <aside
      aria-label="Advertisement"
      data-testid={`adsense-slot-${slotId}`}
      style={{ minHeight: `${minHeightPx}px` }}
      className="my-8 w-full max-w-[var(--sr-reading-max)] mx-auto p-3 rounded-sm bg-[var(--sr-surface)] border border-[var(--sr-rule)] flex flex-col items-center justify-center text-center"
    >
      <span className="text-[10px] font-sans uppercase tracking-widest text-[var(--sr-muted)] mb-2">
        Advertisement
      </span>
      <ins
        className="adsbygoogle block w-full"
        data-ad-client={config.adSenseClientId}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
