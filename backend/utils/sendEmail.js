const { BrevoClient } = require('@getbrevo/brevo');

// Railway-safe: never crash the process at import time; validate per-send.
const sendEmail = async (to, subject, text) => {
    const { BREVO_API_KEY, SENDER_EMAIL } = process.env;

    if (!BREVO_API_KEY || !SENDER_EMAIL) {
        const err = new Error(
            'Email is not configured. Set BREVO_API_KEY and SENDER_EMAIL in Railway Variables.'
        );

        err.code = 'EMAIL_NOT_CONFIGURED';
        throw err;
    }

    const brevo = new BrevoClient({
        apiKey: BREVO_API_KEY,
    });

    try {
        const result = await brevo.transactionalEmails.sendTransacEmail({
            sender: {
                name: 'Ecommerce Full Stack',
                email: SENDER_EMAIL,
            },
            to: (Array.isArray(to) ? to : [to]).map((email) => ({
                email,
            })),
            subject,
            textContent: text,
        });

        console.log('Email sent successfully:', result.messageId);

        return result;
    } catch (error) {
        console.error('Brevo delivery failed:', error);

        const err = new Error(
            error?.message || 'Email delivery failed'
        );

        err.code = 'BREVO_ERROR';
        err.details = error;

        throw err;
    }
};

module.exports = sendEmail;