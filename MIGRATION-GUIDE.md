# Database Migration Guide

## Prerequisites
1. Ensure you have access to both the old and new PostgreSQL databases
2. Have the connection strings ready

## Setup

### 1. Install tsx (TypeScript executor)
```bash
cd perambur-srinivasa-reviews-backend
npm install -D tsx
```

### 2. Create Environment Variables
Create a `.env.migration` file in the backend root:

```env
# Old database (source)
SOURCE_DATABASE_URL="postgresql://user:pass@localhost:5432/old_db_name"

# New database (target)
DATABASE_URL="postgresql://user:pass@localhost:5432/new_db_name"
```

### 3. Prepare New Database
```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations to create tables
npx prisma migrate deploy
# OR if you want to create a new migration
npx prisma migrate dev --name init
```

## Run Migration

### Option A: Using the migration script
```bash
# Load environment variables and run migration
npx dotenv -e .env.migration -- tsx scripts/migrate-data.ts
```

### Option B: Manual migration using Prisma Studio
```bash
# Open old database
DATABASE_URL="postgresql://old_db" npx prisma studio --port 5555

# Open new database (in another terminal)
DATABASE_URL="postgresql://new_db" npx prisma studio --port 5556

# Copy data manually through the UI
```

### Option C: Using pg_dump (PostgreSQL native)
```bash
# Export from old database
pg_dump -h localhost -U user -d old_db_name > backup.sql

# Import to new database
psql -h localhost -U user -d new_db_name < backup.sql
```

## Verify Migration

After migration, verify the data:

```bash
# Connect to new database
npx prisma studio

# Or use SQL
psql -h localhost -U user -d new_db_name

# Run these queries:
SELECT COUNT(*) FROM "User";
SELECT COUNT(*) FROM "Branch";
SELECT COUNT(*) FROM "Dish";
SELECT COUNT(*) FROM "Review";
```

## Troubleshooting

### If migration fails midway:
```bash
# Clear the target database and start fresh
npx prisma migrate reset

# Then run migration again
```

### If you get constraint errors:
- Ensure all foreign key relationships exist
- Check that IDs don't conflict
- Verify data integrity in source database

## Post-Migration

1. Test the backend API:
```bash
npm run dev
# Visit http://localhost:4000/api/branches
```

2. Test admin login:
   - Ensure at least one user with role='ADMIN' exists
   - Login at http://localhost:3001/login

3. Update the old project's DATABASE_URL to point to the new database if you want to keep using it

## Important Notes

- ⚠️ The migration script uses `upsert`, so it's safe to run multiple times
- ⚠️ Always backup your data before migration
- ⚠️ Test on a development database first
- ✅ All relationships will be preserved
- ✅ Timestamps will be kept as-is
