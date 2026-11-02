# Reader Foundation Hardening — Implementation Plan (2026-11-02)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans or subagent-driven-development. Follow test-driven-development and verification-before-completion. This plan is scoped to an isolated branch, not production deployment.

**Goal:** Strengthen the beloved ScientificRadar Web first version without changing its paper color, Merriweather/Inter typography, scientific diagrams, citations, tables, or equation callout surfaces. Set Compact Cover as the home default and keep Standard selectable.

**Architecture:** Keep the current Next.js App Router reader and demo repository. Strengthen the canonical HTML rendering boundary, render arbitrary TeX with an actual math engine, and add reproducible CI checks. Delay production publishing/Wikipedia API until the Studio-to-Web contract is approved.

**Tech Stack:** Next.js/React/TypeScript, DOMPurify, KaTeX, node:test/tsx, GitHub Actions.

**Spec:** Existing `docs/WEBSITE_BUILD_AUDIT.md`, user-approved public website blueprint in `public/assets/aistudio/`.

## Global Constraints
- Do not change existing figures, captions, tables, citations, Merriweather/Inter fonts or warm-white background `#FAFAF8`.
- Compact Cover becomes the default **without deleting Standard Cover**; `?hero=standard` still works.
- Drop cap stays visible for the first paragraph for now; its long-term style is a separate owner decision.
- Keep demo noindex and avoid connecting production.
- No main-branch updates or deployment without passing verification and owner review.
- New server-side content HTML must be sanitized with a DOM-based allowlist before it reaches `dangerouslySetInnerHTML`.
- Real math rendering must preserve existing callout background, captions, TeX source in `data-tex` and accessibility semantics.

## Review Focus
1. Malicious URLs, event handlers, SVG/MathML fragments and encoded attribute payloads do not survive HTML sanitization.
2. Trusted scientific tags/attributes (source IDs, figures, sup/sub, tables and math markers) survive.
3. Any TeX expression is rendered by a general-purpose engine, rather than a hand-written limited replacement list.
4. Home default is compact, while `?hero=standard` deterministically restores the previous look.
5. Existing desktop, tablet and 320px mobile UI remains usable; CSS surfaces unchanged.

### Task 1 — Tests and CI baseline

**Files:** `lib/content/repository.test.ts`, `.github/workflows/web-quality.yml`, `package.json`.

- [ ] Add security regression tests that would FAIL against the existing regex sanitizer (e.g. encoded untrusted href or malicious data attr).
- [ ] Run CI baseline and record RED when applicable (no CI before this change).
- [ ] Add `test:unit` and `typecheck` scripts, predictable Node tooling, lint/test/typecheck/build GitHub Actions PR workflow.
- [ ] Verify reproducible dependency install; note missing lockfile as a separate gate, not a disguised pass.

### Task 2 — HTML parser-based sanitizer

**Files:** `lib/content/sanitizer.ts`, `lib/content/repository.test.ts`.

- [ ] Replace regex-only sanitization with DOMPurify allowlist and per-element URL/attribute checks, inspired by Studio's independently maintained safe boundary.
- [ ] Preserve accepted science attributes and demote any article-body H1 to H2.
- [ ] Run tests, TypeScript check, lint and build, record actual CI result.

### Task 3 — Scientific KaTeX

**Files:** `components/editorial/ArticleReader.tsx`, `app/layout.tsx`, `lib/content/repository.test.ts`.

- [ ] Add a red general-purpose TeX check not supported by prior manual string rewrites.
- [ ] Use KaTeX renderToString with `trust:false`; include KaTeX CSS; leave existing equation card design untouched.
- [ ] Check invalid/unsupported expressions degrade safely and figure/table UI unchanged.

### Task 4 — Owner-approved homepage variant

**Files:** `app/page.tsx`.

- [ ] Default to `compact`; still support `/?hero=standard`.
- [ ] Preserve both feature designs and category navigation.
- [ ] Verify home DOM and visual screenshots via CI browser automation if available.

### Task 5 — Finish and follow-on roadmap

- [ ] Check real CI GitHub status; do not claim green based on code review only.
- [ ] Create a reviewable PR, **no auto-merge**.
- [ ] Subsequent isolated PR: migrate Next.js 15 to compatible 16 after smoke/SSR tests, remove unsupported Next config, generate lockfile and run frozen install.
- [ ] Subsequent isolated PR: adapt **existing Studio** `components/knowledge/knowledge-link-popover.tsx` concepts to a standalone Web reader. Use a published reviewed `KnowledgeLink` snapshot, internal-first resolution, linked Wikipedia HTTPS preview, focus/hover/tap, safe attribution, cached preview text, no unchecked third-party requests or popup code import.
- [ ] Subsequent design pass: improve visual asset variety **without replacing the user-loved figures**, hide demo evaluation controls only in production, fix minor scientific diagram label collisions, keep owner-approved colors/fonts.

## Verification ledger
- Baseline main HEAD: `41a73b49f69c1310eca819d1ad2cdb1c712da89a`.
- This plan does not assert test success. Actual CI/run links and failures belong in the PR.
