# ScientificRadar Web staging runbook

This is a staging procedure for the Next.js Web reader. It does not provision
hosting or authorize public exposure. The Web application is a read-only
consumer; SQLite, editorial authentication, and durable publishing storage are
owned by ScientificRadar Studio and are not implemented in this repository.

## Runtime and build

- Use the patched Node.js 24 LTS release pinned in `.nvmrc` (currently 24.22.2).
- Install from the committed npm lockfile with `npm ci`.
- Run `npm run check` and `npm run test:responsive` before promoting a build.
- Build an immutable standalone artifact with `npm run build`; run it with
  `npm run start -- --hostname 127.0.0.1 --port 3000` behind a staging reverse
  proxy that terminates HTTPS.
- Configure the proxy to preserve the original host and HTTPS scheme. Do not
  trust arbitrary client forwarded headers at the application boundary.

## Staging environment

Start with `.env.example`. For an isolated staging demo, use
`SCIRAD_RUNTIME_MODE=stage-a-demo`,
`SCIRAD_CONTENT_ADAPTER=demo-fixtures`,
`NEXT_PUBLIC_ENABLE_PRODUCTION_INDEXING=false`,
`NEXT_PUBLIC_ENABLE_GOOGLE_SERVICES=false`,
`NEXT_PUBLIC_ENABLE_ADSENSE=false`, and
`NEXT_PUBLIC_REQUIRE_CONSENT=true`. Use a staging HTTPS `NEXT_PUBLIC_SITE_URL`
and keep indexing disabled. Demo fixtures are not production scientific content.

To validate the read-only snapshot adapter in a private staging environment,
set `SCIRAD_CONTENT_ADAPTER=published-snapshots` and
`SCIENTIFICRADAR_STUDIO_PUBLISHING_URL` to the trusted HTTPS Studio origin.
Never point staging at production credentials or expose an unprotected staging
origin. The Web server must fail closed when the adapter or Studio origin is
invalid/unavailable; do not add a demo fallback to production.

## Smoke checks

After deployment, request `/`, `/topics`, `/search`, `/robots.txt`, and
`/sitemap.xml` over HTTPS. Confirm the staging host returns `noindex`, robots
disallow indexing, and sitemap contains no public production entries. In
snapshot mode, load a known published article, then verify withdrawn content is
absent from its route, search, topic feeds, homepage, related content, and
sitemap after cache revalidation. Check response headers and CDN behavior for
withdrawn content; purge the CDN as part of emergency withdrawal if the cache
provider does not honor the app's revalidation mechanism.

## Rollback and withdrawal

For a bad Web release, route staging traffic back to the previous immutable
build and invalidate the CDN cache. Keep indexing disabled. For a scientific
withdrawal, update the authoritative Studio publication state, verify the
withdrawn revision is excluded in Web, trigger the configured cache
revalidation, and confirm the routes and sitemap no longer expose it. A Web
rollback alone must not restore a withdrawn Studio record.

## Readiness boundaries

- This repository contains no editor login service, sessions, role checks,
  SQLite database, migrations, backup/restore utility, or publishing API.
  Those controls must be verified in Studio before the combined publishing
  system can be called production-ready.
- SQLite is a single-node storage choice and must not be treated as validated
  for multi-instance/serverless deployment. Persistent disk, backup integrity,
  restore drills, WAL behavior, and file permissions remain Studio deployment
  gates.
- Production DNS, HTTPS certificate, secret management, durable hosting,
  monitoring, CDN purge behavior, content rights, and owner release approval
  remain explicit launch gates. No deployment is performed by this runbook.
