import { Page, expect } from '@playwright/test';
import { BasePage } from './basePage';

export class LoginPage extends BasePage {

  constructor(page: Page) {
    super(page);
  }

  // ================= LOCATORS =================

  private signupLoginBtn = this.page.locator('a[href="/login"]');
  private emailInput = this.page.locator('input[data-qa="login-email"]');
  private passwordInput = this.page.locator('input[data-qa="login-password"]');
  private loginBtn = this.page.locator('button[data-qa="login-button"]');
  private logoutBtn = this.page.getByRole('link', { name: /logout/i });
  private loggedInUser = this.page.getByText(/logged in as/i);
  private errorMsg = this.page.getByText(/incorrect|invalid|error/i);

  // ================= NAVIGATION =================

  async navigate(): Promise<void> {
    await this.goto('/');

    await this.page.waitForLoadState('domcontentloaded');

    // 🔥 Handle already logged-in state
    const isLoggedIn = await this.logoutBtn.isVisible().catch(() => false);

    if (isLoggedIn) {
      await this.logoutBtn.click();

      // wait until login link appears again
      await this.signupLoginBtn.waitFor();
    }

    // Navigate to login page
    await this.signupLoginBtn.click();

    // Verify login page
    await expect(this.emailInput).toBeVisible();
  }

  async clickSignupLogin(): Promise<void> {
    await this.signupLoginBtn.click();
  }

  async verifyLoginPage(): Promise<void> {
    await expect(this.emailInput).toBeVisible();
  }

  // ================= LOGIN =================

  async login(email: string, password: string): Promise<void> {
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();

    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);

    await Promise.all([
      this.page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
      this.loginBtn.click(),
    ]);
  }

  async isLoggedIn(): Promise<boolean> {
    return this.loggedInUser.isVisible().catch(() => false);
  }

  async verifyUserLoggedIn(): Promise<void> {
    await expect(this.loggedInUser).toBeVisible();
  }

  async verifyLogoutVisible(): Promise<void> {
    await expect(this.logoutBtn).toBeVisible();
  }

  async clickLogout(): Promise<void> {
    await this.logoutBtn.click();
  }

  // ================= INVALID LOGIN =================

  async verifyLoginError(): Promise<void> {
    await expect(this.errorMsg).toBeVisible();
  }
}