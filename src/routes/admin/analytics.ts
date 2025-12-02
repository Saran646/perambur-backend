import express, { Router } from 'express';
import { prisma } from '../../lib/prisma';
import * as XLSX from 'xlsx';

const router: Router = express.Router();

// GET /api/admin/analytics/reviews - Get filtered reviews
router.get('/reviews', async (req, res) => {
    try {
        const { branchId, month } = req.query;

        if (!month || typeof month !== 'string') {
            return res.status(400).json({
                success: false,
                error: 'Month parameter is required (format: YYYY-MM)'
            });
        }

        // Parse month to get date range
        const [year, monthNum] = month.split('-').map(Number);
        const startDate = new Date(year, monthNum - 1, 1);
        const endDate = new Date(year, monthNum, 0, 23, 59, 59, 999);

        // Build where clause
        const where: any = {
            createdAt: {
                gte: startDate,
                lte: endDate
            }
        };

        if (branchId && branchId !== 'all') {
            where.branchId = branchId as string;
        }

        // Fetch reviews with all related data
        const reviews = await prisma.review.findMany({
            where,
            include: {
                branch: {
                    select: {
                        id: true,
                        name: true,
                        city: true,
                        area: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.json({
            success: true,
            data: reviews,
            count: reviews.length,
            month: month
        });
    } catch (error) {
        console.error('Analytics fetch error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch analytics data'
        });
    }
});

// GET /api/admin/analytics/export - Export reviews to Excel
router.get('/export', async (req, res) => {
    try {
        const { branchId, month } = req.query;

        if (!month || typeof month !== 'string') {
            return res.status(400).json({
                success: false,
                error: 'Month parameter is required (format: YYYY-MM)'
            });
        }

        // Parse month to get date range
        const [year, monthNum] = month.split('-').map(Number);
        const startDate = new Date(year, monthNum - 1, 1);
        const endDate = new Date(year, monthNum, 0, 23, 59, 59, 999);

        // Build where clause
        const where: any = {
            createdAt: {
                gte: startDate,
                lte: endDate
            }
        };

        if (branchId && branchId !== 'all') {
            where.branchId = branchId as string;
        }

        // Fetch reviews
        const reviews = await prisma.review.findMany({
            where,
            include: {
                branch: {
                    select: {
                        name: true,
                        city: true,
                        area: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Format data for Excel
        const excelData = reviews.map(review => ({
            'Date': new Date(review.createdAt).toLocaleDateString('en-IN'),
            'Branch': review.branch.name,
            'Area': review.branch.area,
            'City': review.branch.city,
            'Guest Name': review.guestName || 'Anonymous',
            'Phone': review.guestPhone || 'N/A',
            'Email': review.guestEmail || 'N/A',
            'Overall Rating': review.overallRating,
            'Taste Rating': review.tasteRating || '-',
            'Service Rating': review.serviceRating || '-',
            'Ambience Rating': review.ambienceRating || '-',
            'Cleanliness Rating': review.cleanlinessRating || '-',
            'Value Rating': review.valueRating || '-',
            'Visit Type': review.visitType,
            'Table Number': review.tableNumber || '-',
            'Review Text': review.reviewText,
            'Admin Reply': review.staffReply || '-',
            'Reply Date': review.staffReplyAt ? new Date(review.staffReplyAt).toLocaleDateString('en-IN') : '-'
        }));

        // Create workbook and worksheet
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(excelData);

        // Auto-size columns
        const colWidths = [
            { wch: 12 }, // Date
            { wch: 20 }, // Branch
            { wch: 15 }, // Area
            { wch: 15 }, // City
            { wch: 20 }, // Guest Name
            { wch: 15 }, // Phone
            { wch: 25 }, // Email
            { wch: 8 },  // Overall Rating
            { wch: 8 },  // Taste
            { wch: 8 },  // Service
            { wch: 8 },  // Ambience
            { wch: 8 },  // Cleanliness
            { wch: 8 },  // Value
            { wch: 12 }, // Visit Type
            { wch: 10 }, // Table
            { wch: 50 }, // Review Text
            { wch: 30 }, // Admin Reply
            { wch: 12 }  // Reply Date
        ];
        ws['!cols'] = colWidths;

        XLSX.utils.book_append_sheet(wb, ws, 'Reviews');

        // Generate buffer
        const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

        // Set headers for download
        const filename = `reviews_${month}${branchId && branchId !== 'all' ? `_branch_${branchId}` : '_all'}.xlsx`;
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

        res.send(buffer);
    } catch (error) {
        console.error('Excel export error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to export data'
        });
    }
});

export default router;
