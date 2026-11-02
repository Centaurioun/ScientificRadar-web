import { defineConfig } from "@playwright/test";

const baseURL = "http://127.0.0.1:4387";
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 2,
  reporter: [
    ["list"],
    ["junit", { outputFile: "/tmp/scirad-responsive-playwright-results/junit.xml" }],
  ],
  outputDir: "/tmp/scirad-responsive-playwright-results",
  use: {
    baseURL,
    browserName: "chromium",
    launchOptions: executablePath ? { executablePath } : {},
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    video: "retain-on-failure",
  },
  webServer: {
    command: "node scripts/serve-standalone-for-playwright.mjs",
    url: `${baseURL}/`,
    reuseExistingServer: false,
    env: { HOSTNAME: "127.0.0.1", PORT: "4387" },
    timeout: 60_000,
  },
});
