import { expect, test } from "@playwright/test";
import {
  assertNoHorizontalOverflow,
  attachDiagnostics,
  collectDiagnostics,
  VIEWPORTS,
} from "./helpers";

const ARTICLE_ROUTES = [
  "/article/spider-silk-hierarchical-protein-mechanics",
  "/article/respiratory-pigments-evolutionary-biochemistry",
];

test.describe("Group B: Responsive Article Table of Contents", () => {
  for (const route of ARTICLE_ROUTES) {
    const slug = route.split("/").pop();

    test.describe(`${slug} - Breakpoint Parity & Placement`, () => {
      for (const viewport of VIEWPORTS) {
        test(`visibility and layout on ${viewport.name} (${viewport.width}x${viewport.height})`, async ({
          page,
        }) => {
          const diagnostics = collectDiagnostics(page);
          await page.setViewportSize({
            width: viewport.width,
            height: viewport.height,
          });
          const response = await page.goto(route, { waitUntil: "networkidle" });
          expect(response?.status()).toBe(200);

          const responsiveToc = page.locator('[data-testid="responsive-toc"]');
          const desktopRail = page.locator(
            'aside[aria-label="Article outline and metadata"]',
          );
          const proseContainer = page.locator(
            '[data-testid="article-prose-container"]',
          );

          if (viewport.width >= 1280) {
            // Desktop >= 1280px (e.g. 1440x900)
            await expect(responsiveToc).toBeHidden();
            await expect(desktopRail).toBeVisible();
          } else {
            // Below xl (< 1280px, e.g. 1024, 768, 390, 320)
            await expect(responsiveToc).toBeVisible();
            await expect(desktopRail).toBeHidden();

            // Verify DOM Placement: responsive TOC appears before prose container
            const isPositionedBefore = await page.evaluate(() => {
              const toc = document.querySelector(
                '[data-testid="responsive-toc"]',
              );
              const prose = document.querySelector(
                '[data-testid="article-prose-container"]',
              );
              if (!toc || !prose) return false;
              return Boolean(
                toc.compareDocumentPosition(prose) &
                  Node.DOCUMENT_POSITION_FOLLOWING,
              );
            });
            expect(isPositionedBefore).toBe(true);
          }

          // Semantic Checks: exactly one h1 and no duplicate IDs
          const h1Count = await page.locator("h1").count();
          expect(h1Count).toBe(1);

          const duplicateIds = await page.evaluate(() => {
            const elements = Array.from(
              document.querySelectorAll(
                "h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]",
              ),
            );
            const seen = new Set<string>();
            const duplicates = new Set<string>();
            for (const el of elements) {
              if (seen.has(el.id)) {
                duplicates.add(el.id);
              } else {
                seen.add(el.id);
              }
            }
            return Array.from(duplicates);
          });
          expect(duplicateIds).toEqual([]);

          await assertNoHorizontalOverflow(page, viewport.width);
          await attachDiagnostics(
            page,
            diagnostics,
            `toc-parity-${slug}-${viewport.name}-diagnostics.json`,
          );
        });
      }
    });
  }

  test.describe("TOC Disclosure Interaction & Keyboard Navigation", () => {
    test.beforeEach(async ({ page }) => {
      // Test interaction at mobile viewport
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(
        "/article/spider-silk-hierarchical-protein-mechanics",
        { waitUntil: "networkidle" },
      );
    });

    test("disclosure trigger toggles aria-expanded and panel visibility via click", async ({
      page,
    }) => {
      const trigger = page.locator('[data-testid="responsive-toc-trigger"]');
      const panel = page.locator('[data-testid="responsive-toc-panel"]');

      // Initial state: collapsed
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
      await expect(panel).toBeHidden();

      // Click to open
      await trigger.click();
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
      await expect(panel).toBeVisible();

      // Click to close
      await trigger.click();
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
      await expect(panel).toBeHidden();
    });

    test("disclosure trigger toggles via Enter key and Space key", async ({
      page,
    }) => {
      const trigger = page.locator('[data-testid="responsive-toc-trigger"]');
      const panel = page.locator('[data-testid="responsive-toc-panel"]');

      await trigger.focus();
      await expect(trigger).toBeFocused();

      // Press Enter to open
      await page.keyboard.press("Enter");
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
      await expect(panel).toBeVisible();

      // Press Enter to close
      await page.keyboard.press("Enter");
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
      await expect(panel).toBeHidden();

      // Press Space to open
      await page.keyboard.press("Space");
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
      await expect(panel).toBeVisible();

      // Press Space to close
      await page.keyboard.press("Space");
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
      await expect(panel).toBeHidden();
    });

    test("Escape key closes open disclosure and restores focus to trigger button", async ({
      page,
    }) => {
      const trigger = page.locator('[data-testid="responsive-toc-trigger"]');
      const panel = page.locator('[data-testid="responsive-toc-panel"]');

      // 1. Trigger has focus, user presses Enter to open, then Escape
      await trigger.focus();
      await page.keyboard.press("Enter");
      await expect(panel).toBeVisible();

      await page.keyboard.press("Escape");
      await expect(panel).toBeHidden();
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
      await expect(trigger).toBeFocused();

      // 2. Focus moved inside panel (on an anchor link), user presses Escape
      await trigger.click();
      await expect(panel).toBeVisible();

      const firstLink = panel.locator("a").first();
      await firstLink.focus();
      await expect(firstLink).toBeFocused();

      await page.keyboard.press("Escape");
      await expect(panel).toBeHidden();
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
      await expect(trigger).toBeFocused();
    });

    test("clicking section anchor scrolls to heading and closes disclosure without focus trap", async ({
      page,
    }) => {
      const trigger = page.locator('[data-testid="responsive-toc-trigger"]');
      const panel = page.locator('[data-testid="responsive-toc-panel"]');

      await trigger.click();
      await expect(panel).toBeVisible();

      const sectionLink = panel.locator('a[href="#silk-h2-nanocrystals"]');
      await expect(sectionLink).toBeVisible();
      await sectionLink.click();

      // Disclosure should be closed
      await expect(panel).toBeHidden();
      await expect(trigger).toHaveAttribute("aria-expanded", "false");

      // Target heading is in viewport
      const targetHeading = page.locator("#silk-h2-nanocrystals");
      await expect(targetHeading).toBeInViewport();
    });

    test("clicking references anchor scrolls to sources list and closes disclosure", async ({
      page,
    }) => {
      const trigger = page.locator('[data-testid="responsive-toc-trigger"]');
      const panel = page.locator('[data-testid="responsive-toc-panel"]');

      await trigger.click();
      await expect(panel).toBeVisible();

      const refLink = panel.locator('a[href="#references-heading"]');
      await expect(refLink).toBeVisible();
      await refLink.click();

      // Disclosure should be closed
      await expect(panel).toBeHidden();
      await expect(trigger).toHaveAttribute("aria-expanded", "false");

      // References heading is in viewport
      const refHeading = page.locator("#references-heading");
      await expect(refHeading).toBeInViewport();
    });

    test("TOC contents wrap cleanly and cause no horizontal overflow at 320x700 mobile stress", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 320, height: 700 });
      await page.goto(
        "/article/spider-silk-hierarchical-protein-mechanics",
        { waitUntil: "networkidle" },
      );

      const trigger = page.locator('[data-testid="responsive-toc-trigger"]');
      const panel = page.locator('[data-testid="responsive-toc-panel"]');

      await trigger.click();
      await expect(panel).toBeVisible();

      // Assert no horizontal scrollbar when TOC is open at 320px
      await assertNoHorizontalOverflow(page, 320);
    });
  });
});
