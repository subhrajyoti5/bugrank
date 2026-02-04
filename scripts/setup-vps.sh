#!/bin/bash
###############################################################################
# BugPulse VPS Setup Script (Automated)
# This script completes Phases 0-3 of JUDGE0_REPLACEMENT_GUIDE.md
# Run this on your VPS to enable code execution
###############################################################################

set -e  # Exit on any error

echo "======================================================================"
echo "🚀 BugPulse VPS Setup - Automated Installation"
echo "======================================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
   echo -e "${RED}❌ Do not run as root. Run as normal user with sudo privileges.${NC}"
   exit 1
fi

echo -e "${GREEN}✓ Running as user: $(whoami)${NC}"
echo ""

###############################################################################
# PHASE 0: VPS PREPARATION
###############################################################################
echo "======================================================================"
echo "📦 PHASE 0: VPS Preparation"
echo "======================================================================"

# Check VPS type
echo -n "Checking VPS type... "
VIRT_TYPE=$(systemd-detect-virt 2>/dev/null || echo "unknown")
if [ "$VIRT_TYPE" != "kvm" ]; then
    echo -e "${RED}❌ FAILED${NC}"
    echo -e "${RED}VPS type is '$VIRT_TYPE', but KVM is required for security.${NC}"
    echo -e "${RED}This setup will NOT work on OpenVZ or LXC containers.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ KVM detected${NC}"

# Update system
echo ""
echo "Updating system packages..."
sudo apt update -qq
echo -e "${GREEN}✓ Package list updated${NC}"

# Install required packages
echo ""
echo "Installing required packages (build-essential, g++, gcc, etc.)..."
sudo apt install -y -qq \
  build-essential \
  g++ \
  gcc \
  util-linux \
  time \
  curl \
  jq \
  git \
  iptables-persistent \
  > /dev/null 2>&1

echo -e "${GREEN}✓ All packages installed${NC}"

# Verify GCC
GCC_VERSION=$(g++ --version | head -n 1)
echo -e "${GREEN}✓ GCC: $GCC_VERSION${NC}"

echo ""
echo -e "${GREEN}✅ PHASE 0 COMPLETE${NC}"
echo ""

###############################################################################
# PHASE 1: SECURITY BASELINE
###############################################################################
echo "======================================================================"
echo "🔐 PHASE 1: Security Setup"
echo "======================================================================"

# Create executor user
echo -n "Creating executor user... "
if id "executor" &>/dev/null; then
    echo -e "${YELLOW}⚠ User already exists${NC}"
else
    sudo useradd -r -m -s /bin/bash executor
    echo "executor:$(openssl rand -base64 12)" | sudo chpasswd
    echo -e "${GREEN}✓ Created${NC}"
fi

# Block network access for executor
echo ""
echo "Blocking network access for executor user..."

# Remove old rules if they exist
sudo iptables -D OUTPUT -m owner --uid-owner executor -j DROP 2>/dev/null || true
sudo iptables -D OUTPUT -m owner --uid-owner executor -j REJECT 2>/dev/null || true

# Add new rules
sudo iptables -A OUTPUT -m owner --uid-owner executor -j DROP
sudo iptables -A OUTPUT -m owner --uid-owner executor -j REJECT

# Save iptables rules
echo iptables-persistent iptables-persistent/autosave_v4 boolean true | sudo debconf-set-selections
echo iptables-persistent iptables-persistent/autosave_v6 boolean true | sudo debconf-set-selections
sudo netfilter-persistent save > /dev/null 2>&1

echo -e "${GREEN}✓ Network blocked for executor${NC}"

# Verify network block
echo -n "Verifying network block... "
if sudo -u executor timeout 2 curl -s google.com &>/dev/null; then
    echo -e "${RED}❌ FAILED - Network still accessible${NC}"
    exit 1
else
    echo -e "${GREEN}✓ Verified${NC}"
fi

# Set resource limits
echo ""
echo "Setting resource limits..."
sudo mkdir -p /etc/security/limits.d

cat << 'EOF' | sudo tee /etc/security/limits.d/executor.conf > /dev/null
executor soft nproc 20
executor hard nproc 30
executor soft nofile 100
executor hard nofile 200
executor soft cpu 10
executor hard cpu 15
executor soft as 262144
executor hard as 524288
EOF

echo -e "${GREEN}✓ Resource limits configured${NC}"

echo ""
echo -e "${GREEN}✅ PHASE 1 COMPLETE${NC}"
echo ""

###############################################################################
# PHASE 2: DIRECTORY STRUCTURE
###############################################################################
echo "======================================================================"
echo "📁 PHASE 2: Directory Structure"
echo "======================================================================"

# Create directories
echo "Creating /srv/bugpulse directory structure..."
sudo mkdir -p /srv/bugpulse/{jobs,runner,logs,temp}

# Set ownership and permissions
sudo chown -R executor:executor /srv/bugpulse
sudo chmod 750 /srv/bugpulse
sudo chmod 770 /srv/bugpulse/jobs
sudo chmod 755 /srv/bugpulse/runner
sudo chmod 755 /srv/bugpulse/logs
sudo chmod 755 /srv/bugpulse/temp

echo -e "${GREEN}✓ Directory structure created:${NC}"
echo "  /srv/bugpulse/"
echo "  ├── jobs/    (execution workspaces)"
echo "  ├── runner/  (execution scripts)"
echo "  ├── logs/    (system logs)"
echo "  └── temp/    (temporary files)"

echo ""
echo -e "${GREEN}✅ PHASE 2 COMPLETE${NC}"
echo ""

###############################################################################
# PHASE 3: RUNNER SCRIPTS
###############################################################################
echo "======================================================================"
echo "⚙️  PHASE 3: Runner Scripts"
echo "======================================================================"

# Create C++ runner script
echo "Creating C++ execution script..."
cat << 'EOFSCRIPT' | sudo tee /srv/bugpulse/runner/run_cpp.sh > /dev/null
#!/bin/bash
set -e

# Configuration
JOB_ID="$1"
TIME_LIMIT=5          # seconds (matches Judge0)
MEM_LIMIT=262144      # KB = 256MB (matches Judge0)
COMPILE_TIMEOUT=10    # seconds

JOB_DIR="/srv/bugpulse/jobs/$JOB_ID"
SRC="$JOB_DIR/main.cpp"
BIN="$JOB_DIR/a.out"
INPUT="$JOB_DIR/input.txt"
OUTPUT="$JOB_DIR/output.txt"
ERROR="$JOB_DIR/error.txt"
COMPILE_ERROR="$JOB_DIR/compile_error.txt"
STATUS="$JOB_DIR/status.txt"

cd "$JOB_DIR" || exit 1

# Compilation Phase
echo "COMPILING" > "$STATUS"
ulimit -t "$COMPILE_TIMEOUT"
ulimit -v "$MEM_LIMIT"

if ! g++ -std=c++17 -O2 -Wall -Wextra main.cpp -o a.out 2> "$COMPILE_ERROR"; then
    echo "CE" > "$STATUS"
    cat "$COMPILE_ERROR" > "$ERROR"
    exit 10
fi

# Execution Phase
echo "RUNNING" > "$STATUS"

# Run with time and resource limits
set +e
/usr/bin/time -f "%e %M" \
timeout "$TIME_LIMIT"s \
sudo -u executor \
"$BIN" < "$INPUT" > "$OUTPUT" 2>> "$ERROR"

EXIT_CODE=$?
set -e

# Determine status
if [ $EXIT_CODE -eq 124 ] || [ $EXIT_CODE -eq 137 ]; then
    echo "TLE" > "$STATUS"
elif [ $EXIT_CODE -ne 0 ]; then
    echo "RE" > "$STATUS"
else
    echo "COMPLETED" > "$STATUS"
fi

exit 0
EOFSCRIPT

sudo chmod +x /srv/bugpulse/runner/run_cpp.sh
sudo chown executor:executor /srv/bugpulse/runner/run_cpp.sh

echo -e "${GREEN}✓ run_cpp.sh created and executable${NC}"

# Create cleanup script
echo ""
echo "Creating cleanup script..."
cat << 'EOFCLEANUP' | sudo tee /srv/bugpulse/runner/cleanup.sh > /dev/null
#!/bin/bash

# Clean up job directories older than 24 hours
find /srv/bugpulse/jobs -type d -mtime +1 -exec rm -rf {} + 2>/dev/null || true

# Clean temp files older than 1 hour
find /srv/bugpulse/temp -type f -mmin +60 -delete 2>/dev/null || true

echo "Cleanup completed at $(date)" >> /srv/bugpulse/logs/cleanup.log
EOFCLEANUP

sudo chmod +x /srv/bugpulse/runner/cleanup.sh
echo -e "${GREEN}✓ cleanup.sh created${NC}"

# Add cleanup to crontab
echo ""
echo "Setting up automatic cleanup (runs every hour)..."
(sudo crontab -l 2>/dev/null | grep -v cleanup.sh; echo "0 * * * * /srv/bugpulse/runner/cleanup.sh") | sudo crontab -
echo -e "${GREEN}✓ Cron job added${NC}"

echo ""
echo -e "${GREEN}✅ PHASE 3 COMPLETE${NC}"
echo ""

###############################################################################
# TEST EXECUTION
###############################################################################
echo "======================================================================"
echo "🧪 TESTING EXECUTION ENVIRONMENT"
echo "======================================================================"

# Create test job
TEST_ID=$(uuidgen || cat /proc/sys/kernel/random/uuid)
TEST_DIR="/srv/bugpulse/jobs/$TEST_ID"

echo "Creating test job: $TEST_ID"
sudo mkdir -p "$TEST_DIR"

# Create test C++ file
cat << 'EOFTEST' | sudo tee "$TEST_DIR/main.cpp" > /dev/null
#include <iostream>
using namespace std;

int main() {
    cout << "Hello from BugPulse VPS!" << endl;
    return 0;
}
EOFTEST

# Create empty input
echo "" | sudo tee "$TEST_DIR/input.txt" > /dev/null

# Set permissions
sudo chown -R executor:executor "$TEST_DIR"

# Run test
echo ""
echo "Running test compilation and execution..."
sudo /srv/bugpulse/runner/run_cpp.sh "$TEST_ID"

# Check results
echo ""
echo "=== Test Results ==="
echo -n "Status: "
STATUS=$(cat "$TEST_DIR/status.txt")
if [ "$STATUS" = "COMPLETED" ]; then
    echo -e "${GREEN}$STATUS ✓${NC}"
else
    echo -e "${RED}$STATUS ✗${NC}"
fi

echo -n "Output: "
OUTPUT=$(cat "$TEST_DIR/output.txt")
if [ "$OUTPUT" = "Hello from BugPulse VPS!" ]; then
    echo -e "${GREEN}$OUTPUT ✓${NC}"
else
    echo -e "${RED}$OUTPUT ✗${NC}"
fi

if [ -f "$TEST_DIR/error.txt" ] && [ -s "$TEST_DIR/error.txt" ]; then
    echo "Errors:"
    cat "$TEST_DIR/error.txt"
fi

# Cleanup test
sudo rm -rf "$TEST_DIR"

echo ""
if [ "$STATUS" = "COMPLETED" ] && [ "$OUTPUT" = "Hello from BugPulse VPS!" ]; then
    echo -e "${GREEN}✅ EXECUTION TEST PASSED${NC}"
else
    echo -e "${RED}❌ EXECUTION TEST FAILED${NC}"
    exit 1
fi

###############################################################################
# SUCCESS
###############################################################################
echo ""
echo "======================================================================"
echo -e "${GREEN}🎉 VPS SETUP COMPLETE!${NC}"
echo "======================================================================"
echo ""
echo "Next steps:"
echo "1. Deploy your backend code to this VPS"
echo "2. Set NODE_ENV=production in your .env file"
echo "3. Install Node.js and start your backend"
echo ""
echo "Your VPS is now ready for code execution!"
echo ""
Also, because you're a big **** no OK, I would like to say, but OK. OK, bro. I think, I think it's it's done. Yeah, it's done. Alright, Steve. Yeah, OK. Thank you. Can I say thanks? You know what? That might be the unfortunate thing I've seen today. Yo, what's up guys? I'm mine and I'm going to try to make you guys laugh today. OK, OK. So I love telling jokes about orphans because what are they going to do, tell their parents? 26 feet tall depends on the hills. Me and my friends started a band. What happened to it? Alive and well, thank you very much. I. There's a cold in India right now. Bonfire. Just. It doesn't turn on the buttons. No, it doesn't turn on like that. You have to turn it on. Turn it on. Hello hello. Hello. I stayed hate this guy but. Please. Then then. Second one no, no, no. This was, this was that was that was it? So the elephant was in the act or the ad was made. I. Me is that these guys are gonna be rich now. Yeah, this is. They're gonna motivate more people now. Next person, please. Hey guys. Yo, what's up? My name is Singh. I'm from New Delhi. I'm 25. Can I hand this out to you? If you make the floor, yes. Alright. So I have a joke now. Knock knock. Who's there? Jake. Jake. Looking for his job. Next. One guess, my favorite numbers between zero to 20. 6 and 7 No 7 eleven. Last one, why doesn't Andrew tape like therapy? Because this thing is for the poor. This time we go bro OK. Thank you. All right, next question please. They said II can make you laugh. I will get a car, I will drive it around Bandra. I'll look at people who dream time. So I score the highest mark in my 10th standard, which is high school. This is what they gave me. This is my master. I'm so black. Hello everyone. My name is 19 years old and I'll be honest, I haven't come here alone today. I have got someone who is like an emotional supporter. He is to me what Mcdonald's was to Tanmay after the AIB roast. So JJ. Will you handle him carefully? Sure, unlike you handle Morpheus. I mean, he just died of natural causes. You'll die. If you fought with that, you know. Well, yes, I guess. Well done. One more. One OK. Alright, number two. Hi guys. Hello. My name is Anubhava. I'm a bisexual. I was this both sides. Whenever I want to have sex girls say bye. Bye. Bisexual. Yes. Bisexual. Yeah. I'm very excited. I just got circumcised today. I wanted to reduce my weight for this show. Just like cut my **** KSI. I'm a boxer just like you. I package boxes for Amazon delivery. It's going good. So shall I kiss it? Where's the consent part of this man? Do you want to try do somebody else to try Microsoft? Why don't you guys have a joke? And he always calls me, he misses India. Always like, hey, I miss India, I miss India. And I'm like, why don't you come back? And he's like, how do I miss India then? You're from NIFT though. Basically, he's asking about. She's a classical singer. She's also a music professor. Professional ethnicity behavior. Favorite stand up comedian? And you have your favorite house. My dad is in parametric. I. This is not Kashmir we won't go through. People from two broken collectors. Shut up the man from broken state. What are you doing on 21st? Spanish. Straight. Hey, Cortana. You are going to go to a relationship. How? What makes you feel secure about a man? India got late in here. I think she knows a lot more about his relations. Hey, Cortana play. Jokes about jokes. I. Tumhe Jerry kesar trayta hai billna tom ticket sahih mili to AA bhai Karnataka. Maggie Ecosystem 80s and 90%. Level. Related otherwise Mexico. Famous. Ecosystem. Silent restructuring firing. If you're not aligned with our AI post future, this is your exit. Yeah, concerning, you can just Google this top tech company. Industry wide message. Upset gold engineer Mona is not enough. Companies want. I. Degree. Please. 