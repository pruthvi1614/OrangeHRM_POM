# Credential Management Architecture

## Overview
This document outlines the enterprise-grade credential management strategy for the OrangeHRM POM Framework.

## Problem Statement
- Automation frameworks require credentials for testing
- Credentials must never be exposed in version control
- Different environments (dev/qa/staging/prod) may require different credentials
- Both local developers and CI/CD pipelines need secure access

## Solution Architecture

### Layer 1: Local Development Environment
```
Developer Machine
├── Clone Repository
├── Copy environment.example.env → environment.env
├── Add actual credentials to environment.env
└── environment.env stays local (in .gitignore)
```

**Files:**
- `utils/environment.example.env` - Template (committed to git)
- `utils/environment.env` - Actual credentials (NOT committed)

### Layer 2: Version Control (Git)
```
.gitignore entries:
├── utils/environment.env         (prevent credential commits)
├── .env                          (fallback .env file)
├── .env.local                    (local environment overrides)
└── .env.*.local                  (environment-specific local files)
```

**Why this approach:**
- Developers can't accidentally commit credentials
- Template file guides new developers
- Different developers can use different credentials for same environment

### Layer 3: CI/CD Pipeline
```
GitHub/GitLab/Jenkins
├── Store credentials as Platform Secrets
├── Inject as environment variables at runtime
├── Tests run with injected credentials
└── Credentials never stored in repository or artifacts
```

**Example - GitHub Actions:**
```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Run Tests
        env:
          Base_Url: ${{ secrets.BASE_URL }}
          Base_User: ${{ secrets.BASE_USER }}
          Base_Pass: ${{ secrets.BASE_PASS }}
        run: npm run All-Test
```

### Layer 4: Credential Loading Strategy
```
Priority Order (in playwright.config.ts):
1. Environment Variables (from CI/CD or system)
2. Local .env files (environment.env)
3. Command-line arguments
4. Default/fallback values
```

**Current Implementation:**
```typescript
dotenv.config({ path: path.resolve(__dirname, './utils/environment.env') });

// Later in config:
baseURL: process.env.Base_Url ?? undefined
```

## Implementation Checklist

### ✅ Already Completed
- [x] Updated `.gitignore` to exclude `utils/environment.env`
- [x] Created `utils/environment.example.env` template
- [x] Updated README with setup instructions
- [x] Added security best practices documentation

### ✅ For Local Development
- [ ] Each developer copies `environment.example.env` to `environment.env`
- [ ] Fill in actual credentials in local `environment.env`
- [ ] Verify `.gitignore` is working: `git status` should NOT show `environment.env`

### ✅ For CI/CD Setup (when ready)
- [ ] Create secret variables in your Git platform:
  - `BASE_URL`
  - `BASE_USER`
  - `BASE_PASS`
- [ ] Update CI/CD workflow to inject these variables
- [ ] Test that credentials work in pipeline
- [ ] Verify no credentials appear in logs or artifacts

### ✅ For Already-Exposed Credentials (URGENT)
If `environment.env` was already committed to git history:
```bash
# Step 1: Stop using that password immediately
# Step 2: Remove file from git history
git rm --cached utils/environment.env
git commit -m "Remove environment.env with sensitive data"
git push origin main

# Step 3: Force colleagues to rebase
# Step 4: CHANGE THE PASSWORD in the actual application!
# Step 5: Update all CI/CD secrets with new password
```

## Environment Variable Naming Convention

**Standards:**
- Use `SCREAMING_SNAKE_CASE` for CI/CD secrets
- Use original camelCase for local `.env` files
- Keep names descriptive and consistent

**Mapping:**
```
Local (environment.env)          CI/CD Secrets (GitHub)
Base_Url                    →    BASE_URL
Base_User                   →    BASE_USER
Base_Pass                   →    BASE_PASS
```

## Security Audit Checklist

Run these commands regularly to audit security:

```bash
# Check if environment.env is properly ignored
git check-ignore -v utils/environment.env

# View git history for sensitive files
git log --all --name-status | grep environment

# Search for credential patterns in history
git log --all -S "password" --pretty=format:"%h %s"

# Check committed secrets (requires git-secrets tool)
git secrets --scan
```

## Tools for Enhanced Security

1. **git-secrets** - Prevent committing credentials
   ```bash
   brew install git-secrets
   git secrets --install
   git secrets --register-aws
   ```

2. **detect-secrets** - Python-based secret detection
   ```bash
   pip install detect-secrets
   detect-secrets scan
   ```

3. **TruffleHog** - Git history scanner
   ```bash
   trufflehog git https://github.com/username/repo
   ```

## Password Rotation Policy

**Recommendation:**
- Rotate credentials quarterly (every 3 months)
- Rotate immediately after any exposure
- Use unique credentials per environment
- Keep audit logs of rotations

## Q&A

**Q: Why not use Vault or HashiCorp?**
A: For smaller teams, environment variables via CI/CD secrets are sufficient. Vault can be introduced later for complex deployments.

**Q: Can developers share environment.env?**
A: NO - Credentials should never be shared. Each developer maintains their own local copy.

**Q: What if I accidentally committed environment.env?**
A: Follow the "Already-Exposed Credentials" section - it's a security incident requiring password rotation.

**Q: Should I encrypt environment.env?**
A: No - it's ignored by git. Don't add complexity. Use CI/CD secrets for production.

---

**Last Updated:** 2026-07-06
**Reviewed by:** Senior Architecture Team
