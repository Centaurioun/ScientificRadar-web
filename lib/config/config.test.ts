import test from "node:test";
import assert from "node:assert/strict";
import { validateWebEnvironment } from "./env";
import {
  createRedactedDiagnosticEvent,
  getArticleCacheTags,
  validateRevalidationPayload,
} from "./diagnostics";
import { evaluateProductionLaunchReadiness } from "./launch-preflight";

test("validateWebEnvironment passes cleanly in default Stage A demo configuration", () => {
  const res = validateWebEnvironment({});
  assert.equal(res.valid, true);
  assert.equal(res.mode, "stage-a-demo");
  assert.equal(res.adapter, "demo-fixtures");
  assert.equal(res.issues.length, 0);
});

test("validateWebEnvironment fails closed when production indexing is enabled on demo fixtures or unverified origin", () => {
  const badProd = validateWebEnvironment({
    SCIRAD_RUNTIME_MODE: "stage-c-production",
    SCIRAD_CONTENT_ADAPTER: "demo-fixtures",
    NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
    NEXT_PUBLIC_ENABLE_PRODUCTION_INDEXING: "true",
    NEXT_PUBLIC_GEMINI_API_KEY: "leaked-secret",
  });

  assert.equal(badProd.valid, false);
  const vars = new Set(badProd.issues.map((i) => i.variable));
  assert.ok(vars.has("NEXT_PUBLIC_SITE_URL"));
  assert.ok(vars.has("SCIRAD_CONTENT_ADAPTER"));
  assert.ok(vars.has("NEXT_PUBLIC_GEMINI_API_KEY"));
});

test("published snapshot adapter requires a credential-free public Studio origin", () => {
  const missing = validateWebEnvironment({ SCIRAD_CONTENT_ADAPTER: "published-snapshots" });
  assert.equal(missing.valid, false);
  assert.ok(missing.issues.some((issue) => issue.variable === "SCIENTIFICRADAR_STUDIO_PUBLISHING_URL"));

  const local = validateWebEnvironment({
    SCIRAD_CONTENT_ADAPTER: "published-snapshots",
    SCIENTIFICRADAR_STUDIO_PUBLISHING_URL: "http://localhost:3000",
  });
  assert.equal(local.valid, true);
  assert.equal(local.studioPublishingUrl, "http://localhost:3000");
  assert.equal(local.allowLoopbackHttpMediaOrigin, true);

  const productionLoopback = validateWebEnvironment({
    SCIRAD_RUNTIME_MODE: "stage-c-production",
    SCIRAD_CONTENT_ADAPTER: "published-snapshots",
    SCIENTIFICRADAR_STUDIO_PUBLISHING_URL: "http://localhost:3000",
    NEXT_PUBLIC_SITE_URL: "https://scientificradar.com",
  });
  assert.equal(productionLoopback.valid, false);
  assert.equal(productionLoopback.allowLoopbackHttpMediaOrigin, false);

  const productionBuildLoopback = validateWebEnvironment({
    NODE_ENV: "production",
    SCIRAD_CONTENT_ADAPTER: "published-snapshots",
    SCIENTIFICRADAR_STUDIO_PUBLISHING_URL: "http://localhost:3000",
  });
  assert.equal(productionBuildLoopback.valid, false);
  assert.equal(productionBuildLoopback.allowLoopbackHttpMediaOrigin, false);

  const productionHttpsLoopback = validateWebEnvironment({
    NODE_ENV: "production",
    SCIRAD_CONTENT_ADAPTER: "published-snapshots",
    SCIENTIFICRADAR_STUDIO_PUBLISHING_URL: "https://localhost:3000",
  });
  assert.equal(productionHttpsLoopback.valid, false);
  assert.equal(productionHttpsLoopback.studioPublishingUrl, null);

  const pathAndCredentials = validateWebEnvironment({
    SCIRAD_CONTENT_ADAPTER: "published-snapshots",
    SCIENTIFICRADAR_STUDIO_PUBLISHING_URL: "https://user:password@studio.example.com/private",
  });
  assert.equal(pathAndCredentials.valid, false);
});

test("invalid adapter values are blockers instead of silently selecting demo fixtures", () => {
  const result = validateWebEnvironment({ SCIRAD_CONTENT_ADAPTER: "production-ish" });
  assert.equal(result.valid, false);
  assert.ok(result.issues.some((issue) => issue.variable === "SCIRAD_CONTENT_ADAPTER"));
});

test("validateRevalidationPayload fails closed without secret and returns exact cache tags when authorized", () => {
  const samplePayload = {
    contractVersion: "1.0.0",
    action: "publish",
    slug: "spider-silk-hierarchical-protein-mechanics",
    categorySlug: "biology",
    revisionId: "rev-01",
    issuedAt: "2026-11-03T10:00:00Z",
  };

  const noSecret = validateRevalidationPayload(
    samplePayload,
    "Bearer my-super-secret-token-12345",
    undefined
  );
  assert.equal(noSecret.authorized, false);

  const authorized = validateRevalidationPayload(
    samplePayload,
    "Bearer my-super-secret-token-12345",
    "my-super-secret-token-12345"
  );
  assert.equal(authorized.authorized, true);
  assert.equal(authorized.validPayload, true);
  assert.deepEqual(
    authorized.tagsToRevalidate,
    getArticleCacheTags(
      "spider-silk-hierarchical-protein-mechanics",
      "biology",
      "rev-01"
    )
  );
});

test("createRedactedDiagnosticEvent scrubs tokens, secrets, and Bearer headers", () => {
  const event = createRedactedDiagnosticEvent("revalidation.attempt", {
    route: "/api/revalidate?token=supersecret123",
    authorizationHeader: "Bearer tok_live_999999",
    authDetail: "Failed header Bearer tok_live_999999 on request",
    statusCode: 401,
  });

  assert.equal(event.sanitizedMetadata.authorizationHeader, "[REDACTED]");
  assert.equal(
    event.sanitizedMetadata.route,
    "/api/revalidate?token=[REDACTED]"
  );
  assert.equal(
    event.sanitizedMetadata.authDetail,
    "Failed header Bearer [REDACTED] on request"
  );
  assert.equal(event.sanitizedMetadata.statusCode, 401);
});

test("evaluateProductionLaunchReadiness passes Web-owned gates while blocking live launch until external dependencies are approved", () => {
  const defaultReport = evaluateProductionLaunchReadiness({});
  assert.equal(defaultReport.readyForLiveLaunch, false);
  assert.equal(
    defaultReport.overallStatus,
    "STAGE_A_READY_LIVE_LAUNCH_BLOCKED"
  );

  const webGates = defaultReport.checks.filter((c) => c.scope === "web-owned");
  assert.ok(webGates.every((g) => g.status === "PASS"));

  const externalGates = defaultReport.checks.filter(
    (c) => c.scope === "external-dependency"
  );
  assert.ok(externalGates.every((g) => g.status === "BLOCKED"));
});
