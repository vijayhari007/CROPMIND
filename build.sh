#!/bin/bash
set -e  # Exit on error

echo "=== Starting build process ==="

# Frontend build
echo "Building frontend..."
cd frontend
npm install
npm run build
cd ..

# Python setup
echo "Setting up Python environment..."
python3.10 -m venv /opt/render/project/venv
source /opt/render/project/venv/bin/activate

echo "Upgrading pip and setuptools..."
python -m pip install --upgrade pip==23.0.1 setuptools wheel

echo "Installing Python dependencies..."
python -m pip install -r requirements.txt
python -m pip install gunicorn==20.1.0

# Create a symlink to gunicorn in a directory that's in the PATH
ln -sf /opt/render/project/venv/bin/gunicorn /usr/local/bin/gunicorn || true

echo "=== Build completed successfully ==="