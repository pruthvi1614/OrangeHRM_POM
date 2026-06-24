# OrangeHRM POM Framework

This repository contains a Playwright-based test automation framework for OrangeHRM using the Page Object Model (POM) pattern.

## Project Structure

- `pages/` - Page object classes for the OrangeHRM UI pages.
- `tests/` - Playwright test files and test suites.
- `utils/` - Utility helpers such as Excel data readers and environment helpers.
- `testdata/` - Test data files used by the suites (Excel, JSON, etc.).
- `playwright.config.ts` - Playwright configuration file.
- `tsconfig.json` - TypeScript configuration.

## Getting Started

### Prerequisites

- Node.js (16+ recommended)
- npm

### Install dependencies

```bash
npm install
```

### Configure environment

Update environment variables in `utils/environment.env` or your preferred `.env` file.

Typical variables include:

```env
Base_Url=
Base_User=
Base_Pass=
```

## Run Tests

### Run all tests

```bash
npx playwright test
```

### Run a single spec file

```bash
npx playwright test tests/Qualifications.spec.ts
```

### Run using npm scripts

```bash
npm run All-Test
```

### Generate Allure report

```bash
npm run Allure-report
```

### Clean Allure results

```bash
npm run clean-allure
```

## Notes

- The test framework uses `@playwright/test` and TypeScript.
- Page objects are stored under `pages/` for reusable flows and selectors.
- Data-driven tests use utilities from `utils/ExcelFileUtil.ts`.
- If Playwright autocomplete is not working in VS Code, make sure the workspace TypeScript version is enabled and `tsconfig.json` is loaded.

## Recommended VS Code Settings

Ensure the workspace uses the local TypeScript install and supports inline suggestions:

```json
{
  "editor.inlineSuggest.enabled": true,
  "editor.quickSuggestions": {
    "other": true,
    "comments": "on",
    "strings": "on"
  }
}
```

## Project Scripts

- `Single-Data` - Run a single data-driven spec.
- `Multiple-Json` - Run the JSON data-driven spec.
- `Multiple-Excel` - Run the Excel data-driven spec.
- `All-Test` - Run all Playwright tests.
- `Allure-report` - Serve the Allure report.

## Useful commands

```bash
npx playwright test --debug
npx playwright show-report
```

## Contributing

- Add new page objects under `pages/`
- Keep selectors stable and use Playwright locators
- Use `await expect(locator).toBeVisible()` before interacting with elements to reduce flakiness
- Add new test scenarios under `tests/`
