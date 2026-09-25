const nodeMailer = require('nodemailer');
require('dotenv').config();
const sendEmail = async (to, subject, text) => {
    const { EMAIL_USER, EMAIL_PASS } = process.env;
    if (!EMAIL_USER || !EMAIL_PASS) {
        throw new Error('Email is not configured. Set EMAIL_USER and EMAIL_PASS in backend/.env.');
    }

    const transporter = nodeMailer.createTransport({
        service: 'gmail',
        auth: { user: EMAIL_USER, pass: EMAIL_PASS }
    });
    const info = await transporter.sendMail({
        from: EMAIL_USER,
        to,
        subject,
        text
    });
    console.log('Email sent successfully:', info.messageId);
    return info;
}
module.exports = sendEmail;