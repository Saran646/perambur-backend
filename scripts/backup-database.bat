@echo off
REM Database backup script for Windows
REM Run this before deploying to export all your data

echo === Perambur Srinivasa Reviews - Database Backup ===
echo.

REM Configuration
set DB_HOST=localhost
set DB_USER=postgres
set DB_NAME=perambur_srinivasa
set BACKUP_FILE=database_backup_%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%.sql

echo Backing up database: %DB_NAME%
echo Output file: %BACKUP_FILE%
echo.

REM Export schema and data
pg_dump -h %DB_HOST% -U %DB_USER% -d %DB_NAME% --clean --if-exists --inserts --column-inserts > %BACKUP_FILE%

if %ERRORLEVEL% EQU 0 (
    echo ✅ Backup completed successfully!
    echo File: %BACKUP_FILE%
    echo.
    echo To restore this backup on Railway:
    echo 1. Get your Railway PostgreSQL connection string
    echo 2. Run: psql connection_string ^< %BACKUP_FILE%
) else (
    echo ❌ Backup failed!
    exit /b 1
)

pause
