import { Before, After, BeforeAll, AfterAll, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium, Browser, BrowserContext } from '@playwright/test';
import { ApiClient } from '../api/apiClient';
import { CustomWorld } from '../support/world';
import dotenv from 'dotenv';

dotenv.config();
export let apiClient: ApiClient;

setDefaultTimeout(90 * 1000);

let browser: Browser;

BeforeAll(async function () {
  const isHeadless = process.env.HEADLESS === 'true' || process.env.CI === 'true' || process.env.CI === '1';

  browser = await chromium.launch({
    headless: isHeadless,
    args: process.env.CI ? ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'] : undefined,
  });
});

Before(async function (this: CustomWorld) {
  this.browser = browser;

  const context: BrowserContext = await browser.newContext({
    recordVideo: process.env.RECORD_VIDEO === 'true' ? { dir: './videos' } : undefined,
    recordHar: process.env.RECORD_HAR === 'true' ? { path: './hars/recording.har' } : undefined,
  });

  this.context = context;
  this.page = await context.newPage();

  // ✅ IMPORTANT: initialize pages AFTER page is created
  await this.initializePages();


  // ✅ API client
  apiClient = new ApiClient();
  await apiClient.init();
});

After(async function (this: CustomWorld, { pickle, result }) {

  if (result?.status === 'FAILED' && this.page) {

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

    await this.page.screenshot({
      path: `./test-results/screenshots/${pickle.name}-${timestamp}.png`
    });

    // await this.context?.tracing.stop({
    //   path: `./test-results/traces/${pickle.name}-${timestamp}.zip`
    // });
  }

  await this.context?.close();
});

AfterAll(async function () {
  await browser?.close();
});