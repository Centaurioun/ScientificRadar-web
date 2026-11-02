/**
 * Server cache tag & revalidation contract and non-sensitive diagnostic helpers (M5).
 */

export function getArticleCacheTags(
  slug: string,
  categorySlug: string,
  revisionId?: string
): string[] {
  const tags = [
    "scirad:articles:all",
    `scirad:article:${slug}`,
    `scirad:category:${categorySlug}`,
    "scirad:sitemap",
  ];
  if (revisionId) {
    tags.push(`scirad:revision:${revisionId}`);
  }
  return tags;
}

export interface RevalidationWebhookPayload {
  contractVersion: "1.0.0";
  action: "publish" | "update" | "withdraw";
  slug: string;
  categorySlug: string;
  revisionId: string;
  issuedAt: string;
}

export function validateRevalidationPayload(
  payload: unknown,
  authHeader: string | null | undefined,
  configuredSecret: string | undefined
): {
  authorized: boolean;
  validPayload: boolean;
  tagsToRevalidate: string[];
  reason: string;
} {
  if (!configuredSecret || configuredSecret.trim().length < 16) {
    return {
      authorized: false,
      validPayload: false,
      tagsToRevalidate: [],
      reason: "Revalidation secret is not configured on the server (fail-closed).",
    };
  }

  const expectedHeader = `Bearer ${configuredSecret.trim()}`;
  if (!authHeader || authHeader.trim() !== expectedHeader) {
    return {
      authorized: false,
      validPayload: false,
      tagsToRevalidate: [],
      reason: "Invalid or missing Bearer authorization token.",
    };
  }

  if (!payload || typeof payload !== "object") {
    return {
      authorized: true,
      validPayload: false,
      tagsToRevalidate: [],
      reason: "Payload must be a JSON object.",
    };
  }

  const record = payload as Partial<RevalidationWebhookPayload>;
  if (
    record.contractVersion !== "1.0.0" ||
    !record.slug ||
    !record.categorySlug ||
    !record.revisionId ||
    !["publish", "update", "withdraw"].includes(String(record.action))
  ) {
    return {
      authorized: true,
      validPayload: false,
      tagsToRevalidate: [],
      reason: "Payload does not match RevalidationWebhookPayload v1.0.0 schema.",
    };
  }

  return {
    authorized: true,
    validPayload: true,
    tagsToRevalidate: getArticleCacheTags(
      record.slug,
      record.categorySlug,
      record.revisionId
    ),
    reason: "Authorized and valid revalidation request.",
  };
}

const SENSITIVE_KEY_PATTERN =
  /(secret|token|password|authorization|cookie|api[-_]?key|credential|session)/i;

/**
 * Produces a structured, non-sensitive diagnostic event by redacting any keys
 * or URL query parameters that could contain credentials or personal tokens.
 */
export function createRedactedDiagnosticEvent(
  eventName: string,
  metadata: Record<string, unknown>
): {
  timestamp: string;
  event: string;
  sanitizedMetadata: Record<string, unknown>;
} {
  const sanitizedMetadata: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(metadata)) {
    if (SENSITIVE_KEY_PATTERN.test(key)) {
      sanitizedMetadata[key] = "[REDACTED]";
      continue;
    }

    if (typeof value === "string") {
      // Redact Bearer tokens or sensitive query params inside strings
      const cleaned = value
        .replace(/Bearer\s+[A-Za-z0-9._-]+/gi, "Bearer [REDACTED]")
        .replace(
          /([?&](?:token|key|secret|password|auth)=)[^&\s]+/gi,
          "$1[REDACTED]"
        );
      sanitizedMetadata[key] = cleaned;
    } else {
      sanitizedMetadata[key] = value;
    }
  }

  return {
    timestamp: new Date().toISOString(),
    event: eventName,
    sanitizedMetadata,
  };
}
