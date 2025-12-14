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