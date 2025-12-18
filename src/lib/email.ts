/**
 * Email service using Brevo (formerly Sendinblue)
 * Free tier: 300 emails/day
 */

// Helper to get emoji for rating
const getRatingEmoji = (rating: number) => {
    switch (rating) {
        case 4: return '😍 Love it';
        case 3: return '😊 Good';
        case 2: return '😐 Average';
        case 1: return '🙁 Poor';
        default: return `${rating}/4`;
    }
};

export async function sendReviewNotification(review: any) {
    try {
        const apiKey = process.env.BREVO_API_KEY;

        if (!apiKey) {
            console.warn('Brevo API key not configured. Email will not be sent.');
            return false;
        }

        const adminDashboardUrl = process.env.ADMIN_DASHBOARD_URL || 'https://ps4admin.netlify.app/dashboard';
        const fromEmail = process.env.EMAIL_FROM || 'noreply@perambursrinivasa.com';
        const fromName = process.env.EMAIL_FROM_NAME || 'PS4 Srinivasa Reviews';
        const toEmail = process.env.ADMIN_EMAIL || 'admin@perambursrinivasa.com';

        const emailContent = `
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
                    ${review.tasteRating ? `<p>Taste: ${review.tasteRating}/4</p>` : ''}
                    ${review.serviceRating ? `<p>Service: ${review.serviceRating}/4</p>` : ''}
                    ${review.ambienceRating ? `<p>Ambience: ${review.ambienceRating}/4</p>` : ''}
                    ${review.cleanlinessRating ? `<p>Cleanliness: ${review.cleanlinessRating}/4</p>` : ''}
                    ${review.valueRating ? `<p>Value for Money: ${review.valueRating}/4</p>` : ''}
                    <p><strong>Visit Type:</strong> ${review.visitType}</p>
                    ${review.tableNumber ? `<p><strong>Table:</strong> ${review.tableNumber}</p>` : ''}
                </div>

                <div style="background-color: #f1f5f9; padding: 15px; border-radius: 6px; margin-bottom: 25px;">
                    <h3 style="margin-top: 0; color: #334155;">Feedback</h3>
                    ${review.whatLiked ? `<p><strong>Liked:</strong> ${review.whatLiked}</p>` : ''}
                    ${review.whatImprove ? `<p><strong>Improve:</strong> ${review.whatImprove}</p>` : ''}
                    <p><strong>Recommend:</strong> ${review.wouldRecommend}</p>
                </div>

                <div style="text-align: center; margin-top: 30px;">
                    <a href="${adminDashboardUrl}" style="display: inline-block; background-color: #ea580c; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
                        View in Admin Dashboard
                    </a>
                </div>

                <p style="text-align: center; color: #64748b; font-size: 12px; margin-top: 20px;">
                    This is an automated notification from the PS4 Srinivasa Reviews system.
                </p>
            </div>
        `;

        // Use Brevo's API
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': apiKey,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                sender: {
                    name: fromName,
                    email: fromEmail
                },
                to: [{ email: toEmail }],
                subject: `New Review: ${getRatingEmoji(review.overallRating)} - ${review.branch.name}`,
                htmlContent: emailContent
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Brevo API error:', errorData);
            return false;
        }

        console.log('Brevo email sent successfully to:', toEmail);
        return true;
    } catch (error) {
        console.error('Error sending email via Brevo:', error);
        return false;
    }
}
