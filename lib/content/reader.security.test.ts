import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ArticleReader from "../../components/editorial/ArticleReader";
import { DEMO_ARTICLES } from "./fixtures";

const trustedOrigin = "https://studio.example.test";
const mediaUrl = `${trustedOrigin}/media/revision-4/figure.webp`;

function renderReader(trustedImageOrigins?: string[]): string {
  const article = {
    ...DEMO_ARTICLES[0],
    bodyHtml: `<figure><img src="${mediaUrl}" alt="Verified scientific figure"></figure>`,
  };

  return renderToStaticMarkup(
    React.createElement(ArticleReader, {
      article,
      authors: [],
      trustedImageOrigins,
    })
  );
}

test("ArticleReader forwards only configured trusted origins to body sanitization", () => {
  const withoutConfiguredOrigin = renderReader();
  assert.doesNotMatch(withoutConfiguredOrigin, /media\/revision-4\/figure\.webp/);

  const configuredOrigin = renderReader([trustedOrigin]);
  assert.match(configuredOrigin, /src="https:\/\/studio\.example\.test\/media\/revision-4\/figure\.webp"/);
});
