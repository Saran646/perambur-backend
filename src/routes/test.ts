import express, { Router } from 'express';
import { sendReviewNotification } from '../lib/email';

const router: Router = express.Router();

// GET /api/test-email - Test email configuration (development only)
router.get('/test-email', async (req, res) => {
    try {
        // Create a mock review for testing
        const testReview = {
            id: 'test-' + Date.now(),
            overallRating: 5,
            tasteRating: 5,
            serviceRating: 5,
            ambienceRating: 5,
            cleanlinessRating: 5,
            valueRating: 5,
            reviewText: 'This is a test email from the backend to verify SMTP configuration.',
            visitType: 'DINE_IN',
            guestName: 'Test User',
            guestPhone: '1234567890',
            guestEmail: 'test@example.com',
            tableNumber: '10',
            branch: {
                name: 'Test Branch',
                address: 'Test Address',
                city: 'Test City'
            }
        };

        const result = await sendReviewNotification(testReview);

        if (result) {
            res.json({
                success: true,
                message: 'Test email sent successfully! Check admin email inbox.'
            });
        } else {
            res.status(500).json({
                success: false,
                error: 'Failed to send test email. Check server logs for details.',
                hint: 'Verify SMTP credentials are set in environment variables.'
            });
        }
    } catch (error) {
        console.error('Test email error:', error);
        res.status(500).json({
            success: false,
            error: 'Test email failed',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

export default router;
