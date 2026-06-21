/**
 * Multi-Browser Context Manager
 * Demonstrates handling multiple browser contexts for parallel testing
 */

import { Browser, BrowserContext, Page, chromium, firefox, webkit } from '@playwright/test';

export type BrowserType = 'chromium' | 'firefox' | 'webkit';

export interface BrowserContextEntry {
  type: BrowserType;
  browser: Browser;
  context: BrowserContext;
  page: Page;
}

export class MultiBrowserManager {
  private browsers: Map<BrowserType, BrowserContextEntry> = new Map();

  async launchBrowser(type: BrowserType): Promise<BrowserContextEntry> {
    let browser: Browser;

    switch (type) {
      case 'chromium':
        browser = await chromium.launch({ headless: true });
        break;
      case 'firefox':
        browser = await firefox.launch({ headless: true });
        break;
      case 'webkit':
        browser = await webkit.launch({ headless: true });
        break;
      default:
        throw new Error(`Unsupported browser type: ${type}`);
    }

    const context = await browser.newContext({
      recordVideo: { dir: './videos' },
    });

    const page = await context.newPage();

    const entry: BrowserContextEntry = { type, browser, context, page };
    this.browsers.set(type, entry);

    return entry;
  }

  getContext(type: BrowserType): BrowserContextEntry | undefined {
    return this.browsers.get(type);
  }

  async switchContext(type: BrowserType): Promise<BrowserContextEntry> {
    let entry = this.browsers.get(type);

    if (!entry) {
      entry = await this.launchBrowser(type);
    }

    return entry;
  }

  async closeBrowser(type: BrowserType): Promise<void> {
    const entry = this.browsers.get(type);

    if (entry) {
      await entry.context.close();
      await entry.browser.close();
      this.browsers.delete(type);
    }
  }

  async closeAllBrowsers(): Promise<void> {
    for (const [type] of this.browsers) {
      await this.closeBrowser(type);
    }
  }

  getAllContexts(): BrowserContextEntry[] {
    return Array.from(this.browsers.values());
  }
}
