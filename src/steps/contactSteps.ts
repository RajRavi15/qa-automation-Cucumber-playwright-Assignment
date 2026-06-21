import { Given, When, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';

// ================= NAVIGATION =================

Given('user is on contact us page', async function (this: CustomWorld) {
  await this.contactPage.navigate();
});

// ================= FORM =================

When('user fills contact form', async function (this: CustomWorld) {
  await this.contactPage.fillForm();
});

When('user uploads a file', async function (this: CustomWorld) {
  await this.contactPage.uploadFile();
});

// ⚠️ IMPORTANT: this step should NOT click submit
When('user submits the form', async function () {
  // handled in alert steps
});

// ================= ALERT =================

When('user accepts the confirmation alert', async function (this: CustomWorld) {
  await this.contactPage.submitFormAccept();
});

When('user dismisses the confirmation alert', async function (this: CustomWorld) {
  await this.contactPage.submitFormDismiss();
});

// ================= VALIDATION =================

Then('success message should be displayed', async function (this: CustomWorld) {
  await this.contactPage.verifySuccessMessage();
  console.log('Success message verified');
});

Then('form should not be submitted', async function (this: CustomWorld) {
  await this.contactPage.verifyFormNotSubmitted();
  console.log('Form submission verified as not submitted');
});