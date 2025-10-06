@echo off
REM Mythofy Mail - Windows Deployment Script

echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo    Mythofy Mail - Windows Deployment
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not running. Please start Docker Desktop.
    pause
    exit /b 1
)

echo ✓ Docker is running
echo.

REM Check for .env file
if not exist .env (
    if exist .env.example (
        echo ⚠ No .env file found. Creating from .env.example...
        copy .env.example .env
        echo ⚠ Please edit .env with your Mailcow credentials.
        pause
    ) else (
        echo ❌ No .env file or .env.example found!
        pause
        exit /b 1
    )
)

echo ✓ Environment file exists
echo.

REM Stop existing containers
echo 🛑 Stopping existing containers...
docker-compose down >nul 2>&1
echo.

REM Build images
echo 🔨 Building Docker images...
docker-compose build --no-cache
echo.

REM Start services
echo 🚀 Starting services...
docker-compose up -d
echo.

REM Wait for services
echo ⏳ Waiting for services to start...
timeout /t 10 /nobreak >nul
echo.

REM Check status
echo 📊 Checking service status...
docker-compose ps
echo.

echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo    ✅ Deployment complete!
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo 📡 Services are running at:
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:8080
echo.
echo 📊 View logs:
echo    docker-compose logs -f
echo.
pause
