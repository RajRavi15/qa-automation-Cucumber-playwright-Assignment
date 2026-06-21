# Playwright Cucumber BDD Automation Framework

A production-ready, enterprise-grade QA automation framework using Playwright, TypeScript, and Cucumber (BDD).

## 📋 Table of Contents

- [Architecture](#architecture)
- [Requirements](#requirements)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Features](#features)
- [Usage](#usage)
- [Configuration](#configuration)
- [Advanced Features](#advanced-features)
- [Reporting](#reporting)

## 🏗️ Architecture

### Key Design Principles

1. **Page Object Model (POM)** - Separation of UI elements from test logic
2. **Cucumber World** - Shared context across step definitions
3. **No Global Variables** - Browser/page managed through dependency injection
4. **Strict TypeScript** - Full type safety with `noImplicitAny: true`
5. **Reusable Components** - DRY principle with base classes and utilities

### Folder Structure

```
src/
  ├── features/           # Gherkin feature files
  ├── steps/             # Step definitions
  ├── pages/             # Page Object Models
  ├── api/               # API client and utilities
  ├── hooks/             # Before/After hooks
  └── utils/             # Utilities and types
config/                  # Configuration files
allure-results/         # Allure report data
test-results/           # Screenshots, videos, traces
```

## 📦 Requirements

- Node.js = v24.16.0
- npm = 11.13.0
- TypeScript >= 5.x

## 🚀 Installation

### 1. Clone and Setup

```bash
# Navigate to project
cd "Playwright Cucumber"

# Install dependencies
npm install
```

### 2. Install Browsers

```bash
npx playwright install
```

### 3. Environment Setup

```bash
# Copy example env file
cp .env.example .env

# Update with your configuration
# - API_BASE_URL: Your API endpoint
# - HEADLESS: true/false
# - RECORD_VIDEO: true/false
```

### 4. Create Directories for Artifacts

```bash
mkdir -p test-results/screenshots
mkdir -p test-results/traces
mkdir -p videos
mkdir -p hars
```

## 📁 Project Structure Details

### Features (`src/features/`)

Gherkin feature files with BDD scenarios. Supports tags:
- `@ui` - UI automation tests
- `@api` - API automation tests
- `@smoke` - Smoke tests
- `@regression` - Regression tests

### Pages (`src/pages/`)

**BasePage.ts** - Base class with common actions:
- Navigation and URL handling
- Playwright best practices (getByRole, getByPlaceholder, etc.)
- Screenshot capture
- No XPath usage

**RegistrationPage.ts** - Example page object:
- Form interactions
- Success/error message validation
- Type-safe methods

### Steps (`src/steps/`)

**registrationSteps.ts** - UI automation example:
- Navigation
- Form filling
- Validation

**apiSteps.ts** - API automation example:
- API calls via Playwright request context
- Response validation
- Dynamic data handling

### API (`src/api/`)

**apiClient.ts** - Reusable API client:
- Typed request/response models
- Form URL encoded support
- Bearer token authentication
- Type-safe method wrappers

### Hooks (`src/hooks/`)

**world.ts** - Cucumber World context:
- Browser/page/API context management
- Page object initialization
- Test data storage

**hooks.ts** - Before/After lifecycle:
- Browser launch/close
- Context initialization
- Screenshot/video/trace capture on failure
- Network recording

### Utils (`src/utils/`)

**types.ts** - TypeScript interfaces for:
- API requests/responses
- User models
- Domain objects

**testDataGenerator.ts** - Dynamic test data:
- Faker.js integration
- No hardcoded test data
- Reusable data builders

## 🎯 Features

### 1. Page Object Model
```typescript
// Clean separation of concerns
const registrationPage = new RegistrationPage(page);
await registrationPage.fillEmail("user@example.com");
await registrationPage.submitRegistration();
```

### 2. Type-Safe API Client
```typescript
// Fully typed API calls
const response = await apiClient.register(userData);
const loginData = response.data as LoginResponse;
```

### 3. Dynamic Test Data
```typescript
// No hardcoded data
const user = TestDataGenerator.generateUser();
// Generates unique email, phone, etc.
```

### 4. Managed Context
```typescript
// No global variables
// All context through Cucumber World
this.page        // Current browser page
this.apiClient   // API client instance
this.testData    // Shared test data
```

## 📖 Usage

### Run All Tests

```bash
npm test
```

### Run by Tags

```bash
# UI tests only
npm run test:ui

# API tests only
npm run test:api

# Smoke tests
npm run test:smoke

# Regression tests
npm run test:regression
```

### Run Specific Feature

```bash
npx cucumber-js src/features/registration.feature \
  --require-module ts-node/register \
  --require src/steps/**/*.ts \
  --require src/hooks/**/*.ts
```

### Run with Tags

```bash
npx cucumber-js src/features \
  --require-module ts-node/register \
  --require src/steps/**/*.ts \
  --require src/hooks/**/*.ts \
  --tags "@ui and @smoke"
```

## ⚙️ Configuration

### Environment Variables

```env
# API endpoint
API_BASE_URL=https://api.example.com

# Browser settings
HEADLESS=true                          # Run in headless mode
RECORD_VIDEO=false                     # Record videos on failure
RECORD_HAR=false                       # Record network HAR files

# Debugging
DEBUG=false                            # Enable debug logs
```

### Playwright Configuration

Edit `playwright.config.ts` for:
- Base URL
- Timeouts
- Retry policies
- Reporter settings

### Cucumber Configuration

Edit `.cucumber.json` for:
- Default step definition paths
- Report formats
- Tag-based profiles

## 🔧 Advanced Features

### Network Interception

Capture network requests and responses:

```typescript
Before(async function() {
  this.context = await browser.newContext({
    recordHar: { path: './hars/recording.har' }
  });
});
```

### Multi-Browser Context

Run tests on multiple browsers:

```typescript
const chromium = await require('@playwright/test').chromium.launch();
const firefox = await require('@playwright/test').firefox.launch();

// Switch contexts as needed
const page = await context1.newPage();
```

### Video Recording

Enable video capture for debugging:

```typescript
this.context = await browser.newContext({
  recordVideo: { dir: './videos' }
});
```

### Trace Viewer

Detailed step-by-step execution trace:

```bash
npx playwright show-trace ./test-results/traces/trace.zip
```

### Screenshot on Failure

Automatic screenshot capture in After hook:

```typescript
if (result?.status === 'FAILED' && this.page) {
  await this.page.screenshot({ path: screenshotPath });
}
```

## 📊 Reporting

### HTML Reports

Cucumber generates HTML reports:

```bash
# View reports
open cucumber-report.html          # All tests
open cucumber-report-ui.html       # UI tests only
open cucumber-report-api.html      # API tests only
```

### Allure Reports (Optional)

Install and generate Allure reports:

```bash
npm install --save-dev allure-commandline

# Run tests and generate report
npm run allure:report
```

### JUnit Reports

CI/CD integration:

```bash
# Reports generated at: test-results.xml
# Compatible with Jenkins, GitLab CI, GitHub Actions
```

## 📝 TypeScript Strictness

Full TypeScript strict mode enabled:

```json
{
  "strict": true,
  "noImplicitAny": true,
  "strictNullChecks": true,
  "noUnusedLocals": true
}
```

## 🎨 Best Practices

1. **Use getByRole() over XPath**
   ```typescript
   // Good
   page.getByRole('button', { name: 'Submit' })
   
   // Avoid
   page.locator('//button[@class="submit"]')
   ```

2. **No Hardcoded Waits**
   ```typescript
   // Good
   await page.waitForLoadState('networkidle');
   
   // Avoid
   await page.waitForTimeout(5000);
   ```

3. **Type Everything**
   ```typescript
   // Good
   const userData: RegistrationRequest = { ... }
   
   // Avoid
   const userData: any = { ... }
   ```

4. **Reusable Components**
   ```typescript
   // Create base classes
   // Extend for specific functionality
   // Share across tests
   ```

## 🧪 Example Test Flow

```gherkin
@smoke @ui
Scenario: Register new user with dynamic data
  Given user navigates to registration page
  Given user has dynamic registration data
  When user fills registration form with generated data
  And user submits registration form
  Then registration should be successful
  And success message should contain "Registration successful"
```

**Execution Flow:**
1. Before hook: Launch browser, create context
2. Navigation: Opens registration page
3. Data generation: Creates unique user data
4. Form interaction: Fills all fields dynamically
5. Submission: Submits form and waits for response
6. Validation: Asserts success message visible
7. After hook: Captures artifacts on failure, closes browser

## 🔐 Security

- No credentials in feature files
- Use environment variables for secrets
- Token management through API client
- Secure form handling

## 🚀 CI/CD Integration

### GitHub Actions Example

```yaml
name: Playwright Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npx playwright install --with-deps
      - run: npm test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: test-results
          path: test-results/
```

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev)
- [Cucumber.js Documentation](https://github.com/cucumber/cucumber-js)
- [Faker.js Documentation](https://fakerjs.dev)
- [TypeScript Documentation](https://www.typescriptlang.org)

## 📝 License

ISC

## 👥 Contributing

1. Follow TypeScript strict mode
2. Add feature files for new scenarios
3. Create page objects for new pages
4. Write step definitions
5. Update README with new features

## 🆘 Troubleshooting

### Tests Not Running

```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
npx playwright install
```

### Timeout Errors

Increase timeout in hooks.ts:
```typescript
setDefaultTimeout(60 * 1000); // 60 seconds
```

### Screenshot Artifacts Not Found

Ensure directories exist:
```bash
mkdir -p test-results/screenshots
mkdir -p test-results/traces
```

### TypeScript Errors

Check strict mode is enabled in tsconfig.json and all types are properly defined.

---

**Framework Version:** 1.0.0  
**Last Updated:** 2024
