#!/bin/bash
# Script to update Chocolatey package with correct checksums

# Get the latest version from the CLI package.json
VERSION=$(cd ../vibe-cli && node -p "require('./package.json').version")
echo "Current version: $VERSION"

# Update the Chocolatey install script with the correct version and download URL
echo "To update checksums for Chocolatey package:"
echo "1. Download the Windows binary: curl -L https://github.com/mk-knight23/vibe/releases/download/v$VERSION/vibe-win.exe -o vibe-win-$VERSION.exe"
echo "2. Calculate the SHA256: certUtil -hashfile vibe-win-$VERSION.exe SHA256 (on Windows) or shasum -a 256 vibe-win-$VERSION.exe (on macOS/Linux)"
echo "3. Update the chocolatey/vibe-ai-cli/tools/chocolateyinstall.ps1 file with the new checksum"