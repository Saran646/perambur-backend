import express, { Router } from 'express';
import { prisma } from '../../lib/prisma';
import { sendReviewNotification } from '../../lib/email';
import { z } from 'zod';

const router: Router = express.Router();

// Review validation schema
const reviewSchema = z.object({
    branchId: z.string(),
    guestName: z.string().optional(),
    guestEmail: z.string().email().optional().or(z.literal('')),
    guestPhone: z.string().optional(),
    overallRating: z.number().min(1).max(5),
    tasteRating: z.number().min(0).max(5).optional(),
    serviceRating: z.number().min(0).max(5).optional(),
    ambienceRating: z.number().min(0).max(5).optional(),
    cleanlinessRating: z.number().min(0).max(5).optional(),
    valueRating: z.number().min(0).max(5).optional(),
    visitType: z.enum(['DINE_IN', 'TAKEAWAY', 'DELIVERY']),
    reviewText: z.string(),
    tableNumber: z.string().optional()
});

// GET /api/reviews - Get public reviews
router.get('/', async (req, res) => {
    try {
        const { branchId, limit = '10' } = req.query;

        const reviews = await prisma.review.findMany({
            where: branchId ? { branchId: branchId as string } : {},
            include: {
                branch: {
                    select: { name: true, city: true }
                },
                user: {
                    select: { name: true }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: parseInt(limit as string)
        });

        res.json({ success: true, data: reviews });
    } catch (error) {
        console.error('Reviews fetch error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch reviews' });
    }
});

// POST /api/reviews - Submit new review (anonymous)
router.post('/', async (req, res) => {
    try {
        const validatedData = reviewSchema.parse(req.body);

        const review = await prisma.review.create({
            data: validatedData,
            include: {
                branch: true,
                user: {
                    select: { name: true, email: true }
                }
            }
        });

        // Send email notification
        const emailSent = await sendReviewNotification(review);

        if (!emailSent) {
            console.warn('Email notification failed to send for review:', review.id);
        }

        res.json({
            success: true,
            data: review,
            message: 'Review submitted successfully',
            emailSent: emailSent
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                success: false,
                error: error.errors[0]?.message || 'Validation error'
            });
        }

        console.error('Review submission error:', error);
        res.status(500).json({ success: false, error: 'Failed to submit review' });
    }
});

export default router;
