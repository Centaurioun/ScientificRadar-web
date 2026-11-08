import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { DEMO_ARTICLES, DEMO_AUTHORS } from "./fixtures";
import { adaptPublicArticleToSnapshotV1 } from "./contract-v1";
import { PublishedSnapshotContentRepository, UnavailablePublishedContentRepository } from "./published-snapshot-repository";
import { createContentRepository } from "./repository";
import { PublishedSnapshotRecordV1 } from "./types";

function publishedSnapshot({
  id,
  slug,
  status = "published",
  relatedIds = [],
  seriesId,
}: {
  id: string;
  slug: string;
  status?: "published" | "draft" | "in_review";
  relatedIds?: string[];
  seriesId?: string;
}): PublishedSnapshotRecordV1 {
  const article = {
    ...DEMO_ARTICLES[0],
    id,
    slug,
    status,
    relatedIds,
    seriesId,
    revisionId: `test-only-revision-${id}`,
  };
  const snapshot = adaptPublicArticleToSnapshotV1(article, DEMO_AUTHORS);
  const bindTestRights = <T extends { id: string; license: string; rightsVerified: boolean }>(media: T) => ({
    ...media,
    src: `/api/public/media/${createHash("sha256").update(`synthetic-test-asset:${id}:${media.id}`).digest("hex")}`,
    rightsVerified: true,
    rightsEvidence: {
      evidenceId: `test-only-evidence-${media.id}`,
      mediaId: media.id,
      assetRevisionId: createHash("sha256").update(`synthetic-test-asset:${id}:${media.id}`).digest("hex"),
      license: media.license,
    },
  });
  return {
    ...snapshot,
    hero: snapshot.hero ? bindTestRights(snapshot.hero) : undefined,
    blocks: snapshot.blocks.map((block) => block.type === "figure"
      ? { ...block, media: bindTestRights(block.media) }
      : block),
  };
}

function mockFetch(payload: unknown, calls: Array<{ url: string; cache?: RequestCache }>) {
  return (async (input: RequestInfo | URL, init?: RequestInit) => {
    calls.push({ url: String(input), cache: init?.cache });
    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }) as typeof fetch;
}

test("published snapshot mode fetches no-store data and excludes draft/invalid snapshots from every public listing", async () => {
  const published = publishedSnapshot({ id: "public-article-01", slug: "public-article-01" });
  const draft = publishedSnapshot({ id: "draft-article-01", slug: "draft-article-01", status: "draft" });
  const invalid = { ...published, revisionId: "", slug: "invalid-article" };
  const calls: Array<{ url: string; cache?: RequestCache }> = [];
  const repository = new PublishedSnapshotContentRepository(
    "https://studio.example.test",
    mockFetch([published, draft, invalid], calls)
  );

  const articles = await repository.listPublicArticles();
  assert.deepEqual(articles.map((article) => article.slug), ["public-article-01"]);
  assert.equal((await repository.getPublicArticle("missing")), null);
  assert.ok(calls.every((call) => call.cache === "no-store"));
  assert.ok(calls.some((call) => call.url === "https://studio.example.test/api/publications"));
  assert.ok(calls.some((call) => call.url === "https://studio.example.test/api/publications/missing"));
});

test("slug reads use the authorized snapshot endpoint and reject revisions absent from the active public list", async () => {
  const snapshot = publishedSnapshot({ id: "article-slug-id", slug: "article-slug" });
  const calls: Array<{ url: string; cache?: RequestCache }> = [];
  const fetcher = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    calls.push({ url, cache: init?.cache });
    return new Response(JSON.stringify(url.endsWith("/api/publications/article-slug") ? snapshot : [snapshot]), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }) as typeof fetch;
  const repository = new PublishedSnapshotContentRepository("https://studio.example.test", fetcher);

  const article = await repository.getPublicArticle("article-slug");
  assert.equal(article?.revisionId, snapshot.revisionId);
  assert.ok(calls.some((call) => call.url.endsWith("/api/publications/article-slug")));
  assert.ok(calls.some((call) => call.url.endsWith("/api/publications")));
  assert.ok(calls.every((call) => call.cache === "no-store"));

  const staleFetcher = (async (input: RequestInfo | URL) =>
    new Response(JSON.stringify(String(input).endsWith("/api/publications/stale")
      ? snapshot
      : []), { status: 200, headers: { "content-type": "application/json" } })) as typeof fetch;
  const staleRepository = new PublishedSnapshotContentRepository("https://studio.example.test", staleFetcher);
  assert.equal(await staleRepository.getPublicArticle("stale"), null);
});

test("published related articles resolve only active catalog IDs and prioritize exact relation then series", async () => {
  const primary = publishedSnapshot({
    id: "primary-id",
    slug: "primary-article",
    relatedIds: ["explicit-id", "draft-id"],
    seriesId: "verified-series-01",
  });
  const explicit = publishedSnapshot({ id: "explicit-id", slug: "explicit-article", seriesId: "another-series" });
  const series = publishedSnapshot({ id: "series-id", slug: "series-article", seriesId: "verified-series-01" });
  const draft = publishedSnapshot({ id: "draft-id", slug: "draft-article", status: "draft", seriesId: "verified-series-01" });
  const repository = new PublishedSnapshotContentRepository(
    "https://studio.example.test",
    mockFetch([primary, explicit, series, draft], [])
  );
  const primaryArticle = {
    ...DEMO_ARTICLES[0],
    id: "primary-id",
    slug: "primary-article",
    relatedIds: ["explicit-id", "draft-id"],
    seriesId: "verified-series-01",
  };

  const related = await repository.getRelatedArticles(primaryArticle, 3);
  assert.deepEqual(related.map((article) => article.id), ["explicit-id", "series-id"]);
});

test("internal Knowledge Links survive only when their target article is active and matches the exact route", async () => {
  const target = publishedSnapshot({ id: "target-id", slug: "target-slug" });
  const linking = {
    ...publishedSnapshot({ id: "linking-id", slug: "linking-slug" }),
    knowledgeLinks: [
      {
        id: "good-link",
        targetType: "internal" as const,
        targetUrl: "/article/target-slug",
        targetArticleId: "target-id",
        locale: "en" as const,
        previewTitle: "Related published article",
        previewExcerpt: "Reviewed and linked to a public article.",
        sourceAttribution: "Reviewed editor link",
        reviewStatus: "approved" as const,
        isSampleDemoData: false,
      },
      {
        id: "hidden-link",
        targetType: "internal" as const,
        targetUrl: "/article/private-slug",
        targetArticleId: "not-public-id",
        locale: "en" as const,
        previewTitle: "Hidden target",
        previewExcerpt: "Must be omitted.",
        sourceAttribution: "Reviewed editor link",
        reviewStatus: "approved" as const,
        isSampleDemoData: false,
      },
    ],
  };
  const repository = new PublishedSnapshotContentRepository(
    "https://studio.example.test",
    mockFetch([target, linking], [])
  );
  const article = (await repository.listPublicArticles()).find((candidate) => candidate.id === "linking-id");
  assert.ok(article);
  assert.deepEqual(article.knowledgeLinks?.map((link) => link.id), ["good-link"]);
});

test("unavailable published adapter never falls back to demo fixtures", async () => {
  const repository = new PublishedSnapshotContentRepository(null, mockFetch(DEMO_ARTICLES, []));
  assert.deepEqual(await repository.listPublicArticles(), []);
  assert.equal(await repository.getPublicArticle(DEMO_ARTICLES[0].slug), null);

  const missingUrl = createContentRepository({ SCIRAD_CONTENT_ADAPTER: "published-snapshots" });
  assert.ok(missingUrl instanceof UnavailablePublishedContentRepository);
  assert.deepEqual(await missingUrl.listPublicArticles(), []);

  const invalidAdapter = createContentRepository({ SCIRAD_CONTENT_ADAPTER: "unknown" });
  assert.ok(invalidAdapter instanceof UnavailablePublishedContentRepository);

  const prodDemo = createContentRepository({
    SCIRAD_RUNTIME_MODE: "stage-c-production",
    SCIRAD_CONTENT_ADAPTER: "demo-fixtures",
  });
  assert.ok(prodDemo instanceof UnavailablePublishedContentRepository);
});

test("local HTTP publishing origin is accepted only with explicit loopback media permission and exact host/port", async () => {
  const base = publishedSnapshot({ id: "local-public-id", slug: "local-public-article" });
  const localizeMedia = <T extends { src: string; rightsEvidence?: { assetRevisionId: string } }>(media: T, port = 3000) => ({
    ...media,
    src: `http://localhost:${port}/api/public/media/${media.rightsEvidence?.assetRevisionId}`,
  });
  const localSnapshot = {
    ...base,
    hero: base.hero ? localizeMedia(base.hero) : undefined,
    blocks: base.blocks.map((block) => block.type === "figure"
      ? { ...block, media: localizeMedia(block.media) }
      : block),
  };
  const configured = new PublishedSnapshotContentRepository(
    "http://localhost:3000",
    mockFetch([localSnapshot], []),
    true
  );
  assert.deepEqual((await configured.listPublicArticles()).map((article) => article.slug), ["local-public-article"]);

  const implicitPermission = new PublishedSnapshotContentRepository(
    "http://localhost:3000",
    mockFetch([localSnapshot], [])
  );
  assert.deepEqual(await implicitPermission.listPublicArticles(), []);

  const wrongPortSnapshot = {
    ...localSnapshot,
    hero: localSnapshot.hero ? localizeMedia(localSnapshot.hero, 3001) : undefined,
    blocks: localSnapshot.blocks.map((block) => block.type === "figure"
      ? { ...block, media: localizeMedia(block.media, 3001) }
      : block),
  };
  const wrongPort = new PublishedSnapshotContentRepository(
    "http://localhost:3000",
    mockFetch([wrongPortSnapshot], []),
    true
  );
  assert.deepEqual(await wrongPort.listPublicArticles(), []);
});
