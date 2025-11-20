#!/bin/bash

# Exit on error
set -e

# Install Node.js dependencies and build frontend
echo "Building frontend..."
cd frontend
npm install
npm run build
cd ..

# Set Python version
echo "Setting up Python environment..."
python --version

# Install Python dependencies
echo "Installing Python dependencies..."
python -m pip install --upgrade pip==23.0.1
pip install setuptools==68.0.0 wheel==0.40.0

# Install numpy with specific version that works with Python 3.10
pip install numpy==1.23.5

# Now install the rest of the requirements
pip install -r requirements.txt

# Install gunicorn explicitly
pip install gunicorn==20.1.0

echo "Build completed successfully!"