// routes/seller.js
const express = require('express');
const Book = require('../models/Book');
const Order = require('../models/Order');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

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

module.exports = router;
