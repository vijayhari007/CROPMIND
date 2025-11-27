#!/bin/bash
set -e

echo "=== Starting build process ==="

# Python setup
echo "Setting up Python environment..."
python --version

# Create and activate virtual environment
echo "Creating virtual environment..."
python -m venv /opt/render/project/venv
source /opt/render/project/venv/bin/activate

# Upgrade pip
echo "Upgrading pip..."
python -m pip install --upgrade pip

# Install requirements
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Install Gunicorn
echo "Installing Gunicorn..."
pip install gunicorn

# Verify installation
echo "Python version: $(python --version)"
echo "Pip version: $(pip --version)"
gunicorn --version

echo "=== Build completed successfully ==="