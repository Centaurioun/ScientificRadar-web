import { expect, test } from "@playwright/test";
import {
  assertNoHorizontalOverflow,
  attachDiagnostics,
  collectDiagnostics,
  VIEWPORTS,
} from "./helpers";

const QUERY_100_CHARS =
  "nonexistent_xenobiology_99999_poly_alanine_nanocrystal_shear_dissipation_hydrothermal_100_character_ln";
const QUERY_300_CHARS =
  "unbroken_scientific_token_nonexistent_xenobiology_long_unbroken_alphanumeric_sequence_for_stress_testing_narrow_viewport_word_wrap_strategy_preventing_horizontal_page_overflow_and_document_scrollbars_at_320px_mobile_device_screen_dimensions_with_strict_editorial_typography_and_math_integrity_verification_1234567890";

const TURKISH_QUERY_MATCHING = "İsmetpaşa";
const TURKISH_QUERY_EMPTY = "ışğüöç_İŞĞÜÖÇ_öğrenme_araştırması";

test.describe("Group A: Responsive Search Overflow & Character Integrity", () => {
  for (const viewport of VIEWPORTS) {
    test.describe(`${viewport.name} (${viewport.width}x${viewport.height})`, () => {
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize({
          width: viewport.width,
          height: viewport.height,
        });
      });

      test("unmatched 100-character unbroken query wraps cleanly without horizontal overflow", async ({
        page,
      }) => {
        const diagnostics = collectDiagnostics(page);
        const response = await page.goto(
          `/search?q=${encodeURIComponent(QUERY_100_CHARS)}`,
          { waitUntil: "networkidle" },
        );
        expect(response?.status()).toBe(200);

        const emptyState = page.locator('[data-testid="search-empty-state"]');
        await expect(emptyState).toBeVisible();

        const emptyHeading = emptyState.locator("h3");
        await expect(emptyHeading).toBeVisible();
        await expect(emptyHeading).toContainText(QUERY_100_CHARS);

        const headingBox = await emptyHeading.boundingBox();
        expect(headingBox).not.toBeNull();
        expect(headingBox!.width).toBeLessThanOrEqual(viewport.width);

        await assertNoHorizontalOverflow(page, viewport.width);
        await attachDiagnostics(
          page,
          diagnostics,
          `search-100char-${viewport.name}-diagnostics.json`,
        );
      });

      test("unmatched 300-character unbroken query wraps without page overflow", async ({
        page,
      }) => {
        const diagnostics = collectDiagnostics(page);
        const response = await page.goto(
          `/search?q=${encodeURIComponent(QUERY_300_CHARS)}`,
          { waitUntil: "networkidle" },
        );
        expect(response?.status()).toBe(200);

        const emptyState = page.locator('[data-testid="search-empty-state"]');
        await expect(emptyState).toBeVisible();

        const emptyHeading = emptyState.locator("h3");
        await expect(emptyHeading).toBeVisible();
        await expect(emptyHeading).toContainText(QUERY_300_CHARS);

        const headingBox = await emptyHeading.boundingBox();
        expect(headingBox).not.toBeNull();
        expect(headingBox!.width).toBeLessThanOrEqual(viewport.width);

        await assertNoHorizontalOverflow(page, viewport.width);
        await attachDiagnostics(
          page,
          diagnostics,
          `search-300char-${viewport.name}-diagnostics.json`,
        );
      });

      test("matching search query wraps results heading and displays story cards", async ({
        page,
      }) => {
        const diagnostics = collectDiagnostics(page);
        const response = await page.goto("/search?q=spider", {
          waitUntil: "networkidle",
        });
        expect(response?.status()).toBe(200);

        const resultsHeading = page.locator("h2.font-editorial");
        await expect(resultsHeading).toBeVisible();
        await expect(resultsHeading).toContainText("Search results for “spider”");

        const countBadge = page.locator('[data-testid="search-results-count"]');
        await expect(countBadge).toBeVisible();
        await expect(countBadge).toContainText("found");

        const headingBox = await resultsHeading.boundingBox();
        expect(headingBox).not.toBeNull();
        expect(headingBox!.width).toBeLessThanOrEqual(viewport.width);

        await assertNoHorizontalOverflow(page, viewport.width);
        await attachDiagnostics(
          page,
          diagnostics,
          `search-results-${viewport.name}-diagnostics.json`,
        );
      });

      test("Turkish character query with diacritics returns correct article without overflow", async ({
        page,
      }) => {
        const diagnostics = collectDiagnostics(page);
        const response = await page.goto(
          `/search?q=${encodeURIComponent(TURKISH_QUERY_MATCHING)}`,
          { waitUntil: "networkidle" },
        );
        expect(response?.status()).toBe(200);

        const resultsHeading = page.locator("h2.font-editorial");
        await expect(resultsHeading).toBeVisible();
        await expect(resultsHeading).toContainText(
          `Search results for “${TURKISH_QUERY_MATCHING}”`,
        );

        // Verify it matches the North Anatolian Fault article (Turkish title: Kuzey Anadolu Fay)
        const articleLink = page.getByRole("link", {
          name: /Kuzey Anadolu Fay/i,
        });
        await expect(articleLink.first()).toBeVisible();

        await assertNoHorizontalOverflow(page, viewport.width);
        await attachDiagnostics(
          page,
          diagnostics,
          `search-turkish-${viewport.name}-diagnostics.json`,
        );
      });

      test("Turkish special characters empty query renders cleanly without distortion", async ({
        page,
      }) => {
        const diagnostics = collectDiagnostics(page);
        const response = await page.goto(
          `/search?q=${encodeURIComponent(TURKISH_QUERY_EMPTY)}`,
          { waitUntil: "networkidle" },
        );
        expect(response?.status()).toBe(200);

        const emptyHeading = page.locator(
          '[data-testid="search-empty-state"] h3',
        );
        await expect(emptyHeading).toBeVisible();
        await expect(emptyHeading).toContainText(TURKISH_QUERY_EMPTY);

        await assertNoHorizontalOverflow(page, viewport.width);
        await attachDiagnostics(
          page,
          diagnostics,
          `search-turkish-empty-${viewport.name}-diagnostics.json`,
        );
      });
    });
  }

  test("search input form submission and reset filters function properly with keyboard", async ({
    page,
  }) => {
    const diagnostics = collectDiagnostics(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/search", { waitUntil: "networkidle" });

    const input = page.locator("#main-search-input");
    await expect(input).toBeVisible();
    await input.focus();
    await input.fill("spider silk");
    await page.keyboard.press("Enter");

    await page.waitForURL("**/search?q=spider+silk*");
    const countBadge = page.locator('[data-testid="search-results-count"]');
    await expect(countBadge).toBeVisible();

    // Check suggested query navigation
    const sampleTermLink = page.getByRole("link", { name: "İsmetpaşa" });
    await expect(sampleTermLink).toBeVisible();
    await sampleTermLink.click();
    await page.waitForURL("**/search?q=%C4%B0smetpa%C5%9Fa*");

    // Check reset search filter
    await page.goto("/search?q=nonexistent_xyz", { waitUntil: "networkidle" });
    const resetButton = page.getByRole("link", { name: "Reset Search Filter" });
    await expect(resetButton).toBeVisible();
    await resetButton.click();
    await page.waitForURL("**/search");

    await attachDiagnostics(page, diagnostics);
  });
});
