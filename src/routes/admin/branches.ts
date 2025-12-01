import express, { Router } from 'express';
import { prisma } from '../../lib/prisma';
import { AuthRequest, authenticateToken, isAdmin } from '../../middleware/auth';
import { z } from 'zod';

const router: Router = express.Router();

// Apply auth middleware to all routes
router.use(authenticateToken, isAdmin);

// Branch schema
const branchSchema = z.object({
    name: z.string().min(1),
    address: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    area: z.string().min(1),
    phone: z.string(),
    mapLink: z.string().url().optional(),
    workingHours: z.string().optional(),
    description: z.string().optional(),
    isActive: z.boolean().optional()
});

// GET /api/admin/branches - Get all branches (including inactive)
router.get('/', async (req, res) => {
    try {
        const branches = await prisma.branch.findMany({
            include: {
                reviews: { select: { overallRating: true } },
                _count: { select: { reviews: true } }
            },
            orderBy: { name: 'asc' }
        });

        res.json({ success: true, data: branches });
    } catch (error) {
        console.error('Admin branches fetch error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch branches' });
    }
});

// GET /api/admin/branches/:id - Get single branch (including inactive)
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const branch = await prisma.branch.findUnique({
            where: { id },
            include: {
                _count: { select: { reviews: true } }
            }
        });

        if (!branch) {
            return res.status(404).json({ success: false, error: 'Branch not found' });
        }

        res.json({ success: true, data: branch });
    } catch (error) {
        console.error('Admin branch fetch error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch branch' });
    }
});

// POST /api/admin/branches - Create branch
router.post('/', async (req, res) => {
    try {
        const validatedData = branchSchema.parse(req.body);

        const branch = await prisma.branch.create({
            data: validatedData
        });

        res.json({ success: true, data: branch, message: 'Branch created successfully' });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ success: false, error: error.errors[0]?.message });
        }

        console.error('Branch creation error:', error);
        res.status(500).json({ success: false, error: 'Failed to create branch' });
    }
});

// PUT /api/admin/branches/:id - Update branch
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const validatedData = branchSchema.parse(req.body);

        const branch = await prisma.branch.update({
            where: { id },
            data: validatedData
        });

        res.json({ success: true, data: branch, message: 'Branch updated successfully' });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ success: false, error: error.errors[0]?.message });
        }

        console.error('Branch update error:', error);
        res.status(500).json({ success: false, error: 'Failed to update branch' });
    }
});

// DELETE /api/admin/branches/:id - Delete branch
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.branch.delete({
            where: { id }
        });

        res.json({ success: true, message: 'Branch deleted successfully' });
    } catch (error) {
        console.error('Branch deletion error:', error);
        res.status(500).json({ success: false, error: 'Failed to delete branch' });
    }
});

export default router;
