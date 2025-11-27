#!/bin/bash
set -e

echo "=== Setting up Python environment ==="
python --version

# Upgrade pip
echo "Upgrading pip..."
python -m pip install --upgrade pip

# Install requirements
echo "Installing dependencies from requirements.txt..."
pip install -r requirements.txt

# Install gunicorn
echo "Installing gunicorn..."
pip install gunicorn==21.2.0

echo "=== Setup completed successfully ==="
