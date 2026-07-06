@echo off
REM Jenkins Setup Script for Windows - Automated setup for CI/CD
REM This script is designed to run in Jenkins freestyle jobs

setlocal enabledelayedexpansion

echo ==================================================
echo 🚀 Jenkins Freestyle Job Setup
echo ==================================================

REM Step 1: Create environment.env from template
echo.
echo [Step 1] Creating environment.env from template...
if exist "utils\environment.env" (
    echo ✅ environment.env already exists
) else (
    if exist "utils\environment.example.env" (
        copy utils\environment.example.env utils\environment.env >nul
        echo ✅ Created utils\environment.env from template
    ) else (
        echo ❌ ERROR: environment.example.env not found
        exit /b 1
    )
)

REM Step 2: Set environment variables for Playwright tests
echo.
echo [Step 2] Setting environment variables...
if "%BASE_URL%"=="" (
    set BASE_URL=http://orangehrm.qedgetech.com/
    echo Using default BASE_URL: %BASE_URL%
)
if "%TEST_USER%"=="" (
    set TEST_USER=Admin
    echo Using default TEST_USER: %TEST_USER%
)
if "%TEST_PASS%"=="" (
    echo ❌ WARNING: TEST_PASS not set. Please configure in Jenkins.
)

REM Export variables for the test process
set Base_Url=%BASE_URL%
set Base_User=%TEST_USER%
set Base_Pass=%TEST_PASS%

echo ✅ Environment variables set
echo    Base_Url=%Base_Url%
echo    Base_User=%Base_User%

echo.
echo ==================================================
echo ✅ Jenkins setup complete!
echo ==================================================