const nodeMailer = require('nodemailer');
require('dotenv').config();
const sendEmail = async (to, subject, text) => {
    try {
        const transporter = nodeMailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }

        })
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: to,
            subject: subject,
            text: text
        };
        const info =await transporter.sendMail(mailOptions);
        console.log("Email Sent Successfully!", info.messageId)
        return info;
    }
    catch (error) {
        console.log('Error sending email:', error);
    throw error
    }
}
module.exports = sendEmail;