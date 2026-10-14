import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  timeout: 60_000,
  use: {
    baseURL: 'http://localhost:8081',
    viewport: { width: 1440, height: 1000 },
    headless: true,
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
      ? {
          executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
          args: ['--no-sandbox', '--no-zygote', '--disable-dev-shm-usage'],
        }
      : undefined,
  },
  webServer: {
    command: 'EXPO_OFFLINE=1 npm run web',
    url: 'http://localhost:8081',
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
