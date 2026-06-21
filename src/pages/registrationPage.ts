import { expect, Page } from '@playwright/test';
import type { RegistrationRequest } from '../types/apiTypes';

export class RegistrationPage {
  constructor(private page: Page) {}

  // ================= UI-003 =================

  async clickSignupLogin(): Promise<void> {
    await this.page.getByRole('link', { name: ' Signup / Login' }).click();
  }

  async verifyLoginPage(): Promise<void> {
    await expect(
      this.page.locator('button[data-qa="login-button"]')
    ).toBeVisible();
  }

  // ================= UI-004 =================

  async enterSignupDetails(name: string, email: string): Promise<void> {
    await this.page.locator('input[data-qa="signup-name"]').fill(name);
    await this.page.locator('input[data-qa="signup-email"]').fill(email);
  }

  async clickSignup(): Promise<void> {
    await this.page.locator('button[data-qa="signup-button"]').click();
  }

  async verifyAccountInfoPage(): Promise<void> {
    await expect(
      this.page.getByText(/enter account information/i)
    ).toBeVisible();
  }

  async fillAccountInformation(user: RegistrationRequest): Promise<void> {
    await this.page.locator('input[data-qa="password"]').fill(user.password);
    await this.page.locator('input[data-qa="first_name"]').fill(user.firstName);
    await this.page.locator('input[data-qa="last_name"]').fill(user.lastName);

    // ✅ dynamic data (no hardcoding)
    await this.page.locator('input[data-qa="address"]').fill(user.address);
    await this.page.locator('input[data-qa="state"]').fill(user.state);
    await this.page.locator('input[data-qa="city"]').fill(user.city);
    await this.page.locator('input[data-qa="zipcode"]').fill(user.zipcode);
    await this.page.locator('input[data-qa="mobile_number"]').fill(user.phone);
  }

  async clickCreateAccount(): Promise<void> {
    await this.page.locator('button[data-qa="create-account"]').click();
  }

  async verifyAccountCreated(): Promise<void> {
    await expect(
      this.page.getByText(/account created/i)
    ).toBeVisible();
  }

  async clickContinue(): Promise<void> {
    await this.page.getByRole('link', { name: /continue/i }).click();
  }
}