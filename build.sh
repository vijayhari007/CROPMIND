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
# Use python3 explicitly and check its version
python3 -m venv /opt/render/project/venv
source /opt/render/project/venv/bin/activate

# Verify Python version in the virtual environment
echo "Python version: $(python3 --version)"
echo "Pip version: $(python3 -m pip --version)"

echo "Upgrading pip and setuptools..."
python3 -m pip install --upgrade pip==23.0.1 setuptools==65.5.0 wheel==0.40.0

echo "Installing Python dependencies..."
python3 -m pip install -r requirements.txt

# Verify all dependencies are installed
echo "Installed packages:"
python3 -m pip list

echo "Installing gunicorn..."
python3 -m pip install gunicorn==20.1.0

echo "=== Build completed successfully ==="