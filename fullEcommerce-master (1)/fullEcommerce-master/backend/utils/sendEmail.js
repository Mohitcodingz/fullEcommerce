const { Resend } = require('resend');

// Railway-safe: never crash the process at import time; validate per-send.
const sendEmail = async (to, subject, text) => {
    const { RESEND_API_KEY, SENDER_EMAIL } = process.env;

    if (!RESEND_API_KEY || !SENDER_EMAIL) {
        const err = new Error('Email is not configured. Set RESEND_API_KEY and SENDER_EMAIL in Railway Variables.');
        err.code = 'EMAIL_NOT_CONFIGURED';
        throw err;
    }

    const resend = new Resend(RESEND_API_KEY);

    const result = await resend.emails.send({
        from: SENDER_EMAIL,
        to: Array.isArray(to) ? to : [to],
        subject,
        text,
    });

    // Resend v3/v4 resolves { data, error }; older versions resolve { id } directly.
    const error = result && result.error;
    const data = result && (result.data || result);

    if (error) {
        console.error('Resend delivery failed:', error);
        const err = new Error(error.message || 'Email delivery failed');
        err.code = error.name || 'RESEND_ERROR';
        err.details = error;
        throw err;
    }

    console.log('Email sent successfully:', data && (data.id || (data.data && data.data.id)));
    return data;
};

module.exports = sendEmail;
