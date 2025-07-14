const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const auth = require('../middlewares/auth');

// Place order
router.post('/', auth, async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user.id });
  if (!cart || cart.items.length === 0) return res.status(400).json({ error: 'Cart is empty' });

  const order = new Order({ userId: req.user.id, items: cart.items });
  await order.save();

  cart.items = [];
  await cart.save();

  res.status(201).json(order);
});

// Get orders
router.get('/', auth, async (req, res) => {
  const orders = await Order.find({ userId: req.user.id });
  res.json(orders);
});

module.exports = router;
