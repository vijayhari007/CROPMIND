#!/bin/bash

# Exit on error
set -e

# Print Python version
echo "Python version:"
python --version

# Install Node.js dependencies and build frontend
echo "Building frontend..."
cd frontend
npm install
npm run build
cd ..

# Create and activate virtual environment
echo "Setting up Python virtual environment..."
python -m venv venv
source venv/bin/activate

# Upgrade pip and setuptools
echo "Upgrading pip and setuptools..."
python -m pip install --upgrade pip==23.0.1
python -m pip install setuptools==68.0.0 wheel==0.40.0

# Install numpy first
echo "Installing numpy..."
python -m pip install numpy==1.23.5

# Install other requirements
echo "Installing Python dependencies..."
python -m pip install -r requirements.txt

# Install gunicorn
echo "Installing gunicorn..."
python -m pip install gunicorn==20.1.0

echo "Build completed successfully!"