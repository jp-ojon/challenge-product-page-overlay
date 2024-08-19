import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import dotenv from 'dotenv';
dotenv.config();

// Mapping for the environments
const environments = {
  local: process.env.LOCAL_BASE_URL,
  network: process.env.NETWORK_BASE_URL,
  production: process.env.PRODUCTION_BASE_URL,
};

// Determine the current environment (default to 'local' if not set)
const currentEnv = process.env.ENVIRONMENT || 'local';

// Get the base URL for the current environment
const baseURL = environments[currentEnv];

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  timeout: 60000,
  expect: {
    timeout: 30000
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'on-failure' }] // Generate HTML report
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',
    baseURL: baseURL,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    //screenshot: 'only-on-failure',
    //video: 'retain-on-failure',
    headless: false,
    //viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    launchOptions: {
      //slowMo: 50, // Slow down by 500 milliseconds
    }
  },

  /* Configure projects for major browsers */
  projects: [
    // Desktop configuration (1920x1080) Chrome
    {
      name: 'Desktop chrome/chromium',
      use: { ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
       },
    },
    
    // Desktop configuration (1920x1080) Firefox
    {
      name: 'Desktop firefox',
      use: { ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1080 },
       },
    },
    // Desktop configuration (1920x1080) Safari
    {
      name: 'Desktop safari webkit',
      use: { ...devices['Desktop Safari'],
        viewport: { width: 1920, height: 1080 },
       },
    },
    // Mobile configuration (320x480 - Portrait)
    {
      name: 'Mobile Portrait',
      use: {...devices['iPhone SE'], // Optional use of built-in device descriptor, screen size match
        viewport: { width: 320, height: 480 }, //Override viewport size
        isMobile: true, 
      },
    },
    // Mobile configuration (480x320 - Landscape)
    {
      name: 'Mobile Landscape',
      use: {...devices['Pixel 5'], // Optional use of built-in device descriptor, screen size match
        viewport: { width: 480, height: 320 }, //Override viewport size
        isMobile: true, 
      },
    },
    // Tablet configuration (768x1024 - Portrait)
    {
      name: 'Tablet Portrait',
      use: {...devices['iPad (gen 7)'], // Optional use of built-in device descriptor, screen size match
        viewport: { width: 768, height: 1024 }, //Override viewport size
        isMobile: true, 
      },
    },
    // Tablet configuration (1024x768 - Landscape)
    {
      name: 'Tablet Landscape',
      use: {...devices['Galaxy Tab S7'], // Optional use of built-in device descriptor, screen size match
        viewport: { width: 1024, height: 768 }, //Override viewport size
        isMobile: true, 
      },
    },
    
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});

export { baseURL }; // Export baseURL for use in tests
