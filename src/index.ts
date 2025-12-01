import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes
import publicBranchesRouter from './routes/public/branches';
import publicReviewsRouter from './routes/public/reviews';

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
