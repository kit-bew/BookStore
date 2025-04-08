// routes/admin.js
const express = require('express');
const User = require('../models/User');
const Book = require('../models/Book');
const Order = require('../models/Order');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

router.get('/stats', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalSellers = await User.countDocuments({ role: 'seller' });
    const totalBooks = await Book.countDocuments();
    const totalOrders = await Order.countDocuments();

    // Count total quantity sold
    const orders = await Order.find();
    let totalBooksSold = 0;
    orders.forEach(order => {
      order.items.forEach(item => {
        totalBooksSold += item.quantity;
      });
    });

    res.json({
      totalUsers,
      totalSellers,
      totalBooks,
      totalOrders,
      totalBooksSold
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
