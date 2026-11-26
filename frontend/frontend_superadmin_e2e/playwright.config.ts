import path from 'path';
import { defineConfig, devices } from '@playwright/test';

/**
 * Superadmin frontend E2E configuration.
 * Configured with channel: 'chrome' to support the local Windows environment.
 */
export default defineConfig({
  testDir: '.',
  testMatch: '**/*.spec.ts',
  timeout: 60 * 1000,
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : 2,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:3000',
    channel: 'chrome',
    storageState: path.join(__dirname, 'storageState.json'),
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    ...devices['Desktop Chrome'],
  },
  webServer: {
    command: 'npm run start',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: true,
    timeout: 120 * 1000,
  },
});
