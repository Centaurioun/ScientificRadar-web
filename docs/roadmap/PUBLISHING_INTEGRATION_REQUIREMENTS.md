# Studio–Web Publishing Integration Requirements

## Verified boundary

Web currently serves demo fixtures through `PublishedContentRepository` (`lib/content/repository.ts`). Its public content model includes locale, article type/status, author IDs, taxonomy, publication/update times, media credits and rights, structured scientific blocks, sanitized HTML snapshot support, sources/DOI, and SEO fields (`lib/content/types.ts`). The contract explicitly defers a server-authenticated adapter (`docs/design/CONTENT_CONTRACT.md`).

## ScientificRadar Studio capability inventory (remote `main`)

**Inspected revision:** `b160accd89c8d24b9e5b726e70158d73cc2176d1` (2026-11-03; exact `origin/main`, detached clean worktree). The separate local Studio checkout was dirty and 83 commits behind and was not treated as current evidence.

| Capability | Classification | Evidence and boundary |
|---|---|---|
| Article editor and structured content | Implemented in Studio prototype | `components/editor/article-workspace.tsx`, `components/editor/article-ckeditor.tsx`, `components/editor/article-tiptap-editor.tsx`; editor stores title, slug, summary, locale, HTML and JSON body, taxonomy, author, sources, media, SEO fields, and schedule time. These are Studio UI capabilities, not a Web publishing connection. |
| Persistence | Implemented locally; not production content storage | `lib/studio-context.tsx` loads and commits the application snapshot using IndexedDB and falls back to volatile in-memory state; `lib/studio-persistence.ts` wraps durable transactions. No shared server database or cross-device storage is established by this client store. |
| Publication states and quality gate | Implemented as local workflow simulation | `lib/types.ts` defines idea, draft, in_review, revision_requested, approved, scheduled, published, archived. `lib/audit/publish-policy.ts` evaluates role, unsaved state, blockers, warnings, and unverified checks. `components/audit/pre-publish-dialog.tsx` explicitly states that confirmation changes local IndexedDB only and never deploys or indexes `scientificradar.com`. `lib/studio-context.tsx` owns local transitions. |
| SEO & Editorial Quality Center | Implemented in Studio prototype | `app/seo/page.tsx` calculates per-article local audits and stores reports in IndexedDB; `app/articles/[id]/seo/page.tsx` exposes article findings and quick-fix proposals. This is an administration interface, not a public Web HTML validator. |
| Metadata and canonical verification | Partial/editorial-side only | `components/editor/article-workspace.tsx` edits SEO title, description, canonical. `lib/audit/run-article-audit.ts` has local metadata/canonical checks. No server-rendered Web head or cross-site published HTML duplicate-tag verification is present in this Studio flow. |
| Media, figures, citations, tables, LaTeX | Implemented in editor prototype; external asset transfer absent | `components/editor/article-ckeditor.tsx` and `components/editor/article-tiptap-editor.tsx` support scientific blocks; `lib/types.ts` models media, sources, and article data; `app/media/page.tsx` labels its adapter “Local Demo Storage (IndexedDB)” and caps local media uploads. The editor provides figure/citation/table/math editing, but a durable external media URL and verified attribution/rights transfer to Web remain contract requirements. |
| Preview | Implemented as local noindex preview | `components/editor/article-preview-view.tsx` explicitly labels preview “Demo Preview Only” and “Not live on scientificradar.com”; it provides viewport modes. It does not demonstrate a remotely addressable authenticated preview deployment. |
| Revision behavior | Implemented locally | `app/revisions/page.tsx` shows explicit snapshots; restoring uses an expected-version check and creates a new version instead of deleting history (`lib/studio-context.tsx`). This is not yet a shared Web revision history or production rollback channel. |
| API, authentication, storage, publishing integration | Prototype-only / not verified in production | `app/settings/integrations/page.tsx` states no credentials or external endpoints are configured in isolated P0 prototype mode and its “Test Connection” is truthful local status text. `app/settings/roles/page.tsx` describes role switching as demo simulation and server RBAC as future work. Studio remote `main` has no verified public publishing API, production authentication boundary, external storage adapter, or end-to-end Studio–Web publishing path. |

This inventory satisfies M0 evidence gathering. Whether and how to turn any prototype capability into a cross-repository production workflow remains an owner decision tracked in M1 issues; this document selects no architecture.

## Contract topics to resolve

Define versioned payload/schema and validation for title/dek/summary, authors and credentials, categories/tags, figures with alt/caption/credit/license/rights, citations/DOI, formulas, tables, canonical body representation, SEO metadata, locale, revision identity, and timestamps. Specify preview, draft, scheduled, published, archived, and withdrawn behavior; idempotency, retries, rollback, conflict handling, audit trail, and cache invalidation. Specify authenticated least-privilege publishing and secret rotation without committing credentials.

Assess API, versioned artifact, and content-service alternatives. Choose storage/transport only after owner decision. Preview and draft content must remain inaccessible to anonymous readers and crawlers. Acceptance requires contract tests across both repositories and public HTML verification.
