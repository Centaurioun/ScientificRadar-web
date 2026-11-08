import { expect, test } from "@playwright/test";

test.skip(
  process.env.PLAYWRIGHT_EMPTY_CATALOG !== "true",
  "Run with playwright.empty-catalog.config.ts to start the app with an unavailable published-snapshot adapter."
);

test("homepage renders a safe empty state when no published articles are available", async ({ page }) => {
  const response = await page.goto("/");

  expect(response?.status()).toBe(200);
  await expect(
    page.getByRole("heading", { name: "No published articles are available yet." })
  ).toBeVisible();
  await expect(
    page.getByText("Spider silk's hidden architecture", { exact: false })
  ).toHaveCount(0);
  await expect(page.locator('a[href^="/article/"]')).toHaveCount(0);
});
