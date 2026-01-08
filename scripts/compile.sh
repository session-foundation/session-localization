#!/usr/bin/env bash

# Type-check the localization library
# This ensures the TypeScript files are valid

set -e

echo "Type-checking localization library..."

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TSC_DIR="$SCRIPT_DIR/.tsc"
TSC_PATH="$TSC_DIR/node_modules/.bin/tsc"
PACKAGE_JSON="$TSC_DIR/package.json"

# Check if we need to download TypeScript
if [ ! -f "$TSC_PATH" ] || [ ! -f "$PACKAGE_JSON" ]; then
  echo "Setting up TypeScript compiler..."

  # Generate package.json from .tool-versions
  "$SCRIPT_DIR/generate-package.sh"

  # Install TypeScript
  cd "$TSC_DIR"
  if command -v npm &>/dev/null; then
    echo "Installing TypeScript and dependencies..."
    npm install --silent
  else
    echo "Error: npm is required to download TypeScript"
    exit 1
  fi

  cd - >/dev/null
  echo "TypeScript compiler ready."
fi

# Run tsc with noEmit and specify where to find type definitions
"$TSC_PATH" --noEmit --typeRoots "$TSC_DIR/node_modules/@types"

if [ $? -eq 0 ]; then
  echo "✓ Type check passed!"
  exit 0
else
  echo "✗ Type check failed!"
  exit 1
fi
