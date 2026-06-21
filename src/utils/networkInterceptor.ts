/**
 * Network Interception Helper
 * Useful for multi-browser context and advanced network handling
 */

import { BrowserContext, Page } from '@playwright/test';

export class NetworkInterceptor {
  private context: BrowserContext;

  constructor(context: BrowserContext) {
    this.context = context;
  }

  async interceptNetworkRequests(
    urlPattern: RegExp | string,
    responseHandler: (url: string) => unknown
  ): Promise<void> {
    const pages = this.context.pages();
    for (const page of pages) {
      await page.route(urlPattern, (route) => {
        const url = route.request().url();
        responseHandler(url);
        void route.abort();
      });
    }
  }

  async allowNetworkRequests(urlPattern: RegExp | string): Promise<void> {
    const pages = this.context.pages();
    for (const page of pages) {
      await page.unroute(urlPattern);
    }
  }

  async recordNetworkActivity(page: Page): Promise<void> {
    const requestsLog: Array<{ url: string; method: string; headers: Record<string, string> }> = [];

    page.on('request', (request) => {
      requestsLog.push({
        url: request.url(),
        method: request.method(),
        headers: request.headers(),
      });
    });
  }

  async mockApiResponse(
    page: Page,
    urlPattern: RegExp | string,
    responseData: unknown
  ): Promise<void> {
    await page.route(urlPattern, (route) => {
      void route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(responseData),
      });
    });
  }
}

