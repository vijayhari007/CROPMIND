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
python -m ensurepip --upgrade
python -m pip install --upgrade pip setuptools wheel

# Create virtual environment
echo "Creating virtual environment..."
python -m venv /opt/render/project/venv
source /opt/render/project/venv/bin/activate

# Verify Python version in the virtual environment
echo "Python version: $(python --version)"
echo "Pip version: $(python -m pip --version)"

echo "Upgrading pip and setuptools..."
python -m pip install --upgrade pip==23.0.1 setuptools==65.5.0 wheel==0.40.0

echo "Installing Python dependencies..."
python -m pip install -r requirements.txt

# Verify all dependencies are installed
echo "Installed packages:"
python -m pip list

echo "=== Build completed successfully ==="