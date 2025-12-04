const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  FROM_EMAIL,
  API_BASE_URL
} = process.env;

// Configure transporter once
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS
  }
});

// POST /api/tickets/resolve
// Body: { "ticketId": "T123", "customerEmail": "user@example.com" }
router.post('/resolve', async (req, res) => {
  try {
    const { ticketId, customerEmail } = req.body;

    if (!ticketId || !customerEmail) {
      return res.status(400).json({ message: 'ticketId and customerEmail required' });
    }

    // Build 5 smiley links
    const base = API_BASE_URL || 'http://localhost:5000';
    const url = (rating) =>
      `${base}/api/csat/email-click?ticketId=${encodeURIComponent(
        ticketId
      )}&rating=${rating}&email=${encodeURIComponent(customerEmail)}`;

    // You can use PNG URLs or emoji; for email, hosted PNGs are safer.
   const html = `
  <p>How satisfied are you with the resolution of ticket #${ticketId}?</p>
  
  <a href="${url(1)}"><img src="https://cdn-icons-png.flaticon.com/512/1828/1828778.png" alt="1" width="32" height="32"/></a>
  <a href="${url(2)}"><img src="https://cdn-icons-png.flaticon.com/512/1828/1828779.png" alt="2" width="32" height="32"/></a>
  <a href="${url(3)}"><img src="https://cdn-icons-png.flaticon.com/512/1828/1828780.png" alt="3" width="32" height="32"/></a>
  <a href="${url(4)}"><img src="https://cdn-icons-png.flaticon.com/512/1828/1828781.png" alt="4" width="32" height="32"/></a>
  <a href="${url(5)}"><img src="https://cdn-icons-png.flaticon.com/512/1828/1828782.png" alt="5" width="32" height="32"/></a>
`;


    await transporter.sendMail({
      from: FROM_EMAIL || SMTP_USER,
      to: customerEmail,
      subject: `How was ticket #${ticketId}?`,
      html
    });

    return res.status(200).json({ message: 'CSAT email sent' });
  } catch (err) {
    console.error('Error sending CSAT email:', err);
    return res.status(500).json({ message: 'Error sending CSAT email' });
  }
});

module.exports = router;
