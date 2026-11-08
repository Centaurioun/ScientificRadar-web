import test from "node:test";
import assert from "node:assert/strict";
import { shouldShowRelatedReadingControls } from "./related-reading";

test("Related Reading omits controls for an empty or single-card list", () => {
  assert.equal(shouldShowRelatedReadingControls(0, true), false);
  assert.equal(shouldShowRelatedReadingControls(1, true), false);
});

test("Related Reading shows controls for multiple cards only when the track overflows", () => {
  assert.equal(shouldShowRelatedReadingControls(2, false), false);
  assert.equal(shouldShowRelatedReadingControls(2, true), true);
  assert.equal(shouldShowRelatedReadingControls(3, false), false);
  assert.equal(shouldShowRelatedReadingControls(3, true), true);
});
