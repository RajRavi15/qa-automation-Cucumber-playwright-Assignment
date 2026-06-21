import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';

// ================= HEADER ASSERTIONS =================

Then('header menu should be visible', async function (this: CustomWorld) {
  await this.headerPage.verifyHeaderVisible();
});

Then('Home link should be visible', async function (this: CustomWorld) {
  await this.headerPage.verifyHomeLink();
});

Then('Products link should be visible', async function (this: CustomWorld) {
  await this.headerPage.verifyProductsLink();
});

Then('Cart link should be visible', async function (this: CustomWorld) {
  await this.headerPage.verifyCartLink();
});

Then('Signup Login link should be visible', async function (this: CustomWorld) {
  await this.headerPage.verifySignupLoginLink();
});