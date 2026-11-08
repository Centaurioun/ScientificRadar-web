import { expect, test } from "@playwright/test";

const articleUrl = "/article/spider-silk-hierarchical-protein-mechanics";

for (const width of [320, 390, 810, 1200, 1280]) {
  test(`Related Reading shows the intended card count at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(articleUrl, { waitUntil: "networkidle" });

    const section = page.getByRole("region", { name: "Related Reading" });
    const track = section.getByTestId("related-reading-track");
    const slides = track.locator("[data-related-slide]");
    await expect(section.getByRole("heading", { name: "Related Reading" })).toBeVisible();
    await expect(slides).toHaveCount(3);
    await expect(track).toHaveAttribute("tabindex", "0");

    const widths = await track.evaluate((element) => {
      const trackWidth = element.clientWidth;
      const first = element.querySelector<HTMLElement>("[data-related-slide]");
      return { trackWidth, slideWidth: first?.getBoundingClientRect().width ?? 0 };
    });
    const ratio = widths.slideWidth / widths.trackWidth;

    if (width < 640) {
      expect(ratio).toBeGreaterThan(0.75);
      expect(ratio).toBeLessThan(1);
    } else if (width < 1024) {
      expect(ratio).toBeGreaterThan(0.45);
      expect(ratio).toBeLessThan(0.55);
    } else {
      expect(ratio).toBeGreaterThan(0.30);
      expect(ratio).toBeLessThan(0.36);
    }

    if (width >= 1200) {
      await expect(track).toHaveJSProperty("scrollWidth", await track.evaluate((element) => element.clientWidth));
      await expect(section.getByRole("button", { name: "Previous related stories" })).toBeDisabled();
      await expect(section.getByRole("button", { name: "Next related stories" })).toBeDisabled();
    }

    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  });
}

test("Related Reading controls advance and return one card without autoplay", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(articleUrl, { waitUntil: "networkidle" });

  const section = page.getByRole("region", { name: "Related Reading" });
  const track = section.getByTestId("related-reading-track");
  const previous = section.getByRole("button", { name: "Previous related stories" });
  const next = section.getByRole("button", { name: "Next related stories" });
  const startingLeft = await track.evaluate((element) => element.scrollLeft);

  await expect(previous).toBeDisabled();
  await expect(next).toBeEnabled();
  await next.focus();
  await expect(next).toBeFocused();
  await page.keyboard.press("Enter");
  await expect.poll(() => track.evaluate((element) => element.scrollLeft)).toBeGreaterThan(startingLeft + 10);
  await expect(previous).toBeEnabled();

  const advancedLeft = await track.evaluate((element) => element.scrollLeft);
  await previous.focus();
  await page.keyboard.press("Enter");
  await expect.poll(() => track.evaluate((element) => element.scrollLeft)).toBeLessThan(advancedLeft - 10);
  await expect.poll(() => track.evaluate((element) => element.scrollLeft)).toBeLessThanOrEqual(startingLeft + 2);

  await page.waitForTimeout(1200);
  await expect.poll(() => track.evaluate((element) => element.scrollLeft)).toBeLessThanOrEqual(startingLeft + 2);
});

test("Related Reading controls and track support visible keyboard focus and native arrow scrolling", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(articleUrl, { waitUntil: "networkidle" });

  const section = page.getByRole("region", { name: "Related Reading" });
  const track = section.getByTestId("related-reading-track");
  const next = section.getByRole("button", { name: "Next related stories" });

  await next.focus();
  await page.keyboard.press("Tab");
  await expect(track).toBeFocused();
  await expect.poll(() => track.evaluate((element) => getComputedStyle(element).outlineStyle)).toBe("solid");

  await page.keyboard.press("Shift+Tab");
  await expect(next).toBeFocused();
  await expect.poll(() => next.evaluate((element) => getComputedStyle(element).outlineStyle)).toBe("solid");

  const startingLeft = await track.evaluate((element) => element.scrollLeft);
  await track.focus();
  await page.keyboard.press("ArrowRight");
  await expect.poll(() => track.evaluate((element) => element.scrollLeft)).toBeGreaterThan(startingLeft);
});

test("Related Reading respects reduced-motion preference", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(articleUrl, { waitUntil: "networkidle" });

  const section = page.getByRole("region", { name: "Related Reading" });
  const track = section.getByTestId("related-reading-track");
  const next = section.getByRole("button", { name: "Next related stories" });
  await next.click();
  await expect.poll(() => track.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
});
