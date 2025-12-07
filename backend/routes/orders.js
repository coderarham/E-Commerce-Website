const express = require('express');
const Order = require('../models/Order');
const router = express.Router();

// Create new order
router.post('/create', async (req, res) => {
  try {
    const { userId, items, shippingAddress, paymentMethod, subtotal, shipping, tax, total } = req.body;
    
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

module.exports = router;