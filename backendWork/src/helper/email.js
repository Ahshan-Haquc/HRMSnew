const nodemailer = require("nodemailer");
const { smtpUserName, smtpPassword } = require("../secret");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465, // Use 587 for TLS
    secure: true, // Use true for SSL and false for TLS
    auth: {
        user: smtpUserName,
        pass: smtpPassword, // Use App Password if 2FA is enabled
    },
});

const emailWithNodeMailer = async (emailData) => {
    try {
        const mailOptions = {
            from: smtpUserName, // sender address
            to: emailData.email, // recipient address
            subject: emailData.subject, // subject line
            html: emailData.html, // HTML body
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.response);
    } catch (error) {
        console.error('Error occurred while sending email: ', error);
        throw error;
    }
};

module.exports = emailWithNodeMailer;
