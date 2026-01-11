const express = require('express');
const Order = require('../models/Order');
const nodemailer = require('nodemailer');
const router = express.Router();

// Email transporter setup
let transporter;
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransporter({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
}

// Create new order
router.post('/create', async (req, res) => {
  try {
    const { userId, items, shippingAddress, paymentMethod, subtotal, shipping, tax, total, customerEmail, customerName } = req.body;
    
    const order = new Order({
      userId,
      items,
      shippingAddress,
      paymentMethod,
      subtotal,
      shipping,
      tax,
      total
    });
    
    await order.save();
    
    // Send order confirmation email
    if (transporter && customerEmail) {
      try {
        const itemsList = items.map(item => 
          `<tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price}</td>
          </tr>`
        ).join('');
        
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: customerEmail,
          subject: `Order Confirmation #${order._id} - Shoe Collection`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;">
              <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <div style="text-align: center; margin-bottom: 30px;">
                  <h1 style="color: #28a745; margin: 0; font-size: 28px;">✅ ORDER CONFIRMED</h1>
                  <h2 style="color: #333; margin: 10px 0 0 0;">SHOE COLLECTION</h2>
                </div>
                
                <p style="color: #555; font-size: 16px;">Dear ${customerName || 'Customer'},</p>
                
                <p style="color: #555; font-size: 16px; line-height: 1.6;">
                  Thank you for your order! We're excited to get your new shoes to you as soon as possible.
                </p>
                
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="color: #333; margin: 0 0 15px 0;">Order Details:</h3>
                  <p style="margin: 5px 0; color: #555;"><strong>Order ID:</strong> #${order._id}</p>
                  <p style="margin: 5px 0; color: #555;"><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
                  <p style="margin: 5px 0; color: #555;"><strong>Total Amount:</strong> ₹${total}</p>
                </div>
                
                <h3 style="color: #333; margin: 20px 0 10px 0;">Items Ordered:</h3>
                <table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
                  <thead>
                    <tr style="background-color: #f8f9fa;">
                      <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Item</th>
                      <th style="padding: 10px; text-align: center; border-bottom: 2px solid #ddd;">Qty</th>
                      <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsList}
                  </tbody>
                </table>
                
                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
                  <h4 style="color: #333; margin: 0 0 10px 0;">Shipping Address:</h4>
                  <p style="margin: 0; color: #555; line-height: 1.4;">
                    ${shippingAddress.fullName}<br>
                    ${shippingAddress.address}<br>
                    ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}<br>
                    Phone: ${shippingAddress.phone}
                  </p>
                </div>
                
                <p style="color: #555; font-size: 16px; line-height: 1.6;">
                  We'll send you another email with tracking information once your order ships.
                </p>
                
                <div style="text-align: center; margin: 30px 0;">
                  <p style="color: #666; font-size: 14px;">Thank you for choosing Shoe Collection!</p>
                </div>
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
                  <p style="color: #888; font-size: 14px; margin: 0;">
                    Questions? Contact us at: <strong>shoecollection03@gmail.com</strong>
                  </p>
                </div>
              </div>
            </div>
          `
        };
        
        await transporter.sendMail(mailOptions);
        console.log('Order confirmation email sent to:', customerEmail);
      } catch (emailError) {
        console.error('Error sending order confirmation email:', emailError);
      }
    }
    
    res.json({ success: true, orderId: order._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user orders
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
      .sort({ orderDate: -1 })
      .populate('items.productId');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all orders (for admin)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find({})
      .sort({ orderDate: -1 })
      .populate('userId', 'name email')
      .populate('items.productId');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update order status (for admin)
router.put('/:orderId/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status },
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;