import express, { Router } from 'express';
import { prisma } from '../../lib/prisma';

const router: Router = express.Router();

// GET /api/branches - Get all active branches
router.get('/', async (req, res) => {
    try {
        const { city } = req.query;

        const branches = await prisma.branch.findMany({
            where: {
                isActive: true,
                ...(city ? { city: city as string } : {})
            },
            include: {
                _count: {
                    select: { reviews: true }
                },
                reviews: {
                    select: { overallRating: true }
                }
            },
            orderBy: { name: 'asc' }
        });

        // Calculate average rating
        const branchesWithRating = branches.map(branch => {
            const avgRating = branch.reviews.length > 0
                ? branch.reviews.reduce((sum, r) => sum + r.overallRating, 0) / branch.reviews.length
                : 0;

            return {
                ...branch,
                averageRating: Number(avgRating.toFixed(1))
            };
        });

        res.json({ success: true, data: branchesWithRating });
    } catch (error) {
        console.error('Branches fetch error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch branches' });
    }
});

// GET /api/branches/:id - Get branch details
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const branch = await prisma.branch.findUnique({
            where: { id },
            include: {
                reviews: {
                    where: { staffReply: { not: null } },
                    include: {
                        user: {
                            select: { name: true, email: true }
                        }
                    },
                    orderBy: { createdAt: 'desc' },
                    take: 10
                },
                _count: {
                    select: { reviews: true }
                }
            }
        });

        if (!branch || !branch.isActive) {
            return res.status(404).json({ success: false, error: 'Branch not found' });
        }

        res.json({ success: true, data: branch });
    } catch (error) {
        console.error('Branch fetch error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch branch' });
    }
});

export default router;
