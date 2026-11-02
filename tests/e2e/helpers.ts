import { expect, type Page, test } from "@playwright/test";

export const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 1024, height: 768 },
  { name: "narrow-tablet", width: 768, height: 1024 },
  { name: "mobile", width: 390, height: 844 },
  { name: "mobile-stress", width: 320, height: 700 },
] as const;

export type ViewportConfig = (typeof VIEWPORTS)[number];

export type BrowserDiagnostics = {
  consoleErrors: Array<{ text: string; url: string }>;
  pageErrors: string[];
  httpFailures: Array<{ status: number; url: string }>;
  requestFailures: Array<{ error: string; url: string }>;
};

export function collectDiagnostics(page: Page): BrowserDiagnostics {
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

export async function attachDiagnostics(
  page: Page,
  diagnostics: BrowserDiagnostics,
  artifactName = "browser-diagnostics.json",
) {
  await test.info().attach(artifactName, {
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

export async function assertNoHorizontalOverflow(
  page: Page,
  expectedWidth: number,
) {
  const scrollState = await page.evaluate(() => {
    const docEl = document.documentElement;
    const body = document.body;
    const htmlOverflowX = window.getComputedStyle(docEl).overflowX;
    const bodyOverflowX = window.getComputedStyle(body).overflowX;

    return {
      scrollWidth: docEl.scrollWidth,
      clientWidth: docEl.clientWidth,
      innerWidth: window.innerWidth,
      htmlOverflowX,
      bodyOverflowX,
    };
  });

  expect(scrollState.scrollWidth).toBeLessThanOrEqual(expectedWidth);
  expect(scrollState.scrollWidth).toBeLessThanOrEqual(scrollState.innerWidth);
  // Guarantee no global overflow-x: hidden concealment
  expect(scrollState.htmlOverflowX).not.toBe("hidden");
  expect(scrollState.bodyOverflowX).not.toBe("hidden");
}
