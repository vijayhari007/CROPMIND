#!/bin/bash

# Install frontend dependencies and build
cd frontend
npm install
npm run build

# Move build files to the root directory
mv build ../

# Go back to root directory
cd ..

# Install Python dependencies
pip install -r requirements.txt

# Run the Flask app
gunicorn backend.app:app
