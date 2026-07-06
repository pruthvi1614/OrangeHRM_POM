# 🚨 JENKINS BUILD FIX - Action Steps

Your Jenkins build is failing because credentials are not being passed to tests.

## The Problem
Your current Jenkins job runs `npm install` but:
- ❌ Doesn't create `environment.env`
- ❌ Doesn't inject credentials
- ❌ Doesn't set environment variables (Base_Url, Base_User, Base_Pass)
- ❌ Doesn't install Playwright browsers

## The Solution
I've created a professional **Jenkinsfile** that handles all of this automatically.

---

## ⚡ Quick Fix (5 Minutes)

### Step 1️⃣: Add Jenkins Credentials
1. Open Jenkins: `http://localhost:8080` (or your Jenkins URL)
2. Click **Manage Jenkins** → **Manage Credentials**
3. Click **Add Credentials** (left sidebar)
4. Fill in:
   - **Kind:** Username with password
   - **Username:** `Admin`
   - **Password:** `Qedge123!@#`
   - **ID:** `orangehrm-credentials` ⚠️ (MUST match this exactly)
   - **Description:** OrangeHRM Test Account
5. Click **Create**

### Step 2️⃣: Update Your Jenkins Job
1. Go to your **OrangeHRM_POM job**
2. Click **Configure**
3. Change **"Build"** section to:
   - **Definition:** Pipeline script from SCM
   - **SCM:** Git
   - **Repository URL:** `https://github.com/pruthvi1614/OrangeHRM_POM.git`
   - **Branch:** `*/master`
   - **Script Path:** `Jenkinsfile`
4. Click **Save**

### Step 3️⃣: Run Build
1. Click **Build Now**
2. Watch the console output - should now work! ✅

---

## What the New Jenkinsfile Does

```
Stage 1: Setup
├─ Creates utils/environment.env from template ✅
├─ Checks Node.js installation ✅
└─ Prepares workspace ✅

Stage 2: Install Dependencies
└─ Runs npm install ✅

Stage 3: Install Playwright Browsers
└─ Downloads Playwright dependencies ✅

Stage 4: Run Tests ⭐ KEY STAGE
├─ Gets credentials from Jenkins (orangehrm-credentials) ✅
├─ Sets environment variables (Base_User, Base_Pass) ✅
└─ Runs: npm run All-Test ✅

Stage 5: Generate Reports
└─ Creates Allure reports ✅

Post Build
├─ Archives test results ✅
├─ Publishes HTML reports ✅
└─ Sends email notifications ✅
```

---

## Credential Flow (Secure)

```
Jenkins Credentials Store (Encrypted)
            ↓
    withCredentials() block
            ↓
   Environment Variables
   (Masked in console logs)
            ↓
  process.env.Base_User
  process.env.Base_Pass
            ↓
  Playwright uses credentials ✅
```

✅ Credentials are **NEVER logged** - they're masked in Jenkins console

---

## Files Created

| File | Purpose |
|------|---------|
| **Jenkinsfile** | Pipeline configuration (main fix) |
| **setup-jenkins.bat** | Freestyle job setup script |
| **JENKINS_SETUP_GUIDE.md** | Detailed setup instructions |

Both files are now in GitHub and will be used by Jenkins.

---

## 🛠️ FREESTYLE JOB FIX (Alternative)

If you want to keep using the **Freestyle job** instead of Pipeline, follow these steps:

### Step 1: Add Jenkins Credentials
(Same as Step 1 above - create `orangehrm-credentials`)

### Step 2: Configure Freestyle Job Build Steps

In your **Freestyle job configuration**, add these **Build Steps** in order:

#### Build Step 1: Create environment.env
```
echo Creating environment.env from template...
if not exist "utils\environment.env" (
    copy utils\environment.example.env utils\environment.env
)
```

#### Build Step 2: Inject Credentials
Add **Inject environment variables** build step:
- **Properties Content:**
```
BASE_URL=http://orangehrm.qedgetech.com/
```

#### Build Step 3: Set Credentials (withCredentials)
Add **Execute Windows batch command** with **Use secret text(s) or file(s) from Jenkins** checked:
- **Secret text or file:** Select `orangehrm-credentials`
- **Variable:** `TEST_USER` and `TEST_PASS`
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

### Step 3: Add Post-build Actions
- **Allure Report Generation**
- **Publish HTML Report**
- **Email Notification**

---

## Troubleshooting

### Build still fails?
1. Check **Console Output** for actual error:
   - Click build → **Console Output**
   - Scroll to see what went wrong
   
2. Common issues:
   - ❌ Node.js not installed on Jenkins server
     - Solution: Install Node.js on Jenkins machine
   
   - ❌ Credentials not found
     - Solution: Verify credential ID is exactly `orangehrm-credentials`
   
   - ❌ Playwright browsers missing
     - Solution: Let stage 3 install them (may take 5 mins)

### Need to update credentials later?
1. Go to **Manage Credentials**
2. Click on **orangehrm-credentials**
3. Click dropdown → **Update**
4. Change password
5. Click **Save**

All future builds automatically use new password ✅

---

## Expected Build Output

When successful, console should show:
```
🔧 Stage 1: Setup Environment
   ✅ Created utils/environment.env from template

📦 Stage 2: Install Dependencies  
   ✅ npm install completed successfully

🌐 Stage 3: Install Playwright Browsers
   ✅ Playwright browsers installed

🧪 Stage 4: Run Tests
   ✅ All tests passed

📊 Stage 5: Generate Reports
   ✅ Allure report generated

SUCCESS
```

---

## Next Actions

- [ ] Create Jenkins credential (Step 1)
- [ ] Update Jenkins job configuration (Step 2)
- [ ] Pull latest code in Jenkins workspace
- [ ] Click **Build Now**
- [ ] Review console output
- [ ] View test reports

---

## Full Documentation

For detailed instructions, see: **JENKINS_SETUP_GUIDE.md** (in repo)

---

**Quick Links:**
- Jenkins Credentials: `http://localhost:8080/credentials/`
- Your Job: `http://localhost:8080/job/OrangeHRM_POM/`
- GitHub Repo: `https://github.com/pruthvi1614/OrangeHRM_POM`