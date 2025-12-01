# Perambur Srinivasa Reviews - Backend API

Shared Express.js backend for hotel reviews user and admin sites.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your database and SMTP credentials
```

3. Set up database:
```bash
npm run prisma:generate
npm run prisma:migrate
```

4. Start development server:
```bash
npm run dev
```

Server will run on `http://localhost:4000`

## API Endpoints

### Public (No Auth Required)
- `GET /api/branches` - List active branches
- `GET /api/branches/:id` - Get branch details
- `GET /api/reviews` - List reviews
- `POST /api/reviews` - Submit review
- `GET /api/menus` - Get menu items

### Admin (Requires Bearer Token)
- `POST /api/admin/auth/login` - Admin login
- `GET /api/admin/auth/me` - Get current user
- `PUT /api/admin/auth/profile` - Update profile
- `GET /api/admin/branches` - Manage branches
- `POST /api/admin/branches` - Create branch
- `PUT /api/admin/branches/:id` - Update branch
- `DELETE /api/admin/branches/:id` - Delete branch
- `GET /api/admin/reviews` - Manage reviews
- `PUT /api/admin/reviews/:id` - Reply to review
- `DELETE /api/admin/reviews/:id` - Delete review
- `GET /api/admin/menus` - Manage menu items
- `POST /api/admin/menus` - Create menu item
- `PUT /api/admin/menus/:id` - Update menu item
- `DELETE /api/admin/menus/:id` - Delete menu item
- `GET /api/admin/stats` - Get analytics

## Environment Variables

```env
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret-key"
PORT=4000
ADMIN_EMAIL="admin@example.com"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
ALLOWED_ORIGINS="http://localhost:3000,http://localhost:3001"
```
