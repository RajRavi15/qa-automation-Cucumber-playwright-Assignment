import { Given, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';

// ================= NAVIGATION =================

Given('user navigates to home page', async function (this: CustomWorld) {
  await this.homePage.navigate();
});

// ================= ASSERTIONS =================

Then('home page logo should be visible', async function (this: CustomWorld) {
  await this.homePage.verifyLogoVisible();
});

Then('main banner should be visible', async function (this: CustomWorld) {
  await this.homePage.verifyBannerVisible();
});

Then('categories section should be visible', async function (this: CustomWorld) {
  await this.homePage.verifyCategoriesVisible();
});