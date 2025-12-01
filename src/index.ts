import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes
import publicBranchesRouter from './routes/public/branches';
import publicReviewsRouter from './routes/public/reviews';
import publicMenusRouter from './routes/public/menus';
import adminAuthRouter from './routes/admin/auth';
import adminBranchesRouter from './routes/admin/branches';
import adminReviewsRouter from './routes/admin/reviews';
import adminMenusRouter from './routes/admin/menus';
import adminStatsRouter from './routes/admin/stats';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
// CORS configuration - Allow all for now to fix connection issues
app.use(cors({
    origin: true,
    credentials: true
}));

// Health check
app.get('/health', (req, res) => {
    res.json({ success: true, message: 'Server is running' });
});

// Public routes
app.use('/api/branches', publicBranchesRouter);
app.use('/api/reviews', publicReviewsRouter);
app.use('/api/menus', publicMenusRouter);

// Admin routes
app.use('/api/admin/auth', adminAuthRouter);
app.use('/api/admin/branches', adminBranchesRouter);
app.use('/api/admin/reviews', adminReviewsRouter);
app.use('/api/admin/menus', adminMenusRouter);
app.use('/api/admin/stats', adminStatsRouter);

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Server error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Backend server running on port ${PORT}`);
    console.log(`📍 Public API: http://localhost:${PORT}/api`);
    console.log(`🔐 Admin API: http://localhost:${PORT}/api/admin`);
});

export default app;
