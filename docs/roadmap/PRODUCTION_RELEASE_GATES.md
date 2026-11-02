# Production Release Gates — Proposed

Release evidence is evaluated against an approved host, domain, deployment model, and content policy. These gates are proposals, not current pass claims.

- **SEO:** rendered metadata uniqueness; canonical and robots policy; sitemap membership; redirect/status checks; internal search exclusion; locale tags when approved.
- **Publishing integrity:** authenticated contract tests; draft/preview isolation; schema validation; figures/citations/math/table rendering; revision and rollback evidence.
- **Security:** authorization boundary review; input sanitization; secret scanning; dependency and HTTP configuration review; no sensitive data in logs.
- **Accessibility:** automated checks plus manual keyboard and screen-reader review on representative editorial routes.
- **Performance:** agreed field/lab measurement context, representative routes/devices, and owner-approved thresholds before thresholds are set.
- **Integration:** Web–Studio contract, failure/retry behavior, cache invalidation, and deployment smoke tests.
- **Monetization/privacy:** script uniqueness, `ads.txt`, consent behavior, and account review readiness; no approval guarantee.
- **Operations:** staging smoke, observability, backup/restore, rollback rehearsal, incident ownership, and owner launch approval.

The repository currently has unit/build and Playwright CI workflows. Preserve the existing suite; add only evidence-backed coverage gaps. The reported 77 successful hosted tests are historical until confirmed on the release candidate.
