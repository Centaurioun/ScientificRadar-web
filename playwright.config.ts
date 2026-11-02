import { defineConfig } from "@playwright/test";

const baseURL = "http://127.0.0.1:4387";
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 2,
  reporter: "list",
  outputDir: "/tmp/scirad-responsive-playwright-results",
  use: {
    baseURL,
    browserName: "chromium",
    launchOptions: executablePath ? { executablePath } : {},
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npm run start -- --hostname 127.0.0.1 --port 4387",
    url: `${baseURL}/`,
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
