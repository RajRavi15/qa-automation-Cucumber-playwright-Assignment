# Playwright Cucumber BDD Framework - Testing Guide

## Quick Start Guide

### 1. Initial Setup

```bash
cd "Playwright Cucumber"
npm install
npx playwright install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Update .env with your API_BASE_URL and browser settings
```

### 3. Run Tests

```bash
# All tests
npm test

# By category
npm run test:ui
npm run test:api
npm run test:smoke
npm run test:regression
```

## Writing New Tests

### Step 1: Create Feature File

Create a new `.feature` file in `src/features/`:

```gherkin
@smoke @ui
Feature: Login Functionality

  Scenario: User logs in successfully
    Given user navigates to login page
    When user enters valid credentials
    And user submits login form
    Then user should be logged in
```

### Step 2: Create Page Object

Create a new page object in `src/pages/`:

```typescript
import { Page } from '@playwright/test';
import { BasePage } from './basePage';

export class LoginPage extends BasePage {
  readonly emailInput = this.page.getByPlaceholder(/email/i);
  readonly passwordInput = this.page.getByPlaceholder(/password/i);
  readonly loginButton = this.page.getByRole('button', { name: /login/i });

  async navigateToLogin(url: string = '/login'): Promise<void> {
    await this.goto(url);
    await this.page.waitForLoadState('networkidle');
  }

  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async submitLogin(): Promise<void> {
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }
}
```

### Step 3: Create Step Definitions

Create step definitions in `src/steps/`:

```typescript
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../hooks/world';

Given('user navigates to login page', async function (this: CustomWorld) {
  if (!this.loginPage) {
    throw new Error('Login page not initialized');
  }
  await this.loginPage.navigateToLogin();
});

When('user enters valid credentials', async function (this: CustomWorld) {
  if (!this.loginPage) {
    throw new Error('Login page not initialized');
  }
  await this.loginPage.fillEmail('test@example.com');
  await this.loginPage.fillPassword('SecurePass123!');
});

When('user submits login form', async function (this: CustomWorld) {
  if (!this.loginPage) {
    throw new Error('Login page not initialized');
  }
  await this.loginPage.submitLogin();
});

Then('user should be logged in', async function (this: CustomWorld) {
  if (!this.page) {
    throw new Error('Page not initialized');
  }
  const currentUrl = this.page.url();
  expect(currentUrl).toContain('/dashboard');
});
```

### Step 4: Update World Initialization

Update `src/hooks/world.ts` to include new page objects:

```typescript
import { LoginPage } from '../pages/loginPage';

export class CustomWorld implements IWorld {
  // ... existing code ...
  loginPage?: LoginPage;

  async initializePages(): Promise<void> {
    if (!this.page) {
      throw new Error('Page is not initialized');
    }
    this.registrationPage = new RegistrationPage(this.page);
    this.loginPage = new LoginPage(this.page);  // Add this line
  }
}
```

## Working with Test Data

### Using Dynamic Data

```typescript
import { TestDataGenerator } from '../utils/testDataGenerator';

Given('user has valid registration data', async function (this: CustomWorld) {
  const userData = TestDataGenerator.generateUser();
  userData.confirmPassword = userData.password;
  this.testData.userData = userData;
});

// Or use specific generators:
const email = TestDataGenerator.generateEmail();
const phone = TestDataGenerator.generatePhoneNumber();
const uuid = TestDataGenerator.generateUUID();
```

### Hardcoding Test Data in Features

```gherkin
Given user has the following credentials:
  | Email    | john@example.com      |
  | Password | SecurePass123!        |

When user logs in with "john@example.com" and "SecurePass123!"
```

## API Testing

### Making API Calls

```typescript
When('user makes login API request', async function (this: CustomWorld) {
  if (!this.apiClient) {
    throw new Error('API client not initialized');
  }

  const response = await this.apiClient.login({
    email: 'test@example.com',
    password: 'SecurePass123!'
  });

  this.testData.apiResponse = response;
  this.testData.authToken = response.data.token;
});
```

### Validating API Responses

```typescript
Then('API should return status {int}', async function (this: CustomWorld, status: number) {
  expect(this.testData.apiResponse?.status).toBe(status);
});

Then('API response should contain token', async function (this: CustomWorld) {
  const data = this.testData.apiResponse?.data;
  expect(data).toHaveProperty('token');
  expect(typeof data.token).toBe('string');
});
```

## Running Tests

### Run All Tests

```bash
npm test
```

### Run Tests with Specific Tags

```bash
# Single tag
npx cucumber-js src/features --require-module ts-node/register \
  --require src/steps/**/*.ts \
  --require src/hooks/**/*.ts \
  --tags "@ui"

# Multiple tags (AND logic)
npx cucumber-js src/features --require-module ts-node/register \
  --require src/steps/**/*.ts \
  --require src/hooks/**/*.ts \
  --tags "@ui and @smoke"

# Multiple tags (OR logic)
npx cucumber-js src/features --require-module ts-node/register \
  --require src/steps/**/*.ts \
  --require src/hooks/**/*.ts \
  --tags "@ui or @api"
```

### Run Specific Feature

```bash
npx cucumber-js src/features/registration.feature \
  --require-module ts-node/register \
  --require src/steps/**/*.ts \
  --require src/hooks/**/*.ts
```

### Run in Different Modes

```bash
# Headless (default)
npm run test:ui

# Headed (with UI)
HEADLESS=false npm test

# With video recording
RECORD_VIDEO=true npm test

# With network recording
RECORD_HAR=true npm test
```

## Advanced Features

### Network Interception Example

```typescript
import { NetworkInterceptor } from '../utils/networkInterceptor';

Given('API responses are mocked', async function (this: CustomWorld) {
  if (!this.context) {
    throw new Error('Context not initialized');
  }

  const interceptor = new NetworkInterceptor(this.context);
  
  // Mock registration endpoint
  const page = this.page!;
  await interceptor.mockApiResponse(
    page,
    /api\/auth\/register/,
    { id: '123', email: 'user@example.com', message: 'Success' }
  );
});
```

### Multi-Browser Testing Example

```typescript
import { MultiBrowserManager } from '../utils/multiBrowserManager';

let browserManager: MultiBrowserManager;

Before(async function () {
  browserManager = new MultiBrowserManager();
  
  // Launch multiple browsers
  const chromiumContext = await browserManager.launchBrowser('chromium');
  const firefoxContext = await browserManager.launchBrowser('firefox');
  
  this.page = chromiumContext.page;
});

When('test runs on Firefox', async function (this: CustomWorld) {
  if (!browserManager) {
    throw new Error('Browser manager not initialized');
  }
  
  const firefoxContext = await browserManager.switchContext('firefox');
  this.page = firefoxContext.page;
});

After(async function () {
  await browserManager?.closeAllBrowsers();
});
```

## TypeScript Best Practices

### Always Use Proper Types

```typescript
// Good
interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const user: UserData = { /* ... */ };

// Bad - avoid 'any'
const user: any = { /* ... */ };
```

### Use Type Assertions Safely

```typescript
// Good - with type guard
if (typeof response.data === 'object' && response.data !== null && 'id' in response.data) {
  const userId = (response.data as { id: string }).id;
}

// Avoid - risky assertion
const userId = (response.data as any).id;
```

### Proper Error Handling

```typescript
try {
  await this.apiClient?.logout();
} catch (error) {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  console.error(`Logout failed: ${errorMessage}`);
  throw error;
}
```

## Debugging

### Enable Debug Logging

```bash
DEBUG=true npm test
```

### Pause and Inspect

In your step definition:

```typescript
When('I inspect the page', async function (this: CustomWorld) {
  await this.page?.pause(); // Opens Inspector
});
```

### View Screenshots

```bash
# Automatic screenshots on failure stored in:
test-results/screenshots/
```

### Inspect Traces

```bash
# View execution trace
npx playwright show-trace test-results/traces/trace.zip
```

## Continuous Integration

### GitHub Actions Example

See `.github/workflows/test.yml` for CI configuration.

```bash
# Run in CI environment
CI=true npm test
```

### Environment Variables in CI

```yaml
env:
  API_BASE_URL: ${{ secrets.API_BASE_URL }}
  HEADLESS: true
```

## Common Issues and Solutions

### Issue: Tests timing out

**Solution:** Increase timeout in hooks.ts

```typescript
setDefaultTimeout(60 * 1000); // 60 seconds
```

### Issue: Page not found

**Solution:** Check base URL in hooks or step definitions

```typescript
const baseUrl = process.env.API_BASE_URL || 'http://localhost:3000';
await this.page?.goto(`${baseUrl}/register`);
```

### Issue: Type errors with any

**Solution:** Add proper types to tsconfig.json - already done with `noImplicitAny: true`

### Issue: Screenshots not found

**Solution:** Ensure directories exist

```bash
mkdir -p test-results/screenshots
mkdir -p test-results/traces
```

## Performance Tips

1. **Parallel Execution**: Run independent features in parallel
2. **Tag Filtering**: Use tags to run subset of tests
3. **Network Stubbing**: Mock slow APIs during testing
4. **Headless Mode**: Run in headless for faster execution
5. **Context Reuse**: Reuse browser context when possible

## Security Best Practices

1. **Never commit secrets** - Use environment variables
2. **Use .env.example** - Show template without sensitive data
3. **Mask sensitive logs** - Don't log passwords/tokens
4. **Secure API calls** - Use HTTPS endpoints
5. **Token rotation** - Refresh tokens in long-running tests

## Reporting

### Generate Reports

```bash
# HTML report
npm test
# View: cucumber-report.html

# Allure report (requires installation)
npm run allure:report

# JUnit for CI/CD
# Generated: test-results.xml
```

### Customize Reports

Edit `.cucumber.json` to change report formats and output.

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Cucumber.js Guide](https://github.com/cucumber/cucumber-js)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Faker.js Docs](https://fakerjs.dev)

## Next Steps

1. ✅ Run sample tests: `npm test`
2. ✅ View reports: `open cucumber-report.html`
3. ✅ Add your own feature files
4. ✅ Create page objects for your application
5. ✅ Write step definitions
6. ✅ Execute in CI/CD pipeline
