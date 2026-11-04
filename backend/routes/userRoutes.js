const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');

// @desc    Get public seller profile and their listings
// @route   GET /api/users/seller/:id
// @access  Public
router.get('/seller/:id', async (req, res, next) => {
  try {
    const seller = await User.findOne({
      _id: req.params.id,
      role: { $in: ['seller', 'shop'] },
    }).select(
      'name avatar sellerProfile createdAt'
    );

    if (!seller) {
      return res.status(404).json({ success: false, message: 'Seller not found' });
    }

    const products = await Product.find({ seller: seller._id })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      seller,
      products,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

