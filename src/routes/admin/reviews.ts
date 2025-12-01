import express, { Router } from 'express';
import { prisma } from '../../lib/prisma';
import { AuthRequest, authenticateToken, isAdmin } from '../../middleware/auth';

const router: Router = express.Router();

// Apply auth middleware
router.use(authenticateToken, isAdmin);

// GET /api/admin/reviews - Get all reviews with filters
router.get('/', async (req, res) => {
    try {
        const { branchId, rating, hasReply, visitType } = req.query;

        const where: any = {};
        if (branchId) where.branchId = branchId;
        if (rating) where.overallRating = parseInt(rating as string);
        if (hasReply === 'true') where.staffReply = { not: null };
        if (hasReply === 'false') where.staffReply = null;
        if (visitType && visitType !== 'All') where.visitType = visitType;

        const reviews = await prisma.review.findMany({
            where,
            include: {
                branch: { select: { name: true } },
                user: { select: { name: true, email: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json({ success: true, data: reviews });
    } catch (error) {
        console.error('Admin reviews fetch error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch reviews' });
    }
});

// PUT /api/admin/reviews/:id - Reply to review
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { staffReply } = req.body;

        if (!staffReply) {
            return res.status(400).json({ success: false, error: 'Reply text required' });
        }

        const review = await prisma.review.update({
            where: { id },
            data: {
                staffReply,
                staffReplyAt: new Date()
            },
            include: {
                branch: true,
                user: { select: { name: true, email: true } }
            }
        });

        res.json({ success: true, data: review, message: 'Reply added successfully' });
    } catch (error) {
        console.error('Review reply error:', error);
        res.status(500).json({ success: false, error: 'Failed to reply to review' });
    }
});

// DELETE /api/admin/reviews/:id - Delete review
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`Attempting to delete review: ${id}`);

        await prisma.review.delete({
            where: { id }
        });

        console.log(`Review ${id} deleted successfully`);
        res.json({ success: true, message: 'Review deleted successfully' });
    } catch (error) {
        console.error('Review deletion error:', error);
        res.status(500).json({ success: false, error: 'Failed to delete review' });
    }
});

export default router;
