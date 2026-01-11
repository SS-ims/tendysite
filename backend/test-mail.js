require('dotenv').config();
const { sendMail } = require('./utils/mailer');

sendMail({
  to: process.env.ADMIN_EMAIL,
  subject: 'Email Test – Tendy System',
  html: '<p>This is a test email. Email system is working.</p>'
})
.then(() => console.log('Test email sent'))
.catch(err => console.error('Email error:', err));
