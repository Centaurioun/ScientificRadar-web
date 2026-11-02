import { expect, test } from "@playwright/test";

const articles = [
  "spider-silk-hierarchical-protein-mechanics",
  "respiratory-pigments-evolutionary-biochemistry",
];
const viewports = [
  { width: 1440, height: 900 },
  { width: 1024, height: 768 },
  { width: 768, height: 1024 },
  { width: 390, height: 844 },
  { width: 320, height: 700 },
];

test.describe("responsive scientific article content", () => {
  for (const slug of articles) {
    for (const viewport of viewports) {
      test(`${slug} fits ${viewport.width}x${viewport.height} without cropping figures`, async ({
        page,
      }) => {
        await page.setViewportSize(viewport);
        await page.goto(`/article/${slug}`, { waitUntil: "networkidle" });
        await page.evaluate(() => document.fonts.ready);

        const figures = page.locator("article figure");
        await expect(figures).not.toHaveCount(0);
        for (const figure of await figures.all()) {
          await figure.scrollIntoViewIfNeeded();
          await figure.locator("img").evaluate((image: HTMLImageElement) => image.decode());
        }

        const layout = await page.evaluate(() => {
          const figureData = Array.from(document.querySelectorAll("article figure")).map(
            (figure) => {
              const image = figure.querySelector("img");
              const caption = figure.querySelector("figcaption");
              const imageBox = image?.getBoundingClientRect();
              const frame = image?.parentElement;
              const frameBox = frame?.getBoundingClientRect();
              return {
                alt: image?.alt ?? "",
                naturalWidth: image?.naturalWidth ?? 0,
                naturalHeight: image?.naturalHeight ?? 0,
                renderedWidth: imageBox?.width ?? 0,
                renderedHeight: imageBox?.height ?? 0,
                frameWidth: frame?.clientWidth ?? 0,
                frameHeight: frame?.clientHeight ?? 0,
                frameRight: frameBox?.right ?? 0,
                figureRight: figure.getBoundingClientRect().right,
                caption: caption?.innerText ?? "",
                background: frame ? getComputedStyle(frame).backgroundColor : "",
              };
            }
          );
          const tableScroller = document.querySelector<HTMLElement>(
            "article div.overflow-x-auto:has(> table)"
          );
          return {
            documentWidth: document.documentElement.scrollWidth,
            viewportWidth: window.innerWidth,
            figureData,
            table: tableScroller
              ? {
                  clientWidth: tableScroller.clientWidth,
                  scrollWidth: tableScroller.scrollWidth,
                  right: tableScroller.getBoundingClientRect().right,
                  maxScrollLeft: tableScroller.scrollWidth - tableScroller.clientWidth,
                  overflowX: getComputedStyle(tableScroller).overflowX,
                }
              : null,
            mathCount: document.querySelectorAll(".katex").length,
            mathMlCount: document.querySelectorAll(".katex-mathml").length,
          };
        });

        expect(layout.documentWidth).toBeLessThanOrEqual(layout.viewportWidth);
        expect(layout.figureData.length).toBeGreaterThan(0);
        for (const figure of layout.figureData) {
          expect(figure.alt.trim().length).toBeGreaterThan(0);
          expect(figure.naturalWidth).toBeGreaterThan(0);
          expect(figure.naturalHeight).toBeGreaterThan(0);
          expect(figure.renderedWidth).toBeLessThanOrEqual(figure.frameWidth + 1);
          expect(figure.renderedHeight).toBeLessThanOrEqual(figure.frameHeight + 1);
          expect(Math.abs(figure.renderedWidth / figure.renderedHeight - figure.naturalWidth / figure.naturalHeight)).toBeLessThan(0.01);
          expect(figure.figureRight).toBeLessThanOrEqual(layout.viewportWidth + 1);
          expect(figure.caption).toContain("Credit:");
          expect(figure.background).toBe("rgb(16, 32, 40)");
        }
        expect(layout.table).not.toBeNull();
        expect(layout.table!.right).toBeLessThanOrEqual(layout.viewportWidth + 1);
        expect(layout.table!.scrollWidth).toBeGreaterThan(layout.table!.clientWidth);
        expect(layout.table!.maxScrollLeft).toBeGreaterThan(0);
        expect(layout.table!.overflowX).toBe("auto");
      });
    }
  }
});


test("tablet navigation keeps directory links available in the mobile menu", async ({
  page,
}) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto("/article/spider-silk-hierarchical-protein-mechanics", {
    waitUntil: "networkidle",
  });
  await page.getByRole("button", { name: "Open navigation menu" }).click();
  const menu = page.getByRole("dialog", {
    name: "ScientificRadar sections and search",
  });
  await expect(menu.getByRole("link", { name: "All Topics Directory" })).toBeVisible();
  await expect(menu.getByRole("link", { name: "About & Editorial Mission" })).toBeVisible();
});
