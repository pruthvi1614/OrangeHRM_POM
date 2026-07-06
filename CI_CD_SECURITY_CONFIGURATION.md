# CI/CD Configuration Guide for Secure Credential Management

## GitHub Actions Configuration

### Setup

1. Go to your repository on GitHub
2. Navigate to **Settings → Secrets and variables → Actions**
3. Add these repository secrets:
   - `BASE_URL` = `http://orangehrm.qedgetech.com/`
   - `BASE_USER` = `Admin`
   - `BASE_PASS` = `your_actual_password`

### Workflow File: `.github/workflows/playwright-tests.yml`

```yaml
name: Playwright Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]
  schedule:
    - cron: '0 2 * * 0'  # Run weekly on Sunday at 2 AM

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
      - name: Checkout repository
        uses: actions/checkout@v3
      
      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
      
      - name: Create environment file from template
        run: cp utils/environment.example.env utils/environment.env
      
      - name: Run Playwright tests
        env:
          Base_Url: ${{ secrets.BASE_URL }}
          Base_User: ${{ secrets.BASE_USER }}
          Base_Pass: ${{ secrets.BASE_PASS }}
        run: npm run All-Test
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: test-results/
          retention-days: 30
      
      - name: Generate Allure report
        if: always()
        run: |
          npx allure generate allure-results --clean -o allure-report
      
      - name: Upload Allure report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: allure-report
          path: allure-report/
          retention-days: 30
      
      - name: Comment PR with results
        if: github.event_name == 'pull_request' && always()
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            const results = JSON.parse(fs.readFileSync('test-results/results.json', 'utf8'));
            const passed = results.stats.expected;
            const failed = results.stats.unexpected;
            
            const comment = `## Test Results
            - ✅ Passed: ${passed}
            - ❌ Failed: ${failed}
            - 📊 Total: ${results.stats.expected + results.stats.unexpected}`;
            
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: comment
            });
```

---

## GitLab CI Configuration

### Setup

1. Go to your repository on GitLab
2. Navigate to **Settings → CI/CD → Variables**
3. Add these variables (mark as **Protected** and **Masked**):
   - `BASE_URL` = `http://orangehrm.qedgetech.com/`
   - `BASE_USER` = `Admin`
   - `BASE_PASS` = `your_actual_password`

### Pipeline File: `.gitlab-ci.yml`

```yaml
stages:
  - test
  - report

variables:
  npm_config_cache: "$CI_PROJECT_DIR/.npm"
  PLAYWRIGHT_JUNIT_OUTPUT_NAME: junit.xml

cache:
  paths:
    - .npm
    - node_modules/

test:
  stage: test
  image: node:20-alpine
  
  before_script:
    - npm ci
    - npx playwright install --with-deps chromium
    - cp utils/environment.example.env utils/environment.env
  
  script:
    - npm run All-Test
  
  env:
    Base_Url: $BASE_URL
    Base_User: $BASE_USER
    Base_Pass: $BASE_PASS
  
  artifacts:
    when: always
    paths:
      - test-results/
      - allure-results/
      - test-reports/
    reports:
      junit: test-results/results.json
    expire_in: 30 days
  
  only:
    - main
    - develop
    - merge_requests
  
  allow_failure: false

allure-report:
  stage: report
  image: node:20-alpine
  
  dependencies:
    - test
  
  script:
    - npm install -g allure-commandline
    - allure generate allure-results --clean -o allure-report
  
  artifacts:
    paths:
      - allure-report/
    expire_in: 30 days
  
  only:
    - main
    - develop
  
  when: always
```

---

## Jenkins Pipeline Configuration

### Setup

1. Go to Jenkins Credentials
2. Add Credential of type "Username with password":
   - Username: `Admin`
   - Password: `your_actual_password` (keep it masked!)
3. Store credential ID as: `orangehrm-credentials`

### Jenkinsfile

```groovy
pipeline {
    agent any
    
    options {
        timestamps()
        timeout(time: 1, unit: 'HOURS')
        buildDiscarder(logRotator(numToKeepStr: '30'))
    }
    
    environment {
        BASE_URL = 'http://orangehrm.qedgetech.com/'
        NODE_ENV = 'ci'
    }
    
    stages {
        stage('Setup') {
            steps {
                script {
                    echo "🔧 Installing dependencies..."
                    sh 'npm ci'
                    sh 'cp utils/environment.example.env utils/environment.env'
                }
            }
        }
        
        stage('Run Tests') {
            steps {
                script {
                    echo "🧪 Running Playwright tests..."
                    withCredentials([
                        usernamePassword(
                            credentialsId: 'orangehrm-credentials',
                            usernameVariable: 'BASE_USER',
                            passwordVariable: 'BASE_PASS'
                        )
                    ]) {
                        sh '''
                            export Base_Url=$BASE_URL
                            export Base_User=$BASE_USER
                            export Base_Pass=$BASE_PASS
                            npm run All-Test
                        '''
                    }
                }
            }
        }
        
        stage('Generate Reports') {
            steps {
                script {
                    echo "📊 Generating Allure report..."
                    sh 'npx allure generate allure-results --clean -o allure-report'
                }
            }
            post {
                always {
                    // Publish test results
                    junit 'test-results/*.xml'
                    
                    // Publish artifacts
                    archiveArtifacts artifacts: 'test-results/**', 
                                     allowEmptyArchive: true
                }
            }
        }
    }
    
    post {
        always {
            echo "Cleaning up..."
            cleanWs()
        }
        success {
            echo "✅ Tests passed successfully!"
        }
        failure {
            echo "❌ Tests failed!"
            emailext(
                subject: "Test Failure: ${env.JOB_NAME} - ${env.BUILD_NUMBER}",
                body: "Build failed. Check console output at ${env.BUILD_URL}",
                to: '${DEFAULT_RECIPIENTS}'
            )
        }
    }
}
```

---

## Azure DevOps Pipeline Configuration

### Setup

1. Go to **Pipelines → Library → Secure files**
2. Create variable group `OrangeHRM-Secrets`:
   - `BASE_URL` = `http://orangehrm.qedgetech.com/`
   - `BASE_USER` = `Admin` (mark as secret)
   - `BASE_PASS` = `your_password` (mark as secret)

### Pipeline File: `azure-pipelines.yml`

```yaml
trigger:
  - main
  - develop

pr:
  - main
  - develop

pool:
  vmImage: 'ubuntu-latest'

variables:
  npm_config_cache: $(Pipeline.Workspace)/.npm

stages:
  - stage: Test
    displayName: 'Run Tests'
    jobs:
      - job: PlaywrightTests
        displayName: 'Playwright Tests'
        
        steps:
          - task: NodeTool@0
            inputs:
              versionSpec: '18.x'
            displayName: 'Install Node.js'
          
          - task: Cache@2
            inputs:
              key: 'npm | "$(Agent.OS)" | package-lock.json'
              restoreKeys: |
                npm | "$(Agent.OS)"
              path: $(npm_config_cache)
            displayName: 'Cache npm packages'
          
          - task: Npm@1
            inputs:
              command: 'ci'
            displayName: 'Install dependencies'
          
          - script: npx playwright install --with-deps
            displayName: 'Install Playwright browsers'
          
          - script: cp utils/environment.example.env utils/environment.env
            displayName: 'Create environment file'
          
          - task: VariableGroupAccess@1
            inputs:
              variableGroupName: 'OrangeHRM-Secrets'
          
          - script: npm run All-Test
            env:
              Base_Url: $(BASE_URL)
              Base_User: $(BASE_USER)
              Base_Pass: $(BASE_PASS)
            displayName: 'Run tests'
          
          - task: PublishTestResults@2
            condition: succeededOrFailed()
            inputs:
              testResultsFormat: 'JUnit'
              testResultsFiles: '**/junit.xml'
            displayName: 'Publish test results'
          
          - task: PublishBuildArtifacts@1
            condition: always()
            inputs:
              PathtoPublish: 'test-results'
              ArtifactName: 'test-results'
            displayName: 'Publish artifacts'
```

---

## Security Best Practices for CI/CD

### ✅ DO:
- Use platform-specific secret management (GitHub Secrets, GitLab Variables, etc.)
- Mark secrets as **protected** and **masked** in CI/CD
- Rotate credentials regularly
- Use separate credentials for dev/qa/prod environments
- Store only the **password** in secrets (URL and username can be hardcoded)
- Audit CI/CD logs to ensure no secrets appear

### ❌ DON'T:
- Hardcode credentials in pipeline files
- Log secrets or environment variables
- Share CI/CD credentials via email
- Use same credentials across environments
- Store credentials in repository files
- Use plain text for sensitive data

---

## Monitoring and Auditing

### GitHub
```bash
# Check if credentials appear in logs
gh run view <run-id> --log
```

### GitLab
```bash
# View pipeline logs (credentials should be masked)
gitlab ci logs <project_id> <pipeline_id>
```

### Jenkins
- Use Jenkins credentials masking in logs
- Enable audit logging for credential access
- Review pipeline logs regularly

---

## Incident Response

If credentials are exposed in CI/CD logs:

1. **IMMEDIATELY rotate the password**
2. **Delete the exposed log** (if possible)
3. **Revoke the exposed credentials** from CI/CD platform
4. **Add new credentials** to CI/CD platform
5. **Update all dependent systems** with new credentials
6. **Document the incident** and lessons learned

---

**Last Updated:** 2026-07-06
