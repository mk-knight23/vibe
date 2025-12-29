#!/bin/bash
# VIBE Ecosystem Release Script
# Usage: ./scripts/release.sh [cli|extension|web|all] [patch|minor|major]

set -e

PRODUCT=${1:-all}
BUMP=${2:-patch}

echo "🚀 VIBE Release Script"
echo "======================"
echo "Product: $PRODUCT"
echo "Bump: $BUMP"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Ensure clean working directory
if [[ -n $(git status --porcelain) ]]; then
  echo -e "${RED}Error: Working directory not clean${NC}"
  exit 1
fi

# Function to bump version
bump_version() {
  local dir=$1
  local name=$2
  
  echo -e "${YELLOW}Bumping $name version...${NC}"
  cd "$dir"
  npm version $BUMP --no-git-tag-version
  VERSION=$(node -p "require('./package.json').version")
  cd ..
  echo -e "${GREEN}✓ $name: v$VERSION${NC}"
}

# Function to run tests
run_tests() {
  local dir=$1
  local name=$2
  
  echo -e "${YELLOW}Testing $name...${NC}"
  cd "$dir"
  npm test
  cd ..
  echo -e "${GREEN}✓ $name tests passed${NC}"
}

# CLI Release
if [[ "$PRODUCT" == "cli" || "$PRODUCT" == "all" ]]; then
  echo ""
  echo "📦 CLI Release"
  echo "--------------"
  bump_version "vibe-cli" "CLI"
  run_tests "vibe-cli" "CLI"
fi

# Extension Release
if [[ "$PRODUCT" == "extension" || "$PRODUCT" == "all" ]]; then
  echo ""
  echo "📦 Extension Release"
  echo "--------------------"
  bump_version "vibe-code" "Extension"
  run_tests "vibe-code" "Extension"
fi

# Web Release
if [[ "$PRODUCT" == "web" || "$PRODUCT" == "all" ]]; then
  echo ""
  echo "📦 Web Release"
  echo "--------------"
  bump_version "vibe-web" "Web"
  cd vibe-web && npm run build && cd ..
  echo -e "${GREEN}✓ Web build passed${NC}"
fi

# Commit and tag
echo ""
echo -e "${YELLOW}Creating release commit...${NC}"

git add -A
git commit -m "chore: release $PRODUCT $BUMP"

if [[ "$PRODUCT" == "cli" ]]; then
  VERSION=$(node -p "require('./vibe-cli/package.json').version")
  git tag "cli-v$VERSION"
elif [[ "$PRODUCT" == "extension" ]]; then
  VERSION=$(node -p "require('./vibe-code/package.json').version")
  git tag "ext-v$VERSION"
elif [[ "$PRODUCT" == "all" ]]; then
  CLI_VERSION=$(node -p "require('./vibe-cli/package.json').version")
  git tag "v$CLI_VERSION"
fi

echo ""
echo -e "${GREEN}✅ Release prepared!${NC}"
echo ""
echo "Next steps:"
echo "  1. Review changes: git log --oneline -5"
echo "  2. Push: git push && git push --tags"
echo "  3. CI will publish automatically"
echo ""
