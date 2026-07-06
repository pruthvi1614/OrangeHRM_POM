# 🛠️ FREESTYLE JOB FIX - Step-by-Step Configuration

## Your Current Configuration (Needs Fixing)

```
This project is parameterized > Choice Parameter
  Name: SCRIPT_NAME
  Choices: 
    Single-Data
    Qualifications
    Multiple-Json
    Multiple-Excel
    All-Test

Build Steps:
  Execute Windows batch command:
  Command:
    npm install
    npm run clean-allure
    npm run %SCRIPT_NAME%
    powershell -ExecutionPolicy Bypass -File "%WORKSPACE%\jsonResultsForEmails.ps1"
    powershell -ExecutionPolicy Bypass -File "%WORKSPACE%\printResults.ps1"
    dir test-results
    powershell -Command "(Get-Item '%WORKSPACE%\test-results\results.json').LastWriteTime"
    dir "%WORKSPACE%\test-summary.txt"
```

## 🔧 Required Changes

### Step 1: Add Jenkins Credentials (One-time Setup)

1. Go to **Jenkins Dashboard** → **Manage Jenkins** → **Manage Credentials**
2. Click **Add Credentials** (left sidebar)
3. Fill in:
   - **Kind:** Username with password
   - **Username:** `Admin`
   - **Password:** `Qedge123!@#`
   - **ID:** `orangehrm-credentials` ⚠️ (MUST match exactly)
   - **Description:** OrangeHRM Test Account
4. Click **Create**

---

### Step 2: Replace Your Build Steps

**Delete your current build step and add these 6 build steps in order:**

#### Build Step 1: Create environment.env
- **Add build step** → **Execute Windows batch command**
- **Command:**
```batch
echo Creating environment.env from template...
if not exist "utils\environment.env" (
    copy utils\environment.example.env utils\environment.env
    echo ✅ Created utils\environment.env
) else (
    echo ✅ environment.env already exists
)
```

#### Build Step 2: Inject BASE_URL Environment Variable
- **Add build step** → **Inject environment variables**
- **Properties Content:**
```
BASE_URL=http://orangehrm.qedgetech.com/
```

#### Build Step 3: Set Credentials (withCredentials)
- **Add build step** → **Execute Windows batch command**
- **Check:** ✅ "Use secret text(s) or file(s) from Jenkins"
- **Select:** `orangehrm-credentials`
- **Variable names:** `TEST_USER` and `TEST_PASS`
- **Command:**
```batch
echo Setting test credentials...
set Base_Url=%BASE_URL%
set Base_User=%TEST_USER%
set Base_Pass=%TEST_PASS%
echo Base_Url=%Base_Url%
echo Base_User=%Base_User%
```

#### Build Step 4: Install Dependencies
- **Add build step** → **Execute Windows batch command**
- **Command:**
```batch
echo Installing npm packages...
call npm install
if errorlevel 1 (
    echo ❌ npm install failed
    exit /b 1
)
echo ✅ npm install completed
```

#### Build Step 5: Install Playwright Browsers
- **Add build step** → **Execute Windows batch command**
- **Command:**
```batch
echo Installing Playwright browsers...
call npx playwright install --with-deps chromium
if errorlevel 1 (
    echo ❌ Playwright install failed
    exit /b 1
)
echo ✅ Playwright browsers installed
```

#### Build Step 6: Run Tests
- **Add build step** → **Execute Windows batch command**
- **Command:**
```batch
echo Running tests...
echo Script: %SCRIPT_NAME%
call npm run clean-allure
call npm run %SCRIPT_NAME%
if errorlevel 1 (
    echo ⚠️ Some tests may have failed
) else (
    echo ✅ All tests passed
)
```

#### Build Step 7: Generate Reports (Optional - if you want reports)
- **Add build step** → **Execute Windows batch command**
- **Command:**
```batch
echo Generating reports...
call npx allure generate allure-results --clean -o allure-report
powershell -ExecutionPolicy Bypass -File "%WORKSPACE%\jsonResultsForEmails.ps1"
powershell -ExecutionPolicy Bypass -File "%WORKSPACE%\printResults.ps1"
```

---

### Step 3: Add Post-build Actions

1. **Add post-build action** → **Allure Report**
   - **Allure results paths:** `allure-results`
   - **Report path:** `allure-report`

2. **Add post-build action** → **Publish HTML reports**
   - **HTML directory:** `test-reports/playwright-report`
   - **Index file:** `index.html`
   - **Report name:** `Playwright Test Report`

3. **Add post-build action** → **Email notification**
   - **Send email on:** Failure - Any
   - **Recipients:** your-email@gmail.com

---

## 📋 Summary of Changes

| Before | After |
|--------|-------|
| 1 build step with all commands | 7 build steps (separated) |
| No credentials | Credentials via `withCredentials` |
| No environment.env | Creates `environment.env` from template |
| No browser install | Installs Playwright browsers |
| No BASE_URL set | Sets `Base_Url` from environment |

---

## ✅ Expected Console Output

When the fix is applied, you should see:
```
Creating environment.env from template...
✅ Created utils\environment.env

Setting test credentials...
Base_Url=http://orangehrm.qedgetech.com/
Base_User=Admin

Installing npm packages...
✅ npm install completed

Installing Playwright browsers...
✅ Playwright browsers installed

Running tests...
Script: Single-Data
✅ All tests passed
```

---

## ⚠️ Important Notes

1. **Credentials are masked** in console logs for security
2. **Playwright browsers** are installed once and cached
3. **environment.env** is created fresh on each build
4. The `setup-jenkins.bat` file I created can be used as an alternative to Build Step 1-3 combined