import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries:    process.env.CI ? 2 : 0,
  workers:    process.env.CI ? 1 : 2,

  reporter: [
    ['html',  { outputFolder: 'playwright-report', open: 'never' }],
    ['json',  { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['list'],
  ],

  use: {
    baseURL:           process.env.BASE_URL || 'https://eipnewfront.webtech888.com',
    locale:            'zh-TW',
    timezoneId:        'Asia/Taipei',
    trace:             'on-first-retry',
    screenshot:        'only-on-failure',
    video:             'retain-on-failure',
    actionTimeout:     10_000,
    navigationTimeout: 30_000,
  },

  projects: [
    { name: 'frontend-chromium', testMatch: '**/frontend/**/*.spec.ts', use: { ...devices['Desktop Chrome'] } },
    { name: 'frontend-firefox',  testMatch: '**/frontend/**/*.spec.ts', use: { ...devices['Desktop Firefox'] } },
    {
      name: 'backend-chromium',
      testMatch: '**/backend/**/*.spec.ts',
      use: { ...devices['Desktop Chrome'], baseURL: process.env.ADMIN_URL || 'https://eipnew.webtech888.com' },
    },
    { name: 'integration',   testMatch: '**/integration/**/*.spec.ts', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-ios',    testMatch: '**/app/**/*.spec.ts',          use: { ...devices['iPhone 14'] } },
    { name: 'mobile-android',testMatch: '**/app/**/*.spec.ts',          use: { ...devices['Pixel 7'] } },
  ],
});
