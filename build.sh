#!/bin/bash
set -e

echo "=== Starting build process ==="

# Install Python 3.10 if not already installed
if ! command -v python3.10 &> /dev/null; then
    echo "Installing Python 3.10..."
    apt-get update && apt-get install -y python3.10 python3.10-venv
fi

# Set Python to use 3.10
PYTHON=python3.10
PIP=pip3.10

# Build frontend
echo "Building frontend..."
cd frontend
npm install
npm run build
cd ..

# Python setup
echo "Setting up Python environment..."
$PYTHON -m venv /opt/render/project/venv
source /opt/render/project/venv/bin/activate

# Verify Python version in the virtual environment
echo "Python version: $($PYTHON --version)"
echo "Pip version: $($PYTHON -m pip --version)"

echo "Upgrading pip and setuptools..."
$PYTHON -m pip install --upgrade pip==23.0.1 setuptools==65.5.0 wheel==0.40.0

echo "Installing Python dependencies..."
$PYTHON -m pip install -r requirements.txt

# Verify all dependencies are installed
echo "Installed packages:"
$PYTHON -m pip list

echo "=== Build completed successfully ==="