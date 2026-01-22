import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { rateLimit } from 'express-rate-limit';
import { geoBlockMiddleware } from './middleware/geoBlock';

// Import routes
import publicBranchesRouter from './routes/public/branches';
import publicReviewsRouter from './routes/public/reviews';
import publicMenusRouter from './routes/public/menus';
import adminAuthRouter from './routes/admin/auth';
import adminBranchesRouter from './routes/admin/branches';
import adminReviewsRouter from './routes/admin/reviews';
import adminMenusRouter from './routes/admin/menus';
import adminStatsRouter from './routes/admin/stats';
import adminAnalyticsRouter from './routes/admin/analytics';
import testRouter from './routes/test';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 4000;

// Trust proxy for Cloudflare Tunnel
app.set('trust proxy', 1);

// Rate limiting configurations
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: { success: false, error: 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

const reviewLimiter = rateLimit({
    windowMs: 30 * 60 * 1000, // 30 minutes
    max: 5, // Limit each IP to 5 review submissions per 30 minutes
    message: { success: false, error: 'Too many reviews submitted. Please wait before submitting another.' },
    standardHeaders: true,
    legacyHeaders: false,
});

const adminAuthLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login attempts per 15 minutes
    message: { success: false, error: 'Too many login attempts. Please try again in 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// NUCLEAR CORS - Allow everything for debugging
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin) {
        res.header('Access-Control-Allow-Origin', origin);
    } else {
        res.header('Access-Control-Allow-Origin', '*');
    }
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// TEMPORARILY DISABLED FOR DEBUGGING
// app.use(generalLimiter);
// app.use(geoBlockMiddleware);

// Health check
app.get('/health', (req, res) => {
    res.json({ success: true, message: 'Server is running' });
});

// Public routes
app.use('/api/branches', publicBranchesRouter);
app.use('/api/reviews', reviewLimiter, publicReviewsRouter); // Apply strict limit to review submissions
app.use('/api/menus', publicMenusRouter);

// Test routes (for debugging)
app.use('/api/test', testRouter);

// Admin routes
app.use('/api/admin/auth', adminAuthLimiter, adminAuthRouter); // Apply very strict limit to login attempts
app.use('/api/admin/branches', adminBranchesRouter);
app.use('/api/admin/reviews', adminReviewsRouter);
app.use('/api/admin/menus', adminMenusRouter);
app.use('/api/admin/stats', adminStatsRouter);
app.use('/api/admin/analytics', adminAnalyticsRouter);

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
