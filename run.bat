@echo off
chcp 65001 >nul
echo ========================================
echo LocalMate Application
echo ========================================
echo.

REM Check if venv exists
if not exist venv (
    echo [ERROR] Virtual environment not found!
    echo Please run 'setup.bat' first to set up the project.
    echo.
    pause
    exit /b 1
)

echo [✓] Activating virtual environment...
call venv\Scripts\activate.bat

echo [✓] Starting FastAPI server...
echo.
echo ========================================
echo Server is running!
echo ========================================
echo.
echo ^> Login page: http://localhost:8000/static/login.html
echo ^> Register page: http://localhost:8000/static/register.html
echo ^> API docs: http://localhost:8000/docs
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

cd backend
python main.py
