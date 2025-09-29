#!/bin/bash

# Exit immediately if a command fails
set -e

echo "🚮 Removing node_modules and package-lock.json..."
rm -rf node_modules package-lock.json

echo "📦 Reinstalling dependencies..."
npm install

echo "✅ Reinstall complete!"