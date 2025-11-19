#!/bin/bash
# Script to update Homebrew formula with correct checksums

# Get the latest version from the CLI package.json
VERSION=$(cd ../vibe-cli && node -p "require('./package.json').version")
echo "Current version: $VERSION"

# Update the Homebrew formula file with the correct version and download URL
# This would be run when publishing new versions to update checksums
echo "To update checksums for Homebrew formula:"
echo "1. Download the npm package: curl -O https://registry.npmjs.org/vibe-ai-cli/-/vibe-ai-cli-$VERSION.tgz"
echo "2. Calculate the SHA256: shasum -a 256 vibe-ai-cli-$VERSION.tgz"
echo "3. Update the Formula/vibe-ai-cli.rb file with the new checksum"