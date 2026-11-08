import test from "node:test";
import assert from "node:assert/strict";
import {
  contentRepository,
  filterArticles,
  formatPublicationDate,
  isPubliclyVisibleArticle,
} from "./repository";
import {
  normalizeSearchText,
  sanitizeCanonicalBodyHtml,
} from "./sanitizer";
import { DEMO_ARTICLES, DEMO_CATEGORIES } from "./fixtures";
import { PublicArticle } from "./types";

test("fixture inventory contains at least 8 original demo stories across 7 categories", () => {
  assert.ok(
    DEMO_ARTICLES.length >= 8,
    `Expected >= 8 demo articles, got ${DEMO_ARTICLES.length}`
  );
  assert.equal(DEMO_CATEGORIES.length, 7);
});

test("draft articles are strictly excluded from public repository listings", () => {
  const mockDraft: PublicArticle = {
    ...DEMO_ARTICLES[0],
    id: "draft-secret-01",
    slug: "unpublished-draft-story",
    status: "draft",
  };
  assert.equal(isPubliclyVisibleArticle(mockDraft), false);
  const filtered = filterArticles([mockDraft, DEMO_ARTICLES[0]]);
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].slug, DEMO_ARTICLES[0].slug);
});

test("Turkish character normalization handles ı, İ, ğ, Ğ, ş, Ş, ö, Ö, ü, Ü, ç, Ç", async () => {
  assert.equal(
    normalizeSearchText("İsmetpaşa Boşluğu Çağdaş Öğreti"),
    "ismetpasa boslugu cagdas ogreti"
  );
  const trResults = await contentRepository.listPublicArticles({
    query: "İsmetpaşa",
  });
  assert.equal(trResults.length, 1);
  assert.equal(
    trResults[0].slug,
    "north-anatolian-fault-aseismic-creep-geodesy"
  );

  const asciiResults = await contentRepository.listPublicArticles({
    query: "ismetpasa bosluk",
  });
  assert.equal(asciiResults.length, 1);
  assert.equal(
    asciiResults[0].slug,
    "north-anatolian-fault-aseismic-creep-geodesy"
  );
});

test("search returns empty array on unmatched query without throwing", async () => {
  const empty = await contentRepository.listPublicArticles({
    query: "nonexistent-xenobiology-warp-drive-9999",
  });
  assert.equal(empty.length, 0);
});

test("demo related reading has no arbitrary fallback and preserves locale plus editorial order", async () => {
  const primary = { ...DEMO_ARTICLES[0], categorySlug: "no-public-category", relatedIds: [] };
  assert.deepEqual(await contentRepository.getRelatedArticles(primary, 3), []);

  const explicit = DEMO_ARTICLES.find((article) => article.id === DEMO_ARTICLES[0].relatedIds[0]);
  if (explicit) {
    const result = await contentRepository.getRelatedArticles(DEMO_ARTICLES[0], 3);
    assert.equal(result[0]?.id, explicit.id);
    assert.ok(result.every((article) => article.locale === DEMO_ARTICLES[0].locale));
    assert.equal((await contentRepository.getRelatedArticles(DEMO_ARTICLES[0], 1)).length, 1);
    assert.equal((await contentRepository.getRelatedArticles(DEMO_ARTICLES[0], 2)).length, 2);
  }
});

test("no fixture source fabricates a synthetic DOI claiming to be real", () => {
  for (const article of DEMO_ARTICLES) {
    for (const src of article.sources) {
      assert.equal(
        src.isIllustrativeDemo,
        true,
        `Source ${src.id} in ${article.slug} must be flagged as illustrative demo`
      );
      assert.equal(
        src.doi,
        undefined,
        `Source ${src.id} must not invent a fake DOI`
      );
    }
  }
});

test("canonical HTML sanitizer strips scripts, event handlers, and demotes nested H1 to H2", () => {
  const dirty =
    '<h1 class="inner">Bad H1</h1><p onclick="alert(1)">Safe <sup data-citation-source-id="src-1">[1]</sup></p><script>evil()</script><a href="javascript:void(0)">Link</a>';
  const clean = sanitizeCanonicalBodyHtml(dirty);
  assert.ok(!clean.includes("<script"), "Should strip script tags");
  assert.ok(!clean.includes("onclick="), "Should strip inline event handlers");
  assert.ok(!clean.includes("<h1"), "Should demote inner h1 to h2");
  assert.ok(clean.includes("<h2>Bad H1</h2>"), "Unknown user CSS classes should not survive published HTML");
  assert.ok(clean.includes('data-citation-source-id="src-1"'));
});

test("formatPublicationDate formats YYYY-MM-DD deterministically", () => {
  assert.equal(formatPublicationDate("2026-10-28"), "October 28, 2026");
});
