import { expect, test, type Page } from "@playwright/test";

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

type BrowserDiagnostics = {
  consoleErrors: Array<{ text: string; url: string }>;
  pageErrors: string[];
  httpFailures: Array<{ status: number; url: string }>;
  requestFailures: Array<{ error: string; url: string }>;
};

function collectDiagnostics(page: Page): BrowserDiagnostics {
  const diagnostics: BrowserDiagnostics = {
    consoleErrors: [],
    pageErrors: [],
    httpFailures: [],
    requestFailures: [],
  };

  page.on("console", (message) => {
    if (message.type() === "error") {
      diagnostics.consoleErrors.push({
        text: message.text(),
        url: message.location().url,
      });
    }
  });
  page.on("pageerror", (error) => diagnostics.pageErrors.push(error.message));
  page.on("response", (response) => {
    if (response.status() >= 400) {
      diagnostics.httpFailures.push({
        status: response.status(),
        url: response.url(),
      });
    }
  });
  page.on("requestfailed", (request) => {
    diagnostics.requestFailures.push({
      error: request.failure()?.errorText ?? "unknown request failure",
      url: request.url(),
    });
  });

  return diagnostics;
}

function isKnownFavicon404(url: string) {
  try {
    return new URL(url, "http://127.0.0.1").pathname === "/favicon.ico";
  } catch {
    return false;
  }
}

function isExpectedPrefetchAbort(failure: { error: string; url: string }) {
  return failure.error === "net::ERR_ABORTED" && failure.url.includes("_rsc=");
}

async function attachDiagnostics(page: Page, diagnostics: BrowserDiagnostics) {
  await test.info().attach("browser-diagnostics.json", {
    body: Buffer.from(JSON.stringify(diagnostics, null, 2)),
    contentType: "application/json",
  });

  expect(diagnostics.pageErrors).toEqual([]);
  expect(
    diagnostics.consoleErrors.filter((error) => !isKnownFavicon404(error.url)),
  ).toEqual([]);
  expect(
    diagnostics.httpFailures.filter((failure) => !isKnownFavicon404(failure.url)),
  ).toEqual([]);
  expect(
    diagnostics.requestFailures.filter(
      (failure) => !isExpectedPrefetchAbort(failure),
    ),
  ).toEqual([]);
}

test.describe("responsive scientific article content", () => {
  for (const slug of articles) {
    for (const viewport of viewports) {
      test(`${slug} fits ${viewport.width}x${viewport.height} after full-page scrolling`, async ({
        page,
      }) => {
        const diagnostics = collectDiagnostics(page);
        await page.setViewportSize(viewport);
        const response = await page.goto(`/article/${slug}`, {
          waitUntil: "networkidle",
        });
        expect(response?.status()).toBe(200);

        const fontState = await page.evaluate(async () => {
          await document.fonts.ready;
          return {
            loaded: document.fonts.status === "loaded",
            merriweather: document.fonts.check("16px Merriweather"),
            inter: document.fonts.check("16px Inter"),
            documentWidth: document.documentElement.scrollWidth,
          };
        });
        expect(fontState.loaded).toBe(true);
        expect(fontState.merriweather).toBe(true);
        expect(fontState.inter).toBe(true);
        expect(fontState.documentWidth).toBeLessThanOrEqual(viewport.width);

        const scan = await page.evaluate(async () => {
          const widthSamples: number[] = [];
          const step = Math.max(160, Math.floor(window.innerHeight * 0.75));
          const maxScrollY = document.documentElement.scrollHeight - window.innerHeight;

          for (let scrollY = 0; scrollY < maxScrollY; scrollY += step) {
            window.scrollTo(0, scrollY);
            await new Promise<void>((resolve) =>
              requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
            );
            widthSamples.push(document.documentElement.scrollWidth);
          }
          window.scrollTo(0, maxScrollY);
          await new Promise<void>((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
          );
          widthSamples.push(document.documentElement.scrollWidth);

          const imageStates = [];
          for (const image of Array.from(
            document.querySelectorAll<HTMLImageElement>("img"),
          )) {
            image.scrollIntoView({ block: "center" });
            try {
              await image.decode();
            } catch {
              // Preserve the failure state for the assertion and diagnostic attachment.
            }
            imageStates.push({
              alt: image.alt,
              complete: image.complete,
              naturalWidth: image.naturalWidth,
              naturalHeight: image.naturalHeight,
              src: image.currentSrc,
            });
            widthSamples.push(document.documentElement.scrollWidth);
          }
          window.scrollTo(0, 0);

          const figures = Array.from(document.querySelectorAll("article figure")).map(
            (figure) => {
              const image = figure.querySelector("img");
              const caption = figure.querySelector("figcaption");
              const imageBox = image?.getBoundingClientRect();
              const frame = image?.parentElement;
              const frameBox = frame?.getBoundingClientRect();
              const figureBox = figure.getBoundingClientRect();
              return {
                alt: image?.alt ?? "",
                naturalWidth: image?.naturalWidth ?? 0,
                naturalHeight: image?.naturalHeight ?? 0,
                renderedWidth: imageBox?.width ?? 0,
                renderedHeight: imageBox?.height ?? 0,
                frameWidth: frame?.clientWidth ?? 0,
                frameHeight: frame?.clientHeight ?? 0,
                figureLeft: figureBox.left,
                figureRight: figureBox.right,
                caption: caption?.innerText ?? "",
                captionVisible: Boolean(
                  caption && getComputedStyle(caption).visibility !== "hidden",
                ),
                background: frame ? getComputedStyle(frame).backgroundColor : "",
              };
            },
          );
          const tableContainers = Array.from(
            document.querySelectorAll<HTMLElement>(
              "article div.overflow-x-auto:has(> table)",
            ),
          ).map((table) => ({
            clientWidth: table.clientWidth,
            scrollWidth: table.scrollWidth,
            right: table.getBoundingClientRect().right,
            maxScrollLeft: table.scrollWidth - table.clientWidth,
            overflowX: getComputedStyle(table).overflowX,
          }));
          const relatedSection = document.querySelector(
            "section[aria-labelledby='related-reading-heading']",
          );
          const relatedCards = relatedSection
            ? Array.from(
                relatedSection.querySelectorAll<HTMLImageElement>("article img"),
              ).map((image) => ({
                  alt: image.alt,
                  complete: image.complete,
                  naturalWidth: image.naturalWidth,
                  src: image.currentSrc,
                }))
            : [];

          return {
            documentWidth: document.documentElement.scrollWidth,
            viewportWidth: window.innerWidth,
            widthSamples,
            imageStates,
            figures,
            tableContainers,
            rowFocusCount: document.querySelectorAll('[data-testid="table-row-focus-view"]').length,
            relatedCards,
            mathCount: document.querySelectorAll(".katex").length,
            mathMlCount: document.querySelectorAll(".katex-mathml").length,
          };
        });

        await test.info().attach("responsive-layout.json", {
          body: Buffer.from(JSON.stringify({ fontState, ...scan }, null, 2)),
          contentType: "application/json",
        });
        await attachDiagnostics(page, diagnostics);
        expect(scan.widthSamples.every((width) => width <= viewport.width)).toBe(true);
        expect(scan.documentWidth).toBeLessThanOrEqual(scan.viewportWidth);
        expect(scan.imageStates.length).toBeGreaterThan(0);
        expect(
          scan.imageStates.every(
            (image) => image.complete && image.naturalWidth > 0 && image.naturalHeight > 0,
          ),
        ).toBe(true);
        expect(scan.figures.length).toBeGreaterThan(0);
        for (const figure of scan.figures) {
          expect(figure.alt.trim().length).toBeGreaterThan(0);
          expect(figure.renderedWidth).toBeLessThanOrEqual(figure.frameWidth + 1);
          expect(figure.renderedHeight).toBeLessThanOrEqual(figure.frameHeight + 1);
          expect(
            Math.abs(
              figure.renderedWidth / figure.renderedHeight -
                figure.naturalWidth / figure.naturalHeight,
            ),
          ).toBeLessThan(0.01);
          expect(figure.figureLeft).toBeGreaterThanOrEqual(-1);
          expect(figure.figureRight).toBeLessThanOrEqual(viewport.width + 1);
          expect(figure.caption).toContain("Credit:");
          expect(figure.captionVisible).toBe(true);
          expect(figure.background).toBe("rgb(16, 32, 40)");
        }
        if (viewport.width < 700) {
          // The approved Framer prototype defaults to accessible row-focus on narrow screens.
          expect(scan.rowFocusCount).toBeGreaterThan(0);
        } else {
          expect(scan.tableContainers.length).toBeGreaterThan(0);
          for (const table of scan.tableContainers) {
            expect(table.right).toBeLessThanOrEqual(viewport.width + 1);
            expect(table.scrollWidth).toBeGreaterThan(table.clientWidth);
            expect(table.maxScrollLeft).toBeGreaterThan(0);
            expect(table.overflowX).toBe("auto");
          }
        }
        expect(scan.relatedCards.length).toBeGreaterThan(0);
        expect(
          scan.relatedCards.every((image) => image.complete && image.naturalWidth > 0),
        ).toBe(true);
        if (scan.mathCount > 0) {
          expect(scan.mathMlCount).toBeGreaterThan(0);
        }

        console.log(
          JSON.stringify({
            route: `/article/${slug}`,
            viewport: `${viewport.width}x${viewport.height}`,
            documentWidth: scan.documentWidth,
            fontState,
            figureCount: scan.figures.length,
            mathCount: scan.mathCount,
            mathMlCount: scan.mathMlCount,
            tableContainers: scan.tableContainers.map((table) => ({
              clientWidth: table.clientWidth,
              scrollWidth: table.scrollWidth,
              overflowX: table.overflowX,
            })),
            relatedImages: scan.relatedCards.map((image) => ({
              loaded: image.complete && image.naturalWidth > 0,
              naturalWidth: image.naturalWidth,
              src: image.src,
            })),
          }),
        );

        if (viewport.width === 768) {
          const masthead = page.locator("header .site-container > div").first();
          const mastheadBox = await masthead.boundingBox();
          expect((mastheadBox?.x ?? 0) + (mastheadBox?.width ?? 0)).toBeLessThanOrEqual(
            viewport.width + 1,
          );
        }
      });
    }
  }
});

test("tablet mobile navigation preserves destinations, search, Escape and focus", async ({
  page,
}) => {
  const diagnostics = collectDiagnostics(page);
  await page.setViewportSize({ width: 768, height: 1024 });
  const response = await page.goto(
    "/article/spider-silk-hierarchical-protein-mechanics",
    { waitUntil: "networkidle" },
  );
  expect(response?.status()).toBe(200);

  const trigger = page.getByRole("button", { name: "Open navigation menu" });
  await trigger.focus();
  await page.keyboard.press("Enter");
  const menu = page.getByRole("dialog", {
    name: "ScientificRadar sections and search",
  });
  await expect(menu).toBeVisible();
  await expect(page.getByRole("button", { name: "Close menu" })).toBeFocused();
  await expect(menu.getByRole("link", { name: "All Topics Directory" })).toHaveAttribute(
    "href",
    "/topics",
  );
  await expect(menu.getByRole("link", { name: "About & Editorial Mission" })).toHaveAttribute(
    "href",
    "/about",
  );
  const search = menu.getByRole("searchbox", { name: "Search articles" });
  await expect(search).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(search).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(trigger).toBeFocused();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
  ).toBe(true);

  await attachDiagnostics(page, diagnostics);
});
