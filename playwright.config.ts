import { defineConfig, devices } from '@playwright/test';

const baseURL = 'http://127.0.0.1:4321';
const chromiumPath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || '/snap/bin/chromium';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'reports/playwright' }]],
  use: {
    baseURL,
    locale: 'pt-BR',
    timezoneId: 'America/Sao_Paulo',
    colorScheme: 'light',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 4321',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    {
      name: 'chromium-desktop',
      use: {
        ...devices['Desktop Chrome'],
        browserName: 'chromium',
        viewport: { width: 1440, height: 1000 },
        launchOptions: {
          executablePath: chromiumPath,
          args: ['--no-sandbox', '--disable-dev-shm-usage'],
        },
      },
    },
    {
      name: 'firefox-desktop',
      use: {
        ...devices['Desktop Firefox'],
        browserName: 'firefox',
        viewport: { width: 1440, height: 1000 },
      },
    },
    {
      name: 'chromium-mobile',
      use: {
        ...devices['Pixel 7'],
        browserName: 'chromium',
        launchOptions: {
          executablePath: chromiumPath,
          args: ['--no-sandbox', '--disable-dev-shm-usage'],
        },
      },
    },
    {
      name: 'firefox-narrow',
      use: {
        ...devices['Desktop Firefox'],
        browserName: 'firefox',
        viewport: { width: 390, height: 844 },
      },
    },
  ],
});
