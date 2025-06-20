const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

const sendResetEmail = async (to, resetLink) => {
  await transporter.sendMail({
    from: `"UniBazaar Support" <${process.env.GMAIL_USER}>`,
    to,
    subject: 'Reset Your Password',
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link is valid for 15 minutes.</p>`,
  });
};

module.exports = sendResetEmail;
