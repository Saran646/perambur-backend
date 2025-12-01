import express, { Router } from 'express';
import { prisma } from '../../lib/prisma';
import { AuthRequest, authenticateToken, isAdmin } from '../../middleware/auth';
import { z } from 'zod';

const router: Router = express.Router();

router.use(authenticateToken, isAdmin);

const dishSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    category: z.enum(['SWEETS', 'SNACKS', 'SAVOURIES', 'COOKIES', 'PODI', 'THOKKU', 'PICKLE', 'GIFT_HAMPER']),
    price: z.number().positive(),
    isAvailable: z.boolean().optional(),
    branchId: z.string().optional()
});

// GET /api/admin/menus
router.get('/', async (req, res) => {
    try {
        const dishes = await prisma.dish.findMany({
            include: {
                branch: { select: { name: true } }
            },
            orderBy: [{ category: 'asc' }, { name: 'asc' }]
        });

        res.json({ success: true, data: dishes });
    } catch (error) {
        console.error('Admin menus fetch error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch menu items' });
    }
});

// POST /api/admin/menus
router.post('/', async (req, res) => {
    try {
        const validatedData = dishSchema.parse(req.body);

        const dish = await prisma.dish.create({
            data: {
                ...validatedData,
                price: validatedData.price.toString()
            }
        });

        res.json({ success: true, data: dish, message: 'Menu item created' });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ success: false, error: error.errors[0]?.message });
        }

        console.error('Menu creation error:', error);
        res.status(500).json({ success: false, error: 'Failed to create menu item' });
    }
});

// PUT /api/admin/menus/:id
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const validatedData = dishSchema.parse(req.body);

        const dish = await prisma.dish.update({
            where: { id },
            data: {
                ...validatedData,
                price: validatedData.price.toString()
            }
        });

        res.json({ success: true, data: dish, message: 'Menu item updated' });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ success: false, error: error.errors[0]?.message });
        }

        console.error('Menu update error:', error);
        res.status(500).json({ success: false, error: 'Failed to update menu item' });
    }
});

// DELETE /api/admin/menus/:id
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`Attempting to delete menu item: ${id}`);

        await prisma.dish.delete({
            where: { id }
        });

        console.log(`Menu item ${id} deleted successfully`);
        res.json({ success: true, message: 'Menu item deleted' });
    } catch (error) {
        console.error('Menu deletion error:', error);
        res.status(500).json({ success: false, error: 'Failed to delete menu item' });
    }
});

export default router;
