import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Loads DATABASE_URL / AUTH_SECRET / etc. so test-data seeding utilities (e2e/src/utils/db-client.ts)
// can talk to the same database as the `next dev` server started by webServer below.
dotenv.config({ path: '.env.local' });

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run dev',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
  },
});
