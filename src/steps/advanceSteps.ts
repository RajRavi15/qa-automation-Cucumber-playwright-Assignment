import { Given, When, Then } from '@cucumber/cucumber';
import { expect, BrowserContext, Page } from '@playwright/test';
import { CustomWorld } from '../support/world';
import { TestDataGenerator } from '../utils/testDataGenerator';


let contextB: BrowserContext;
let pageB: Page;

// ================= UI-016 =================

Given('user blocks non critical assets', async function (this: CustomWorld) {
  await this.page.route('**/*', (route) => {
    const url = route.request().url();

    if (
      url.endsWith('.jpg') ||
      url.endsWith('.png') ||
      url.endsWith('.jpeg') ||
      url.includes('banner') ||
      url.includes('ads')
    ) {
      return route.abort();
    }

    return route.continue();
  });
});

When('user navigates to products page', async function (this: CustomWorld) {
  await this.productPage.navigate();
});

Then('product list should still be visible', async function (this: CustomWorld) {
  await this.productPage.verifyProductListVisible();
});

// ================= UI-017 =================

Given('user logs in with valid credentials', async function (this: CustomWorld) {

  // Always use dynamic user (assessment rule)
  const user = TestDataGenerator.generateUser();
  this.user = user;

  // Register new user
  await this.loginPage.navigate();

  await this.registerPage.enterSignupDetails(user.firstName, user.email);
  await this.registerPage.clickSignup();

  await this.registerPage.verifyAccountInfoPage();
  await this.registerPage.fillAccountInformation(user);

  await this.registerPage.clickCreateAccount();
  await this.registerPage.verifyAccountCreated();
  await this.registerPage.clickContinue();

  // Now user is logged in
  await this.loginPage.verifyUserLoggedIn();

});

When('user creates new browser context with same session', async function (this: CustomWorld) {
  // Extract cookies from Context A
  const cookies = await this.page.context().cookies();

  // Create Context B
  contextB = await this.browser.newContext();

  // Inject cookies
  await contextB.addCookies(cookies);

  // New Page in Context B
  pageB = await contextB.newPage();

  // Navigate directly (bypass login)
  await pageB.goto(`${process.env.BASE_URL || 'https://www.automationexercise.com'}/`);
});

Then('user should be logged in without login again', async function () {
  await expect(pageB.getByText('Logged in as')).toBeVisible();
});