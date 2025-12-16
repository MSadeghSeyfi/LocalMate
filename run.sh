#!/bin/bash

echo "========================================"
echo "LocalMate Application"
echo "========================================"
echo ""

# Check if venv exists
if [ ! -d "venv" ]; then
    echo "[ERROR] Virtual environment not found!"
    echo "Please run './setup.sh' first to set up the project."
    echo ""
    exit 1
fi

echo "[✓] Activating virtual environment..."
source venv/bin/activate

echo "[✓] Starting FastAPI server..."
echo ""
echo "========================================"
echo "Server is running!"
echo "========================================"
echo ""
echo "> Login page: http://localhost:8000/static/login.html"
echo "> Register page: http://localhost:8000/static/register.html"
echo "> API docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop the server"
echo "========================================"
echo ""

cd backend
python3 main.py
