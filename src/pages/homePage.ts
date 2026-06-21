import { expect, Page } from '@playwright/test';
import { BasePage } from './basePage';

export class HomePage extends BasePage {

  constructor(page: Page) {
    super(page);
  }

  // ================= LOCATORS =================

  // Logo (top left)
  private logo = this.page.getByRole('img', { name: /website for automation practice/i });

  // Main banner / carousel
  private mainBanner = this.page.locator('#slider-carousel');

  // Categories section
  private categoriesSection = this.page.getByRole('heading', { name: /category/i });

  // ================= METHODS =================

  async navigate(): Promise<void> {
    await this.goto('/');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async verifyLogoVisible(): Promise<void> {
    await expect(this.logo).toBeVisible();
  }

  async verifyBannerVisible(): Promise<void> {
    await expect(this.mainBanner).toBeVisible();
  }

  async verifyCategoriesVisible(): Promise<void> {
    await expect(this.categoriesSection).toBeVisible();
  }
}