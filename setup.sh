#!/bin/bash
# Team Setup Script - Run this after cloning the repository
# This script configures the project with proper security measures

echo "=================================================="
echo "🚀 OrangeHRM POM Framework - Team Setup"
echo "=================================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Step 1: Install node modules
echo -e "\n${BLUE}Step 1: Installing dependencies...${NC}"
npm install

# Step 2: Setup Git hooks
echo -e "\n${BLUE}Step 2: Setting up Git security hooks...${NC}"
if [ -f "hooks/pre-commit" ]; then
    cp hooks/pre-commit .git/hooks/pre-commit
    chmod +x .git/hooks/pre-commit
    echo -e "${GREEN}✅ Pre-commit hook installed${NC}"
else
    echo -e "${YELLOW}⚠️  Pre-commit hook file not found${NC}"
fi

# Step 3: Setup environment file
echo -e "\n${BLUE}Step 3: Setting up environment configuration...${NC}"
if [ ! -f "utils/environment.env" ]; then
    if [ -f "utils/environment.example.env" ]; then
        echo -e "${YELLOW}Creating utils/environment.env from template...${NC}"
        cp utils/environment.example.env utils/environment.env
        echo -e "${YELLOW}⚠️  IMPORTANT: Edit utils/environment.env with your actual credentials${NC}"
        echo -e "${YELLOW}   DO NOT commit this file to git!${NC}"
        echo -e "${GREEN}✅ utils/environment.env created${NC}"
    else
        echo -e "${RED}❌ Template file not found: utils/environment.example.env${NC}"
        echo -e "${YELLOW}   Please create utils/environment.env manually${NC}"
    fi
else
    echo -e "${GREEN}✅ utils/environment.env already exists${NC}"
fi

# Step 4: Verify .gitignore
echo -e "\n${BLUE}Step 4: Verifying security .gitignore...${NC}"
if grep -q "utils/environment.env" .gitignore; then
    echo -e "${GREEN}✅ utils/environment.env is properly ignored by git${NC}"
else
    echo -e "${RED}❌ Warning: utils/environment.env is not in .gitignore${NC}"
fi

# Step 5: Verify credentials are not in history
echo -e "\n${BLUE}Step 5: Checking git history for exposed credentials...${NC}"
if git log --all -p -- utils/environment.env 2>/dev/null | grep -i "Base_Pass" | head -1; then
    echo -e "${RED}❌ WARNING: Credentials may be exposed in git history!${NC}"
    echo -e "${YELLOW}   This is a security issue that needs immediate attention.${NC}"
    echo -e "${YELLOW}   See CREDENTIAL_MANAGEMENT_ARCHITECTURE.md for remediation steps.${NC}"
else
    echo -e "${GREEN}✅ No credentials found in git history${NC}"
fi

# Step 6: Setup instructions
echo -e "\n${BLUE}Step 6: Final setup instructions...${NC}"
echo -e "${YELLOW}IMPORTANT NEXT STEPS:${NC}"
echo ""
echo -e "${YELLOW}1️⃣  Edit your credentials:${NC}"
echo "   nano utils/environment.env  (or use your editor)"
echo ""
echo -e "${YELLOW}2️⃣  Add your actual login credentials:${NC}"
echo "   Base_Url=http://orangehrm.qedgetech.com/"
echo "   Base_User=Admin"
echo "   Base_Pass=YOUR_ACTUAL_PASSWORD_HERE"
echo ""
echo -e "${YELLOW}3️⃣  Verify the file is ignored by git:${NC}"
echo "   git status  (should NOT show utils/environment.env)"
echo ""
echo -e "${YELLOW}4️⃣  Run tests:${NC}"
echo "   npm run All-Test"
echo ""

# Step 7: Verify setup
echo -e "\n${BLUE}Step 7: Verifying setup...${NC}"

# Check if environment.env has been customized
if grep -q "YOUR_PASSWORD_HERE" utils/environment.env; then
    echo -e "${YELLOW}⚠️  Credentials not yet configured${NC}"
    echo -e "${YELLOW}   Please update utils/environment.env with actual values${NC}"
else
    echo -e "${GREEN}✅ Looks like credentials are configured${NC}"
fi

echo -e "\n${GREEN}=================================================="
echo "✅ Setup complete! You're ready to run tests."
echo "=================================================="
echo -e "\nFor more details, see: CREDENTIAL_MANAGEMENT_ARCHITECTURE.md${NC}\n"
