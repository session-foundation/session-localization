#!/usr/bin/env bash

# Generate package.json for TypeScript compiler
# This reads the Node.js version from .tool-versions and generates
# the appropriate package.json file from package.template.json

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
TSC_DIR="$SCRIPT_DIR/.tsc"
TOOL_VERSIONS_FILE="$ROOT_DIR/.tool-versions"
TEMPLATE_FILE="$ROOT_DIR/package.template.json"

echo "Generating package.json for TypeScript compiler..."

# Check if template exists
if [ ! -f "$TEMPLATE_FILE" ]; then
  echo "Error: package.template.json not found at $TEMPLATE_FILE"
  exit 1
fi

# Read Node.js version from .tool-versions
if [ ! -f "$TOOL_VERSIONS_FILE" ]; then
  echo "Error: .tool-versions file not found at $TOOL_VERSIONS_FILE"
  exit 1
fi

NODE_VERSION=$(grep "^node" "$TOOL_VERSIONS_FILE" | cut -d' ' -f2)

if [ -z "$NODE_VERSION" ]; then
  echo "Error: Could not find node version in .tool-versions"
  exit 1
fi

echo "Detected Node.js version: $NODE_VERSION"
echo "Using @types/node version: ^$NODE_VERSION"

# Create directory if it doesn't exist
mkdir -p "$TSC_DIR"

# Generate package.json from template
sed "s/NODE_VERSION_PLACEHOLDER/^$NODE_VERSION/g" "$TEMPLATE_FILE" >"$TSC_DIR/package.json"

echo "✓ package.json generated at $TSC_DIR/package.json"
