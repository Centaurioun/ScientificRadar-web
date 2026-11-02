# Architecture Decisions — Open

No final architecture is approved. Record decision owner, evidence, alternatives, consequences, and approval date in the corresponding issue before implementation.

| Decision | Options to evaluate | Current evidence / constraint | Tracking |
|---|---|---|---|
| Web hosting and runtime | Existing host, managed Next.js platform, Cloudflare-backed deployment, VPS/other | No target production platform verified in Web repo | M5 issue |
| Publishing transport and storage | Authenticated API, versioned export/import, shared content service, other | Web reads in-memory fixtures. Studio `main` at `b160accd89c8d24b9e5b726e70158d73cc2176d1` has a local IndexedDB prototype but no verified public API, external production storage, or Studio–Web link | M1 issue |
| Public article revision model | Immutable published snapshots, revisions with rollback, scheduled releases | Web schema includes `updatedAt`; no live revision transport verified | M1 issue |
| Authentication and authorization | Server-to-server credentials, delegated identity, scoped publishing roles | No publishing endpoint verified | M1 issue |
| Legacy URL handling | Explicit redirect map, route compatibility, staged retirement | Historical Search Console issue categories require fresh exports | M3 issue |
| Analytics, consent, monetization | GA4/GSC verification and AdSense placement/integration evaluated separately | No production account or site integration verified | M4 issues |
| Localization | English/Turkish route strategy and `hreflang` | Types allow `en`/`tr`; route-level locale strategy unverified | M2 issue |

Architecture remains Proposed / Needs Decision until owner review. Avoid introducing a CMS, database, hosting vendor, paid service, or account changes before the relevant decision is approved.
