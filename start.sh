#!/bin/bash
set -e

# Activate the virtual environment
source venv/bin/activate

# Run gunicorn
exec gunicorn --timeout 120 --workers 1 --threads 4 --worker-class gthread backend.app:app --bind 0.0.0.0:${PORT:-10000}