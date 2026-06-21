import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './basePage';
import path from 'path';

export class ContactPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ================= LOCATORS =================

  private nameInput: Locator = this.page.getByPlaceholder('Name');
  private emailInput: Locator = this.page.getByRole('textbox', { name: 'Email', exact: true })
  private subjectInput: Locator = this.page.getByPlaceholder('Subject');
  private messageInput: Locator = this.page.getByPlaceholder('Your Message Here');

  private uploadInput: Locator = this.page.locator('input[type="file"]');
  private submitBtn: Locator = this.page.locator('input[type="submit"]');

  private successMsg: Locator = this.page.locator('.status.alert-success');

  // ================= NAVIGATION =================

  async navigate(): Promise<void> {
    await this.goto('/contact_us');
    await expect(this.nameInput).toBeVisible();
  }

  // ================= FORM =================

  async fillForm(): Promise<void> {
    await this.nameInput.fill('Test User');
    await this.emailInput.fill('testuser@gmail.com');
    await this.subjectInput.fill('Test Subject');
    await this.messageInput.fill('This is a test message');
  }

  async uploadFile(): Promise<void> {
    const filePath = path.resolve('src/testdata/account.png');
    await this.uploadInput.setInputFiles(filePath);
  }

  // ================= ALERT HANDLING =================

  async submitFormAccept(): Promise<void> {
    await Promise.all([
      this.page.waitForEvent('dialog').then(dialog => dialog.accept()),
      this.submitBtn.click()
    ]);
  }

  async submitFormDismiss(): Promise<void> {
    await Promise.all([
      this.page.waitForEvent('dialog').then(dialog => dialog.dismiss()),
      this.submitBtn.click()
    ]);
  }

  // ================= VALIDATIONS =================

  async verifySuccessMessage(): Promise<void> {
    await expect(this.successMsg).toBeVisible();
    await expect(this.successMsg).toContainText('Success');
  }

  async verifyFormNotSubmitted(): Promise<void> {
    await expect(this.successMsg).not.toBeVisible();
  }
}