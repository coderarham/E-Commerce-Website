const express = require('express');
const Cart = require('../models/Cart');
const router = express.Router();

// Get user cart
router.get('/:userId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    res.json(cart || { items: [], totalAmount: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add item to cart
router.post('/add', async (req, res) => {
  try {
    const { userId, item } = req.body;
    console.log('Adding item to cart:', { userId, item });
    
    let cart = await Cart.findOne({ userId });
    
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }
    
    const existingItem = cart.items.find(i => i.productId === item.productId && i.size === item.size);
    
    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      cart.items.push(item);
    }
    
    cart.totalAmount = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    await cart.save();
    
    console.log('Cart saved:', cart);
    res.json(cart);
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update item quantity
router.put('/update', async (req, res) => {
  try {
    const { userId, productId, size, quantity } = req.body;
    
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    
    const item = cart.items.find(i => i.productId === productId && i.size === size);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    
    item.quantity = quantity;
    cart.totalAmount = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    await cart.save();
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove item from cart
router.delete('/remove', async (req, res) => {
  try {
    const { userId, productId, size } = req.body;
    
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    
    cart.items = cart.items.filter(i => !(i.productId === productId && i.size === size));
    cart.totalAmount = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    await cart.save();
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Clear cart
router.delete('/clear/:userId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    
    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;