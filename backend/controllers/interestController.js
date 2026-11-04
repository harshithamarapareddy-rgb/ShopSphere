const Interest = require('../models/Interest');
const Product = require('../models/Product');

const populateInterest = (query) =>
  query
    .populate('product', 'name images price originalPrice city location condition availabilityStatus')
    .populate('seller', 'name email phone sellerProfile')
    .populate('user', 'name email phone address');

// @desc    Mark interest in a product
// @route   POST /api/interests
// @access  Private
const createInterest = async (req, res, next) => {
  try {
    const { productId, message, phone } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Please specify the product you are interested in.',
      });
    }

    const product = await Product.findById(productId).select('seller name availabilityStatus');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product listing not found.',
      });
    }

    if (product.seller.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot mark interest in your own listing.',
      });
    }

    let interest = await Interest.findOne({ user: req.user._id, product: product._id });

    if (interest) {
      const populated = await populateInterest(Interest.findById(interest._id));
      return res.status(200).json({
        success: true,
        alreadyInterested: true,
        message: 'You have already marked interest in this listing.',
        interest: populated,
      });
    }

    interest = await Interest.create({
      user: req.user._id,
      product: product._id,
      seller: product.seller,
      message: message ? String(message).trim().slice(0, 600) : '',
      phone: phone ? String(phone).trim() : req.user.phone || '',
    });

    const populated = await populateInterest(Interest.findById(interest._id));

    res.status(201).json({
      success: true,
      message: 'Interest sent! The seller can now see your contact details.',
      interest: populated,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(200).json({
        success: true,
        alreadyInterested: true,
        message: 'You have already marked interest in this listing.',
      });
    }
    next(error);
  }
};

// @desc    Get interests sent by logged in buyer
// @route   GET /api/interests/my
// @access  Private
const getMyInterests = async (req, res, next) => {
  try {
    const interests = await populateInterest(
      Interest.find({ user: req.user._id }).sort({ createdAt: -1 })
    );

    res.status(200).json({
      success: true,
      count: interests.length,
      interests,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check whether logged in buyer is interested in a product
// @route   GET /api/interests/check/:productId
// @access  Private
const checkInterest = async (req, res, next) => {
  try {
    const interest = await populateInterest(
      Interest.findOne({ user: req.user._id, product: req.params.productId })
    );

    res.status(200).json({
      success: true,
      interested: Boolean(interest),
      interest: interest || null,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get buyer interests for current seller/shop
// @route   GET /api/interests/seller
// @access  Private (Seller, Shop, Admin)
const getSellerInterests = async (req, res, next) => {
  try {
    const query = req.user.role === 'admin' ? {} : { seller: req.user._id };
    const interests = await populateInterest(
      Interest.find(query).sort({ status: -1, createdAt: -1 })
    );

    res.status(200).json({
      success: true,
      count: interests.length,
      interests,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update interest status or seller note
// @route   PUT /api/interests/:id/status
// @access  Private (Seller, Shop, Admin)
const updateInterestStatus = async (req, res, next) => {
  try {
    const { status, sellerNote } = req.body;
    const allowedStatuses = ['Pending', 'Contacted', 'Closed'];

    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${allowedStatuses.join(', ')}.`,
      });
    }

    const interest = await Interest.findById(req.params.id);

    if (!interest) {
      return res.status(404).json({
        success: false,
        message: 'Interest request not found.',
      });
    }

    if (
      interest.seller.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this interest request.',
      });
    }

    if (status) {
      interest.status = status;
      if (status === 'Contacted' && !interest.contactedAt) {
        interest.contactedAt = new Date();
      }
    }

    if (sellerNote !== undefined) {
      interest.sellerNote = String(sellerNote).trim().slice(0, 600);
    }

    await interest.save();
    const populated = await populateInterest(Interest.findById(interest._id));

    res.status(200).json({
      success: true,
      message: 'Interest request updated successfully.',
      interest: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Withdraw an interest request
// @route   DELETE /api/interests/:id
// @access  Private (Owner)
const withdrawInterest = async (req, res, next) => {
  try {
    const interest = await Interest.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!interest) {
      return res.status(404).json({
        success: false,
        message: 'Interest request not found.',
      });
    }

    await interest.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Interest request withdrawn.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createInterest,
  getMyInterests,
  checkInterest,
  getSellerInterests,
  updateInterestStatus,
  withdrawInterest,
};
