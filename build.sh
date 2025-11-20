#!/bin/bash

# Exit on error
set -e

# Set Python version
PYTHON_VERSION=3.10.0
echo "Using Python $PYTHON_VERSION"

# Install Node.js dependencies and build frontend
echo "Building frontend..."
cd frontend
npm install
npm run build
cd ..

# Set up Python environment
python --version

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate

# Upgrade pip and install dependencies
pip install --upgrade pip==23.0.1
pip install setuptools==68.0.0 wheel==0.40.0

# Install numpy first with specific version
pip install numpy==1.23.5

# Install other requirements
pip install -r requirements.txt

# Install gunicorn
pip install gunicorn==20.1.0

echo "Build completed successfully!"