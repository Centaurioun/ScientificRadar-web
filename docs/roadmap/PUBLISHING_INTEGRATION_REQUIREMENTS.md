# Studio–Web Publishing Integration Requirements

## Verified boundary

Web currently serves demo fixtures through `PublishedContentRepository` (`lib/content/repository.ts`). Its public content model includes locale, article type/status, author IDs, taxonomy, publication/update times, media credits and rights, structured scientific blocks, sanitized HTML snapshot support, sources/DOI, and SEO fields (`lib/content/types.ts`). The contract explicitly defers a server-authenticated adapter (`docs/design/CONTENT_CONTRACT.md`). Studio local source includes editor/preview and pre-publish audit components, but the checkout is dirty and stale versus remote; no cross-repo API or production publication path is confirmed.

## Contract topics to resolve

Define versioned payload/schema and validation for title/dek/summary, authors and credentials, categories/tags, figures with alt/caption/credit/license/rights, citations/DOI, formulas, tables, canonical body representation, SEO metadata, locale, revision identity, and timestamps. Specify preview, draft, scheduled, published, archived, and withdrawn behavior; idempotency, retries, rollback, conflict handling, audit trail, and cache invalidation. Specify authenticated least-privilege publishing and secret rotation without committing credentials.

Assess API, versioned artifact, and content-service alternatives. Choose storage/transport only after owner decision. Preview and draft content must remain inaccessible to anonymous readers and crawlers. Acceptance requires contract tests across both repositories and public HTML verification.
