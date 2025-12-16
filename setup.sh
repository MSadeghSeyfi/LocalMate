#!/bin/bash

echo "========================================"
echo "LocalMate - Initial Setup"
echo "========================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "[ERROR] Python 3 is not installed!"
    echo "Please install Python 3.9+ from https://www.python.org/"
    exit 1
fi

echo "[1/3] Checking Python version..."
python3 --version
echo ""

echo "[2/3] Creating virtual environment..."
if [ -d "venv" ]; then
    echo "Virtual environment already exists. Skipping creation."
else
    python3 -m venv venv
    if [ $? -ne 0 ]; then
        echo "[ERROR] Failed to create virtual environment!"
        exit 1
    fi
    echo "Virtual environment created successfully!"
fi
echo ""

echo "[3/3] Installing dependencies..."
source venv/bin/activate
pip install --upgrade pip
pip install -r backend/requirements.txt
if [ $? -ne 0 ]; then
    echo "[ERROR] Failed to install dependencies!"
    exit 1
fi
echo ""

echo "========================================"
echo "Setup completed successfully! ✓"
echo "========================================"
echo ""
echo "Next steps:"
echo "1. Run './run.sh' to start the application"
echo "2. Open http://localhost:8000/static/login.html in your browser"
echo ""
