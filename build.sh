#!/bin/bash

# Exit on error
set -e

# Print Python version
echo "3.10.0" > .python-version
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

# Install Python dependencies
echo "Installing Python dependencies..."
python -m pip install --upgrade pip==23.0.1
python -m pip install setuptools==68.0.0 wheel==0.40.0
python -m pip install -r requirements.txt

# Make gunicorn executable
chmod +x venv/bin/gunicorn

echo "Build completed successfully!"