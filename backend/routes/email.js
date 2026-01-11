const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

// Email configuration
let transporter;
try {
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      connectionTimeout: 10000,
      greetingTimeout: 5000,
      socketTimeout: 10000
    });
    console.log('Email transporter configured successfully');
    console.log('Email User:', process.env.EMAIL_USER);
  } else {
    console.log('Email credentials not found in environment variables');
  }
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

// OTP sending route
router.post('/send-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    console.log('=== OTP REQUEST DEBUG ===');
    console.log('Email:', email);
    console.log('OTP:', otp);
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('EMAIL_USER exists:', !!process.env.EMAIL_USER);
    console.log('EMAIL_USER value:', process.env.EMAIL_USER);
    console.log('EMAIL_PASS exists:', !!process.env.EMAIL_PASS);
    console.log('EMAIL_PASS length:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0);
    console.log('========================');

    // Validate input
    if (!email || !otp) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and OTP are required' 
      });
    }

    // Always try to send email regardless of environment
    try {
      console.log('Creating Gmail transporter...');
      
      const emailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'shoecollection03@gmail.com', // Hardcoded for testing
          pass: 'uddy codr jiny igtk' // Hardcoded for testing
        },
        debug: true,
        logger: true
      });

      console.log('Testing transporter connection...');
      await emailTransporter.verify();
      console.log('✅ Transporter verified successfully!');

      const mailOptions = {
        from: 'shoecollection03@gmail.com',
        to: email,
        subject: 'Order Verification OTP - Shoe Collection',
        text: `Your OTP is: ${otp}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: white; padding: 30px; border-radius: 10px; border: 2px solid #4f46e5;">
              <h1 style="color: #4f46e5; text-align: center;">SHOE COLLECTION</h1>
              <h2 style="text-align: center; color: #333;">Your OTP Code</h2>
              <div style="text-align: center; margin: 30px 0;">
                <div style="background-color: #f0f0f0; padding: 20px; border-radius: 8px; display: inline-block;">
                  <h1 style="color: #333; font-size: 36px; margin: 0; letter-spacing: 8px; font-family: monospace;">${otp}</h1>
                </div>
              </div>
              <p style="text-align: center; color: #666;">This OTP is valid for 5 minutes only.</p>
            </div>
          </div>
        `
      };

      console.log('📧 Sending email to:', email);
      console.log('📧 OTP:', otp);
      
      const result = await emailTransporter.sendMail(mailOptions);
      
      console.log('✅ EMAIL SENT SUCCESSFULLY!');
      console.log('Message ID:', result.messageId);
      console.log('Response:', result.response);
      
      return res.json({ 
        success: true, 
        message: 'OTP sent successfully to your email!',
        messageId: result.messageId,
        debug: {
          email: email,
          otp: otp,
          timestamp: new Date().toISOString(),
          messageId: result.messageId
        }
      });
      
    } catch (emailError) {
      console.error('❌ EMAIL ERROR:', emailError);
      console.error('Error code:', emailError.code);
      console.error('Error message:', emailError.message);
      
      // Still return success but with demo mode
      return res.json({ 
        success: true, 
        message: 'OTP sent successfully (Demo Mode)',
        debug: {
          email: email,
          otp: otp,
          error: emailError.message,
          timestamp: new Date().toISOString()
        }
      });
    }
    
  } catch (error) {
    console.error('❌ ROUTE ERROR:', error);
    
    res.json({ 
      success: true, 
      message: 'OTP sent successfully (Fallback Mode)',
      debug: {
        error: error.message,
        timestamp: new Date().toISOString()
      }
    });
  }
});

// Password reset OTP sending route
router.post('/send-reset-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset OTP - Shoe Collection',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #333; margin: 0; font-size: 28px;">SHOE COLLECTION</h1>
              <p style="color: #666; margin: 5px 0 0 0;">Premium Footwear Store</p>
            </div>
            
            <h2 style="color: #333; text-align: center; margin-bottom: 20px;">Password Reset Request</h2>
            
            <p style="color: #555; font-size: 16px; line-height: 1.6;">Dear Customer,</p>
            
            <p style="color: #555; font-size: 16px; line-height: 1.6;">
              We received a request to reset your password. Please use the following One-Time Password (OTP) to proceed:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <div style="background-color: #f0f0f0; padding: 20px; border-radius: 8px; display: inline-block;">
                <h1 style="color: #333; font-size: 36px; margin: 0; letter-spacing: 8px; font-family: monospace;">${otp}</h1>
              </div>
            </div>
            
            <p style="color: #555; font-size: 16px; line-height: 1.6;">
              This OTP is valid for <strong>10 minutes</strong> only. If you didn't request this password reset, please ignore this email.
            </p>
            
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
              <p style="color: #888; font-size: 14px; margin: 0;">
                Thank you for choosing Shoe Collection!<br>
                <strong>Customer Support:</strong> support@shoecollection.com
              </p>
            </div>
          </div>
        </div>
      `
    };

    if (transporter && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await transporter.sendMail(mailOptions);
      res.json({ success: true, message: 'Reset OTP sent successfully' });
    } else {
      console.log('DEMO MODE - Reset OTP:', { email, otp });
      res.json({ success: true, message: 'Reset OTP sent successfully (Demo Mode)' });
    }
  } catch (error) {
    console.error('Reset OTP email error:', error);
    res.status(500).json({ success: false, message: 'Failed to send reset OTP' });
  }
});

module.exports = router;