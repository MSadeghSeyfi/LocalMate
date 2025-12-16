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

echo [OK] Activating virtual environment...
call venv\Scripts\activate.bat
if %errorlevel% neq 0 (
    echo [ERROR] Failed to activate virtual environment!
    pause
    exit /b 1
)

echo [OK] Starting FastAPI server...
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
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Server stopped with an error!
    cd ..
    pause
    exit /b 1
)

cd ..
pause
