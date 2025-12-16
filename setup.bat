@echo off
chcp 65001 >nul
echo ========================================
echo LocalMate - Initial Setup
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in PATH!
    echo Please install Python 3.9+ from https://www.python.org/
    pause
    exit /b 1
)

echo [1/3] Checking Python version...
python --version
echo.

echo [2/3] Creating virtual environment...
if exist venv (
    echo Virtual environment already exists. Skipping creation.
) else (
    python -m venv venv
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to create virtual environment!
        pause
        exit /b 1
    )
    echo Virtual environment created successfully!
)
echo.

echo [3/3] Installing dependencies...
call venv\Scripts\activate.bat
pip install --upgrade pip
pip install -r backend\requirements.txt
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install dependencies!
    pause
    exit /b 1
)
echo.

echo ========================================
echo Setup completed successfully!
echo ========================================
echo.
echo Next steps:
echo 1. Run 'run.bat' to start the application
echo 2. Open http://localhost:8000/static/login.html in your browser
echo.
pause
