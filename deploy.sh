#!/bin/bash
###############################################################################
# BugPulse Automated Deployment Script
# This script handles code updates, dependency installation, and server restart
###############################################################################

set -e  # Exit on any error

# Configuration
PROJECT_ROOT="/root/bugrank"
PM2_PROCESS_NAME="bugpulse"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "======================================================================"
echo "🚀 Starting Deployment: $(date)"
echo "======================================================================"

# 1. Navigate to project root
cd "$PROJECT_ROOT" || { echo -e "${RED}❌ Project directory not found at $PROJECT_ROOT!${NC}"; exit 1; }

# 2. Pull latest changes
echo -e "${YELLOW}📥 Pulling latest code from Git...${NC}"
git pull origin master
echo -e "${GREEN}✓ Code updated${NC}"

# 3. Handle shared package
echo -e "${YELLOW}📦 Updating shared package...${NC}"
cd shared
npm install
cd ..

# 4. Handle Server
echo -e "${YELLOW}⚙️  Updating Server...${NC}"
cd server
echo "Installing server dependencies..."
npm install
echo "Building server..."
npm run build
cd ..

# 5. Restart PM2 Process
echo -e "${YELLOW}🔄 Restarting PM2 process: $PM2_PROCESS_NAME...${NC}"
# Check if process exists, if not start it, if yes restart it
if pm2 show "$PM2_PROCESS_NAME" > /dev/null 2>&1; then
    pm2 restart "$PM2_PROCESS_NAME"
else
    cd server
    pm2 start dist/index.js --name "$PM2_PROCESS_NAME"
    cd ..
fi

echo -e "${GREEN}✓ Process restarted${NC}"

# 6. Final status
echo ""
pm2 status "$PM2_PROCESS_NAME"

echo "======================================================================"
echo -e "${GREEN}🎉 DEPLOYMENT SUCCESSFUL!${NC}"
echo "======================================================================"
