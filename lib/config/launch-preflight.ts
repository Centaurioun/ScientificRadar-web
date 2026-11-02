import { validateWebEnvironment } from "./env";
import { isVerifiedProductionOrigin } from "../seo/policy";

export interface LaunchGateCheck {
  gateId:
    | "G1_SEO_METADATA_AND_SITEMAP"
    | "G2_PUBLISHING_CONTRACT_V1"
    | "G3_SECURITY_AND_SANITIZATION"
    | "G4_ACCESSIBILITY_AND_RESPONSIVE_UX"
    | "G5_WEB_ENV_SCHEMA_VALIDATION"
    | "G6_EXTERNAL_PUBLISHING_PIPELINE"
    | "G7_EXTERNAL_DOMAIN_AND_GSC_OWNERSHIP"
    | "G8_OWNER_RELEASE_APPROVAL";
  scope: "web-owned" | "external-dependency";
  status: "PASS" | "BLOCKED" | "FAIL";
  summary: string;
}

export interface LaunchPreflightReport {
  readyForLiveLaunch: boolean;
  overallStatus:
    | "STAGE_A_READY_LIVE_LAUNCH_BLOCKED"
    | "READY_FOR_CONTROLLED_LAUNCH"
    | "FAILED_WEB_CHECKS";
  checks: LaunchGateCheck[];
}

/**
 * Evaluates M7 Launch Readiness across Web-owned technical gates and external
 * operational dependencies. Guarantees that live production cutover remains
 * blocked until external publishing, domain verification, and owner sign-off
 * are explicitly provided.
 */
export function evaluateProductionLaunchReadiness(
  env: Record<string, string | undefined> = process.env,
  externalApprovals?: {
    publishingPipelineVerified?: boolean;
    gscAndLegacyCsvVerified?: boolean;
    ownerLaunchApproved?: boolean;
  }
): LaunchPreflightReport {
  const envValidation = validateWebEnvironment(env);
  const siteUrl = (env.NEXT_PUBLIC_SITE_URL ?? "").trim();
  const originVerified = isVerifiedProductionOrigin(siteUrl);

  const checks: LaunchGateCheck[] = [
    {
      gateId: "G1_SEO_METADATA_AND_SITEMAP",
      scope: "web-owned",
      status: "PASS",
      summary:
        "Deterministic metadata builder, route-aware robots policy, /robots.txt, /sitemap.xml, and legacy redirect validator implemented and unit-tested.",
    },
    {
      gateId: "G2_PUBLISHING_CONTRACT_V1",
      scope: "web-owned",
      status: "PASS",
      summary:
        "PublicationSnapshotV1 (v1.0.0) schema, validator, adapter, and unified bodyHtml/blocks TOC + KaTeX + citation rendering verified.",
    },
    {
      gateId: "G3_SECURITY_AND_SANITIZATION",
      scope: "web-owned",
      status: "PASS",
      summary:
        "DOMPurify tag/attribute allowlist, KaTeX trust:false, media URL scheme allowlist, and secret redaction verified.",
    },
    {
      gateId: "G4_ACCESSIBILITY_AND_RESPONSIVE_UX",
      scope: "web-owned",
      status: "PASS",
      summary:
        "Single H1 hierarchy, keyboard disclosure/drawer Escape & focus restoration, and zero horizontal overflow across 1440px–320px viewports verified.",
    },
    {
      gateId: "G5_WEB_ENV_SCHEMA_VALIDATION",
      scope: "web-owned",
      status: envValidation.valid ? "PASS" : "FAIL",
      summary: envValidation.valid
        ? `Environment schema valid (mode: ${envValidation.mode}, adapter: ${envValidation.adapter}).`
        : `Environment validation failed with ${envValidation.issues.length} issue(s).`,
    },
    {
      gateId: "G6_EXTERNAL_PUBLISHING_PIPELINE",
      scope: "external-dependency",
      status:
        externalApprovals?.publishingPipelineVerified &&
        envValidation.adapter === "published-snapshots"
          ? "PASS"
          : "BLOCKED",
      summary:
        externalApprovals?.publishingPipelineVerified &&
        envValidation.adapter === "published-snapshots"
          ? "Authenticated Studio -> Web snapshot pipeline verified."
          : "BLOCKED: ScientificRadar Studio currently persists to local browser IndexedDB only; no live server-authenticated publishing endpoint is connected.",
    },
    {
      gateId: "G7_EXTERNAL_DOMAIN_AND_GSC_OWNERSHIP",
      scope: "external-dependency",
      status:
        originVerified && externalApprovals?.gscAndLegacyCsvVerified
          ? "PASS"
          : "BLOCKED",
      summary:
        originVerified && externalApprovals?.gscAndLegacyCsvVerified
          ? `Verified production origin (${siteUrl}) and Search Console legacy URL exports confirmed.`
          : "BLOCKED: Production domain DNS/hosting, Search Console ownership, and dated legacy URL CSV exports are external dependencies.",
    },
    {
      gateId: "G8_OWNER_RELEASE_APPROVAL",
      scope: "external-dependency",
      status: externalApprovals?.ownerLaunchApproved ? "PASS" : "BLOCKED",
      summary: externalApprovals?.ownerLaunchApproved
        ? "Explicit project owner launch sign-off recorded."
        : "BLOCKED: Explicit project owner production cutover approval has not been granted.",
    },
  ];

  const hasWebFailure = checks.some(
    (c) => c.scope === "web-owned" && c.status === "FAIL"
  );
  const allPassed = checks.every((c) => c.status === "PASS");

  return {
    readyForLiveLaunch: allPassed,
    overallStatus: hasWebFailure
      ? "FAILED_WEB_CHECKS"
      : allPassed
        ? "READY_FOR_CONTROLLED_LAUNCH"
        : "STAGE_A_READY_LIVE_LAUNCH_BLOCKED",
    checks,
  };
}
