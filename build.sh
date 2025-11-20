#!/bin/bash

# Exit on error
set -e

# Install Node.js dependencies and build frontend
echo "Building frontend..."
cd frontend
npm install
npm run build
cd ..

# Install Python dependencies
echo "Installing Python dependencies..."
python -m pip install --upgrade pip
pip install -r requirements.txt

# Install gunicorn explicitly
pip install gunicorn

# Install any other required system packages
# apt-get update && apt-get install -y python3-gunicorn  # Uncomment if needed

echo "Build completed successfully!"