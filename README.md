# OrangeHRM POM Framework

This repository contains a Playwright-based test automation framework for OrangeHRM using the Page Object Model (POM) pattern.

## Project Structure

- `pages/` - Page object classes for the OrangeHRM UI pages.
- `tests/` - Playwright test files and test suites.
- `fixtures/` - Test fixtures for reusable test setup and authentication.
- `utils/` - Utility helpers such as Excel data readers and environment helpers.
- `testdata/` - Test data files used by the suites (Excel, JSON, etc.).
- `hooks/` - Git hooks for security (pre-commit hook to prevent credential leaks).
- `playwright.config.ts` - Playwright configuration file.
- `tsconfig.json` - TypeScript configuration.
- `Jenkinsfile` - CI/CD pipeline configuration for Jenkins.
- `printResults.ps1` - PowerShell script for parsing test results.
- `jsonResultsForEmails.ps1` - PowerShell script for generating email reports.

## Getting Started

### Prerequisites

- Node.js (16+ recommended)
- npm

### Install dependencies

```bash
npm install
```

### Configure environment

**SECURITY FIRST**: Credentials are sensitive and must NEVER be committed to git.

**Setup Steps:**

1. Copy the template file to create your local environment file:
   ```bash
   cp utils/environment.example.env utils/environment.env
   ```

2. Edit `utils/environment.env` and add your actual credentials:
   ```env
   Base_Url=http://orangehrm.qedgetech.com/
   Base_User=Admin
   Base_Pass=your_actual_password_here
   ```

3. **Important**: The `utils/environment.env` file is in `.gitignore` and will NOT be committed to git. This is intentional and keeps credentials secure.

**For CI/CD Pipelines:**
- Store credentials as GitHub Secrets / GitLab Variables / Jenkins credentials
- Pass them as environment variables during test execution:
  ```bash
  Base_Url=${{ secrets.BASE_URL }} Base_User=${{ secrets.BASE_USER }} Base_Pass=${{ secrets.BASE_PASS }} npm run All-Test
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

- `Single-Data` - Run a single data-driven spec (HRMSingleData.spec.ts).
- `Multiple-Json` - Run the JSON data-driven spec (MultipleDataUsingJson.spec.ts).
- `Multiple-Excel` - Run the Excel data-driven spec (MultipleDataExcel.spec.ts).
- `All-Test` - Run all Playwright tests.
- `Allure-report` - Serve the Allure report.
- `Qualifications` - Run the Qualifications test suite (tests/Qualifications.spec.ts).

## Security Best Practices

### Protecting Credentials

⚠️ **CRITICAL**: Never commit credentials to version control. Follow these practices:

#### 1. **Local Development**
- Use `utils/environment.env` (added to `.gitignore`)
- Each developer maintains their own local copy with actual credentials
- Never share the `environment.env` file

#### 2. **If Credentials Were Already Committed** (URGENT STEPS)
If you've already pushed `environment.env` with credentials to the repository:

```bash
# Remove the file from git history completely
git rm --cached utils/environment.env
git commit -m "Remove environment.env with sensitive data"
git push origin main

# For shared repos, colleagues should rebase:
git pull --rebase

# IMPORTANT: Change the password immediately in the actual system!
# Treat this as a security breach - any password committed to git should be rotated
```

Use [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/) for deeper cleaning:
```bash
bfg --delete-files environment.env
```

#### 3. **CI/CD Pipeline Setup**

**GitHub Actions Example:**
```yaml
- name: Run Playwright Tests
  env:
    Base_Url: ${{ secrets.BASE_URL }}
    Base_User: ${{ secrets.BASE_USER }}
    Base_Pass: ${{ secrets.BASE_PASS }}
  run: npm run All-Test
```

**GitLab CI Example:**
```yaml
test:
  script:
    - npm run All-Test
  variables:
    Base_Url: $CI_JOB_VARIABLE_BASE_URL
    Base_User: $CI_JOB_VARIABLE_BASE_USER
    Base_Pass: $CI_JOB_VARIABLE_BASE_PASS
```

**Jenkins Pipeline:**
The project includes a `Jenkinsfile` for CI/CD integration. The pipeline:
- Supports parameterized test selection (All-Test, Single-Data, Multiple-Json, Multiple-Excel, Qualifications)
- Uses Jenkins credentials for secure authentication
- Generates both Playwright HTML and Allure reports
- Sends email notifications with test execution summary

#### 4. **Additional Security Layers**

- **Rotate passwords regularly** (quarterly minimum)
- **Use separate credentials** for dev/qa/staging/prod
- **Enable 2FA** on critical accounts
- **Use secret scanning tools** (Git has built-in secret scanning on GitHub)
- **Audit git history** periodically: `git log --all -p -- utils/environment.env`

### Git Hooks for Security

A pre-commit hook is available in `hooks/pre-commit` to prevent accidental credential commits:

```bash
# Install the pre-commit hook
cp hooks/pre-commit .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

This hook will:
- Block commits containing `utils/environment.env` or other sensitive files
- Scan for common credential patterns (password, secret, api_key, token)
- Help maintain security best practices

### Verification

Ensure your `.gitignore` contains:
```
utils/environment.env
.env
.env.local
```

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
- Follow the existing test patterns using fixtures for authentication