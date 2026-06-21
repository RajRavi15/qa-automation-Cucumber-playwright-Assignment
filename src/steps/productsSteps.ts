import { Given, When, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';

// ================= COMMON =================

Given('user is on products page', async function (this: CustomWorld) {
  await this.productPage.navigate();
});

// ================= UI-008 =================

Then('product list should be visible', async function (this: CustomWorld) {
  await this.productPage.verifyProductListVisible();
});

Then('each product should have name and price', async function (this: CustomWorld) {
  await this.productPage.verifyProductNameAndPrice();
});

// ================= UI-009 =================

When('user clicks on a product', async function (this: CustomWorld) {
  await this.productPage.openFirstProduct();
});

Then('product name should be displayed', async function (this: CustomWorld) {
  await this.productPage.verifyProductName();
});

Then('product price should be displayed', async function (this: CustomWorld) {
  await this.productPage.verifyProductPrice();
});

Then('availability should be visible', async function (this: CustomWorld) {
  await this.productPage.verifyAvailability();
});

// ================= UI-010 =================

When('user searches for {string}', async function (this: CustomWorld, keyword: string) {
  await this.productPage.searchProduct(keyword);
});

Then('search results should be displayed', async function (this: CustomWorld) {
  await this.productPage.verifySearchResults();
});

// ================= UI-011 =================

Then('user clicks on the search icon button', async function (this: CustomWorld) {
  await this.productPage.clickSearchButton();
});

Then('no results message should be displayed', async function (this: CustomWorld) {
  await this.productPage.verifyNoResults();
});

// ================= UI-012 =================

When('user selects brand {string}', async function (this: CustomWorld, brand: string) {
  await this.productPage.selectBrand(brand);
});

Then('filtered products should be displayed', async function (this: CustomWorld) {
  await this.productPage.verifyFilteredResults();
});

// ================= UI-013 =================

When('user adds a product to cart', async function (this: CustomWorld) {
  await this.productPage.addFirstProductToCart();
});

When('user clicks on view cart', async function (this: CustomWorld) {
  await this.productPage.goToCart();
});

Then('cart should contain the product', async function (this: CustomWorld) {
  await this.productPage.verifyProductInCart();
});

// ================= UI-014 =================

Given('user has product in cart', async function (this: CustomWorld) {
  await this.productPage.navigate();
  await this.productPage.addFirstProductToCart();
  await this.productPage.goToCart();
});

When('user increases quantity', async function (this: CustomWorld) {
  await this.productPage.increaseQuantity();
});

Then('total price should be updated', async function (this: CustomWorld) {
  await this.productPage.verifyTotalPriceUpdated();
});