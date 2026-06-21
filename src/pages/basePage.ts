import { Page } from '@playwright/test';
import { ENV } from '../../config/env';

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(path: string = ''): Promise<void> {
    await this.page.goto(`${ENV.BASE_URL}${path}`, {
      timeout: ENV.TIMEOUT,
      waitUntil: 'domcontentloaded',
    });
    await this.page.waitForLoadState('domcontentloaded', { timeout: ENV.TIMEOUT });
  }
}