# QA Automation Framework – Playwright + Cucumber

## 🚀 Overview

This project is a scalable, enterprise-grade QA automation framework built using:

* Playwright (UI Automation)
* Cucumber (BDD)
* TypeScript (Type Safety)
* Allure Reporting (Test Reporting)

It supports UI, API, and advanced test scenarios with modular and maintainable architecture.

---

## 📂 Project Structure

```
config/           → Framework configurations  
src/
  features/       → Feature files (BDD scenarios)
  steps/          → Step definitions
  pages/          → Page Object Models (POM)
  support/        → World, hooks
  utils/          → Utilities & test data
  types/          → TypeScript interfaces
test-resources/   → Test data
```

---

## ⚙️ Setup

```bash
npm install
npx playwright install
```

---

## ▶️ Run Tests

### Run all tests

```bash
npm run test
```

### Smoke tests

```bash
npm run test:smoke
```

### Regression tests

```bash
npm run test:regression
```

### Parallel execution

```bash
npm run test:parallel
```

---

## 📊 Reporting (Allure)

```bash
npm run report:allure
npm run report:open
```

---

## 🔄 CI/CD

GitHub Actions pipeline is configured to:

* Run smoke + regression tests
* Generate Allure report
* Upload artifacts

---

## ✅ Key Features

* Page Object Model (POM)
* Strong TypeScript typing
* Dynamic test data using Faker
* Parallel execution support
* CI/CD ready
* Allure reporting with screenshots

---

## 👨‍💻 Author

Ravi Raj
