const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');

// Public - Get products with optional search/pagination
router.get('/', async (req, res) => {
  const { search = '', page = 1, limit = 10 } = req.query;
  const query = search ? { name: { $regex: search, $options: 'i' } } : {};
  const products = await Product.find(query)
    .skip((page - 1) * limit)
    .limit(Number(limit));
  res.json(products);
});

// Admin - Add product
router.post('/', auth, role('admin'), async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.status(201).json(product);
});

// Admin - Update product
router.put('/:id', auth, role('admin'), async (req, res) => {
  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// Admin - Delete product
router.delete('/:id', auth, role('admin'), async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;
