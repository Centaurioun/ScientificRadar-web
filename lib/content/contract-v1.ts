import {
  ArticleHeadingOutlineItem,
  PUBLICATION_CONTRACT_VERSION,
  PublicArticle,
  PublicAuthor,
  PublicKnowledgeLink,
  PublicMedia,
  PublicSource,
  PublicationStatus,
  PublishedSnapshotRecordV1,
  SupportedLocale,
} from "./types";
import {
  prepareCanonicalBodyHtml,
  resolveArticleHeadings,
} from "./sanitizer";

export interface SnapshotValidationIssue {
  code:
    | "INVALID_CONTRACT_VERSION"
    | "MISSING_REQUIRED_FIELD"
    | "INVALID_REVISION"
    | "INVALID_LOCALE"
    | "NON_PUBLIC_STATUS"
    | "WITHDRAWN_ARTICLE"
    | "UNSAFE_MEDIA_URL"
    | "INCOMPLETE_MEDIA_METADATA"
    | "UNVERIFIED_MEDIA_RIGHTS"
    | "UNBOUND_MEDIA_RIGHTS_EVIDENCE"
    | "SYNTHETIC_DEMO_DOI_FORBIDDEN"
    | "INVALID_DOI_FORMAT"
    | "INVALID_SNAPSHOT_SHAPE"
    | "INVALID_IDENTIFIER"
    | "DUPLICATE_IDENTIFIER"
    | "AUTHORSHIP_MISMATCH"
    | "INVALID_SERIES_RELATION"
    | "INVALID_KNOWLEDGE_LINK"
    | "UNSAFE_KNOWLEDGE_DESTINATION"
    | "UNREVIEWED_KNOWLEDGE_LINK"
    | "UNBOUND_BODY_MEDIA"
    | "UNSAFE_SOURCE_URL"
    | "INVALID_SCIENTIFIC_METADATA"
    | "BROKEN_CITATION_REFERENCE"
    | "UNSUPPORTED_STUDIO_NODE"
    | "EMPTY_ARTICLE_BODY";
  field: string;
  message: string;
}

export interface SnapshotValidationResult {
  valid: boolean;
  isPubliclyRenderable: boolean;
  isIndexableCandidate: boolean;
  issues: SnapshotValidationIssue[];
  headings: ArticleHeadingOutlineItem[];
}

const VALID_LOCALES: ReadonlySet<SupportedLocale> = new Set(["en", "tr"]);
const PUBLIC_STATUSES: ReadonlySet<PublicationStatus> = new Set([
  "published",
  "demo",
]);
const NON_PUBLIC_STATUSES: ReadonlySet<PublicationStatus> = new Set([
  "draft",
  "in_review",
  "scheduled",
  "archived",
]);
const DOI_REGEX = /^10\.\d{4,9}\/[-._;()/:A-Za-z0-9]+$/;

/**
 * Tags or Studio editor artifacts that must never be silently dropped or
 * accepted into a published snapshot without explicit rejection.
 */
const UNSUPPORTED_RAW_HTML_PATTERNS: Array<{
  pattern: RegExp;
  reason: string;
}> = [
  {
    pattern: /<\s*(script|iframe|object|embed|applet|form|input|button|select|textarea)\b/i,
    reason: "Interactive or executable HTML tag is forbidden in published snapshots",
  },
  {
    pattern: /\bsrc\s*=\s*["']\s*(blob:|data:|file:|javascript:)/i,
    reason: "Ephemeral or unsafe media scheme (blob:/data:/file:/javascript:) is forbidden",
  },
  {
    pattern: /\bdata-studio-(draft|unsaved|local-blob|editor-only)\b/i,
    reason: "Unresolved Studio authoring node attribute cannot be published to Web",
  },
];

export function isSafePublishedMediaUrl(
  urlValue: string,
  trustedMediaOrigins: ReadonlySet<string> = new Set()
): boolean {
  if (typeof urlValue !== "string") return false;
  const trimmed = urlValue.trim();
  if (!trimmed) return false;

  // Reject protocol-relative, backslash, or ephemeral browser URLs
  if (
    trimmed.startsWith("//") ||
    trimmed.startsWith("/\\") ||
    /^(blob|data|file|javascript|vbscript):/i.test(trimmed)
  ) {
    return false;
  }

  // Same-origin root-relative paths are valid
  if (trimmed.startsWith("/")) {
    return true;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "https:") {
      return false;
    }
    return trustedMediaOrigins.has(parsed.origin);
  } catch {
    return false;
  }
}

export function isSafeKnowledgeLinkDestination(link: PublicKnowledgeLink): boolean {
  if (typeof link.targetUrl !== "string" || !link.targetUrl.trim()) return false;
  if (link.targetType === "internal") {
    return link.targetUrl.startsWith("/") &&
      !link.targetUrl.startsWith("//") &&
      !link.targetUrl.startsWith("/\\") &&
      !/[\\\u0000-\u001f]/.test(link.targetUrl) &&
      !/^(javascript|data|file|blob):/i.test(link.targetUrl);
  }
  if (link.targetType !== "wikipedia") return false;
  try {
    const url = new URL(link.targetUrl);
    return url.protocol === "https:" && url.hostname === "en.wikipedia.org" &&
      url.pathname.startsWith("/wiki/") && !url.username && !url.password;
  } catch {
    return false;
  }
}

function isSafeSourceUrl(value: string): boolean {
  if (value.startsWith("/") && !value.startsWith("//") && !value.startsWith("/\\")) return true;
  try {
    const parsed = new URL(value);
    return (parsed.protocol === "https:" || parsed.protocol === "http:") && !parsed.username && !parsed.password;
  } catch {
    return false;
  }
}

function validateMediaRecord(
  media: PublicMedia,
  fieldPrefix: string,
  trustedMediaOrigins: ReadonlySet<string>,
  issues: SnapshotValidationIssue[],
  requiresVerifiedRights: boolean
): void {
  if (typeof media.id !== "string" || !media.id.trim()) {
    issues.push({
      code: "INCOMPLETE_MEDIA_METADATA",
      field: `${fieldPrefix}.id`,
      message: "Published media requires a stable, non-empty asset ID.",
    });
  }

  if (!isSafePublishedMediaUrl(media.src, trustedMediaOrigins)) {
    issues.push({
      code: "UNSAFE_MEDIA_URL",
      field: `${fieldPrefix}.src`,
      message: `Media URL "${media.src}" is not an approved same-origin path or trusted HTTPS origin (blob:/data: URLs are forbidden).`,
    });
  }

  if (typeof media.alt !== "string" || !media.alt.trim()) {
    issues.push({
      code: "INCOMPLETE_MEDIA_METADATA",
      field: `${fieldPrefix}.alt`,
      message: "Scientific figure/media requires non-empty accessible alt text.",
    });
  }

  if (typeof media.caption !== "string" || !media.caption.trim()) {
    issues.push({
      code: "INCOMPLETE_MEDIA_METADATA",
      field: `${fieldPrefix}.caption`,
      message: "Scientific figure/media requires a descriptive caption.",
    });
  }

  if (
    typeof media.credit !== "string" || !media.credit.trim() ||
    typeof media.license !== "string" || !media.license.trim()
  ) {
    issues.push({
      code: "INCOMPLETE_MEDIA_METADATA",
      field: `${fieldPrefix}.credit`,
      message: "Scientific figure/media requires explicit credit and license provenance.",
    });
  }

  // Published snapshots must be rejected if usage rights have not been
  // explicitly verified upstream. Attribution text is NOT rights evidence.
  if (requiresVerifiedRights && media.rightsVerified !== true) {
    issues.push({
      code: "UNVERIFIED_MEDIA_RIGHTS",
      field: `${fieldPrefix}.rightsVerified`,
      message: "Publicly published media requires explicit verified usage rights; credit and license text alone are insufficient.",
    });
  }

  if (requiresVerifiedRights) {
    const evidence = media.rightsEvidence;
    if (
      !evidence ||
      typeof evidence.evidenceId !== "string" || !evidence.evidenceId.trim() ||
      typeof evidence.mediaId !== "string" || evidence.mediaId !== media.id ||
      typeof evidence.assetRevisionId !== "string" || !/^[a-f0-9]{64}$/i.test(evidence.assetRevisionId) ||
      typeof evidence.license !== "string" || evidence.license !== media.license
    ) {
      issues.push({
        code: "UNBOUND_MEDIA_RIGHTS_EVIDENCE",
        field: `${fieldPrefix}.rightsEvidence`,
        message: "Published media requires server-resolvable rights evidence bound to the exact media ID, asset revision, and license.",
      });
    }
  }
  if (requiresVerifiedRights && media.rightsEvidence && /^[a-f0-9]{64}$/i.test(media.rightsEvidence.assetRevisionId)) {
    try {
      const mediaPath = new URL(media.src, "https://same-origin.invalid").pathname;
      if (mediaPath.split("/").filter(Boolean).at(-1) !== media.rightsEvidence.assetRevisionId) {
        issues.push({
          code: "UNBOUND_MEDIA_RIGHTS_EVIDENCE",
          field: `${fieldPrefix}.src`,
          message: "Published media URL must address the exact SHA-256 asset revision bound by rights evidence.",
        });
      }
    } catch {
      // The unsafe URL issue above already reports the malformed source.
    }
  }

  if (
    typeof media.width !== "number" ||
    media.width <= 0 ||
    typeof media.height !== "number" ||
    media.height <= 0
  ) {
    issues.push({
      code: "INCOMPLETE_MEDIA_METADATA",
      field: `${fieldPrefix}.dimensions`,
      message: "Media width and height must be positive numbers to prevent layout shift.",
    });
  }
}

/**
 * Validates a Versioned Public Snapshot (v1.0.0) deterministically before
 * rendering or caching in ScientificRadar Web.
 */
export function validatePublicationSnapshotV1(
  input: unknown,
  options?: {
    trustedMediaOrigins?: string[];
  }
): SnapshotValidationResult {
  const issues: SnapshotValidationIssue[] = [];
  const trustedOrigins = new Set(options?.trustedMediaOrigins ?? []);
  const emptyResult = (issue: SnapshotValidationIssue): SnapshotValidationResult => ({
    valid: false,
    isPubliclyRenderable: false,
    isIndexableCandidate: false,
    issues: [issue],
    headings: [],
  });
  const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null && !Array.isArray(value);

  // API responses are untrusted JSON at runtime even though producers share a
  // TypeScript interface. Reject malformed envelopes before traversing fields.
  if (!isRecord(input)) {
    return emptyResult({
      code: "INVALID_SNAPSHOT_SHAPE",
      field: "snapshot",
      message: "Publication snapshot must be a JSON object.",
    });
  }
  const snapshot = input as unknown as PublishedSnapshotRecordV1;
  const requiredArrays: Array<keyof PublishedSnapshotRecordV1> = [
    "authorIds",
    "blocks",
    "sources",
    "relatedIds",
    "subcategorySlugs",
    "tagSlugs",
  ];
  for (const field of requiredArrays) {
    if (!Array.isArray(input[field])) {
      return emptyResult({
        code: "INVALID_SNAPSHOT_SHAPE",
        field: String(field),
        message: `Publication snapshot field "${String(field)}" must be an array.`,
      });
    }
  }
  if (
    !(input.blocks as unknown[]).every((block) => isRecord(block) && typeof block.type === "string") ||
    !(input.sources as unknown[]).every((source) => isRecord(source) && typeof source.id === "string") ||
    !(input.authorIds as unknown[]).every((id) => typeof id === "string") ||
    !(input.relatedIds as unknown[]).every((id) => typeof id === "string")
  ) {
    return emptyResult({
      code: "INVALID_SNAPSHOT_SHAPE",
      field: "blocks/sources/authorIds/relatedIds",
      message: "Snapshot blocks, sources, author IDs, and related IDs must contain valid records or strings.",
    });
  }
  const supportedBlockTypes = new Set(["paragraph", "heading", "figure", "quote", "math", "table", "key-takeaways"]);
  const blockIds = new Set<string>();
  for (const [index, block] of (input.blocks as Record<string, unknown>[]).entries()) {
    if (!supportedBlockTypes.has(block.type as string)) {
      return emptyResult({
        code: "UNSUPPORTED_STUDIO_NODE",
        field: `blocks[${index}].type`,
        message: `Unsupported article block type "${String(block.type)}".`,
      });
    }
    if (typeof block.id !== "string" || !block.id.trim() || blockIds.has(block.id)) {
      return emptyResult({
        code: "INVALID_SNAPSHOT_SHAPE",
        field: `blocks[${index}].id`,
        message: "Article blocks require unique, non-empty stable IDs.",
      });
    }
    blockIds.add(block.id);
    if (
      (block.type === "paragraph" && typeof block.text !== "string") ||
      (block.type === "heading" && (typeof block.text !== "string" || (block.level !== 2 && block.level !== 3))) ||
      (block.type === "quote" && typeof block.quote !== "string") ||
      (block.type === "math" && (typeof block.tex !== "string" || typeof block.label !== "string" || typeof block.explanation !== "string")) ||
      (block.type === "figure" && (typeof block.layout !== "string" || typeof block.figureNumber !== "string")) ||
      (block.type === "table" && !isRecord(block.table)) ||
      (block.type === "key-takeaways" && (typeof block.title !== "string" || !Array.isArray(block.items) || !block.items.every((item) => typeof item === "string")))
    ) {
      return emptyResult({
        code: "INVALID_SNAPSHOT_SHAPE",
        field: `blocks[${index}]`,
        message: "Article block is missing the required structured scientific content fields.",
      });
    }
    if (block.type === "figure" && !isRecord(block.media)) {
      return emptyResult({
        code: "INVALID_SNAPSHOT_SHAPE",
        field: `blocks[${index}].media`,
        message: "Figure blocks must contain a media record.",
      });
    }
    if (block.type === "paragraph" && block.citations !== undefined &&
      (!Array.isArray(block.citations) || !block.citations.every((id) => typeof id === "string"))) {
      return emptyResult({
        code: "INVALID_SNAPSHOT_SHAPE",
        field: `blocks[${index}].citations`,
        message: "Paragraph citations must be an array of source IDs.",
      });
    }
    if (block.type === "table") {
      const table = block.table as Record<string, unknown>;
      if (
        typeof table.caption !== "string" || !table.caption.trim() ||
        !Array.isArray(table.headers) || !table.headers.length || !table.headers.every((cell) => typeof cell === "string") ||
        !Array.isArray(table.rows) || !table.rows.every((row) => Array.isArray(row) && row.length === (table.headers as unknown[]).length && row.every((cell) => typeof cell === "string"))
      ) {
        return emptyResult({
          code: "INVALID_SNAPSHOT_SHAPE",
          field: `blocks[${index}].table`,
          message: "Scientific tables require a caption, headers, and rows with matching column counts.",
        });
      }
    }
  }
  if (input.headings !== undefined && (!Array.isArray(input.headings) || !input.headings.every((heading) =>
    isRecord(heading) && heading.type === "heading" && typeof heading.id === "string" &&
    (heading.level === 2 || heading.level === 3) && typeof heading.text === "string"))) {
    return emptyResult({
      code: "INVALID_SNAPSHOT_SHAPE",
      field: "headings",
      message: "Heading outlines must contain heading records with stable IDs, levels 2 or 3, and text.",
    });
  }
  if (input.authors !== undefined && (!Array.isArray(input.authors) || !input.authors.every((author) =>
    isRecord(author) && typeof author.id === "string"))) {
    return emptyResult({
      code: "INVALID_SNAPSHOT_SHAPE",
      field: "authors",
      message: "Included author records must be an array of objects with stable IDs.",
    });
  }
  if (input.knowledgeLinks !== undefined && (!Array.isArray(input.knowledgeLinks) || !input.knowledgeLinks.every(isRecord))) {
    return emptyResult({
      code: "INVALID_SNAPSHOT_SHAPE",
      field: "knowledgeLinks",
      message: "Knowledge links must be an array of records.",
    });
  }

  if (snapshot.contractVersion !== PUBLICATION_CONTRACT_VERSION) {
    issues.push({
      code: "INVALID_CONTRACT_VERSION",
      field: "contractVersion",
      message: `Expected contractVersion "${PUBLICATION_CONTRACT_VERSION}", received "${String(snapshot.contractVersion)}".`,
    });
  }

  const requiredStrings: Array<[keyof PublishedSnapshotRecordV1, string]> = [
    ["articleId", snapshot.articleId],
    ["revisionId", snapshot.revisionId],
    ["slug", snapshot.slug],
    ["title", snapshot.title],
    ["dek", snapshot.dek],
    ["summary", snapshot.summary],
    ["categorySlug", snapshot.categorySlug],
    ["publishedAt", snapshot.publishedAt],
  ];

  for (const [field, value] of requiredStrings) {
    if (typeof value !== "string" || value.trim().length === 0) {
      issues.push({
        code: "MISSING_REQUIRED_FIELD",
        field: String(field),
        message: `Required snapshot field "${String(field)}" must be a non-empty string.`,
      });
    }
  }

  for (const [field, value] of [
    ["articleId", snapshot.articleId],
    ["revisionId", snapshot.revisionId],
    ["slug", snapshot.slug],
  ] as const) {
    if (typeof value === "string" && value.trim() && value.trim() !== value) {
      issues.push({
        code: "INVALID_IDENTIFIER",
        field,
        message: `Snapshot identifier "${field}" must not contain surrounding whitespace.`,
      });
    }
  }

  if (
    typeof snapshot.revisionNumber !== "number" ||
    !Number.isInteger(snapshot.revisionNumber) ||
    snapshot.revisionNumber < 1
  ) {
    issues.push({
      code: "INVALID_REVISION",
      field: "revisionNumber",
      message: "revisionNumber must be a positive integer >= 1.",
    });
  }
  if (snapshot.authorIds.some((id) => !id.trim()) || new Set(snapshot.authorIds).size !== snapshot.authorIds.length) {
    issues.push({
      code: "AUTHORSHIP_MISMATCH",
      field: "authorIds",
      message: "Author IDs must be non-empty and unique.",
    });
  }

  if (!VALID_LOCALES.has(snapshot.locale)) {
    issues.push({
      code: "INVALID_LOCALE",
      field: "locale",
      message: `Unsupported locale "${String(snapshot.locale)}". Supported locales are "en" and "tr".`,
    });
  }

  if (snapshot.status === "withdrawn") {
    issues.push({
      code: "WITHDRAWN_ARTICLE",
      field: "status",
      message: `Article "${snapshot.slug}" has status "withdrawn" and must not be rendered as active public content.`,
    });
  } else if (NON_PUBLIC_STATUSES.has(snapshot.status)) {
    issues.push({
      code: "NON_PUBLIC_STATUS",
      field: "status",
      message: `Article "${snapshot.slug}" has non-public status "${snapshot.status}" and is excluded from public rendering.`,
    });
  }

  const hasBlocks = Array.isArray(snapshot.blocks) && snapshot.blocks.length > 0;
  const hasBodyHtml =
    typeof snapshot.bodyHtml === "string" && snapshot.bodyHtml.trim().length > 0;

  if (!hasBlocks && !hasBodyHtml) {
    issues.push({
      code: "EMPTY_ARTICLE_BODY",
      field: "blocks",
      message: "Published snapshot must contain either structured blocks or canonical bodyHtml.",
    });
  }

  if (snapshot.hero) {
    validateMediaRecord(snapshot.hero, "hero", trustedOrigins, issues, snapshot.status === "published");
  }

  const sourceIds = new Set<string>();
  for (const [idx, source] of (snapshot.sources ?? []).entries()) {
    if (typeof source.title !== "string" || !source.title.trim() || typeof source.label !== "string" || !source.label.trim() || typeof source.isIllustrativeDemo !== "boolean") {
      issues.push({
        code: "INVALID_SCIENTIFIC_METADATA",
        field: `sources[${idx}]`,
        message: "Scientific bibliography records require a title, citation label, and explicit demo/real classification.",
      });
    }
    if (source.href !== undefined && (typeof source.href !== "string" || !isSafeSourceUrl(source.href))) {
      issues.push({
        code: "UNSAFE_SOURCE_URL",
        field: `sources[${idx}].href`,
        message: "Bibliography URLs must use a safe HTTP(S) address or same-origin path.",
      });
    }
    if (!source.id.trim() || sourceIds.has(source.id)) {
      issues.push({
        code: sourceIds.has(source.id) ? "DUPLICATE_IDENTIFIER" : "INVALID_IDENTIFIER",
        field: `sources[${idx}].id`,
        message: sourceIds.has(source.id)
          ? `Source ID "${source.id}" is duplicated.`
          : "Source ID must be a non-empty string.",
      });
    }
    sourceIds.add(source.id);
    if (source.doi !== undefined && typeof source.doi !== "string") {
      issues.push({
        code: "INVALID_SNAPSHOT_SHAPE",
        field: `sources[${idx}].doi`,
        message: "Source DOI must be a string when present.",
      });
    }
    if (source.isIllustrativeDemo && typeof source.doi === "string") {
      issues.push({
        code: "SYNTHETIC_DEMO_DOI_FORBIDDEN",
        field: `sources[${idx}].doi`,
        message: `Illustrative demo source "${source.id}" must not fabricate a DOI.`,
      });
    }
    if (!source.isIllustrativeDemo && typeof source.doi === "string") {
      if (!DOI_REGEX.test(source.doi.trim())) {
        issues.push({
          code: "INVALID_DOI_FORMAT",
          field: `sources[${idx}].doi`,
          message: `Source "${source.id}" has malformed DOI "${source.doi}".`,
        });
      }
    }
  }

  if (snapshot.authors) {
    const authorRecordIds = new Set<string>();
    for (const [idx, author] of snapshot.authors.entries()) {
    if (!author || typeof author.id !== "string" || !author.id.trim() || authorRecordIds.has(author.id)) {
        issues.push({
          code: "INVALID_SNAPSHOT_SHAPE",
          field: `authors[${idx}].id`,
          message: "Author records must have unique, non-empty IDs.",
        });
      } else {
        authorRecordIds.add(author.id);
      }
    }
    if (snapshot.authorIds.some((id) => !authorRecordIds.has(id))) {
      issues.push({
        code: "AUTHORSHIP_MISMATCH",
        field: "authorIds",
        message: "Every declared author ID must resolve to a matching author record when author records are included.",
      });
    }
  }

  if (snapshot.relatedIds.some((id) => !id.trim()) || new Set(snapshot.relatedIds).size !== snapshot.relatedIds.length) {
    issues.push({
      code: "INVALID_IDENTIFIER",
      field: "relatedIds",
      message: "Related article IDs must be non-empty and unique.",
    });
  }
  if (snapshot.relatedIds.includes(snapshot.articleId)) {
    issues.push({
      code: "INVALID_IDENTIFIER",
      field: "relatedIds",
      message: "An article cannot include itself in its related article IDs.",
    });
  }
  if (snapshot.seriesId !== undefined && (typeof snapshot.seriesId !== "string" || !snapshot.seriesId.trim())) {
    issues.push({
      code: "INVALID_SERIES_RELATION",
      field: "seriesId",
      message: "Series relation IDs must be non-empty strings when present.",
    });
  }
  const knowledgeLinkIds = new Set<string>();
  for (const [idx, link] of (snapshot.knowledgeLinks ?? []).entries()) {
    if (!link || typeof link.id !== "string" || !link.id.trim() || knowledgeLinkIds.has(link.id)) {
      issues.push({
        code: "INVALID_KNOWLEDGE_LINK",
        field: `knowledgeLinks[${idx}].id`,
        message: "Knowledge links require unique, non-empty IDs.",
      });
      continue;
    }
    knowledgeLinkIds.add(link.id);
    if (
      !["internal", "wikipedia"].includes(String(link.targetType)) ||
      typeof link.targetUrl !== "string" ||
      !VALID_LOCALES.has(link.locale) ||
      typeof link.previewTitle !== "string" || !link.previewTitle.trim() ||
      typeof link.previewExcerpt !== "string" || !link.previewExcerpt.trim() ||
      typeof link.sourceAttribution !== "string" || !link.sourceAttribution.trim()
    ) {
      issues.push({
        code: "INVALID_KNOWLEDGE_LINK",
        field: `knowledgeLinks[${idx}]`,
        message: "Knowledge Link records require a supported type and locale, URL, title, excerpt, and source attribution.",
      });
    }
    if (link.reviewStatus !== "approved" || link.isSampleDemoData !== false) {
      issues.push({
        code: "UNREVIEWED_KNOWLEDGE_LINK",
        field: `knowledgeLinks[${idx}]`,
        message: "Published snapshots may include only approved, non-demo Knowledge Links.",
      });
    }
    if (!isSafeKnowledgeLinkDestination(link as PublicKnowledgeLink)) {
      issues.push({
        code: "UNSAFE_KNOWLEDGE_DESTINATION",
        field: `knowledgeLinks[${idx}].targetUrl`,
        message: "Knowledge Link destination is not a safe internal path or HTTPS English Wikipedia article URL.",
      });
    }
    if (link.targetArticleId !== undefined && (typeof link.targetArticleId !== "string" || !link.targetArticleId.trim())) {
      issues.push({
        code: "INVALID_KNOWLEDGE_LINK",
        field: `knowledgeLinks[${idx}].targetArticleId`,
        message: "Knowledge Link targetArticleId must be a non-empty string when present.",
      });
    }
  }

  for (const [idx, block] of (snapshot.blocks ?? []).entries()) {
    if (block.type === "figure") {
      validateMediaRecord(
        block.media,
        `blocks[${idx}].media`,
        trustedOrigins,
        issues,
        snapshot.status === "published"
      );
    }
    if (block.type === "paragraph" && block.citations) {
      for (const citeId of block.citations) {
        if (!sourceIds.has(citeId)) {
          issues.push({
            code: "BROKEN_CITATION_REFERENCE",
            field: `blocks[${idx}].citations`,
            message: `Paragraph "${block.id}" cites unknown source ID "${citeId}".`,
          });
        }
      }
    }
  }

  if (hasBodyHtml && snapshot.bodyHtml) {
    for (const rule of UNSUPPORTED_RAW_HTML_PATTERNS) {
      if (rule.pattern.test(snapshot.bodyHtml)) {
        issues.push({
          code: "UNSUPPORTED_STUDIO_NODE",
          field: "bodyHtml",
          message: rule.reason,
        });
      }
    }

    // Verify all inline data-citation-source-id attributes in bodyHtml match declared sources
    const citationMatches = snapshot.bodyHtml.matchAll(
      /data-citation-source-id\s*=\s*["']([^"']+)["']/gi
    );
    for (const match of citationMatches) {
      const citedId = match[1];
      if (!sourceIds.has(citedId)) {
        issues.push({
          code: "BROKEN_CITATION_REFERENCE",
          field: "bodyHtml",
          message: `Canonical bodyHtml cites unknown source ID "${citedId}".`,
        });
      }
    }

    const mediaById = new Map<string, PublicMedia>();
    if (snapshot.hero) mediaById.set(snapshot.hero.id, snapshot.hero);
    for (const block of snapshot.blocks ?? []) {
      if (block.type === "figure" && block.media && typeof block.media.id === "string") {
        mediaById.set(block.media.id, block.media);
      }
    }
    const preparedBody = prepareCanonicalBodyHtml(snapshot.bodyHtml, {
      sources: snapshot.sources,
      trustedImageSources: trustedOrigins,
    }).html;
    const figurePattern = /<figure\b([^>]*)>([\s\S]*?)<\/figure>/gi;
    const imagePattern = /<img\b([^>]*)>/gi;
    const attr = (attributes: string, name: string): string | null => {
      const found = new RegExp(`\\b${name}\\s*=\\s*(["'])(.*?)\\1`, "i").exec(attributes);
      return found?.[2] ?? null;
    };
    let boundImageCount = 0;
    for (const match of preparedBody.matchAll(figurePattern)) {
      const mediaId = attr(match[1], "data-media-id");
      const images = [...match[2].matchAll(imagePattern)];
      if (images.length === 0) continue;
      const media = mediaId ? mediaById.get(mediaId) : undefined;
      for (const image of images) {
        boundImageCount += 1;
        const src = attr(image[1], "src");
        if (!media || !src || src !== media.src) {
          issues.push({
            code: "UNBOUND_BODY_MEDIA",
            field: "bodyHtml",
            message: "Every inline scientific image must be inside a figure whose media ID and exact source URL match a rights-verified structured media record.",
          });
        }
      }
    }
    const totalImageCount = [...preparedBody.matchAll(/<img\b/gi)].length;
    if (totalImageCount > boundImageCount) {
      issues.push({
        code: "UNBOUND_BODY_MEDIA",
        field: "bodyHtml",
        message: "Inline images outside a bound scientific figure are not publishable.",
      });
    }
  }

  const headings =
    snapshot.headings && snapshot.headings.length > 0
      ? snapshot.headings
      : hasBodyHtml && snapshot.bodyHtml
        ? prepareCanonicalBodyHtml(snapshot.bodyHtml, {
            sources: snapshot.sources,
          }).headings
        : resolveArticleHeadings({
            blocks: snapshot.blocks ?? [],
            bodyHtml: snapshot.bodyHtml,
            sources: snapshot.sources ?? [],
          });

  const isPublicStatus = PUBLIC_STATUSES.has(snapshot.status);
  const hasBlockingIssues = issues.length > 0;

  return {
    valid: !hasBlockingIssues,
    isPubliclyRenderable: isPublicStatus && !hasBlockingIssues,
    isIndexableCandidate:
      snapshot.status === "published" &&
      !snapshot.seo?.noindex &&
      !hasBlockingIssues,
    issues,
    headings,
  };
}

/**
 * Converts a validated PublishedSnapshotRecordV1 into the PublicArticle shape
 * consumed by ScientificRadar Web routes and components.
 */
export function adaptSnapshotV1ToPublicArticle(
  snapshot: PublishedSnapshotRecordV1
): PublicArticle {
  const authorIds =
    snapshot.authorIds && snapshot.authorIds.length > 0
      ? snapshot.authorIds
      : (snapshot.authors ?? []).map((a) => a.id);

  return {
    id: snapshot.articleId,
    slug: snapshot.slug,
    locale: snapshot.locale,
    editorialType: snapshot.editorialType,
    status: snapshot.status,
    title: snapshot.title,
    dek: snapshot.dek,
    summary: snapshot.summary,
    categorySlug: snapshot.categorySlug,
    subcategorySlugs: [...snapshot.subcategorySlugs],
    tagSlugs: [...snapshot.tagSlugs],
    authorIds,
    publishedAt: snapshot.publishedAt,
    updatedAt: snapshot.updatedAt,
    withdrawnAt: snapshot.withdrawnAt,
    withdrawalReason: snapshot.withdrawalReason,
    readingTimeMinutes: snapshot.readingTimeMinutes,
    featuredRank: snapshot.featuredRank,
    mostReadDemoRank: snapshot.mostReadDemoRank,
    hero: snapshot.hero,
    blocks: snapshot.blocks,
    bodyHtml: snapshot.bodyHtml,
    sources: snapshot.sources,
    relatedIds: snapshot.relatedIds,
    seo: snapshot.seo,
    revisionId: snapshot.revisionId,
    revisionNumber: snapshot.revisionNumber,
    translationGroupId: snapshot.translationGroupId,
    seriesId: snapshot.seriesId,
    knowledgeLinks: snapshot.knowledgeLinks,
  };
}

/**
 * Exports an existing PublicArticle record into the canonical v1 snapshot envelope.
 */
export function adaptPublicArticleToSnapshotV1(
  article: PublicArticle,
  authors?: PublicAuthor[]
): PublishedSnapshotRecordV1 {
  const headings = resolveArticleHeadings(article);
  return {
    contractVersion: PUBLICATION_CONTRACT_VERSION,
    articleId: article.id,
    revisionId: article.revisionId ?? `rev-${article.id}-v1`,
    revisionNumber: article.revisionNumber ?? 1,
    slug: article.slug,
    locale: article.locale,
    translationGroupId: article.translationGroupId ?? `tg-${article.id}`,
    seriesId: article.seriesId,
    editorialType: article.editorialType,
    status: article.status,
    title: article.title,
    dek: article.dek,
    summary: article.summary,
    categorySlug: article.categorySlug,
    subcategorySlugs: [...article.subcategorySlugs],
    tagSlugs: [...article.tagSlugs],
    authorIds: [...article.authorIds],
    authors,
    publishedAt: article.publishedAt,
    updatedAt: article.updatedAt,
    withdrawnAt: article.withdrawnAt,
    withdrawalReason: article.withdrawalReason,
    readingTimeMinutes: article.readingTimeMinutes,
    featuredRank: article.featuredRank,
    mostReadDemoRank: article.mostReadDemoRank,
    hero: article.hero,
    blocks: article.blocks,
    bodyHtml: article.bodyHtml,
    headings,
    sources: article.sources as PublicSource[],
    knowledgeLinks: article.knowledgeLinks,
    relatedIds: [...article.relatedIds],
    seo: article.seo,
  };
}
