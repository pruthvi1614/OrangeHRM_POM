pipeline {
    agent any
    
    parameters {
        choice(
            name: 'SCRIPT_NAME',
            choices: [
                'All-Test',
                'Single-Data',
                'Multiple-Json',
                'Multiple-Excel',
                'Qualifications'
            ],
            description: 'Select which test script to run'
        )
    }
    
    options {
        timestamps()
        timeout(time: 2, unit: 'HOURS')
        buildDiscarder(logRotator(numToKeepStr: '30'))
    }
    
    environment {
        BASE_URL = 'http://orangehrm.qedgetech.com/'
        NODE_ENV = 'ci'
        WORKSPACE_DIR = "${WORKSPACE}"
        SCRIPT_NAME = "${params.SCRIPT_NAME ?: 'All-Test'}"
    }
    
    stages {
        stage('Setup') {
            steps {
                script {
                    echo "=================================================="
                    echo "🔧 Stage 1: Setup Environment"
                    echo "=================================================="
                    
                    echo "📍 Current workspace: ${WORKSPACE_DIR}"
                    echo "📍 Listing files..."
                    dir("${WORKSPACE_DIR}") {
                        bat 'dir /B'
                    }
                    
                    echo "📍 Creating environment.env from template..."
                    bat '''
                        cd /d "%WORKSPACE_DIR%"
                        if exist "utils\\environment.env" (
                            echo ✅ environment.env already exists
                        ) else (
                            if exist "utils\\environment.example.env" (
                                copy utils\\environment.example.env utils\\environment.env
                                echo ✅ Created utils\\environment.env from template
                            ) else (
                                echo ❌ ERROR: environment.example.env not found
                                exit /b 1
                            )
                        )
                    '''
                }
            }
        }
        
        stage('Install Dependencies') {
            steps {
                script {
                    echo "=================================================="
                    echo "📦 Stage 2: Install Dependencies"
                    echo "=================================================="
                    
                    bat '''
                        cd /d "%WORKSPACE_DIR%"
                        echo Installing npm packages...
                        call npm install
                        if errorlevel 1 (
                            echo ❌ npm install failed
                            exit /b 1
                        )
                        echo ✅ npm install completed successfully
                    '''
                }
            }
        }
        
        stage('Install Playwright Browsers') {
            steps {
                script {
                    echo "=================================================="
                    echo "🌐 Stage 3: Install Playwright Browsers"
                    echo "=================================================="
                    
                    bat '''
                        cd /d "%WORKSPACE_DIR%"
                        echo Installing Playwright browsers...
                        call npx playwright install --with-deps chromium
                        if errorlevel 1 (
                            echo ❌ Playwright install failed
                            exit /b 1
                        )
                        echo ✅ Playwright browsers installed
                    '''
                }
            }
        }
        
        stage('Run Tests') {
            steps {
                script {
                    echo "=================================================="
                    echo "🧪 Stage 4: Run Playwright Tests"
                    echo "Script: ${SCRIPT_NAME}"
                    echo "=================================================="
                    
                    withCredentials([
                        usernamePassword(
                            credentialsId: 'orangehrm-credentials',
                            usernameVariable: 'TEST_USER',
                            passwordVariable: 'TEST_PASS'
                        )
                    ]) {
                        bat '''
                            cd /d "%WORKSPACE_DIR%"
                            
                            echo Setting environment variables...
                            echo User: %TEST_USER%
                            echo Script: %SCRIPT_NAME%
                            echo Running tests...
                            
                            set Base_Url=%BASE_URL%
                            set Base_User=%TEST_USER%
                            set Base_Pass=%TEST_PASS%
                            
                            call npm run %SCRIPT_NAME%
                            if errorlevel 1 (
                                echo ⚠️  Some tests may have failed (checking reports)
                            ) else (
                                echo ✅ All tests passed
                            )
                        '''
                    }
                }
            }
        }
        
        stage('Generate Reports') {
            steps {
                script {
                    echo "=================================================="
                    echo "📊 Stage 5: Generate Reports"
                    echo "=================================================="
                    
                    // Run the PowerShell scripts to parse test results
                    echo "Parsing test results with PowerShell scripts..."
                    bat '''
                        cd /d "%WORKSPACE_DIR%"
                        
                        echo Generating Allure report...
                        call npx allure generate allure-results --clean -o allure-report
                        if errorlevel 1 (
                            echo ⚠️  Allure generation completed with warnings
                        ) else (
                            echo ✅ Allure report generated
                        )
                        
                        echo.
                        echo Parsing test results...
                        powershell -ExecutionPolicy Bypass -File "%WORKSPACE_DIR%\jsonResultsForEmails.ps1"
                        
                        echo.
                        echo Printing test summary...
                        powershell -ExecutionPolicy Bypass -File "%WORKSPACE_DIR%\printResults.ps1"
                        
                        echo.
                        echo Verifying summary files...
                        if exist "%WORKSPACE_DIR%\total.txt" (
                            echo ✅ Summary files created successfully
                            type "%WORKSPACE_DIR%\test-summary.txt"
                        ) else (
                            echo ⚠️  Summary files not found
                        )
                    '''
                }
            }
        }
    }
    
    post {
        always {
            script {
                echo "=================================================="
                echo "📈 Post Build: Publishing Reports"
                echo "=================================================="
                
                // Publish test results
                junit testResults: 'test-results/**/*.xml', 
                      allowEmptyResults: true,
                      skipPublishingChecks: true
                
                // Archive artifacts
                archiveArtifacts artifacts: '''
                    test-results/**,
                    test-reports/**,
                    allure-report/**,
                    allure-results/**,
                    *.txt
                ''', 
                allowEmptyArchive: true
                
                // Publish HTML reports
                publishHTML([
                    reportDir: 'test-reports/playwright-report',
                    reportFiles: 'index.html',
                    reportName: 'Playwright Test Report'
                ])
                
                publishHTML([
                    reportDir: 'allure-report',
                    reportFiles: 'index.html',
                    reportName: 'Allure Test Report'
                ])
                
                cleanWs()
            }
        }
        success {
            script {
                echo "✅ BUILD SUCCESSFUL"
                
                emailext(
                    subject: "✅ Build Success: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                    to: '${DEFAULT_RECIPIENTS}',
                    mimeType: 'text/html',
                    body: '''
                        <div style="font-family:Segoe UI,Arial,sans-serif;background:#f4f6f9;padding:20px;">
                        <div style="max-width:900px;margin:auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #dfe3e8;box-shadow:0 2px 10px rgba(0,0,0,0.08);">
                        
                        <!-- Header -->
                        <div style="background:linear-gradient(90deg,#0d6efd,#4f46e5);padding:25px;color:white;">
                            <h1 style="margin:0;font-size:24px;">
                                🚀 Playwright Automation Execution Report
                            </h1>
                            <p style="margin-top:8px;font-size:13px;opacity:0.9;">
                                Automated Test Execution Summary
                            </p>
                        </div>
                        
                        <div style="padding:25px;">
                        
                            <!-- Build Information -->
                            <h2 style="color:#0d6efd;margin-bottom:15px;">
                                📋 Build Information
                            </h2>
                        
                            <table width="100%" cellpadding="10" cellspacing="0" style="border-collapse:collapse;border:1px solid #e5e7eb;">
                                <tr style="background:#f8fafc;">
                                    <td width="30%"><b>Project Name</b></td>
                                    <td>${PROJECT_NAME}</td>
                                </tr>
                                <tr>
                                    <td><b>Build Number</b></td>
                                    <td>#${BUILD_NUMBER}</td>
                                </tr>
                                <tr style="background:#f8fafc;">
                                    <td><b>Build Status</b></td>
                                    <td>
                                        <span style="background:#28a745;color:white;padding:6px 15px;border-radius:20px;font-weight:bold;">
                                            SUCCESS ✅
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td><b>Build URL</b></td>
                                    <td>
                                        <a href="${BUILD_URL}" style="color:#0d6efd;">
                                            Open Jenkins Build
                                        </a>
                                    </td>
                                </tr>
                                <tr style="background:#f8fafc;">
                                    <td><b>Test Script</b></td>
                                    <td>${SCRIPT_NAME}</td>
                                </tr>
                                <tr>
                                    <td><b>Triggered By</b></td>
                                    <td>${CAUSE}</td>
                                </tr>
                            </table>
                        
                            <br/>
                        
                            <!-- Execution Summary -->
                            <h2 style="color:#0d6efd;">
                                📊 Test Execution Summary
                            </h2>
                        
                            <table width="450" cellpadding="12" cellspacing="0" style="border-collapse:collapse;text-align:center;border:1px solid #dee2e6;">
                                <tr style="background:#343a40;color:white;">
                                    <th style="border:1px solid #dee2e6;">Metric</th>
                                    <th style="border:1px solid #dee2e6;">Count</th>
                                </tr>
                                <tr>
                                    <td style="border:1px solid #dee2e6;">Total Tests</td>
                                    <td style="border:1px solid #dee2e6;">${FILE,path="total.txt"}</td>
                                </tr>
                                <tr style="background:#eafaf1;">
                                    <td style="border:1px solid #dee2e6;color:#198754;"><b>Passed</b></td>
                                    <td style="border:1px solid #dee2e6;color:#198754;"><b>${FILE,path="passed.txt"}</b></td>
                                </tr>
                                <tr style="background:#fdeaea;">
                                    <td style="border:1px solid #dee2e6;color:#dc3545;"><b>Failed</b></td>
                                    <td style="border:1px solid #dee2e6;color:#dc3545;"><b>${FILE,path="failed.txt"}</b></td>
                                </tr>
                                <tr style="background:#fff4db;">
                                    <td style="border:1px solid #dee2e6;color:#ff9800;"><b>Skipped</b></td>
                                    <td style="border:1px solid #dee2e6;color:#ff9800;"><b>${FILE,path="skipped.txt"}</b></td>
                                </tr>
                            </table>
                        
                            <br/>
                        
                            <!-- Quick Access Buttons -->
                            <h2 style="color:#0d6efd;">
                                🔗 Reports & Artifacts
                            </h2>
                        
                            <table cellpadding="8">
                                <tr>
                                    <td>
                                        <a href="${BUILD_URL}" style="background:#0d6efd;color:white;text-decoration:none;padding:12px 18px;border-radius:6px;font-weight:bold;">
                                            Jenkins Build
                                        </a>
                                    </td>
                                    <td>
                                        <a href="${BUILD_URL}Allure_Test_Report" style="background:#6f42c1;color:white;text-decoration:none;padding:12px 18px;border-radius:6px;font-weight:bold;">
                                            Allure Report
                                        </a>
                                    </td>
                                    <td>
                                        <a href="${BUILD_URL}Playwright_Test_Report" style="background:#198754;color:white;text-decoration:none;padding:12px 18px;border-radius:6px;font-weight:bold;">
                                            Playwright Report
                                        </a>
                                    </td>
                                    <td>
                                        <a href="${BUILD_URL}console" style="background:#fd7e14;color:white;text-decoration:none;padding:12px 18px;border-radius:6px;font-weight:bold;">
                                            Console Log
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        
                            <br/>
                        
                            <!-- Footer -->
                            <div style="border-top:1px solid #e5e7eb;padding-top:20px;color:#6b7280;font-size:13px;">
                                Regards,<br/>
                                <b>Jenkins CI/CD Pipeline</b><br/>
                                Automated Notification System
                            </div>
                        
                        </div>
                        </div>
                        </div>
                    '''
                )
            }
        }
        failure {
            script {
                echo "❌ BUILD FAILED"
                
                emailext(
                    subject: "❌ Build Failure: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                    to: '${DEFAULT_RECIPIENTS}',
                    mimeType: 'text/html',
                    body: '''
                        <div style="font-family:Segoe UI,Arial,sans-serif;background:#f4f6f9;padding:20px;">
                        <div style="max-width:900px;margin:auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #dfe3e8;box-shadow:0 2px 10px rgba(0,0,0,0.08);">
                        
                        <!-- Header -->
                        <div style="background:linear-gradient(90deg,#dc3545,#c82333);padding:25px;color:white;">
                            <h1 style="margin:0;font-size:24px;">
                                🚨 Playwright Automation Execution Report
                            </h1>
                            <p style="margin-top:8px;font-size:13px;opacity:0.9;">
                                Automated Test Execution Summary
                            </p>
                        </div>
                        
                        <div style="padding:25px;">
                        
                            <!-- Build Information -->
                            <h2 style="color:#dc3545;margin-bottom:15px;">
                                📋 Build Information
                            </h2>
                        
                            <table width="100%" cellpadding="10" cellspacing="0" style="border-collapse:collapse;border:1px solid #e5e7eb;">
                                <tr style="background:#f8fafc;">
                                    <td width="30%"><b>Project Name</b></td>
                                    <td>${PROJECT_NAME}</td>
                                </tr>
                                <tr>
                                    <td><b>Build Number</b></td>
                                    <td>#${BUILD_NUMBER}</td>
                                </tr>
                                <tr style="background:#fdeaea;">
                                    <td><b>Build Status</b></td>
                                    <td>
                                        <span style="background:#dc3545;color:white;padding:6px 15px;border-radius:20px;font-weight:bold;">
                                            FAILED ❌
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td><b>Build URL</b></td>
                                    <td>
                                        <a href="${BUILD_URL}" style="color:#dc3545;">
                                            Open Jenkins Build
                                        </a>
                                    </td>
                                </tr>
                                <tr style="background:#f8fafc;">
                                    <td><b>Test Script</b></td>
                                    <td>${SCRIPT_NAME}</td>
                                </tr>
                                <tr>
                                    <td><b>Triggered By</b></td>
                                    <td>${CAUSE}</td>
                                </tr>
                            </table>
                        
                            <br/>
                        
                            <!-- Execution Summary -->
                            <h2 style="color:#dc3545;">
                                📊 Test Execution Summary
                            </h2>
                        
                            <table width="450" cellpadding="12" cellspacing="0" style="border-collapse:collapse;text-align:center;border:1px solid #dee2e6;">
                                <tr style="background:#343a40;color:white;">
                                    <th style="border:1px solid #dee2e6;">Metric</th>
                                    <th style="border:1px solid #dee2e6;">Count</th>
                                </tr>
                                <tr>
                                    <td style="border:1px solid #dee2e6;">Total Tests</td>
                                    <td style="border:1px solid #dee2e6;">${FILE,path="total.txt"}</td>
                                </tr>
                                <tr style="background:#eafaf1;">
                                    <td style="border:1px solid #dee2e6;color:#198754;"><b>Passed</b></td>
                                    <td style="border:1px solid #dee2e6;color:#198754;"><b>${FILE,path="passed.txt"}</b></td>
                                </tr>
                                <tr style="background:#fdeaea;">
                                    <td style="border:1px solid #dee2e6;color:#dc3545;"><b>Failed</b></td>
                                    <td style="border:1px solid #dee2e6;color:#dc3545;"><b>${FILE,path="failed.txt"}</b></td>
                                </tr>
                                <tr style="background:#fff4db;">
                                    <td style="border:1px solid #dee2e6;color:#ff9800;"><b>Skipped</b></td>
                                    <td style="border:1px solid #dee2e6;color:#ff9800;"><b>${FILE,path="skipped.txt"}</b></td>
                                </tr>
                            </table>
                        
                            <br/>
                        
                            <!-- Quick Access Buttons -->
                            <h2 style="color:#dc3545;">
                                🔗 Reports & Artifacts
                            </h2>
                        
                            <table cellpadding="8">
                                <tr>
                                    <td>
                                        <a href="${BUILD_URL}" style="background:#dc3545;color:white;text-decoration:none;padding:12px 18px;border-radius:6px;font-weight:bold;">
                                            Jenkins Build
                                        </a>
                                    </td>
                                    <td>
                                        <a href="${BUILD_URL}Allure_Test_Report" style="background:#6f42c1;color:white;text-decoration:none;padding:12px 18px;border-radius:6px;font-weight:bold;">
                                            Allure Report
                                        </a>
                                    </td>
                                    <td>
                                        <a href="${BUILD_URL}Playwright_Test_Report" style="background:#198754;color:white;text-decoration:none;padding:12px 18px;border-radius:6px;font-weight:bold;">
                                            Playwright Report
                                        </a>
                                    </td>
                                    <td>
                                        <a href="${BUILD_URL}console" style="background:#fd7e14;color:white;text-decoration:none;padding:12px 18px;border-radius:6px;font-weight:bold;">
                                            Console Log
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        
                            <br/>
                        
                            <!-- Build Log Preview -->
                            <h2 style="color:#dc3545;">
                                📄 Build Log Preview
                            </h2>
                        
                            <div style="background:#1e293b;color:#e2e8f0;padding:15px;border-radius:8px;font-family:Consolas,monospace;font-size:12px;max-height:300px;overflow:auto;">
                                ${BUILD_LOG,maxLines=50}
                            </div>
                        
                            <br/>
                        
                            <!-- Footer -->
                            <div style="border-top:1px solid #e5e7eb;padding-top:20px;color:#6b7280;font-size:13px;">
                                Regards,<br/>
                                <b>Jenkins CI/CD Pipeline</b><br/>
                                Automated Notification System
                            </div>
                        
                        </div>
                        </div>
                        </div>
                    '''
                )
            }
        }
    }
}
