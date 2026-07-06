@echo off
REM Team Setup Script for Windows - Run after cloning the repository
REM This script configures the project with proper security measures

setlocal enabledelayedexpansion

echo ==================================================
echo 🚀 OrangeHRM POM Framework - Team Setup (Windows)
echo ==================================================

REM Step 1: Install node modules
echo.
echo [Step 1] Installing dependencies...
call npm install

REM Step 2: Setup environment file
echo.
echo [Step 2] Setting up environment configuration...
if not exist "utils\environment.env" (
    if exist "utils\environment.example.env" (
        echo Creating utils\environment.env from template...
        copy utils\environment.example.env utils\environment.env
        echo.
        echo ⚠️  IMPORTANT: Edit utils\environment.env with your actual credentials
        echo    DO NOT commit this file to git!
        echo ✅ utils\environment.env created
    ) else (
        echo ❌ Template file not found: utils\environment.example.env
        echo    Please create utils\environment.env manually
    )
) else (
    echo ✅ utils\environment.env already exists
)

REM Step 3: Verify .gitignore
echo.
echo [Step 3] Verifying security .gitignore...
findstr /M "utils/environment.env" .gitignore >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ utils\environment.env is properly ignored by git
) else (
    echo ❌ Warning: utils\environment.env is not in .gitignore
)

REM Step 4: Setup instructions
echo.
echo [Step 4] Final setup instructions...
echo.
echo IMPORTANT NEXT STEPS:
echo.
echo 1️⃣  Edit your credentials in: utils\environment.env
echo.
echo 2️⃣  Add your actual login credentials:
echo    Base_Url=http://orangehrm.qedgetech.com/
echo    Base_User=Admin
echo    Base_Pass=YOUR_ACTUAL_PASSWORD_HERE
echo.
echo 3️⃣  Verify the file is ignored by git:
echo    git status  (should NOT show utils\environment.env)
echo.
echo 4️⃣  Run tests:
echo    npm run All-Test
echo.

REM Step 5: Open environment.env in editor
echo.
echo Opening utils\environment.env for editing...
echo (Please update with your credentials)
echo.
timeout /t 3

REM Uncomment the line below to open in default editor
REM start utils\environment.env

echo.
echo ==================================================
echo ✅ Setup complete! You're ready to run tests.
echo ==================================================
echo.
echo For more details, see: CREDENTIAL_MANAGEMENT_ARCHITECTURE.md
echo.

pause
