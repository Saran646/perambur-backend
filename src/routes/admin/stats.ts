import express, { Router } from 'express';
import { prisma } from '../../lib/prisma';
import { AuthRequest, authenticateToken, isAdmin } from '../../middleware/auth';

const router: Router = express.Router();

router.use(authenticateToken, isAdmin);

// GET /api/admin/stats - Get analytics
router.get('/', async (req, res) => {
    try {
        const { area, branchId } = req.query;

        // Base filter for reviews
        const reviewFilter: any = {};
        if (branchId) {
            reviewFilter.branchId = branchId;
        } else if (area) {
            // Find branches in this area
            const branchesInArea = await prisma.branch.findMany({
                where: { area: area as string },
                select: { id: true }
            });
            const branchIds = branchesInArea.map(b => b.id);
            reviewFilter.branchId = { in: branchIds };
        }

        // Branch filter logic
        const branchFilter: any = { isActive: true };
        if (branchId) {
            branchFilter.id = branchId;
        } else if (area) {
            branchFilter.area = area as string;
        }

        // Total reviews
        const totalReviews = await prisma.review.count({
            where: reviewFilter
        });

        // Total branches (filtered)
        const totalBranches = await prisma.branch.count({
            where: branchFilter
        });

        // Reviews by rating
        const reviewsByRating = await prisma.review.groupBy({
            by: ['overallRating'],
            where: reviewFilter,
            _count: true
        });

        // Average rating
        const avgRating = await prisma.review.aggregate({
            where: reviewFilter,
            _avg: { overallRating: true }
        });

        // Reviews this month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const reviewsThisMonth = await prisma.review.count({
            where: {
                ...reviewFilter,
                createdAt: { gte: startOfMonth }
            }
        });

        // Recent reviews
        const recentReviews = await prisma.review.findMany({
            where: reviewFilter,
            take: 5,
            include: {
                branch: { select: { name: true } },
                user: { select: { name: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Reviews by branch
        const reviewsByBranch = await prisma.branch.findMany({
            where: branchFilter,
            select: {
                id: true,
                name: true,
                _count: { select: { reviews: true } }
            },
            orderBy: { reviews: { _count: 'desc' } }
        });

        // Reviews pending reply
        const pendingReplies = await prisma.review.count({
            where: {
                ...reviewFilter,
                staffReply: null
            }
        });

        res.json({
            success: true,
            data: {
                totalReviews,
                totalBranches,
                reviewsByRating,
                averageRating: avgRating._avg.overallRating || 0,
                reviewsThisMonth,
                recentReviews,
                reviewsByBranch,
                pendingReplies
            }
        });
    } catch (error) {
        console.error('Stats fetch error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch stats' });
    }
});

export default router;
