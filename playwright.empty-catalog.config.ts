import { defineConfig } from "@playwright/test";

const baseURL = "http://127.0.0.1:4388";
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;

export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: "empty-published-catalog.spec.ts",
  fullyParallel: false,
  workers: 1,
  reporter: [
    ["list"],
    ["junit", { outputFile: "/tmp/scirad-empty-catalog-results/junit.xml" }],
  ],
  outputDir: "/tmp/scirad-empty-catalog-results",
  use: {
    baseURL,
    browserName: "chromium",
    launchOptions: executablePath ? { executablePath } : {},
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    video: "retain-on-failure",
  },
  webServer: {
    command: "node scripts/start-standalone.mjs",
    url: `${baseURL}/`,
    reuseExistingServer: false,
    env: {
      HOSTNAME: "127.0.0.1",
      PORT: "4388",
      SCIRAD_CONTENT_ADAPTER: "published-snapshots",
      SCIRAD_RUNTIME_MODE: "stage-a-demo",
    },
    timeout: 60_000,
  },
});
