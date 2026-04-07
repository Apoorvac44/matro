const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Create a transporter
    // For production, use a real service like SendGrid, Mailgun, or Gmail with OAuth2
    // For development, you can use Mailtrap or similar
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.mailtrap.io',
        port: process.env.EMAIL_PORT || 2525,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // Define the email options
    const mailOptions = {
        from: `Milana Matrimony <${process.env.EMAIL_FROM || 'noreply@milanamatrimony.com'}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html,
    };

    // Actually send the email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
