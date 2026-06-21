import { expect, Page } from '@playwright/test';
import { BasePage } from './basePage';

export class HeaderPage extends BasePage {

  constructor(page: Page) {
    super(page);
  }

  // ================= LOCATORS =================

  private headerMenu = this.page.locator('header');

  private homeLink = this.page.getByRole('link', { name: /home/i });
  private productsLink = this.page.getByRole('link', { name: /products/i });
  private cartLink = this.page.getByRole('link', { name: /cart/i });
  private signupLoginLink = this.page.getByRole('link', { name: /signup|login/i });

  // ================= METHODS =================

  async verifyHeaderVisible(): Promise<void> {
    await expect(this.headerMenu).toBeVisible();
  }

  async verifyHomeLink(): Promise<void> {
    await expect(this.homeLink).toBeVisible();
  }

  async verifyProductsLink(): Promise<void> {
    await expect(this.productsLink).toBeVisible();
  }

  async verifyCartLink(): Promise<void> {
    await expect(this.cartLink).toBeVisible();
  }

  async verifySignupLoginLink(): Promise<void> {
    await expect(this.signupLoginLink).toBeVisible();
  }
}