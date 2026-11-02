import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ResponsiveArticleToc } from "../../components/editorial/ArticleReader";
import { ArticleBlock } from "./types";

test("ResponsiveArticleToc omits gracefully when headings array is empty", () => {
  const rendered = renderToStaticMarkup(
    React.createElement(ResponsiveArticleToc, {
      headings: [],
      sourceCount: 5,
    }),
  );
  assert.equal(rendered, "", "Component must return null and render empty string when no headings exist");
  assert.ok(!rendered.includes("responsive-toc"), "Must not render responsive-toc container");
});

test("ResponsiveArticleToc renders disclosure when headings are present", () => {
  const mockHeading: Extract<ArticleBlock, { type: "heading" }> = {
    type: "heading",
    id: "test-section-h2",
    level: 2,
    text: "Test Section Heading",
  };

  const rendered = renderToStaticMarkup(
    React.createElement(ResponsiveArticleToc, {
      headings: [mockHeading],
      sourceCount: 3,
    }),
  );

  assert.ok(rendered.includes('data-testid="responsive-toc"'), "Must render responsive-toc container");
  assert.ok(rendered.includes('data-testid="responsive-toc-trigger"'), "Must render trigger button");
  assert.ok(rendered.includes("In This Article"), "Must contain disclosure label");
  assert.ok(rendered.includes("#test-section-h2"), "Must contain link to heading anchor");
  assert.ok(rendered.includes("#references-heading"), "Must contain link to references anchor");
});

test("ResponsiveArticleToc omits references link when sourceCount is 0", () => {
  const mockHeading: Extract<ArticleBlock, { type: "heading" }> = {
    type: "heading",
    id: "test-section-h2",
    level: 2,
    text: "Test Section Heading",
  };

  const rendered = renderToStaticMarkup(
    React.createElement(ResponsiveArticleToc, {
      headings: [mockHeading],
      sourceCount: 0,
    }),
  );

  assert.ok(!rendered.includes("#references-heading"), "Must not render references link when sourceCount is 0");
});
