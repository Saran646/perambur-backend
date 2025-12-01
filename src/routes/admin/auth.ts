import express, { Router } from 'express';
import { prisma } from '../../lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { AuthRequest, authenticateToken } from '../../middleware/auth';

const router: Router = express.Router();

// Login schema
const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
});

// POST /api/admin/auth/login - Admin login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = loginSchema.parse(req.body);

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user || user.role !== 'ADMIN') {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            data: {
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            }
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ success: false, error: 'Invalid input' });
        }

        console.error('Login error:', error);
        res.status(500).json({ success: false, error: 'Login failed' });
    }
});

// GET /api/admin/auth/me - Get current user
router.get('/me', authenticateToken, async (req: AuthRequest, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user!.id },
            select: { id: true, name: true, email: true, phone: true, role: true }
        });

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        res.json({ success: true, data: user });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ success: false, error: 'Failed to get user' });
    }
});

// PUT /api/admin/auth/profile - Update profile
router.put('/profile', authenticateToken, async (req: AuthRequest, res) => {
    try {
        const { name, phone, currentPassword, newPassword } = req.body;

        const updateData: any = {};
        if (name) updateData.name = name;
        if (phone) updateData.phone = phone;

        // If changing password, verify current password
        if (newPassword) {
            if (!currentPassword) {
                return res.status(400).json({ success: false, error: 'Current password required' });
            }

            const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
            const isValid = await bcrypt.compare(currentPassword, user!.password);

            if (!isValid) {
                return res.status(401).json({ success: false, error: 'Invalid current password' });
            }

            updateData.password = await bcrypt.hash(newPassword, 10);
        }

        const updatedUser = await prisma.user.update({
            where: { id: req.user!.id },
            data: updateData,
            select: { id: true, name: true, email: true, phone: true, role: true }
        });

        res.json({ success: true, data: updatedUser });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ success: false, error: 'Failed to update profile' });
    }
});

export default router;
