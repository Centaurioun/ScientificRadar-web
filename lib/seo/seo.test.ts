import test from "node:test";
import assert from "node:assert/strict";
import { DEMO_ARTICLES, DEMO_CATEGORIES } from "../content/fixtures";
import {
  buildCanonicalUrl,
  buildVerifiedLanguageAlternates,
  isVerifiedProductionOrigin,
  resolveRobotsPolicy,
} from "./policy";
import { buildPageMetadata } from "./metadata";
import {
  buildRobotsManifest,
  buildSitemapEntries,
} from "./sitemap-robots";
import {
  LegacyRedirectManifest,
  PREPARED_LEGACY_REDIRECT_MANIFEST,
  validateRedirectManifest,
} from "./redirects";

test("isVerifiedProductionOrigin rejects localhost, .example, .run.app, and HTTP origins", () => {
  assert.equal(isVerifiedProductionOrigin("https://scientificradar.example"), false);
  assert.equal(isVerifiedProductionOrigin("http://localhost:3000"), false);
  assert.equal(isVerifiedProductionOrigin("https://scirad-preview-xyz.run.app"), false);
  assert.equal(isVerifiedProductionOrigin("http://scientificradar.com"), false);
  assert.equal(isVerifiedProductionOrigin("https://scientificradar.com"), true);
});

test("buildCanonicalUrl strips query parameters, fragments, and trailing slashes", () => {
  assert.equal(
    buildCanonicalUrl(
      "/article/spider-silk-hierarchical-protein-mechanics/?measure=600&designReview=1#silk-h2",
      "https://scientificradar.com/"
    ),
    "https://scientificradar.com/article/spider-silk-hierarchical-protein-mechanics"
  );
  assert.equal(
    buildCanonicalUrl("/", "https://scientificradar.com/"),
    "https://scientificradar.com/"
  );
});

test("resolveRobotsPolicy defaults to noindex across all routes when production indexing is off", () => {
  for (const routeType of [
    "home",
    "article",
    "topics-directory",
    "topic-landing",
    "search",
    "about",
    "not-found",
  ] as const) {
    const policy = resolveRobotsPolicy(
      {
        routeType,
        article: { status: "published" },
      },
      {
        siteUrl: "https://scientificradar.com",
        enableProductionIndexing: false,
      }
    );
    assert.equal(policy.index, false);
    assert.equal(policy.follow, false);
  }
});

test("resolveRobotsPolicy keeps search, not-found, demo, draft, and withdrawn routes noindex even when production indexing is enabled", () => {
  const prodEnv = {
    siteUrl: "https://scientificradar.com",
    enableProductionIndexing: true,
  };

  assert.equal(
    resolveRobotsPolicy({ routeType: "search" }, prodEnv).index,
    false
  );
  assert.equal(
    resolveRobotsPolicy({ routeType: "not-found" }, prodEnv).index,
    false
  );

  for (const nonIndexableStatus of ["demo", "draft", "withdrawn"] as const) {
    const res = resolveRobotsPolicy(
      {
        routeType: "article",
        article: { status: nonIndexableStatus },
      },
      prodEnv
    );
    assert.equal(
      res.index,
      false,
      `Article status "${nonIndexableStatus}" must remain noindex in production`
    );
  }

  // Only published article without seo.noindex becomes indexable
  const pubRes = resolveRobotsPolicy(
    {
      routeType: "article",
      article: { status: "published", seo: { noindex: false } },
    },
    prodEnv
  );
  assert.equal(pubRes.index, true);
  assert.equal(pubRes.follow, true);
});

test("buildPageMetadata produces coherent title, description, openGraph, and twitter cards for every route type", () => {
  const article = DEMO_ARTICLES[0];
  const articleMeta = buildPageMetadata(
    {
      routeType: "article",
      pathname: `/article/${article.slug}`,
      article,
    },
    {
      siteUrl: "https://scientificradar.com",
      enableProductionIndexing: false,
      gscVerificationToken: "gsc-token-xyz-123",
    }
  );

  assert.equal(articleMeta.title, article.title);
  assert.equal(articleMeta.description, article.summary);
  assert.equal((articleMeta.openGraph as { type?: string })?.type, "article");
  assert.equal(articleMeta.openGraph?.description, article.summary);
  assert.equal(articleMeta.twitter?.description, article.summary);
  assert.equal(
    articleMeta.alternates?.canonical,
    `https://scientificradar.com/article/${article.slug}`
  );
  assert.equal(
    (articleMeta.verification as { google?: string })?.google,
    "gsc-token-xyz-123"
  );
});

test("buildVerifiedLanguageAlternates omits hreflang unless at least two verified locale paths exist", () => {
  assert.equal(
    buildVerifiedLanguageAlternates(
      { en: "/article/spider-silk" },
      "https://scientificradar.com"
    ),
    undefined
  );

  const reciprocal = buildVerifiedLanguageAlternates(
    {
      en: "/article/north-anatolian-fault-geodesy",
      tr: "/tr/makale/kuzey-anadolu-fayi-jeodezi",
    },
    "https://scientificradar.com"
  );
  assert.deepEqual(reciprocal, {
    en: "https://scientificradar.com/article/north-anatolian-fault-geodesy",
    tr: "https://scientificradar.com/tr/makale/kuzey-anadolu-fayi-jeodezi",
  });
});

test("buildRobotsManifest and buildSitemapEntries stay closed by default and never leak demo fixtures or search routes", () => {
  // 1. Default (disabled) state
  const defaultRobots = buildRobotsManifest({
    siteUrl: "https://scientificradar.example",
    enableProductionIndexing: false,
  });
  assert.equal(defaultRobots.sitemap, undefined);

  const defaultSitemap = buildSitemapEntries(DEMO_ARTICLES, DEMO_CATEGORIES, {
    siteUrl: "https://scientificradar.com",
    enableProductionIndexing: false,
  });
  assert.equal(defaultSitemap.length, 0);

  // 2. Even with production indexing enabled, demo-only articles produce an empty sitemap
  const demoOnlySitemap = buildSitemapEntries(DEMO_ARTICLES, DEMO_CATEGORIES, {
    siteUrl: "https://scientificradar.com",
    enableProductionIndexing: true,
  });
  assert.equal(
    demoOnlySitemap.length,
    0,
    "Demo fixtures (status='demo') must never be emitted into a live production sitemap"
  );

  // 3. When real published articles exist on a verified origin with indexing enabled
  const publishedArticles = [
    {
      ...DEMO_ARTICLES[0],
      status: "published" as const,
    },
    {
      ...DEMO_ARTICLES[1],
      status: "draft" as const,
    },
  ];
  const prodSitemap = buildSitemapEntries(publishedArticles, DEMO_CATEGORIES, {
    siteUrl: "https://scientificradar.com",
    enableProductionIndexing: true,
  });
  assert.ok(prodSitemap.length > 0);
  const urls = prodSitemap.map((e) => e.url);
  assert.ok(
    urls.includes(
      `https://scientificradar.com/article/${DEMO_ARTICLES[0].slug}`
    )
  );
  assert.ok(
    !urls.some((u) => u.includes(DEMO_ARTICLES[1].slug)),
    "Draft article must not appear in sitemap"
  );
  assert.ok(
    !urls.some((u) => u.includes("/search")),
    "Search route must never appear in sitemap"
  );
});

test("prepared legacy redirect manifest passes validation and validator catches loops, chains, homepage fallbacks, and search traps", () => {
  const cleanResult = validateRedirectManifest(
    PREPARED_LEGACY_REDIRECT_MANIFEST
  );
  assert.equal(
    cleanResult.valid,
    true,
    `Expected prepared manifest to pass, issues: ${JSON.stringify(cleanResult.issues)}`
  );

  const brokenManifest: LegacyRedirectManifest = {
    ...PREPARED_LEGACY_REDIRECT_MANIFEST,
    rules: [
      {
        id: "r-dup-1",
        sourcePath: "/old-1",
        targetPath: "/article/a",
        statusCode: 301,
        category: "canonical-consolidation",
        evidenceStatus: "verified-mapping",
        notes: "",
      },
      {
        id: "r-dup-2",
        sourcePath: "/old-1",
        targetPath: "/article/b",
        statusCode: 301,
        category: "canonical-consolidation",
        evidenceStatus: "verified-mapping",
        notes: "",
      },
      {
        id: "r-home-fallback",
        sourcePath: "/2023/10/old-quantum-story.php",
        targetPath: "/",
        statusCode: 301,
        category: "php-legacy",
        evidenceStatus: "verified-mapping",
        notes: "Lazy homepage fallback",
      },
      {
        id: "r-search-trap",
        sourcePath: "/tag/spidroin",
        targetPath: "/search?q=spidroin",
        statusCode: 301,
        category: "search-trap-blocked",
        evidenceStatus: "verified-mapping",
        notes: "Bad search redirect",
      },
      {
        id: "r-chain-step-1",
        sourcePath: "/step-1",
        targetPath: "/step-2",
        statusCode: 301,
        category: "canonical-consolidation",
        evidenceStatus: "verified-mapping",
        notes: "Chain start",
      },
      {
        id: "r-chain-step-2",
        sourcePath: "/step-2",
        targetPath: "/article/final",
        statusCode: 301,
        category: "canonical-consolidation",
        evidenceStatus: "verified-mapping",
        notes: "Chain end",
      },
      {
        id: "r-cross-host",
        sourcePath: "/external",
        targetPath: "https://evil.example.com/phish",
        statusCode: 301,
        category: "canonical-consolidation",
        evidenceStatus: "verified-mapping",
        notes: "Cross-host open redirect",
      },
    ],
  };

  const brokenResult = validateRedirectManifest(brokenManifest);
  assert.equal(brokenResult.valid, false);
  const codes = new Set(brokenResult.issues.map((i) => i.code));
  assert.ok(codes.has("DUPLICATE_SOURCE_PATH"));
  assert.ok(codes.has("HOMEPAGE_FALLBACK_FORBIDDEN"));
  assert.ok(codes.has("SEARCH_QUERY_TRAP_TARGET"));
  assert.ok(codes.has("REDIRECT_CHAIN_DETECTED"));
  assert.ok(codes.has("UNSAFE_CROSS_HOST_TARGET"));
});
