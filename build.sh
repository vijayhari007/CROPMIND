#!/bin/bash
set -e

echo "=== Starting build process ==="

# Build frontend
echo "Building frontend..."
cd frontend
npm install
npm run build
cd ..

# Python setup
echo "Setting up Python environment..."
python --version

# Create and activate virtual environment
echo "Creating virtual environment..."
python -m venv /opt/render/project/venv
source /opt/render/project/venv/bin/activate

# Upgrade pip first
echo "Upgrading pip..."
python -m pip install --upgrade pip

# Verify Python version in the virtual environment
echo "Python version: $(python --version)"
echo "Pip version: $(python -m pip --version)"

echo "Installing Python dependencies..."
python -m pip install -r requirements.txt

# Verify all dependencies are installed
echo "Installed packages:"
python -m pip list

echo "=== Build completed successfully ==="