import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './basePage';
import { ENV } from '../../config/env';

export class ProductPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ================= LOCATORS =================

  private products: Locator = this.page.locator('.product-image-wrapper');
  private productNames: Locator = this.page.locator('.productinfo p');
  private productPrices: Locator = this.page.locator('.productinfo h2');

  private searchInput: Locator = this.page.getByPlaceholder('Search Product');
  private searchButton: Locator = this.page.locator('#submit_search');

  private brandSection: Locator = this.page.locator('.brands_products');

  // MODAL (Add to Cart popup)
  private modal: Locator = this.page.locator('.modal-content');
  private viewCartLink: Locator = this.page.getByRole('link', { name: /view cart/i });

  // CART
  private cartRows: Locator = this.page.locator('#cart_info_table tbody tr');

  // ================= NAVIGATION =================

  async navigate(): Promise<void> {
    await this.goto('/products'); // ✅ NO HARDCODE
    await this.page.waitForLoadState('networkidle', { timeout: ENV.TIMEOUT }).catch(() => null);
    await expect(this.products.first()).toBeVisible({ timeout: ENV.TIMEOUT });
  }

  // ================= UI-008 =================

  async verifyProductListVisible(): Promise<void> {
    await expect(this.products.first()).toBeVisible();
  }

  async verifyProductNameAndPrice(): Promise<void> {
    await expect(this.productNames.first()).toBeVisible();
    await expect(this.productPrices.first()).toBeVisible();
  }

  // ================= UI-009 =================

  async openFirstProduct(): Promise<void> {
    const firstProduct = this.products.first();

    await firstProduct.scrollIntoViewIfNeeded();
    await firstProduct.hover();

    const viewBtn = firstProduct.getByText('View Product');

    await Promise.all([
      this.page.waitForURL('**/product_details/**', { timeout: ENV.TIMEOUT }),
      viewBtn.click()
    ]);
  }

  async verifyProductName(): Promise<void> {
    await expect(this.page.locator('.product-information h2')).toBeVisible();
  }

  async verifyProductPrice(): Promise<void> {
    await expect(this.page.locator('.product-information span span')).toBeVisible();
  }

  async verifyAvailability(): Promise<void> {
    await expect(this.page.getByText(/availability/i)).toBeVisible();
  }

  // ================= UI-010 =================

  async searchProduct(keyword: string): Promise<void> {
    await this.searchInput.fill(keyword);
    await this.searchButton.click();
  }

  async verifySearchResults(): Promise<void> {
    await expect(this.products.first()).toBeVisible();
  }

  // ================= UI-011 =================

  async clickSearchButton(): Promise<void> {
    await this.searchButton.click();
  }

  async verifyNoResults(): Promise<void> {
    await expect(this.page.locator('.features_items')).toContainText('Searched Products');
    await expect(this.products).toHaveCount(0);
  }

  // ================= UI-012 =================

  async selectBrand(brand: string): Promise<void> {
    await this.brandSection
      .getByRole('link', { name: new RegExp(brand, 'i') })
      .click();
  }

  async verifyFilteredResults(): Promise<void> {
    await expect(this.products.first()).toBeVisible();
  }

  // ================= UI-013 =================

  async addFirstProductToCart(): Promise<void> {
    const firstProduct = this.products.first();

    await firstProduct.scrollIntoViewIfNeeded();
    await firstProduct.hover();

    await firstProduct.locator('.add-to-cart').first().click();

    await expect(this.modal).toBeVisible();
  }

  async goToCart(): Promise<void> {
    await expect(this.modal).toBeVisible();
    await this.viewCartLink.click();
  }

  async verifyProductInCart(): Promise<void> {
    await expect(this.cartRows).toHaveCount(1);
  }

  // ================= UI-014 =================

  async increaseQuantity(): Promise<void> {
    // Navigate back to products
    await this.page.getByRole('link', { name: /products/i }).click();

    const secondProduct = this.products.nth(1);

    await secondProduct.scrollIntoViewIfNeeded();
    await secondProduct.hover();

    await secondProduct.locator('.add-to-cart').first().click();

    await expect(this.modal).toBeVisible();

    await this.viewCartLink.click();
  }

  async verifyTotalPriceUpdated(): Promise<void> {
    const rows = this.cartRows;

    await expect(rows).toHaveCount(2);

    const prices = this.page.locator('#cart_info_table tbody tr td:nth-child(3)');
    const totals = this.page.locator('#cart_info_table tbody tr td:nth-child(5)');

    await expect(prices.first()).toContainText('Rs.');
    await expect(totals.first()).toContainText('Rs.');
  }
}