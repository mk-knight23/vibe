#!/bin/bash
# VIBE Ecosystem Health Check
# Validates all products build and test successfully

set -e

echo "🏥 VIBE Health Check"
echo "===================="
echo ""

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

FAILED=0

# CLI Health
echo -e "${YELLOW}Checking CLI...${NC}"
cd vibe-cli
if npm run build > /dev/null 2>&1 && npm test > /dev/null 2>&1; then
  TESTS=$(npm test 2>&1 | grep -oE '[0-9]+ passed' | head -1)
  echo -e "${GREEN}✓ CLI: Build OK, $TESTS${NC}"
else
  echo -e "${RED}✗ CLI: FAILED${NC}"
  FAILED=1
fi
cd ..

# Extension Health
echo -e "${YELLOW}Checking Extension...${NC}"
cd vibe-code
if npm run compile > /dev/null 2>&1 && npm test > /dev/null 2>&1; then
  TESTS=$(npm test 2>&1 | grep -oE '[0-9]+ passed' | head -1)
  echo -e "${GREEN}✓ Extension: Build OK, $TESTS${NC}"
else
  echo -e "${RED}✗ Extension: FAILED${NC}"
  FAILED=1
fi
cd ..

# Web Health
echo -e "${YELLOW}Checking Web...${NC}"
cd vibe-web
if npm run build > /dev/null 2>&1; then
  SIZE=$(du -sh dist | cut -f1)
  echo -e "${GREEN}✓ Web: Build OK, $SIZE${NC}"
else
  echo -e "${RED}✗ Web: FAILED${NC}"
  FAILED=1
fi
cd ..

# Security Audit
echo ""
echo -e "${YELLOW}Security Audit...${NC}"
VULNS=0
for dir in vibe-cli vibe-code vibe-web; do
  cd $dir
  AUDIT=$(npm audit 2>&1 | grep -oE '[0-9]+ vulnerabilities' || echo "0 vulnerabilities")
  if [[ "$AUDIT" != "0 vulnerabilities" ]]; then
    echo -e "${YELLOW}⚠ $dir: $AUDIT${NC}"
  fi
  cd ..
done
echo -e "${GREEN}✓ Security audit complete${NC}"

# Summary
echo ""
echo "===================="
if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}✅ All systems healthy${NC}"
  exit 0
else
  echo -e "${RED}❌ Some checks failed${NC}"
  exit 1
fi
