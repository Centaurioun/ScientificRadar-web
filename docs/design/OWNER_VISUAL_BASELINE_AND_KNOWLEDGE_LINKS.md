# ScientificRadar Web — Owner-approved visual baseline and later knowledge previews
**Date:** 2026-11-02
**Status:** Design preferences and future feature contract. Does not certify production integration.

## Visual baseline — preserve, do not redesign

- ScientificRadar Web v1 appearance is OWNER APPROVED as a base for incremental improvements.
- **Home hero:** Compact Cover is preferred and should be default. Standard Cover remains accessible as an alternate feature variant.
- **Paper color:** Preserve warm near-white `#FAFAF8`, with light `#F2F1EC` article callout/surface background. Avoid pure-white full-page redesigns and excessive contrast.
- **Typography:** Merriweather editorial serif and Inter interface. Owner strongly likes both, including scientific article reading rhythm.
- **Equations:** Owner likes warm contrasting equation card background, explanations, variables and proportional spacing. A real KaTeX renderer may enhance math *inside* the same visual frame; do not turn the callout black or radically redesign it.
- **Scientific figures:** Preserve current original SVG scientific graphics, including the diagram/caption/source-attribution system; fix minor label collisions (example: flagelliform spiral silk on Figure 1) in a later precise diagram-only pass. No wholesale replacement with generic stock photos.
- **Tables:** Owner approves table appearance, caption, heading row and endnotes. Preserve.
- **Citations / bibliography:** Keep citation affordances, authentic source relationship, reference cards and end-of-article metadata.
- **Drop cap:** The large initial letter at first paragraph is a *drop cap*. Owner is undecided; do not remove or change without side-by-side evidence. It can become an article-theme variant.
- **Reader widths:** 700/600/560px remain comparison modes until owner selects a final default. Owner approved design overall; no unilateral global reading-width change.
- **No giant permanent 'prototype' watermark or technical evaluation controls on eventual public production UI.** In isolated demo sandbox those controls are allowed.

## What existing ScientificRadar Studio ALREADY does

Existing Studio source (as reviewed on 2026-11-02) has:
- `app/knowledge-links/page.tsx` — registered KnowledgeLink records with targetType `internal | wikipedia`, URL, term, summary and attribution.
- `components/knowledge/knowledge-link-popover.tsx` — a hover/focus/tap interactive popover showing a saved preview. Mouse hover, keyboard Escape and mobile tap are implemented in the Studio component.

**Important distinction:** The existing editor can store Wikipedia links with curated excerpts; it is not evidence that the current standalone Web reader automatically downloads the Wikipedia introduction. The Web app still lacks this integration, intentionally.

## Future public website contract (after publishing data API)

- Studio approves the knowledge glossary: `id, term, locale, targetType, targetUrl, previewTitle, previewExcerpt, sourceAttribution, reviewedAt`, with a versioned publication snapshot.
- Web receives published, sanitized, reviewed knowledge-link records, prioritizing internal ScientificRadar articles over external Wikipedia references.
- The reader highlights configured terms without altering figures, citations, inline TeX, existing links, metadata, or code. Avoid naive global `bodyHtml.replace()`; use parsed text nodes, longest non-overlapping whole-phrase matches, locale rules and user-approved scope.
- Tooltip/popover: accessible focusable trigger, hover/focus on desktop, tap on touch, Escape/outside-click dismissal, focus return, safe overlay position, source attribution, distinct internal/external link.
- Wikipedia target must be an approved HTTPS Wikimedia URL. Open external links with `rel="noopener noreferrer"` and `target="_blank"`.
- If the owner wants **automated first-paragraph previews**, implement a verified server-side fetch/cache from Wikimedia REST interfaces with rate limiting, attribution, content fallback and editorial review. Do NOT fetch Wikipedia on each browser hover or promise current live summary from manually stored text.
- Any licensing/attribution and translation issues must be handled before deployment.

## Progressive phases

A. Current PR: compact home, DOMPurify HTML safety, genuine KaTeX inside existing visual design, CI checks.
B. Separate compatibility PR: tested Next.js 16 migration, frozen lockfile and browser smoke tests.
C. Separate editorial PR: knowledge-popover adapter and a feature-flagged demo with curated data.
D. Production publication pipeline: Studio publish/review workflow → server snapshots → Web, cache invalidation, rights/SEO/indexing and monitoring.
