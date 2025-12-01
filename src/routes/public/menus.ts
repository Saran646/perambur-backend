import express, { Router } from 'express';
import { prisma } from '../../lib/prisma';

const router: Router = express.Router();

// GET /api/menus - Get menu items
router.get('/', async (req, res) => {
    try {
        const { category, branchId } = req.query;

        const dishes = await prisma.dish.findMany({
            where: {
                isAvailable: true,
                ...(category ? { category: category as any } : {}),
                ...(branchId ? { branchId: branchId as string } : {})
            },
            include: {
                branch: {
                    select: { name: true }
                }
            },
            orderBy: [
                { category: 'asc' },
                { name: 'asc' }
            ]
        });

        res.json({ success: true, data: dishes });
    } catch (error) {
        console.error('Menu fetch error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch menu' });
    }
});

export default router;
