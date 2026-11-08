# ScientificRadar Article Reading Experience — Independent D6 Closure & Owner Review Decision

**Date:** 2026-11-07  
**Reviewer:** ChatGPT (independent Framer source + screenshot inspection; real-browser interaction measurements supplied by Codex)  
**Disposition:** **READY FOR OWNER DESIGN REVIEW** · **NOT APPROVED FOR SCIENTIFICRADAR WEB INTEGRATION OR PRODUCTION**.

## Evidence and scope of the decision
- Same single Framer article page: `QDX13iWpW`, route `/article-reading-experience-lab`, component `ScientificRadarArticleExperienceLab.tsx` / `codeFile/zDUnMAD:default`.
- Independently re-read latest Framer source including mobile TOC `useLayoutEffect`, focus recovery, real popup/trigger `getBoundingClientRect()`, source disclosure, static Knowledge Link dataset, `Thematic Reading Trail` and current M1/M2/M3 scope.
- Re-rendered and independently visually inspected Framer screenshots at 1200 and 320 px. Four Framer frames use the same code component; `noIndex` and `noIndexSite` are enabled.
- Codex supplied real Brave 320/390/810/1200 DOM and interaction measurements and D1–D6 reports. **ChatGPT did not independently repeat those live Brave clicks**. The following browser PASS statuses are **Codex-reported**, not a new browser E2E run.
- Draft GitHub PR #54 was verified open/draft/unmerged with `main` as base. Framer remains unpublished, Web/Studio application source unchanged.

## Closed issues
| Finding | Initial state | D6 evidence | Final state |
| --- | --- | --- | --- |
| Mobile TOC target moves out of viewport when dropdown collapses | **P2 FAIL** `top=-189.09px`, 320 px | Framer source closes dropdown first and performs post-commit scroll; Codex 12 tests 320/390 H2 first/middle/last click+Enter `top≈24px`, `aria-current`, Enter heading focus; 1200 unchanged | **RESOLVED** within tested flows |
| Knowledge popup clipped at 320×568 | **P3 FAIL** bottom 583.57 beyond 568 | Actual popup/trigger DOMRect. Codex measured rect `[12, 278.91, 308, 556]`; 390×667 `[26,12,378,274.09]`, desktop `[389.04,12,741.04,274.09]` | **RESOLVED** within tested flows |
| M3 misleading pedagogical expectation | Design risk | Kicker renamed `Thematic Reading Trail`; cards state that unrelated physical mechanisms are **not** an evidence chain; canonical article IDs preserved | **RESOLVED** as editorial prototype positioning |

## Independent integrated visual critique
- **1200:** editorial headline/dek/hero and narrow prose are balanced; left TOC + optional right knowledge callout do not visibly crush the 680px reading column. Summary before article, source disclosure and font group establish a legible hierarchy. No urgent layout redesign.
- **320:** one-column layout, collapsible TOC and inline key concept are coherent; long headline and three reading trail titles wrap without visible clipping. Design is **text-dense**, especially before the first article paragraph, but this is a content hierarchy/real-user preference question, **not** established P2 functional failure.
- **M2:** very short context box explains why a concept matters rather than restating the wiki definition. Controlled previews and explicit demo source transparency are rational; avoid clutter by showing at most selected terms/panels.
- **M3:** 3 current-fixture articles are theme-related but not prerequisites or linked causal evidence. `Thematic Reading Trail` is appropriate. Production should show it **only when an editor has approved the theme and at least 2 real published articles**, not for every story.
- **Full-Web parity is NOT claimed:** Framer uses a shortened illustrative fixture and does not verify the real reader's figures, citations, KaTeX, tables, sanitized `bodyHtml`, browser history, source records and actual CMS-backed knowledge links.

## Priority triage at D6 closure
**No remaining independently identified, confirmed P1/P2 issue inside the tested combined Framer reader scope.** That is a scoped statement, not a blanket claim that the prototype or production site is error-free.

| Item | Priority / status | Disposition |
| --- | --- | --- |
| Framer page metadata title/description still mention M1 only | P3 housekeeping | Rename to M1–M3 before any release or external review share |
| Hero alt/caption paraphrase vs canonical fixture details | P3 fidelity | Source from verified Web media metadata during adapter implementation |
| Long inline Knowledge Link underlined across lines at 320 | P3 polish | Reassess semantic inline link typography with representative long scientific terms |
| Repeated demo/source labels and first-scroll density | UX observation | Owner review / optional restrained copy edit, preserve provenance |
| Real hover, touch emulation and reduced-motion | **BLOCKED** by current CUA surface | Re-run with a capable pointer/touch/OS media environment |
| Actual hash/Back semantics and deep links | Integration gap | Preserve native URL behavior in Web; current Framer `preventDefault()` does not implement it |
| LCP, INP, CLS and real network waterfall | **BLOCKED**, unmeasured | Profile with production-like Web runtime before launch |
| Prior Framer canvas “Component file does not exist” warning unrelated to active preview | **BLOCKED** scope/impact | Triage separately if it affects editing/publishing; do not claim resolved |
| Framer vs Web rail breakpoint: Framer desktop starts 1200, Web `xl` at 1280 | Adapter compatibility | Use actual Web breakpoint and test 1200–1280 boundary to prevent prose width collapse |

## Owner decision requested
1. Approve or request changes to the **unified reader visual hierarchy** on one page (M1–M3).
2. Decide if reading-size and the summary should be visible in first screen on 320 and whether M2 source disclosure should stay above prose.
3. Confirm **Thematic Reading Trail** as an optional editor-owned content module; not a universal algorithmic RelatedStories replacement.
4. Authorize an explicit separate **Web integration implementation phase**, or keep as a Framer concept. This D6 decision grants **neither** Web code-change nor publish permission.

## Proposed Web integration PR order (not authorized)
1. **Web PR-A — M1 reader enhancement:** adapt summary deduplication, A−/A/A+ (prose only) and scrollspy/current-section to existing `ArticleHeader`/`ArticleReader`; preserve canonical headings, figures, tables, equations, citations, content sanitization. Keyboard/mobile/320/390/1200/1280 tests, no new content model if existing summary can serve.
2. **Web PR-B — M2 knowledge + source disclosure:** expose only reviewed Studio KnowledgeLink records in a safe versioned publication snapshot; resolve internal target ID → public visible slug server-side; validate wiki URL/attribution; dedupe citation vs knowledge previews and keep source ledger ownership with `CitationList`. Audit popup focus, touch and XSS.
3. **Web PR-C — M3 thematic route, conditional:** editor-owned optional 2–5 ordered public article IDs with explicit theme/rationale and publication visibility checks; if no coherent pathway, no module. Deduplicate vs `RelatedStories`. Never treat fixture themes as a universal recommendation system.
4. **Web PR-D — integrated regression and release readiness:** full canonical `bodyHtml`, all scientific blocks, deep-link/hash/Back, tested hover/touch/reduced-motion, real LCP/INP/CLS and hydration, SSR/publication isolation. **Do not publish or merge by default.**

## Do-not-change boundaries
- PR #54 remains docs-only, draft and unmerged unless owner explicitly authorizes merge.
- No ScientificRadar Web/Studio application source modifications, domain/DNS, Framer publish, or production deployment.
- D6 closure means **review-ready prototype**, not **integration-ready implementation** or **production-ready release**.
