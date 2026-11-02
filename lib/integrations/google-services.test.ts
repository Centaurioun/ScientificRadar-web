import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  buildAdsTxtContent,
  canLoadAdSenseScript,
  canLoadAnalyticsScript,
  ConsentState,
  DEFAULT_DENIED_CONSENT_STATE,
  getGoogleServicesConfig,
  isRouteEligibleForAdSense,
  resolveDeduplicatedGoogleScripts,
} from "./google-services";
import {
  AdSenseSlot,
  GoogleServicesGate,
} from "../../components/site/GoogleServicesGate";

const GRANTED_CONSENT: ConsentState = {
  analyticsStorage: "granted",
  adStorage: "granted",
  adUserData: "granted",
  adPersonalization: "granted",
};

test("Google services and AdSense are strictly disabled by default", () => {
  const defaultConfig = getGoogleServicesConfig();
  assert.equal(defaultConfig.enableGoogleServices, false);
  assert.equal(defaultConfig.enableAdSense, false);
  assert.equal(canLoadAnalyticsScript(defaultConfig, GRANTED_CONSENT), false);
  assert.equal(canLoadAdSenseScript(defaultConfig, GRANTED_CONSENT), false);

  const scripts = resolveDeduplicatedGoogleScripts(
    defaultConfig,
    GRANTED_CONSENT
  );
  assert.equal(scripts.length, 0);

  const gateMarkup = renderToStaticMarkup(
    React.createElement(GoogleServicesGate)
  );
  assert.equal(gateMarkup, "");
});

test("consent gate blocks GA4 and AdSense when consent is pending or denied even if env flags are enabled", () => {
  const enabledConfig = getGoogleServicesConfig({
    enableGoogleServices: true,
    enableAdSense: true,
    requireExplicitConsent: true,
    ga4MeasurementId: "G-SCIRAD2026",
    adSenseClientId: "ca-pub-8558636886209631",
  });

  // Pending consent -> blocked
  assert.equal(
    canLoadAnalyticsScript(enabledConfig, DEFAULT_DENIED_CONSENT_STATE),
    false
  );
  assert.equal(
    canLoadAdSenseScript(enabledConfig, DEFAULT_DENIED_CONSENT_STATE),
    false
  );

  // Granted consent -> allowed and deduplicated
  const scripts = resolveDeduplicatedGoogleScripts(
    enabledConfig,
    GRANTED_CONSENT,
    { routeType: "article", articleStatus: "published" }
  );
  assert.equal(scripts.length, 2);
  assert.equal(scripts[0].id, "scirad-ga4-gtag");
  assert.equal(scripts[1].id, "scirad-adsense-script");
});

test("AdSense route eligibility blocks search, not-found, empty listings, and demo/draft/withdrawn articles", () => {
  assert.equal(isRouteEligibleForAdSense({ routeType: "search" }), false);
  assert.equal(isRouteEligibleForAdSense({ routeType: "not-found" }), false);
  assert.equal(
    isRouteEligibleForAdSense({
      routeType: "topic-landing",
      contentItemCount: 0,
    }),
    false
  );
  assert.equal(
    isRouteEligibleForAdSense({
      routeType: "article",
      articleStatus: "demo",
    }),
    false
  );
  assert.equal(
    isRouteEligibleForAdSense({
      routeType: "article",
      articleStatus: "draft",
    }),
    false
  );
  assert.equal(
    isRouteEligibleForAdSense({
      routeType: "article",
      articleStatus: "withdrawn",
    }),
    false
  );
  assert.equal(
    isRouteEligibleForAdSense({
      routeType: "article",
      articleStatus: "published",
    }),
    true
  );

  // Verify AdSenseSlot component renders null on demo article even with granted consent
  const enabledConfig = {
    enableGoogleServices: true,
    enableAdSense: true,
    requireExplicitConsent: true,
    ga4MeasurementId: "G-SCIRAD2026",
    adSenseClientId: "ca-pub-8558636886209631",
  };
  const demoSlotHtml = renderToStaticMarkup(
    React.createElement(AdSenseSlot, {
      slotId: "article-mid-1",
      routeType: "article",
      articleStatus: "demo",
      configOverrides: enabledConfig,
      consent: GRANTED_CONSENT,
    })
  );
  assert.equal(demoSlotHtml, "");

  // Renders CLS-guarded slot on published article when enabled + consented
  const pubSlotHtml = renderToStaticMarkup(
    React.createElement(AdSenseSlot, {
      slotId: "article-mid-1",
      routeType: "article",
      articleStatus: "published",
      minHeightPx: 280,
      configOverrides: enabledConfig,
      consent: GRANTED_CONSENT,
    })
  );
  assert.ok(pubSlotHtml.includes('data-testid="adsense-slot-article-mid-1"'));
  assert.ok(pubSlotHtml.includes("min-height:280px"));
});

test("buildAdsTxtContent serves safe disabled comment by default and exact record only when authorized", () => {
  const defaultTxt = buildAdsTxtContent();
  assert.equal(defaultTxt.isAuthorizedRecordActive, false);
  assert.match(defaultTxt.body, /^# ScientificRadar Web/);

  const activeTxt = buildAdsTxtContent({
    enableGoogleServices: true,
    enableAdSense: true,
    adsTxtRecord:
      "google.com, pub-8558636886209631, DIRECT, f08c47fec0942fa0",
  });
  assert.equal(activeTxt.isAuthorizedRecordActive, true);
  assert.equal(
    activeTxt.body,
    "google.com, pub-8558636886209631, DIRECT, f08c47fec0942fa0\n"
  );
});
