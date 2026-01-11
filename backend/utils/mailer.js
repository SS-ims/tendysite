const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,     // your email
    pass: process.env.MAIL_PASS      // app password
  }
});

function sendMail({ to, subject, html }) {
  return transporter.sendMail({
    from: `"Tendy Woodlands Services" <${process.env.MAIL_USER}>`,
    to,
    subject,
    html
  });
}

module.exports = { sendMail };
