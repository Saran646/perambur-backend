#!/bin/bash

# Database backup script for PostgreSQL
# Run this before deploying to export all your data

echo "=== Perambur Srinivasa Reviews - Database Backup ==="
echo ""

# Configuration
DB_HOST="localhost"
DB_USER="postgres"
DB_NAME="perambur_srinivasa"
BACKUP_FILE="database_backup_$(date +%Y%m%d_%H%M%S).sql"

echo "Backing up database: $DB_NAME"
echo "Output file: $BACKUP_FILE"
echo ""

# Export schema and data
pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME --clean --if-exists --inserts --column-inserts > $BACKUP_FILE

if [ $? -eq 0 ]; then
    echo "✅ Backup completed successfully!"
    echo "File: $BACKUP_FILE"
    echo ""
    echo "To restore this backup on Railway:"
    echo "1. Get your Railway PostgreSQL connection string"
    echo "2. Run: psql <connection_string> < $BACKUP_FILE"
else
    echo "❌ Backup failed!"
    exit 1
fi
