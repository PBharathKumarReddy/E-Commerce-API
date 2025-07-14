const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const auth = require('../middlewares/auth');

// Get cart
router.get('/', auth, async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user.id });
  res.json(cart || { items: [] });
});

// Add item to cart
router.post('/', auth, async (req, res) => {
  let cart = await Cart.findOne({ userId: req.user.id });
  if (!cart) {
    cart = new Cart({ userId: req.user.id, items: [req.body] });
  } else {
    cart.items.push(req.body);
  }
  await cart.save();
  res.json(cart);
});

// Update cart item
router.put('/:itemId', auth, async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user.id });
  const item = cart.items.id(req.params.itemId);
  if (item) {
    item.quantity = req.body.quantity;
    await cart.save();
  }
  res.json(cart);
});

// Delete item from cart
router.delete('/:itemId', auth, async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user.id });
  cart.items.id(req.params.itemId).remove();
  await cart.save();
  res.json(cart);
});

module.exports = router;
