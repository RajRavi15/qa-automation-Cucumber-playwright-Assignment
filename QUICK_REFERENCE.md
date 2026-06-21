# Quick Reference Card

## 🎯 Essential Commands

```bash
# Installation (one time)
npm install
npx playwright install

# Running Tests
npm test                  # All tests
npm run test:ui          # @ui tag only
npm run test:api         # @api tag only
npm run test:smoke       # @smoke tag only
npm run test:regression  # @regression tag only

# Reporting
open cucumber-report.html  # View HTML report
npm run allure:report      # Generate Allure report

# Development
npx tsc --noEmit          # Check TypeScript
```

## 📁 File Locations

| Layer | Location | Purpose |
|-------|----------|---------|
| Pages | `src/pages/` | UI interactions |
| Steps | `src/steps/` | Test definitions |
| API | `src/api/` | API client |
| Hooks | `src/hooks/` | Lifecycle |
| Utils | `src/utils/` | Data, types |
| Features | `src/features/` | BDD scenarios |

## 🔑 Key Classes

| Class | Location | Use |
|-------|----------|-----|
| BasePage | `src/pages/basePage.ts` | Extend for page objects |
| ApiClient | `src/api/apiClient.ts` | Make API calls |
| CustomWorld | `src/hooks/world.ts` | Access in step defs |
| TestDataGenerator | `src/utils/testDataGenerator.ts` | Generate test data |

## 📝 Creating New Tests

### 1. Feature File (`src/features/myFeature.feature`)
```gherkin
@ui @smoke
Feature: My Feature

  Scenario: Description
    Given step 1
    When step 2
    Then step 3
```

### 2. Page Object (`src/pages/myPage.ts`)
```typescript
import { Page } from '@playwright/test';
import { BasePage } from './basePage';

export class MyPage extends BasePage {
  readonly myElement = this.page.getByRole('button', { name: 'My Button' });

  async clickMyElement(): Promise<void> {
    await this.myElement.click();
  }
}
```

### 3. Update World (`src/hooks/world.ts`)
```typescript
import { MyPage } from '../pages/myPage';

export class CustomWorld {
  myPage?: MyPage;

  async initializePages(): Promise<void> {
    if (!this.page) throw new Error('Page not initialized');
    this.myPage = new MyPage(this.page);
  }
}
```

### 4. Step Definitions (`src/steps/mySteps.ts`)
```typescript
import { Given, When, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../hooks/world';

Given('user does something', async function (this: CustomWorld) {
  if (!this.myPage) throw new Error('Page not initialized');
  await this.myPage.clickMyElement();
});
```

## 🧪 Test Data

```typescript
import { TestDataGenerator } from '../utils/testDataGenerator';

// Generate unique user
const user = TestDataGenerator.generateUser();

// Generate specific data
const email = TestDataGenerator.generateEmail();
const phone = TestDataGenerator.generatePhoneNumber();
const uuid = TestDataGenerator.generateUUID();
```

## 🔐 Environment Variables

```bash
# .env file
API_BASE_URL=https://api.example.com
HEADLESS=true                          # true (default) or false
RECORD_VIDEO=false                     # true or false
RECORD_HAR=false                       # true or false
```

## 🐛 Debugging

```bash
# Pause execution and inspect
await this.page?.pause();

# View trace after test
npx playwright show-trace test-results/traces/trace.zip

# Enable debug output
DEBUG=* npm test
```

## ✅ Assertions

```typescript
import { expect } from '@playwright/test';

// Common assertions
expect(value).toBe(expected);
expect(value).toContain(substring);
expect(value).toBeDefined();
expect(value).toBeVisible();
```

## 🎯 Tags

Use tags to filter tests:

```gherkin
@ui              # UI automation tests
@api             # API tests
@smoke           # Quick smoke tests
@regression      # Full regression tests
```

Run specific tags:
```bash
npx cucumber-js src/features --tags "@ui and @smoke"
```

## 📊 Report Outputs

```
cucumber-report.html       # HTML report
cucumber-report.json       # JSON report
test-results.xml           # JUnit report
test-results/screenshots/  # Failure screenshots
test-results/traces/       # Execution traces
```

## 🔗 Useful Links

- [Playwright Docs](https://playwright.dev)
- [Cucumber.js Docs](https://github.com/cucumber/cucumber-js)
- [TypeScript Docs](https://www.typescriptlang.org)

## 💡 Best Practices

✅ Use `getByRole()`, `getByText()`, `getByPlaceholder()`  
✅ Avoid XPath selectors  
✅ No hardcoded `waitForTimeout()`  
✅ All TypeScript types explicit  
✅ No global variables  
✅ Dynamic test data only  
✅ Page objects don't contain test logic  
✅ Descriptive assertion messages  

## ⚡ Pro Tips

- Run smoke tests first: `npm run test:smoke`
- Use tags to run subsets: `npm run test:ui`
- View reports after failures
- Use traces for debugging
- Keep page objects simple
- Make step definitions reusable
- Generate test data dynamically

---

**Need More Info?** → See README.md or TESTING_GUIDE.md
