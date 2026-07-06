# Jenkins Setup Guide for Secure Test Execution

## Quick Fix for Your Failing Build

Your current Jenkins build is failing because it's not:
1. Creating the `environment.env` file
2. Passing credentials to tests
3. Running the actual playwright tests

---

## Step 1: Create Jenkins Credentials

### In Jenkins UI:

1. Go to **Jenkins Dashboard → Manage Jenkins → Manage Credentials**
2. Click **Add Credentials** on the left sidebar
3. Create a new credential of type **"Username with password"**:
   - **Scope:** Global
   - **Username:** `Admin`
   - **Password:** `Qedge123!@#` (your actual OrangeHRM password)
   - **ID:** `orangehrm-credentials` (important - must match Jenkinsfile)
   - **Description:** OrangeHRM Test Account

4. Click **Create**

---

## Step 2: Update Jenkins Job

### If using the old Job Configuration:

Delete and recreate the job using the new **Jenkinsfile** method (recommended):

1. **Go to your OrangeHRM_POM job**
2. Click **Configure**
3. Change the build trigger to **"Pipeline script from SCM"**:
   - **SCM:** Git
   - **Repository URL:** `https://github.com/pruthvi1614/OrangeHRM_POM.git`
   - **Branch:** `*/master`
   - **Script Path:** `Jenkinsfile` (this is the file I just created)

4. Click **Save**

### Or use Declarative Pipeline (Alternative):

1. Select **"Pipeline"** as job type (not freestyle)
2. Under **Pipeline**, select **"Pipeline script from SCM"**
3. Point to this repository

---

## Step 3: Configure Jenkins Plugins (Required)

Make sure these plugins are installed:

1. **Pipeline** (workflow-aggregator)
2. **Allure Jenkins Plugin** (allure-jenkins-plugin)
3. **HTML Publisher Plugin** (htmlpublisher)
4. **Email Extension Plugin** (email-ext)
5. **Credentials Plugin** (credentials)

**To install:**
1. Go to **Manage Jenkins → Manage Plugins**
2. Search for each plugin
3. Click **Install without restart**

---

## Step 4: Understanding the Jenkinsfile

The new Jenkinsfile I created does:

```
📍 Stage 1: Setup
   └─ Creates environment.env from template

📍 Stage 2: Install Dependencies
   └─ Runs npm install

📍 Stage 3: Install Playwright Browsers
   └─ Installs Playwright with dependencies

📍 Stage 4: Run Tests ⭐ (IMPORTANT)
   └─ Injects credentials from Jenkins Credentials
   └─ Sets environment variables
   └─ Runs: npm run All-Test

📍 Stage 5: Generate Reports
   └─ Creates Allure reports

📍 Post Build
   └─ Archives artifacts
   └─ Publishes HTML reports
   └─ Sends emails
```

---

## Step 5: How Credentials Flow

```
Jenkins Credentials Store
      ↓
    (Encrypted in Jenkins)
      ↓
Jenkinsfile: withCredentials([usernamePassword(...)])
      ↓
    (Masked in logs)
      ↓
Environment Variables: Base_User, Base_Pass
      ↓
playwright.config.ts (reads from process.env)
      ↓
Tests execute with credentials ✅
```

**Important:** Credentials are masked in logs - they won't appear in build output!

---

## Step 6: Test the Build

1. **Go to your Jenkins job**
2. Click **Build Now**
3. Monitor the build progress

**Expected output:**
```
🔧 Stage 1: Setup Environment
   ✅ Created utils/environment.env from template

📦 Stage 2: Install Dependencies
   ✅ npm install completed successfully

🌐 Stage 3: Install Playwright Browsers
   ✅ Playwright browsers installed

🧪 Stage 4: Run Tests
   ✅ All tests passed (or shows test results)

📊 Stage 5: Generate Reports
   ✅ Allure report generated

📈 Post Build: Publishing Reports
   ✅ Reports published
```

---

## Step 7: Email Notifications

The Jenkinsfile includes email notifications for success/failure:

1. Go to **Manage Jenkins → Configure System**
2. Find **Email Notification** section
3. Set up SMTP:
   - **SMTP server:** `smtp.gmail.com`
   - **SMTP Port:** `587`
   - **Use SMTP Authentication:** ✅ checked
   - **Username:** your-email@gmail.com
   - **Password:** your-app-password
   - **Use TLS:** ✅ checked
   - **Default user email suffix:** `@gmail.com`

4. Or scroll to **Extended E-mail Notification** for advanced options

---

## Common Jenkins Issues & Solutions

### Issue 1: "npm: command not found"
**Solution:** 
- Ensure Node.js is installed on Jenkins server
- Or add Node.js path to Jenkins system environment:
  ```
  Manage Jenkins → Configure System → Global properties
  Add: PATH = C:\Program Files\nodejs;${PATH}
  ```

### Issue 2: "Playwright browsers not installed"
**Solution:**
- Run manually on Jenkins server:
  ```
  npx playwright install --with-deps
  ```

### Issue 3: "Credentials not working"
**Solution:**
- Verify credential ID in Jenkinsfile matches Jenkins UI
- Make sure credentials are in Global scope
- Check Jenkins logs: **Manage Jenkins → System Log**

### Issue 4: "Cannot create environment.env"
**Solution:**
- Ensure `utils/environment.example.env` exists in git
- Verify workspace permissions

### Issue 5: "Tests timeout"
**Solution:**
- Increase timeout in Jenkinsfile:
  ```groovy
  timeout(time: 3, unit: 'HOURS')  // Increase from 2 to 3
  ```

---

## Step 8: View Test Reports

After a successful build:

1. Go to build page
2. Look for **"Published HTML Reports"** section
3. Click:
   - **Playwright Test Report** - for test details
   - **Allure Test Report** - for analytics

---

## Step 9: Secure Credential Updates

To update the password later:

1. **Go to Jenkins → Manage Credentials**
2. Find **orangehrm-credentials**
3. Click the dropdown → **Update**
4. Enter the new password
5. Click **Save**

All future builds will use the new password ✅

---

## Environment Variables Available in Tests

Inside your Jenkinsfile, these are available:

```groovy
env.WORKSPACE           // Jenkins workspace path
env.BUILD_NUMBER        // Build number (1, 2, 3...)
env.BUILD_URL           // Full build URL
env.JOB_NAME            // Your job name
env.NODE_NAME           // Node/agent name
env.WORKSPACE_DIR       // Full workspace directory
```

You can use these in scripts:
```groovy
bat 'echo Build #${BUILD_NUMBER} running in ${WORKSPACE_DIR}'
```

---

## Next Steps

1. ✅ Push this Jenkinsfile to your master branch:
   ```bash
   git add Jenkinsfile
   git commit -m "Add declarative Jenkinsfile for secure CI/CD"
   git push origin master
   ```

2. ✅ Create Jenkins credential in UI
3. ✅ Update Jenkins job configuration
4. ✅ Run a test build
5. ✅ View reports

---

## 🛠️ FREESTYLE JOB CONFIGURATION (Alternative)

If you prefer to keep using the **Freestyle job** instead of Pipeline, here's the complete configuration:

### Build Steps (Add in this order):

#### Build Step 1: Create environment.env
```
echo Creating environment.env from template...
if not exist "utils\environment.env" (
    copy utils\environment.example.env utils\environment.env
)
```

#### Build Step 2: Inject Environment Variables
- **Add build step:** "Inject environment variables"
- **Properties Content:**
```
BASE_URL=http://orangehrm.qedgetech.com/
```

#### Build Step 3: Set Credentials
- **Add build step:** "Execute Windows batch command"
- **Check:** "Use secret text(s) or file(s) from Jenkins"
- **Select:** `orangehrm-credentials`
- **Command:**
```batch
set Base_Url=%BASE_URL%
set Base_User=%TEST_USER%
set Base_Pass=%TEST_PASS%
```

#### Build Step 4: Install Dependencies
```
call npm install
```

#### Build Step 5: Install Playwright Browsers
```
call npx playwright install --with-deps chromium
```

#### Build Step 6: Run Tests
```
call npm run clean-allure
call npm run Single-Data
```

### Post-build Actions:
1. **Allure Report Generation**
   - Allure results: `allure-results`
   - Report: `allure-report`

2. **Publish HTML Report**
   - HTML directory: `test-reports/playwright-report`
   - Index file: `index.html`

3. **Email Notification**
   - Send email on failure

---

## Quick Reference

| Component | Value |
|-----------|-------|
| Repository | https://github.com/pruthvi1614/OrangeHRM_POM.git |
| Branch | master |
| Pipeline Script Path | Jenkinsfile |
| Credentials ID | orangehrm-credentials |
| Test Command | npm run All-Test |
| Report Location | test-reports/playwright-report |
| Allure Report | allure-report |

---

**Need help?** Check the Jenkins logs at:
`Jenkins Dashboard → Your Job → Build → Console Output`