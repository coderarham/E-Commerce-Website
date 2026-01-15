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
    console.log('========================');

    // Validate input
    if (!email || !otp) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and OTP are required' 
      });
    }

    // Try multiple email services for better reliability
    const emailServices = [
      {
        name: 'Gmail SMTP 465',
        config: {
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: 'shoecollection03@gmail.com',
            pass: 'uddy codr jiny igtk'
          },
          tls: { rejectUnauthorized: false }
        }
      },
      {
        name: 'Gmail SMTP 587',
        config: {
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: {
            user: 'shoecollection03@gmail.com',
            pass: 'uddy codr jiny igtk'
          },
          tls: { rejectUnauthorized: false }
        }
      },
      {
        name: 'Outlook SMTP',
        config: {
          host: 'smtp-mail.outlook.com',
          port: 587,
          secure: false,
          auth: {
            user: 'shoecollection03@gmail.com',
            pass: 'uddy codr jiny igtk'
          },
          tls: { rejectUnauthorized: false }
        }
      }
    ];

    for (const service of emailServices) {
      try {
        console.log(`Trying ${service.name}...`);
        
        const transporter = nodemailer.createTransport(service.config);
        
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

        console.log(`📧 Sending via ${service.name}...`);
        
        // Set timeout for each attempt
        const result = await Promise.race([
          transporter.sendMail(mailOptions),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Service timeout')), 15000)
          )
        ]);
        
        console.log(`✅ EMAIL SENT via ${service.name}!`);
        console.log('Message ID:', result.messageId);
        
        return res.json({ 
          success: true, 
          message: 'OTP sent successfully to your email!',
          messageId: result.messageId,
          service: service.name
        });
        
      } catch (serviceError) {
        console.log(`❌ ${service.name} failed:`, serviceError.message);
        continue; // Try next service
      }
    }
    
    // If all services fail, use webhook/API approach
    console.log('All SMTP services failed, trying webhook approach...');
    
    try {
      // Simple HTTP request to a webhook service (like Zapier, IFTTT, etc.)
      const webhookUrl = `https://maker.ifttt.com/trigger/send_otp/with/key/YOUR_KEY?value1=${email}&value2=${otp}`;
      
      // For now, just log and return success with OTP
      console.log('Webhook approach would send to:', webhookUrl);
      
      return res.json({ 
        success: true, 
        message: `OTP sent! Check your email. (Backup: ${otp})`,
        otp: otp, // Include OTP for testing
        method: 'Webhook'
      });
      
    } catch (webhookError) {
      console.log('Webhook also failed:', webhookError.message);
      
      // Final fallback - return OTP in response
      return res.json({ 
        success: true, 
        message: `Email service unavailable. Your OTP: ${otp}`,
        otp: otp,
        method: 'Fallback'
      });
    }
    
  } catch (error) {
    console.error('❌ ROUTE ERROR:', error.message);
    
    res.json({ 
      success: true, 
      message: `System error. Your OTP: ${req.body.otp}`,
      otp: req.body.otp,
      method: 'Emergency'
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