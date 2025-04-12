const express = require('express');
const Book = require('../models/Book');
const Order = require('../models/Order');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

// Seller stats
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'seller') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const books = await Book.find({ sellerId: req.user.id });
    const orders = await Order.find({ sellerId: req.user.id });
    let booksSold = 0;
    orders.forEach(order => {
      order.items.forEach(item => {
        booksSold += item.quantity;
      });
    });
    res.json({
      totalBooksListed: books.length,
      totalOrdersReceived: orders.length,
      totalBooksSold: booksSold
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all sellers (admin only)
router.get('/', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  try {
    const sellers = await User.find({ role: 'seller' }).select('-password');
    res.json(sellers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete seller (admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  try {
    const seller = await User.findById(req.params.id);
    if (!seller || seller.role !== 'seller') {
      return res.status(404).json({ message: 'Seller not found' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Seller deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;