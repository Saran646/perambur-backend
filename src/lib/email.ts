import sgMail from '@sendgrid/mail';

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

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
        if (!process.env.SENDGRID_API_KEY) {
            console.warn('SendGrid API key not configured. Email will not be sent.');
            return false;
        }

        const adminDashboardUrl = process.env.ADMIN_DASHBOARD_URL || 'http://localhost:3001/dashboard';
        const fromEmail = process.env.SENDGRID_FROM_EMAIL || process.env.SMTP_USER || 'noreply@perambursrinivasa.com';
        const toEmail = process.env.ADMIN_EMAIL || 'admin@perambursrinivasa.com';

        const msg = {
            to: toEmail,
            from: fromEmail,
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
                        <h3 style="margin-top: 0; color: #334155;">Branch</h3>
                        <p><strong>${review.branch.name}</strong></p>
                        <p style="color: #64748b; font-size: 14px;">${review.branch.address}, ${review.branch.city}</p>
                    </div>

                    <div style="background-color: #f1f5f9; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
                        <h3 style="margin-top: 0; color: #334155;">Rating Details</h3>
                        <p style="font-size: 24px; margin: 10px 0;">
                            <strong>${getRatingEmoji(review.overallRating)}</strong>
                        </p>
                        ${review.tasteRating ? `<p>Taste: ${review.tasteRating}/5</p>` : ''}
                        ${review.serviceRating ? `<p>Service: ${review.serviceRating}/5</p>` : ''}
                        ${review.ambienceRating ? `<p>Ambience: ${review.ambienceRating}/5</p>` : ''}
                        ${review.cleanlinessRating ? `<p>Cleanliness: ${review.cleanlinessRating}/5</p>` : ''}
                        ${review.valueRating ? `<p>Value for Money: ${review.valueRating}/5</p>` : ''}
                        <p><strong>Visit Type:</strong> ${review.visitType}</p>
                        ${review.tableNumber ? `<p><strong>Table:</strong> ${review.tableNumber}</p>` : ''}
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

        await sgMail.send(msg);
        console.log('SendGrid email sent successfully to:', toEmail);
        return true;
    } catch (error) {
        console.error('Error sending email via SendGrid:', error);
        if (error && typeof error === 'object' && 'response' in error) {
            const sgError = error as any;
            console.error('SendGrid error details:', sgError.response?.body);
        }
        return false;
    }
}
