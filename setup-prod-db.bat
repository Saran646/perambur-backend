@echo off
echo ================================================
echo Railway Database Setup Script
echo ================================================
echo.
echo This script will:
echo 1. Connect to your Railway database
echo 2. Create all necessary tables (Migration)
echo 3. Create the default admin user
echo.

set /p DB_URL="Paste your Railway Postgres Connection URL here: "

if "%DB_URL%"=="" (
    echo Error: No URL provided.
    pause
    exit /b 1
)

echo.
echo [1/2] Running Database Migrations...
set DATABASE_URL=%DB_URL%
call npx prisma migrate deploy

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Migration failed! Check your URL and try again.
    pause
    exit /b 1
)
echo ✅ Tables created successfully!

echo.
echo [2/2] Creating Admin User...
call npx ts-node scripts/create-admin.ts

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to create admin user.
    pause
    exit /b 1
)

echo.
echo ================================================
echo ✅ SUCCESS! Database is ready.
echo ================================================
echo.
echo You can now login with:
echo Email: admin@perambursrinivasa.com
echo Password: admin123
echo.
pause
