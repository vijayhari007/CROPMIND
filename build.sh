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
python3.10 -m pip install --upgrade pip==23.0.1 setuptools wheel

echo "Installing Python dependencies..."
python3.10 -m pip install gunicorn==20.1.0
python3.10 -m pip install -r requirements.txt

# Create a wrapper script to run gunicorn
echo '#!/bin/bash
source venv/bin/activate
exec gunicorn --timeout 120 --workers 1 --threads 4 --worker-class gthread backend.app:app --bind 0.0.0.0:${PORT:-10000}
' > run.sh
chmod +x run.sh

echo "=== Build completed successfully ==="