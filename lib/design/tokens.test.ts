import test from "node:test";
import assert from "node:assert/strict";
import { DESIGN_TOKENS, resolveHeroVariant } from "./tokens";

test("compact homepage cover is owner default and standard remains explicitly available", () => {
  assert.equal(resolveHeroVariant(undefined), "compact");
  assert.equal(resolveHeroVariant("unknown"), "compact");
  assert.equal(resolveHeroVariant("compact"), "compact");
  assert.equal(resolveHeroVariant("standard"), "standard");
});

test("approved paper color and editorial font tokens remain intact", () => {
  assert.equal(DESIGN_TOKENS.colors.paper, "#FAFAF8");
  assert.equal(DESIGN_TOKENS.typography.editorialFontVar, "var(--font-editorial)");
  assert.equal(DESIGN_TOKENS.typography.interfaceFontVar, "var(--font-interface)");
});
