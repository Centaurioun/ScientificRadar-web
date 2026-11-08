import { cpSync, existsSync, mkdirSync } from "node:fs";
import { spawn } from "node:child_process";

const standaloneDirectory = ".next/standalone";
const staticOutput = ".next/static";

if (!existsSync(`${standaloneDirectory}/server.js`)) {
  throw new Error("Production standalone server is missing. Run npm run build first.");
}

mkdirSync(`${standaloneDirectory}/.next`, { recursive: true });
cpSync(staticOutput, `${standaloneDirectory}/.next/static`, { recursive: true });
if (existsSync("public")) {
  cpSync("public", `${standaloneDirectory}/public`, { recursive: true });
}

const server = spawn(process.execPath, [`${standaloneDirectory}/server.js`, ...process.argv.slice(2)], {
  env: {
    ...process.env,
    HOSTNAME: process.env.HOSTNAME ?? "127.0.0.1",
    PORT: process.env.PORT ?? "3000",
  },
  stdio: "inherit",
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => server.kill(signal));
}

server.on("error", (error) => {
  console.error("Could not start the Next.js standalone server:", error);
  process.exitCode = 1;
});

server.on("exit", (code, signal) => {
  process.exitCode = code ?? (signal ? 1 : 0);
});
