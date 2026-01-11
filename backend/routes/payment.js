const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const router = express.Router();

// Email transporter setup
let transporter;
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
}

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_your_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'your_key_secret'
});

// Create Razorpay Order
router.post('/create-order', async (req, res) => {
  try {
    console.log('Received order request:', req.body);
    console.log('Razorpay keys:', {
      key_id: process.env.RAZORPAY_KEY_ID ? 'Set' : 'Not set',
      key_secret: process.env.RAZORPAY_KEY_SECRET ? 'Set' : 'Not set'
    });
    
    const { amount, currency = 'INR', receipt } = req.body;

    const options = {
      amount: Math.round(amount * 100), // Convert to paise and round to integer
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      payment_capture: 1
    };

    console.log('Creating order with options:', options);
    const order = await razorpay.orders.create(options);
    console.log('Order created successfully:', order.id);
    
    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
});

// Verify Payment
router.post('/verify', async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      customerEmail,
      customerName,
      orderDetails
    } = req.body;

    // Create signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'your_key_secret')
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Send payment confirmation email
      if (transporter && customerEmail) {
        try {
          const mailOptions = {
            from: process.env.EMAIL_USER,
            to: customerEmail,
            subject: 'Payment Successful - Order Confirmed | Shoe Collection',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;">
                <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                  <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #28a745; margin: 0; font-size: 28px;">✅ PAYMENT SUCCESSFUL</h1>
                    <h2 style="color: #333; margin: 10px 0 0 0;">SHOE COLLECTION</h2>
                  </div>
                  
                  <p style="color: #555; font-size: 16px;">Dear ${customerName || 'Customer'},</p>
                  
                  <p style="color: #555; font-size: 16px; line-height: 1.6;">
                    Great news! Your payment has been successfully processed and your order is confirmed.
                  </p>
                  
                  <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #333; margin: 0 0 15px 0;">Payment Details:</h3>
                    <p style="margin: 5px 0; color: #555;"><strong>Payment ID:</strong> ${razorpay_payment_id}</p>
                    <p style="margin: 5px 0; color: #555;"><strong>Order ID:</strong> ${razorpay_order_id}</p>
                    <p style="margin: 5px 0; color: #555;"><strong>Amount:</strong> ₹${orderDetails?.total || 'N/A'}</p>
                    <p style="margin: 5px 0; color: #555;"><strong>Status:</strong> <span style="color: #28a745; font-weight: bold;">PAID</span></p>
                  </div>
                  
                  <p style="color: #555; font-size: 16px; line-height: 1.6;">
                    Your order is now being processed and you will receive a shipping confirmation email once your items are dispatched.
                  </p>
                  
                  <div style="text-align: center; margin: 30px 0;">
                    <p style="color: #666; font-size: 14px;">Thank you for shopping with Shoe Collection!</p>
                  </div>
                  
                  <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
                    <p style="color: #888; font-size: 14px; margin: 0;">
                      For any queries, contact us at: <strong>shoecollection03@gmail.com</strong>
                    </p>
                  </div>
                </div>
              </div>
            `
          };
          
          await transporter.sendMail(mailOptions);
          console.log('Payment confirmation email sent to:', customerEmail);
        } catch (emailError) {
          console.error('Error sending payment confirmation email:', emailError);
        }
      }
      
      // Payment is verified
      res.json({
        success: true,
        message: 'Payment verified successfully',
        paymentId: razorpay_payment_id
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message
    });
  }
});

// Get Payment Details
router.get('/payment/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = await razorpay.payments.fetch(paymentId);
    
    res.json({
      success: true,
      payment
    });
  } catch (error) {
    console.error('Error fetching payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment details',
      error: error.message
    });
  }
});

// Refund Payment
router.post('/refund', async (req, res) => {
  try {
    const { paymentId, amount, reason } = req.body;
    
    const refund = await razorpay.payments.refund(paymentId, {
      amount: amount * 100, // Amount in paise
      speed: 'normal',
      notes: {
        reason: reason || 'Customer requested refund'
      }
    });
    
    res.json({
      success: true,
      refund
    });
  } catch (error) {
    console.error('Error processing refund:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process refund',
      error: error.message
    });
  }
});

module.exports = router;