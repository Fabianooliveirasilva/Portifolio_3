import { defineConfig, devices } from '@playwright/test';

const STATIC = 'http://localhost:4321';
const API = 'http://localhost:4322';
const LIMITED = 'http://localhost:4323';
const dry = { CONTACT_DRY_RUN: 'true' };

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['line'], ['html', { open: 'never' }]] : 'list',
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.01 } },
  use: { baseURL: STATIC, trace: 'on-first-retry' },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /e2e\/(navigation|security|responsive)|a11y|perf/,
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      testMatch: /e2e\/(navigation|security)/,
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      testMatch: /e2e\/(navigation|security)/,
    },
    {
      name: 'form',
      use: { ...devices['Desktop Chrome'], baseURL: API },
      testMatch: /e2e\/contact\.spec/,
    },
    {
      name: 'form-limit',
      use: { baseURL: LIMITED },
      testMatch: /e2e\/rate-limit\.spec/,
    },
    {
      name: 'visual',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /visual/,
    },
    { name: 'unit', testMatch: /unit\/.*\.spec/, use: {} },
  ],
  webServer: [
    {
      command: 'npm run serve',
      url: STATIC,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'npx astro dev --port 4322 --ignore-lock',
      url: API,
      env: { ...dry, CONTACT_RATE_LIMIT: '1000' },
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      command: 'npx astro dev --port 4323 --ignore-lock',
      url: LIMITED,
      env: { ...dry, CONTACT_RATE_LIMIT: '3' },
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
});
