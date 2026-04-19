#!/bin/bash
set -euo pipefail

REPO="https://github.com/FinlayRJW/pianist.git"
APP_DIR="/home/finlay/midi-bridge"
REPO_DIR="$APP_DIR/repo"
WWW_DIR="$APP_DIR/www"
VENV_DIR="$APP_DIR/venv"

echo "$(date '+%H:%M:%S') [deploy] Starting..."

# Clone or pull
if [ -d "$REPO_DIR/.git" ]; then
    echo "$(date '+%H:%M:%S') [deploy] Pulling latest..."
    cd "$REPO_DIR"
    git fetch origin main
    git reset --hard origin/main
else
    echo "$(date '+%H:%M:%S') [deploy] Cloning repo..."
    git clone --depth 1 "$REPO" "$REPO_DIR"
fi

# Install Node.js deps and build
cd "$REPO_DIR"
if ! command -v node &>/dev/null; then
    echo "$(date '+%H:%M:%S') [deploy] ERROR: Node.js not installed"
    echo "  Install with: curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash - && sudo apt install -y nodejs"
    exit 1
fi

echo "$(date '+%H:%M:%S') [deploy] Installing npm dependencies..."
npm ci --no-audit --no-fund

echo "$(date '+%H:%M:%S') [deploy] Building web app..."
npx vite build

# Copy build output
rm -rf "$WWW_DIR"
cp -r dist "$WWW_DIR"

# Copy bridge script
cp pi/midi-bridge.py "$APP_DIR/midi-bridge.py"

echo "$(date '+%H:%M:%S') [deploy] Done. www dir: $WWW_DIR"
