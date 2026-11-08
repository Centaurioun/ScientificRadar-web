import { expect, test } from "@playwright/test";

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
