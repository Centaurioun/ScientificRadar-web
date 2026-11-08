# ScientificRadar Web staging and deployment preparation

This runbook prepares the Web reader and its proxy boundary for a private staging
environment. It does not provision or modify a server, publish DNS, configure
TLS, deploy either application, or authorize public exposure. ScientificRadar
Web and ScientificRadar Studio remain separate applications and repositories.
Web is a read-only consumer; Studio owns editorial authentication, publication,
and SQLite storage.

All hostnames, ports, paths, certificate locations, service names, and storage
locations below are examples. Replace them only after inspecting the target
server and the Studio deployment configuration. This document makes no
assumption about the server OS, service manager, container runtime, storage
device, or reverse proxy.

## Web runtime and immutable artifact

- Use the patched Node.js 24 LTS release pinned in `.nvmrc` (currently 24.22.2).
- Install from the committed lockfile with `npm ci`.
- Before creating a release artifact, run `npm run check` and
  `npm run test:responsive` under Node 24.
- Build with `npm run build`. Next.js produces a standalone server under
  `.next/standalone/`.
- Preserve the exact Web Git commit alongside the artifact. Keep each release
  immutable and separately identifiable so rollback selects a previous build
  without rebuilding it.
- The standalone artifact needs `.next/standalone/`, `.next/static/`, `public/`
  when present, and `scripts/start-standalone.mjs`. That start script copies
  static assets into the standalone tree and launches `.next/standalone/server.js`.
  Retain the lockfile and `.nvmrc` with the release record.
- The example startup command binds Web to loopback:

  ```sh
  HOSTNAME=127.0.0.1 PORT=3000 npm run start -- --hostname 127.0.0.1 --port 3000
  ```

  Change the port only after checking it is unused and configuring the proxy to
  the same value. Do not expose the standalone server directly to the network.
- Supply runtime environment variables through the chosen service manager or
  secret/configuration mechanism. `.env.example` is a template, not a production
  secret store.

## Single-host two-service proxy examples

The examples below place Web and Studio behind one host with separate loopback
upstreams. `web.staging.example.invalid` and `studio.staging.example.invalid`
are documentation placeholders; replace them with owner-approved staging
hostnames after DNS and TLS ownership are established. Port `3000` is the Web
example above. Port `3001` is only a placeholder for the Studio service: use
the actual Studio listener configured and verified for its own deployment.
Both upstream processes should bind only to loopback or an equivalently private
interface reachable by the proxy.

### Caddy example

```caddyfile
web.staging.example.invalid {
    reverse_proxy 127.0.0.1:3000
}

studio.staging.example.invalid {
    reverse_proxy 127.0.0.1:3001
}
```

Use the proxy's documented certificate mode for the selected staging
environment. The placeholder names are not real services and this example does
not configure DNS or certificates.

### Nginx example

```nginx
server {
    listen 443 ssl;
    server_name web.staging.example.invalid;
    ssl_certificate     /path/to/web-staging-fullchain.pem;
    ssl_certificate_key /path/to/web-staging-private-key.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        # Overwrite client-supplied forwarding values at the trusted edge.
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Proto https;
    }
}

server {
    listen 443 ssl;
    server_name studio.staging.example.invalid;
    ssl_certificate     /path/to/studio-staging-fullchain.pem;
    ssl_certificate_key /path/to/studio-staging-private-key.pem;

    location / {
        # Placeholder only; verify Studio's actual private listener first.
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Proto https;
    }
}
```

Terminate HTTPS at the trusted proxy and forward the original host and HTTPS
scheme. The application must not be reachable directly from untrusted networks.
Do not accept arbitrary client `Forwarded` or `X-Forwarded-*` values as trusted
input. If another trusted proxy sits in front of this one, define the trusted
hop list explicitly, sanitize incoming headers at that edge, and pass only the
validated client address chain. Configure certificate files, renewal and TLS
policy for the actual host; no certificate path or policy is prescribed here.

## Private staging configuration and isolation

Copy `.env.example` into the chosen environment configuration and set values
explicitly. For a private, non-indexed staging demo use:

```dotenv
SCIRAD_RUNTIME_MODE=stage-a-demo
SCIRAD_CONTENT_ADAPTER=demo-fixtures
NEXT_PUBLIC_SITE_URL=https://web.staging.example.invalid
NEXT_PUBLIC_ENABLE_PRODUCTION_INDEXING=false
NEXT_PUBLIC_ENABLE_GOOGLE_SERVICES=false
NEXT_PUBLIC_ENABLE_ADSENSE=false
NEXT_PUBLIC_REQUIRE_CONSENT=true
```

Keep staging behind authentication at the proxy or an equivalent access
control. Keep indexing disabled even if the host has HTTPS. Verify that the
rendered pages declare `noindex`, `/robots.txt` disallows crawling, and
`/sitemap.xml` is empty. Do not enable production indexing or point demo mode at
production content.

To exercise the published-snapshot adapter in private staging, set
`SCIRAD_CONTENT_ADAPTER=published-snapshots` and configure
`SCIENTIFICRADAR_STUDIO_PUBLISHING_URL` to the trusted HTTPS Studio staging
origin. Keep `SCIRAD_RUNTIME_MODE=stage-a-demo` and
`NEXT_PUBLIC_ENABLE_PRODUCTION_INDEXING=false` for non-indexed staging. Never
use production credentials or a demo fallback for an unavailable snapshot
adapter. The Web API client must fail closed; private drafts must not be made
public by staging configuration.

Stage Web and Studio separately. Studio owns SQLite and its persistent storage
location; identify that path from the actual Studio configuration before
creating backup procedures. Do not put the SQLite database in a transient Web
artifact or assume it is shared safely across multiple Studio instances.

## Liveness, readiness, and smoke checks

This Web application does not currently expose a dedicated `/health` endpoint.
Use the service supervisor's process state for process liveness, then use HTTP
checks below for application readiness. Do not mistake a process-alive signal or
an HTTP 200 from the homepage alone for a healthy Studio publishing connection.

### Demo-fixture mode

After the process is running, request the following over the staging HTTPS host:

```sh
curl -fsS -D - https://web.staging.example.invalid/ -o /dev/null
curl -fsS -D - https://web.staging.example.invalid/article/spider-silk-hierarchical-protein-mechanics -o /dev/null
curl -fsS https://web.staging.example.invalid/robots.txt
curl -fsS https://web.staging.example.invalid/sitemap.xml
```

Expect the homepage and known demo article to return 200, the robots response to
disallow crawling, and the sitemap to contain no public production entries.
Check `/topics`, `/search`, and `/about` as well. Confirm the banner/content
states are recognizably demo material and that no real production article,
credential, or private Studio record appears.

### Published-snapshot mode

An HTTP 200 on `/` is not sufficient to establish that the Studio adapter is
ready: an unavailable adapter can safely produce an empty catalog. Select a
known public staging article and an authorized test draft/withdrawn slug, then
verify all of the following:

1. The homepage returns 200 and includes only the current public staging
   catalog. If the public catalog is intentionally empty, the safe empty state
   returns 200 and includes no demo article links.
2. The known published article returns 200 with expected title, locale,
   citations, figures, tables, notices and metadata. The known draft or
   withdrawn route is absent (normally 404) and is not listed in homepage,
   search, topic feeds, Related Reading, or sitemap.
3. `/robots.txt` disallows indexing and `/sitemap.xml` contains no production
   entries while staging indexing is disabled.
4. A publication, withdrawal or restoration is observed after the configured
   revalidation path runs. Inspect response headers and each CDN layer for stale
   HTML, RSC payloads, images, redirects and sitemap content.
5. A public Web response and browser-visible page contain no private
   `editorDraft`, reviewer notes, unpublished metadata, or other editor-only
   fields. The Studio API URL is reachable only from the intended private
   network path and its access rules are verified independently.

The configured Studio publishing API may have its own health/readiness routes;
discover and verify them from Studio's own deployment contract. This Web
runbook does not invent a Studio health endpoint.

## Withdrawal, CDN behavior, and rollback

For a scientific withdrawal or correction, change the authoritative publication
state in Studio through its approved workflow. Confirm that Web excludes the
withdrawn revision from direct article routes, homepage, search, topics, related
content and sitemap after the configured cache revalidation. Inspect browser,
reverse-proxy and CDN responses. If any cache retains withdrawn content, purge
the affected CDN objects using that provider's verified procedure and repeat
the requests. A Web rollback must not restore withdrawn Studio state.

For a bad Web release:

1. Select the prior immutable Web artifact by its recorded commit/release ID.
2. Keep the current private-staging host, loopback binding, environment mode,
   adapter and indexing-off settings unchanged unless the failure requires a
   separately reviewed configuration correction.
3. Restart/switch only the Web process to the prior artifact and verify the
   expected Node.js 24 runtime, process liveness, and demo or published-snapshot
   readiness checks above.
4. Invalidate only the Web/CDN objects required for the rollback. Verify
   homepage, article, robots, sitemap and withdrawal behavior again.
5. Preserve Studio's current publication state and SQLite data. Do not roll back
   Studio, restore its database, or change a withdrawal merely to make the Web
   release appear healthy.

The actual artifact store, service manager, persistent-storage mount, backup
location, and proxy/CDN purge command depend on the owner's server. Obtain those
values from the inspected environment and Studio runbook. Before a production
release, verify Studio's own database backup and restore procedure, including
its configured path and integrity check; this Web repository supplies no
SQLite backup command.

## Readiness boundaries

- This repository contains no Studio editor login, sessions, role checks,
  SQLite database, migrations, backup/restore utility, or publishing API.
- Production DNS, HTTPS certificate management, secret storage, persistent
  hosting, monitoring, CDN behavior, content rights, and owner release approval
  are external release gates. This runbook performs no deployment or server
  changes.
- One-host/two-service routing is an example topology only. Confirm capacity,
  isolation, storage semantics and the Studio runtime separately before using
  it. Do not assume that a serverless or multi-instance target is compatible
  with Studio's SQLite persistence.
