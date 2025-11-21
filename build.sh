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
python -m pip install gunicorn==20.1.0
python -m pip install -r requirements.txt

# Create start script
echo '#!/bin/bash
set -e
source venv/bin/activate
exec gunicorn --timeout 120 --workers 1 --threads 4 --worker-class gthread backend.app:app --bind 0.0.0.0:${PORT:-10000}
' > start.sh
chmod +x start.sh

echo "=== Build completed successfully ==="