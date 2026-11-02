import { expect, test } from "@playwright/test";
import {
  assertNoHorizontalOverflow,
  attachDiagnostics,
  collectDiagnostics,
  VIEWPORTS,
} from "./helpers";

test.describe("Group C: Reader-First Editorial Presentation", () => {
  for (const viewport of VIEWPORTS) {
    test(`homepage clean reader default on ${viewport.name} (${viewport.width}x${viewport.height})`, async ({
      page,
    }) => {
      const diagnostics = collectDiagnostics(page);
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });

      const response = await page.goto("/", { waitUntil: "networkidle" });
      expect(response?.status()).toBe(200);

      // 1. Verify development & review controls are hidden
      const heroSwitcher = page.getByRole("link", { name: "Standard Cover" });
      await expect(heroSwitcher).toBeHidden();

      const typoCallout = page.getByText("Typography & Measure Evaluation");
      await expect(typoCallout).toBeHidden();

      // 2. Exactly one semantic H1 element exists
      const h1Elements = page.locator("h1");
      await expect(h1Elements).toHaveCount(1);
      await expect(h1Elements).toHaveClass(/sr-only/);

      // 3. Editorial honest ranking terminology
      const editorsSelectionHeading = page.locator(
        "#editor-selection-heading",
      );
      await expect(editorsSelectionHeading).toBeVisible();
      await expect(editorsSelectionHeading).toHaveText("Editor’s Selection");

      // 4. Genuine demo disclosures intact
      const curatedOrderBadge = page.getByText("Curated Demo Order");
      await expect(curatedOrderBadge).toBeVisible();

      const svgNotice = page.getByText(
        "Same-Origin Licensed SVG Illustrations (CC0 Demo Archive)",
      );
      await expect(svgNotice).toBeVisible();

      await assertNoHorizontalOverflow(page, viewport.width);
      await attachDiagnostics(
        page,
        diagnostics,
        `homepage-clean-${viewport.name}-diagnostics.json`,
      );
    });
  }

  test("homepage ?designReview=1 reveals hero switcher and typography evaluation sidebar", async ({
    page,
  }) => {
    const diagnostics = collectDiagnostics(page);
    await page.setViewportSize({ width: 1440, height: 900 });

    const response = await page.goto("/?designReview=1", {
      waitUntil: "networkidle",
    });
    expect(response?.status()).toBe(200);

    // Hero switcher controls are visible
    const standardLink = page.getByRole("link", { name: "Standard Cover" });
    const compactLink = page.getByRole("link", { name: "Compact Cover" });
    await expect(standardLink).toBeVisible();
    await expect(compactLink).toBeVisible();

    // Typography evaluation sidebar is visible
    const typoHeading = page.getByText("Typography & Measure Evaluation");
    await expect(typoHeading).toBeVisible();

    // Exactly one H1 preserved
    const h1Elements = page.locator("h1");
    await expect(h1Elements).toHaveCount(1);
    await expect(h1Elements).toContainText("ScientificRadar");

    await attachDiagnostics(page, diagnostics);
  });

  test("homepage /?hero=standard renders Standard Cover without review controls", async ({
    page,
  }) => {
    const diagnostics = collectDiagnostics(page);
    await page.setViewportSize({ width: 1440, height: 900 });

    const response = await page.goto("/?hero=standard", {
      waitUntil: "networkidle",
    });
    expect(response?.status()).toBe(200);

    // Review controls remain hidden
    await expect(page.getByRole("link", { name: "Standard Cover" })).toBeHidden();
    await expect(page.getByText("Typography & Measure Evaluation")).toBeHidden();

    // Exactly one H1
    await expect(page.locator("h1")).toHaveCount(1);

    await attachDiagnostics(page, diagnostics);
  });

  test("homepage /?hero=standard&designReview=1 renders Standard Cover WITH review controls", async ({
    page,
  }) => {
    const diagnostics = collectDiagnostics(page);
    await page.setViewportSize({ width: 1440, height: 900 });

    const response = await page.goto("/?hero=standard&designReview=1", {
      waitUntil: "networkidle",
    });
    expect(response?.status()).toBe(200);

    // Review controls visible
    const standardLink = page.getByRole("link", { name: "Standard Cover" });
    await expect(standardLink).toBeVisible();
    // Standard link is highlighted active
    await expect(standardLink).toHaveClass(/bg-\[var\(--sr-accent\)\]/);

    await expect(page.getByText("Typography & Measure Evaluation")).toBeVisible();
    await expect(page.locator("h1")).toHaveCount(1);

    await attachDiagnostics(page, diagnostics);
  });

  test("homepage topic spotlight CTAs link transparently to valid category routes", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto("/", { waitUntil: "networkidle" });

    // Chemistry spotlight CTA
    const chemistryLink = page
      .locator("section[aria-labelledby='spotlight-life-heading'] div.flex:has(> span:text('Explore:'))")
      .getByRole("link", { name: "Chemistry" });
    await expect(chemistryLink).toHaveAttribute("href", "/topics/chemistry");

    // Biology spotlight CTA
    const biologyLink = page
      .locator("section[aria-labelledby='spotlight-life-heading'] div.flex:has(> span:text('Explore:'))")
      .getByRole("link", { name: "Biology" });
    await expect(biologyLink).toHaveAttribute("href", "/topics/biology");

    // Earth & Climate spotlight CTA
    const earthLink = page
      .locator("section[aria-labelledby='spotlight-earth-heading'] div.flex:has(> span:text('Explore:'))")
      .getByRole("link", { name: "Earth & Climate" });
    await expect(earthLink).toHaveAttribute("href", "/topics/earth-climate");

    // Physics spotlight CTA
    const physicsLink = page
      .locator("section[aria-labelledby='spotlight-earth-heading'] div.flex:has(> span:text('Explore:'))")
      .getByRole("link", { name: "Physics" });
    await expect(physicsLink).toHaveAttribute("href", "/topics/physics");

    // Click chemistry link and verify navigation
    await chemistryLink.click();
    await page.waitForURL("**/topics/chemistry");
    await expect(page.locator("h1")).toContainText("Chemistry");
  });

  test("article reader default visit hides reading-width comparator toolbar", async ({
    page,
  }) => {
    const diagnostics = collectDiagnostics(page);
    await page.setViewportSize({ width: 1440, height: 900 });

    await page.goto(
      "/article/spider-silk-hierarchical-protein-mechanics",
      { waitUntil: "networkidle" },
    );

    const comparatorBar = page.getByRole("group", {
      name: "Select article reading column width",
    });
    await expect(comparatorBar).toBeHidden();

    // Default reading measure container attribute is 700
    const container = page.locator("[data-reading-measure]");
    await expect(container).toHaveAttribute("data-reading-measure", "700");

    await attachDiagnostics(page, diagnostics);
  });

  test("article reader ?designReview=1 reveals reading-width comparator toolbar", async ({
    page,
  }) => {
    const diagnostics = collectDiagnostics(page);
    await page.setViewportSize({ width: 1440, height: 900 });

    await page.goto(
      "/article/spider-silk-hierarchical-protein-mechanics?designReview=1",
      { waitUntil: "networkidle" },
    );

    const comparatorBar = page.getByRole("group", {
      name: "Select article reading column width",
    });
    await expect(comparatorBar).toBeVisible();

    const label = page.locator('[data-testid="active-reading-measure-label"]');
    await expect(label).toHaveText("700px (Owner Default)");

    // Click 600px button
    const btn600 = page.getByRole("button", { name: "600px" });
    await btn600.click();

    // Verify container and label update
    const container = page.locator("[data-reading-measure]");
    await expect(container).toHaveAttribute("data-reading-measure", "600");
    await expect(label).toHaveText("600px (Comparison Variant)");

    // Click 560px button
    const btn560 = page.getByRole("button", { name: "560px" });
    await btn560.click();
    await expect(container).toHaveAttribute("data-reading-measure", "560");
    await expect(label).toHaveText("560px (Quanta Reference)");

    await attachDiagnostics(page, diagnostics);
  });

  test("article reader ?measure=600 and ?measure=560 query parameters apply styles directly", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });

    // Visit with ?measure=600 without review controls
    await page.goto(
      "/article/spider-silk-hierarchical-protein-mechanics?measure=600",
      { waitUntil: "networkidle" },
    );
    await expect(page.locator("[data-reading-measure]")).toHaveAttribute(
      "data-reading-measure",
      "600",
    );
    await expect(
      page.getByRole("group", { name: "Select article reading column width" }),
    ).toBeHidden();

    // Visit with ?measure=560 without review controls
    await page.goto(
      "/article/spider-silk-hierarchical-protein-mechanics?measure=560",
      { waitUntil: "networkidle" },
    );
    await expect(page.locator("[data-reading-measure]")).toHaveAttribute(
      "data-reading-measure",
      "560",
    );
    await expect(
      page.getByRole("group", { name: "Select article reading column width" }),
    ).toBeHidden();
  });
});
