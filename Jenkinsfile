pipeline {
    agent any
    
    options {
        timestamps()
        timeout(time: 2, unit: 'HOURS')
        buildDiscarder(logRotator(numToKeepStr: '30'))
    }
    
    environment {
        BASE_URL = 'http://orangehrm.qedgetech.com/'
        NODE_ENV = 'ci'
        WORKSPACE_DIR = "${WORKSPACE}"
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
                            echo Running tests...
                            
                            set Base_Url=%BASE_URL%
                            set Base_User=%TEST_USER%
                            set Base_Pass=%TEST_PASS%
                            
                            call npm run All-Test
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
                    
                    bat '''
                        cd /d "%WORKSPACE_DIR%"
                        echo Generating Allure report...
                        call npx allure generate allure-results --clean -o allure-report
                        if errorlevel 1 (
                            echo ⚠️  Allure generation completed with warnings
                        ) else (
                            echo ✅ Allure report generated
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
                    allure-results/**
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
                    body: """
                        Build: ${env.BUILD_URL}
                        
                        ✅ All Playwright tests completed
                        
                        View Reports:
                        - Playwright: ${env.BUILD_URL}Playwright_Test_Report/
                        - Allure: ${env.BUILD_URL}Allure_Test_Report/
                    """.stripIndent(),
                    to: '${DEFAULT_RECIPIENTS}'
                )
            }
        }
        failure {
            script {
                echo "❌ BUILD FAILED"
                emailext(
                    subject: "❌ Build Failure: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                    body: """
                        Build: ${env.BUILD_URL}
                        
                        ❌ Build failed during test execution
                        
                        Check the console output at:
                        ${env.BUILD_URL}console
                        
                        View Reports:
                        - Playwright: ${env.BUILD_URL}Playwright_Test_Report/
                        - Allure: ${env.BUILD_URL}Allure_Test_Report/
                    """.stripIndent(),
                    to: '${DEFAULT_RECIPIENTS}'
                )
            }
        }
    }
}
