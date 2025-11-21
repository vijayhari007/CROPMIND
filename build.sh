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
python3.10 -m venv venv
source venv/bin/activate

echo "Upgrading pip and setuptools..."
python -m pip install --upgrade pip==23.0.1 setuptools wheel

echo "Installing Python dependencies..."
python -m pip install -r requirements.txt

echo "=== Build completed successfully ==="