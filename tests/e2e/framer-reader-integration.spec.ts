import { expect, test } from "@playwright/test";

const slug = "/article/spider-silk-hierarchical-protein-mechanics";

test("figure inspector: zoom, regions, Escape and focus restoration on 390px", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(slug, { waitUntil: "networkidle" });

  const trigger = page.getByTestId("figure-inspect-trigger").first();
  await trigger.click();

  const inspector = page.getByRole("dialog", { name: /figure.*inspector/i });
  await expect(inspector).toBeVisible();
  await expect(inspector.getByText("100%", { exact: true })).toBeVisible();

  await inspector.getByRole("button", { name: "Zoom in" }).click();
  await expect(inspector.getByText("125%", { exact: true })).toBeVisible();

  const regions = inspector.getByRole("group", { name: "Jump to figure region" }).getByRole("button");
  await expect(regions).toHaveCount(3);
  await regions.last().click();
  await expect(regions.last()).toHaveAttribute("aria-pressed", "true");
  await expect(inspector.getByText("200%", { exact: true })).toBeVisible();

  await expect.poll(async () => inspector.getByLabel("Zoomable scientific figure").evaluate((el) => el.scrollLeft))
    .toBeGreaterThan(0);
  await page.keyboard.press("Escape");
  await expect(inspector).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test("citation hover previews without changing click-to-reference behaviour", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(slug, { waitUntil: "networkidle" });

  const citation = page.locator('[data-citation-source-id]').filter({ visible: true }).first();
  await citation.hover();
  const tooltip = page.getByTestId("citation-hover-preview");
  await expect(tooltip).toBeVisible();
  await expect(tooltip).toContainText(/Reference|Preview/);
  await page.mouse.move(0, 0);
  await expect(tooltip).toHaveCount(0);

  const id = await citation.getAttribute("data-citation-source-id");
  expect(id).toBeTruthy();
  await citation.scrollIntoViewIfNeeded();
  const beforeY = await page.evaluate(() => window.scrollY);
  await citation.click();

  const reference = page.locator("#ref-" + id);
  await expect(reference).toBeInViewport();
  const back = reference.locator('a[data-back-to-citation="true"]');
  await back.click();

  await expect(citation).toBeFocused();
  await expect.poll(async () => page.evaluate(() => window.scrollY)).toBeGreaterThanOrEqual(beforeY - 2);
  await expect.poll(async () => page.evaluate(() => window.scrollY)).toBeLessThanOrEqual(beforeY + 2);
});

for (const width of [390, 320]) {
  test("mobile scientific table uses row focus and preserves matrix at " + width + "px", async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(slug, { waitUntil: "networkidle" });
    const table = page.getByTestId("responsive-scientific-table").first();

    await expect(table.getByTestId("table-row-focus-view")).toBeVisible();
    const select = table.getByRole("combobox");
    const options = await select.locator("option").count();
    expect(options).toBeGreaterThan(1);
    await select.selectOption(String(options - 1));
    await expect(table.getByText("Row " + options + " of " + options)).toBeVisible();

    await table.getByRole("button", { name: "Data matrix" }).click();
    const matrix = table.getByTestId("table-matrix-view");
    await expect(matrix).toBeVisible();
    const region = matrix.getByRole("region");
    await expect(region).toHaveJSProperty("scrollWidth", await region.evaluate((el) => el.scrollWidth));
    const metrics = await region.evaluate((el) => ({
      width: el.clientWidth,
      scroll: el.scrollWidth,
    }));
    expect(metrics.scroll).toBeGreaterThan(metrics.width);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  });
}

test("equation inspector opens, closes on Escape and returns focus", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto(slug, { waitUntil: "networkidle" });
  const trigger = page.getByTestId("equation-inspect-trigger").first();
  await trigger.click();
  const inspector = page.getByRole("dialog", { name: /equation.*inspector/i });
  await expect(inspector).toBeVisible();
  await expect(inspector.getByRole("math")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(inspector).toHaveCount(0);
  await expect(trigger).toBeFocused();
});
