import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { createHash } from "node:crypto";
import { renderToStaticMarkup } from "react-dom/server";
import { DEMO_ARTICLES, DEMO_AUTHORS } from "./fixtures";
import {
  adaptPublicArticleToSnapshotV1,
  adaptSnapshotV1ToPublicArticle,
  isSafePublishedMediaUrl,
  isSafeKnowledgeLinkDestination,
  validatePublicationSnapshotV1,
} from "./contract-v1";
import { prepareCanonicalBodyHtml, resolveArticleHeadings } from "./sanitizer";
import ArticleReader from "../../components/editorial/ArticleReader";

function withTestRights<T extends { id: string; src: string; license: string; rightsVerified: boolean }>(media: T, label: string) {
  const assetRevisionId = createHash("sha256").update(`synthetic-test-asset:${label}:${media.id}`).digest("hex");
  return {
    ...media,
    src: `/api/public/media/${assetRevisionId}`,
    rightsVerified: true,
    rightsEvidence: {
      evidenceId: `test-only-evidence-${label}`,
      mediaId: media.id,
      assetRevisionId,
      license: media.license,
    },
  };
}

test("all existing Stage A demo fixtures pass PublicationSnapshotV1 validation", () => {
  for (const article of DEMO_ARTICLES) {
    const snapshot = adaptPublicArticleToSnapshotV1(article, DEMO_AUTHORS);
    const validation = validatePublicationSnapshotV1(snapshot);
    assert.equal(
      validation.valid,
      true,
      `Expected ${article.slug} to pass v1 validation, issues: ${JSON.stringify(validation.issues)}`
    );
    assert.equal(validation.isPubliclyRenderable, true);
    // Demo articles must never be production-indexable candidates
    assert.equal(validation.isIndexableCandidate, false);
  }
});

test("PublicationSnapshotV1 supports both English (en) and Turkish (tr) locales and round-trips cleanly", () => {
  const base = adaptPublicArticleToSnapshotV1(DEMO_ARTICLES[0]);
  const trSnapshot = {
    ...base,
    articleId: "art-tr-kaf-01",
    revisionId: "rev-2026-11-03-tr-01",
    revisionNumber: 2,
    locale: "tr" as const,
    status: "published" as const,
    title: "Kuzey Anadolu Fay Zonu'nda Asismik Kayma ve Jeodezik Gerinim",
    dek: "InSAR ve GNSS dizileri İsmetpaşa segmentindeki yüzey kaymasını milimetre hassasiyetle çözümlüyor.",
    hero: base.hero ? withTestRights(base.hero, "tr-hero") : undefined,
    blocks: base.blocks.map((block) =>
      block.type === "figure"
        ? { ...block, media: withTestRights(block.media, `tr-${block.media.id}`) }
        : block
    ),
  };

  const result = validatePublicationSnapshotV1(trSnapshot);
  assert.equal(result.valid, true);
  assert.equal(result.isPubliclyRenderable, true);
  assert.equal(result.isIndexableCandidate, true);

  const adapted = adaptSnapshotV1ToPublicArticle(trSnapshot);
  assert.equal(adapted.id, "art-tr-kaf-01");
  assert.equal(adapted.locale, "tr");
  assert.equal(adapted.revisionId, "rev-2026-11-03-tr-01");
  assert.equal(adapted.revisionNumber, 2);
});

test("draft, scheduled, in_review, archived, and withdrawn snapshots are rejected from public rendering", () => {
  const base = adaptPublicArticleToSnapshotV1(DEMO_ARTICLES[0]);

  for (const nonPublicStatus of [
    "draft",
    "in_review",
    "scheduled",
    "archived",
    "withdrawn",
  ] as const) {
    const candidate = {
      ...base,
      status: nonPublicStatus,
    };
    const res = validatePublicationSnapshotV1(candidate);
    assert.equal(
      res.isPubliclyRenderable,
      false,
      `Status "${nonPublicStatus}" must never be publicly renderable`
    );
    assert.equal(res.isIndexableCandidate, false);
    assert.ok(res.issues.length > 0);
  }
});

test("published snapshots reject unverified hero and figure rights even with filled attribution", () => {
  const base = adaptPublicArticleToSnapshotV1(DEMO_ARTICLES[0]);
  const published = {
    ...base,
    status: "published" as const,
    hero: base.hero ? { ...base.hero, rightsVerified: false } : undefined,
    blocks: base.blocks.map((block) =>
      block.type === "figure"
        ? { ...block, media: { ...block.media, rightsVerified: false } }
        : block
    ),
  };
  assert.ok(published.hero, "A test hero is required");
  assert.ok(published.blocks.some((block) => block.type === "figure"), "A test figure is required");
  const result = validatePublicationSnapshotV1(published);
  assert.equal(result.valid, false);
  assert.equal(result.isPubliclyRenderable, false);
  assert.equal(result.isIndexableCandidate, false);
  assert.ok(result.issues.some((issue) => issue.code === "UNVERIFIED_MEDIA_RIGHTS" && issue.field === "hero.rightsVerified"));
  assert.ok(result.issues.some((issue) => issue.code === "UNVERIFIED_MEDIA_RIGHTS" && issue.field.endsWith(".media.rightsVerified")));

  const verified = {
    ...published,
    hero: withTestRights(published.hero!, "verified-hero"),
    blocks: base.blocks.map((block) =>
      block.type === "figure"
        ? { ...block, media: withTestRights(block.media, `verified-${block.media.id}`) }
        : block
    ),
  };
  const ok = validatePublicationSnapshotV1(verified);
  assert.equal(ok.valid, true, JSON.stringify(ok.issues));
});

test("published media rights evidence must bind the evidence record to the exact media ID and license", () => {
  const base = adaptPublicArticleToSnapshotV1(DEMO_ARTICLES[0]);
  const published = {
    ...base,
    status: "published" as const,
    hero: {
      ...withTestRights(base.hero!, "mismatched-hero"),
      rightsEvidence: {
        ...withTestRights(base.hero!, "mismatched-hero").rightsEvidence,
        mediaId: "different-media-id",
      },
    },
    blocks: base.blocks,
  };
  const result = validatePublicationSnapshotV1(published);
  assert.equal(result.valid, false);
  assert.ok(result.issues.some((issue) => issue.code === "UNBOUND_MEDIA_RIGHTS_EVIDENCE" && issue.field === "hero.rightsEvidence"));
});

test("runtime validator rejects malformed JSON envelopes without throwing", () => {
  for (const input of [
    null,
    [],
    { contractVersion: "1.0.0", blocks: null },
    { ...adaptPublicArticleToSnapshotV1(DEMO_ARTICLES[0]), blocks: [null] },
    { ...adaptPublicArticleToSnapshotV1(DEMO_ARTICLES[0]), blocks: [{ type: "figure", media: null }] },
  ]) {
    const result = validatePublicationSnapshotV1(input);
    assert.equal(result.valid, false);
    assert.equal(result.isPubliclyRenderable, false);
    assert.ok(result.issues.length > 0);
  }
});

test("source IDs must be unique and included author records must match declared attribution IDs", () => {
  const base = adaptPublicArticleToSnapshotV1(DEMO_ARTICLES[0], DEMO_AUTHORS);
  const result = validatePublicationSnapshotV1({
    ...base,
    sources: [base.sources[0], { ...base.sources[0] }],
    authorIds: ["missing-author-id"],
  });
  assert.ok(result.issues.some((issue) => issue.code === "DUPLICATE_IDENTIFIER"));
  assert.ok(result.issues.some((issue) => issue.code === "AUTHORSHIP_MISMATCH"));
});

test("v1-compatible series and approved Knowledge Links retain their Studio relation metadata", () => {
  const base = adaptPublicArticleToSnapshotV1(DEMO_ARTICLES[0]);
  const snapshot = {
    ...base,
    seriesId: "series-test-record-01",
    knowledgeLinks: [
      {
        id: "knowledge-link-test-01",
        targetType: "internal" as const,
        targetUrl: "/article/spider-silk-hierarchical-protein-mechanics",
        targetArticleId: "article-test-target-01",
        locale: "en" as const,
        previewTitle: "Silk protein assembly",
        previewExcerpt: "A reviewed link to a related public explanation.",
        sourceAttribution: "Reviewed editor link",
        reviewStatus: "approved" as const,
        isSampleDemoData: false,
      },
    ],
  };
  const result = validatePublicationSnapshotV1(snapshot);
  assert.equal(result.valid, true, JSON.stringify(result.issues));
  const adapted = adaptSnapshotV1ToPublicArticle(snapshot);
  assert.equal(adapted.seriesId, snapshot.seriesId);
  assert.deepEqual(adapted.knowledgeLinks, snapshot.knowledgeLinks);
  assert.equal(isSafeKnowledgeLinkDestination(snapshot.knowledgeLinks[0]), true);
});

test("Knowledge Links reject unreviewed/demo and unsafe destinations", () => {
  const base = adaptPublicArticleToSnapshotV1(DEMO_ARTICLES[0]);
  const link = {
    id: "knowledge-link-test-02",
    targetType: "wikipedia" as const,
    targetUrl: "javascript:alert(1)",
    locale: "en" as const,
    previewTitle: "Unsafe destination",
    previewExcerpt: "Must be rejected.",
    sourceAttribution: "Test data only",
    reviewStatus: "suggested" as const,
    isSampleDemoData: true,
  };
  assert.equal(isSafeKnowledgeLinkDestination(link), false);
  const result = validatePublicationSnapshotV1({ ...base, knowledgeLinks: [link] });
  assert.ok(result.issues.some((issue) => issue.code === "UNREVIEWED_KNOWLEDGE_LINK"));
  assert.ok(result.issues.some((issue) => issue.code === "UNSAFE_KNOWLEDGE_DESTINATION"));
});

test("published HTML figures must bind the image URL to a rights-verified structured media record", () => {
  const base = adaptPublicArticleToSnapshotV1(DEMO_ARTICLES[0]);
  const figure = base.blocks.find((block) => block.type === "figure");
  assert.ok(figure && figure.type === "figure");
  const media = withTestRights(figure.media, "inline-figure");
  const valid = {
    ...base,
    status: "published" as const,
    hero: base.hero ? withTestRights(base.hero, "inline-hero") : undefined,
    blocks: base.blocks.map((block) => block.type === "figure" ? { ...block, media } : block),
    bodyHtml: `<figure data-media-id="${media.id}"><img src="${media.src}" alt="${media.alt}" /></figure>`,
  };
  const validResult = validatePublicationSnapshotV1(valid);
  assert.equal(validResult.valid, true, JSON.stringify(validResult.issues));

  const unbound = {
    ...valid,
    bodyHtml: `<figure data-media-id="unknown-media"><img src="${media.src}" alt="${media.alt}" /></figure>`,
  };
  const result = validatePublicationSnapshotV1(unbound);
  assert.ok(result.issues.some((issue) => issue.code === "UNBOUND_BODY_MEDIA"));
});

test("media validator rejects blob:, data:, javascript:, and untrusted external image origins", () => {
  assert.equal(isSafePublishedMediaUrl("/images/demo/spider-silk.svg"), true);
  assert.equal(
    isSafePublishedMediaUrl("blob:https://studio.scientificradar.com/abc-123"),
    false
  );
  assert.equal(
    isSafePublishedMediaUrl("data:image/svg+xml;base64,PHN2Zz48L3N2Zz4="),
    false
  );
  assert.equal(isSafePublishedMediaUrl("javascript:alert(1)"), false);
  assert.equal(
    isSafePublishedMediaUrl("https://untrusted.example.com/fig1.png"),
    false
  );
  assert.equal(
    isSafePublishedMediaUrl(
      "https://media.scientificradar.com/figures/fig1.webp",
      new Set(["https://media.scientificradar.com"])
    ),
    true
  );
});

test("contract validator flags broken citation references, synthetic demo DOIs, and unsupported Studio HTML nodes", () => {
  const base = adaptPublicArticleToSnapshotV1(DEMO_ARTICLES[0]);

  const brokenSnapshot = {
    ...base,
    sources: [
      {
        ...base.sources[0],
        isIllustrativeDemo: true,
        doi: "10.1038/fake-demo-doi",
      },
    ],
    bodyHtml:
      '<h2>Introduction</h2><p>Bad ref <sup data-citation-source-id="missing-src-99">[99]</sup></p><img src="blob:http://localhost/123" alt="bad">',
  };

  const validation = validatePublicationSnapshotV1(brokenSnapshot);
  assert.equal(validation.valid, false);
  const codes = new Set(validation.issues.map((i) => i.code));
  assert.ok(codes.has("SYNTHETIC_DEMO_DOI_FORBIDDEN"));
  assert.ok(codes.has("BROKEN_CITATION_REFERENCE"));
  assert.ok(codes.has("UNSUPPORTED_STUDIO_NODE"));
});

test("bodyHtml representation derives accurate TOC headings, KaTeX math, and citation back-links matching ArticleReader", () => {
  const sampleHtml = [
    "<h1>Demoted Inner Heading</h1>",
    '<p> Lead paragraph referencing spidroin <sup data-citation-source-id="silk-src-1">1</sup>.</p>',
    '<h2 id="custom-rheology-id">Nanoconfined Beta-Sheet Rheology</h2>',
    '<div data-math-tex="U_T = \\int_0^{\\varepsilon_f} \\sigma(\\varepsilon)\\,d\\varepsilon" data-math-display="block"></div>',
    "<h3>Sub-section on Hydrogen Bonding</h3>",
  ].join("");

  const prepared = prepareCanonicalBodyHtml(sampleHtml, {
    sources: DEMO_ARTICLES[0].sources,
  });

  // 1. Both H1 (demoted to H2) and explicit H2 appear in extracted TOC outline with valid IDs
  assert.equal(prepared.headings.length, 2);
  assert.equal(prepared.headings[0].id, "section-demoted-inner-heading");
  assert.equal(prepared.headings[0].text, "Demoted Inner Heading");
  assert.equal(prepared.headings[1].id, "custom-rheology-id");
  assert.equal(prepared.headings[1].text, "Nanoconfined Beta-Sheet Rheology");

  // 2. KaTeX math rendered with MathML and role="math"
  assert.match(prepared.html, /role="math"/);
  assert.match(prepared.html, /class="katex-mathml"/);

  // 3. Citation back-link wired to #ref-silk-src-1
  assert.match(prepared.html, /href="#ref-silk-src-1"/);
  assert.match(prepared.html, /id="cite-silk-src-1"/);

  // 4. Verify ArticleReader renders both desktop and mobile TOC when article uses bodyHtml with empty blocks
  const htmlOnlyArticle = {
    ...DEMO_ARTICLES[0],
    blocks: [],
    bodyHtml: sampleHtml,
  };
  const resolvedHeadings = resolveArticleHeadings(htmlOnlyArticle);
  assert.equal(resolvedHeadings.length, 2);

  const staticMarkup = renderToStaticMarkup(
    React.createElement(ArticleReader, {
      article: htmlOnlyArticle,
      authors: DEMO_AUTHORS.slice(0, 1),
    })
  );
  assert.ok(
    staticMarkup.includes('data-testid="responsive-toc"'),
    "ArticleReader must render responsive TOC for bodyHtml articles"
  );
  assert.ok(
    staticMarkup.includes("#custom-rheology-id"),
    "ArticleReader TOC must link to canonical bodyHtml H2 IDs"
  );
});
