#!/usr/bin/env bash
set -euo pipefail

REPO=${REPO:-"mk-knight23/vibe-cli"}
BIN_NAME=${BIN_NAME:-"vibe"}
VERSION=${VERSION:-"latest"}

OS=$(uname -s | tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m)

case "$OS" in
  linux) PLATFORM=linux ;;
  darwin) PLATFORM=macos ;;
  *) echo "Unsupported OS: $OS" >&2; exit 1 ;;
esac

case "$ARCH" in
  x86_64|amd64) ARCH=x64 ;;
  arm64|aarch64) ARCH=arm64 ;;
  *) echo "Unsupported arch: $ARCH" >&2; exit 1 ;;
esac

if [ "$PLATFORM" = "macos" ] && [ "$ARCH" = "arm64" ]; then
  # pkg may not always produce arm64 mac builds by default; fallback to x64 under Rosetta
  ARCH=x64
fi

if [ "$VERSION" = "latest" ]; then
  TAG=$(curl -fsSL https://api.github.com/repos/$REPO/releases/latest | grep -m1 '"tag_name"' | sed -E 's/.*: "(.*)".*/\1/')
else
  TAG="$VERSION"
fi

ASSET="${BIN_NAME}-${PLATFORM}-${ARCH}"
URL="https://github.com/${REPO}/releases/download/${TAG}/${ASSET}"
TARGET="/usr/local/bin/${BIN_NAME}"

echo "Downloading ${URL} -> ${TARGET}"
sudo curl -fL "$URL" -o "$TARGET"
sudo chmod +x "$TARGET"

echo "Installed ${BIN_NAME} to ${TARGET}"