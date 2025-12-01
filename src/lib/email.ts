import nodemailer from 'nodemailer';

// Create transporter with environment variables
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: true, // Use SSL on port 465
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Helper to get emoji for rating
const getRatingEmoji = (rating: number) => {
    switch (rating) {
        case 1: return '😠 Angry';
        case 2: return '☹️ Unhappy';
        case 3: return '😐 Neutral';
        case 4: return '🙂 Happy';
        case 5: return '😍 Loved it';
        default: return `${rating}/5`;
    }
};

export async function sendReviewNotification(review: any) {
    try {
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.warn('SMTP credentials not configured. Email will not be sent.');
            return false;
        }

        const adminDashboardUrl = process.env.ADMIN_DASHBOARD_URL || 'http://localhost:3001/dashboard';

        const mailOptions = {
            from: `"Perambur Srinivasa Reviews" <${process.env.SMTP_USER}>`,
            to: process.env.ADMIN_EMAIL || 'raghulbalaji2014@gmail.com',
            subject: `New Review: ${getRatingEmoji(review.overallRating)} - ${review.branch.name}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                    <h2 style="color: #ea580c; text-align: center;">New Review Received</h2>
                    
                    <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
                        <h3 style="margin-top: 0; color: #334155;">Customer Details</h3>
                        <p><strong>Name:</strong> ${review.guestName || review.user?.name || 'Anonymous'}</p>
                        <p><strong>Phone:</strong> ${review.guestPhone || review.user?.phone || 'Not provided'}</p>
                        <p><strong>Email:</strong> ${review.guestEmail || review.user?.email || 'Not provided'}</p>
                    </div>

                    <div style="background-color: #fff7ed; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
                        <h3 style="margin-top: 0; color: #9a3412;">Visit Details</h3>
                        <p><strong>Branch:</strong> ${review.branch.name}</p>
                        <p><strong>Order Type:</strong> ${review.visitType}</p>
                        ${review.tableNumber ? `<p><strong>Table Number:</strong> ${review.tableNumber}</p>` : ''}
                    </div>

                    <div style="margin-bottom: 20px;">
                        <h3 style="color: #334155;">Ratings</h3>
                        <div style="font-size: 18px; margin-bottom: 10px;">
                            <strong>Overall:</strong> ${getRatingEmoji(review.overallRating)}
                        </div>
                        <ul style="list-style: none; padding: 0;">
                            ${review.tasteRating ? `<li>Taste: ${review.tasteRating}/5</li>` : ''}
                            ${review.serviceRating ? `<li>Service: ${review.serviceRating}/5</li>` : ''}
                            ${review.ambienceRating ? `<li>Ambience: ${review.ambienceRating}/5</li>` : ''}
                            ${review.cleanlinessRating ? `<li>Cleanliness: ${review.cleanlinessRating}/5</li>` : ''}
                            ${review.valueRating ? `<li>Value: ${review.valueRating}/5</li>` : ''}
                        </ul>
                    </div>

                    <div style="background-color: #f1f5f9; padding: 15px; border-radius: 6px; margin-bottom: 25px;">
                        <h3 style="margin-top: 0; color: #334155;">Review</h3>
                        <p style="font-style: italic; color: #475569;">"${review.reviewText}"</p>
                    </div>

                    <div style="text-align: center; margin-top: 30px;">
                        <a href="${adminDashboardUrl}" style="display: inline-block; background-color: #ea580c; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
                            View in Admin Dashboard
                        </a>
                    </div>

                    <p style="text-align: center; color: #64748b; font-size: 12px; margin-top: 20px;">
                        This is an automated notification from the Perambur Srinivasa Reviews system.
                    </p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        console.log('Email sent to:', process.env.ADMIN_EMAIL);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
}
