import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';
import { TestDataGenerator } from '../utils/testDataGenerator';

// ================= UI-003 =================

Given('user is on home page', async function (this: CustomWorld) {
  await this.page.goto(process.env.BASE_URL!, {
    waitUntil: 'domcontentloaded'
  });

  await expect(
    this.page.locator('a[href="/login"]')
  ).toBeVisible();
});

When('user clicks on Signup\\/Login', async function (this: CustomWorld) {
  await this.loginPage.clickSignupLogin();
});

Then('user should be navigated to login page', async function (this: CustomWorld) {
  await expect(this.page).toHaveURL(/login/);

  await expect(
    this.page.getByRole('button', { name: /login/i })
  ).toBeVisible();
});

// ================= UI-004 (REGISTRATION) =================

When('user enters name and email on the signup details', async function (this: CustomWorld) {
  const user = TestDataGenerator.generateUser();
  this.user = user;

  await this.registerPage.enterSignupDetails(user.firstName, user.email);
});

When('user clicks on the signup button', async function (this: CustomWorld) {
  await this.page.getByRole('button', { name: /signup/i }).click();
});

When('on the "Account information" page user fills account information', async function (this: CustomWorld) {
  await this.registerPage.verifyAccountInfoPage();

  if (!this.user) {
    throw new Error('User data missing for registration');
  }

  await this.registerPage.fillAccountInformation(this.user);
});

When('user clicks on the "Create Account" button', async function (this: CustomWorld) {
  await this.registerPage.clickCreateAccount();
});

Then('account should be created successfully', async function (this: CustomWorld) {
  await this.registerPage.verifyAccountCreated();

  await expect(
    this.page.getByText(/account created/i)
  ).toBeVisible();
});

Then('user clicks Continue button', async function (this: CustomWorld) {
  await this.registerPage.clickContinue();
});

// ================= UI-005 (LOGIN SAME USER) =================

When('user navigates to login page', async function (this: CustomWorld) {
  await this.loginPage.navigate();

  await expect(this.page).toHaveURL(/login/);
});

When('user enters valid credentials', async function (this: CustomWorld) {
  if (!this.user) {
    throw new Error('User not found. Registration must run before login.');
  }

  await this.loginPage.login(this.user.email, this.user.password);
});

Then('user name should be visible in header', async function (this: CustomWorld) {
  await this.loginPage.verifyUserLoggedIn();

  await expect(
    this.page.getByText(this.user!.firstName)
  ).toBeVisible();
});

Then('logout button should be visible', async function (this: CustomWorld) {
  await this.loginPage.verifyLogoutVisible();

  await expect(
    this.page.getByRole('link', { name: /logout/i })
  ).toBeVisible();
});

// ================= UI-007 (LOGOUT) =================

When('user clicks logout button', async function (this: CustomWorld) {
  await this.loginPage.clickLogout();
});

Then('user should be redirected to login page', async function (this: CustomWorld) {
  await expect(this.page).toHaveURL(/login/);
});

// ================= UI-006 (INVALID LOGIN) =================

Given('user is on login page', async function (this: CustomWorld) {
  await this.loginPage.navigate();

  await expect(this.page).toHaveURL(/login/);
});

When('user enters invalid credentials', async function (this: CustomWorld) {
  // Negative test case → allowed
  await this.loginPage.login('invalid@test.com', 'wrongPassword123');
});

Then('error message should be displayed', async function (this: CustomWorld) {
  await this.loginPage.verifyLoginError();

  await expect(
    this.page.getByText(/incorrect|invalid/i)
  ).toBeVisible();
});