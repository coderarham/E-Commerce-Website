const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

// Email configuration
let transporter;
try {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  console.log('Email transporter configured successfully');
} catch (error) {
  console.log('Email configuration error:', error.message);
}

// Contact Us form
router.post('/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Email to admin
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || 'admin@yourstore.com',
      subject: `Contact Form: ${subject}`,
      html: `
        <h2>Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong>${message}</p>
      `
    };

    // Thank you email to user
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for contacting us!',
      html: `
        <h2>Thank you for reaching out!</h2>
        <p>Dear ${name},</p>
        <p>Thank you for reaching out to Shoe Collection. I personally received your inquiry regarding "<strong>${message}</strong>".</p>
        <p>My team and I are looking into it and will get back to you very soon. We want to make sure you get the best service possible.</p>
        <p>In the meantime, feel free to browse our latest collection.</p>
        <br>
        <p>Warm regards,<br>Md Arham Founder, Shoe Collection</p>
      `
    };

    if (transporter && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await transporter.sendMail(adminMailOptions);
      await transporter.sendMail(userMailOptions);
      res.json({ success: true, message: 'Message sent successfully' });
    } else {
      console.log('DEMO MODE - Contact Form:', { name, email, subject, message });
      res.json({ success: true, message: 'Message sent successfully (Demo Mode)' });
    }
  } catch (error) {
    console.error('Contact email error:', error);
    res.status(500).json({ success: false, message: 'Failed to send message' });
  }
});

// Feedback form
router.post('/feedback', async (req, res) => {
  try {
    const { name, email, rating, feedback } = req.body;

    // Email to admin
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || 'admin@yourstore.com',
      subject: `Customer Feedback - ${rating} Stars`,
      html: `
        <h2>New Customer Feedback</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Rating:</strong> ${rating}/5 Stars</p>
        <p><strong>Feedback:</strong></p>
        <p>${feedback}</p>
      `
    };

    // Thank you email to user
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for your feedback!',
      html: `
        <h2>Thank you for your valuable feedback!</h2>
        <p>Dear ${name},</p>
        <p>We appreciate so much for taking the time to share your experience with Shoe Collection. We truly value your feedback! </p>
        <p>Your ${rating}-star rating and feedback helps us improve our services.</p>
        <br>
        <p>Warm regards,<br>Md Arham Founder, Shoe Collection</p>
      `
    };

    if (transporter && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await transporter.sendMail(adminMailOptions);
      await transporter.sendMail(userMailOptions);
      res.json({ success: true, message: 'Feedback sent successfully' });
    } else {
      console.log('DEMO MODE - Feedback:', { name, email, rating, feedback });
      res.json({ success: true, message: 'Feedback sent successfully (Demo Mode)' });
    }
  } catch (error) {
    console.error('Feedback email error:', error);
    res.status(500).json({ success: false, message: 'Failed to send feedback' });
  }
});

module.exports = router;