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
python -m pip install --upgrade pip setuptools wheel

# Install numpy first as it has system dependencies
pip install numpy==1.24.3

# Now install the rest of the requirements
pip install -r requirements.txt

# Install gunicorn explicitly
pip install gunicorn

echo "Build completed successfully!"