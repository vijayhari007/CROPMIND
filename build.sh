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

# Install Gunicorn explicitly
echo "Installing Gunicorn..."
python -m pip install gunicorn==21.2.0

echo "Python version: $(python --version)"
echo "Pip version: $(python -m pip --version)"

echo "Installing Python dependencies..."
python -m pip install -r requirements.txt

# Verify Gunicorn is installed
echo "Verifying Gunicorn installation..."
which gunicorn
gunicorn --version

echo "=== Build completed successfully ==="