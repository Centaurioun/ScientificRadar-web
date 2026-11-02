import test from "node:test";
import assert from "node:assert/strict";
import { renderScientificMath } from "./math";

test("general TeX fractions render into accessible KaTeX HTML", () => {
  const html = renderScientificMath("\\frac{a+b}{2}");
  assert.ok(html);
  assert.match(html, /class="katex-display"/);
  assert.match(html, /class="katex-mathml"/);
  assert.doesNotMatch(html, /\\frac/);
});

test("Greek symbols and superscripts render without handwritten substitutions", () => {
  const html = renderScientificMath("\\alpha^2 + \\beta^2 = \\gamma^2");
  assert.ok(html);
  assert.match(html, /katex-html/);
  assert.match(html, /α|&#x3b1;|&#945;/i);
});

test("invalid or excessive TeX returns null for escaped React fallback", () => {
  assert.equal(renderScientificMath("\\notarealcommand{a}"), null);
  assert.equal(renderScientificMath("x".repeat(5000)), null);
});
