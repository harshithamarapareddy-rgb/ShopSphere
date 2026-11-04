const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Category = require('../models/Category');
const City = require('../models/City');

// @desc    Get Admin Dashboard KPI Statistics
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalSellers = await User.countDocuments({ role: 'seller' });
    const totalShops = await User.countDocuments({ role: 'shop' });
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalCategories = await Category.countDocuments();
    const totalCities = await City.countDocuments();

    // Calculate total revenue from all orders not cancelled
    const revenueResult = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } },
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // Recent orders
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent user signups
    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    // Order status breakdown
    const ordersByStatus = await Order.aggregate([
      { $group: { _id: '$orderStatus', count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalSellers,
        totalShops,
        totalProducts,
        totalOrders,
        totalCategories,
        totalCities,
        totalRevenue: Number(totalRevenue.toFixed(2)),
        recentOrders,
        recentUsers,
        ordersByStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (role: 'user')
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const query = { role: 'user' };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // Attach order count for each user
    const usersWithStats = await Promise.all(
      users.map(async (u) => {
        const orderCount = await Order.countDocuments({ user: u._id });
        return {
          ...u.toObject(),
          orderCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      users: usersWithStats,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all sellers (role: 'seller')
// @route   GET /api/admin/sellers
// @access  Private (Admin)
const getAllSellers = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const query = { role: 'seller' };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { 'sellerProfile.shopName': { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await User.countDocuments(query);
    const sellers = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // Attach product count and orders count for each seller
    const sellersWithStats = await Promise.all(
      sellers.map(async (s) => {
        const productCount = await Product.countDocuments({ seller: s._id });
        const ordersCount = await Order.countDocuments({ 'items.seller': s._id });
        return {
          ...s.toObject(),
          productCount,
          ordersCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      sellers: sellersWithStats,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all shops (role: 'shop')
// @route   GET /api/admin/shops
// @access  Private (Admin)
const getAllShops = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const query = { role: 'shop' };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { 'sellerProfile.shopName': { $regex: search, $options: 'i' } },
        { 'sellerProfile.city': { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await User.countDocuments(query);
    const shops = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const shopsWithStats = await Promise.all(
      shops.map(async (s) => {
        const productCount = await Product.countDocuments({ seller: s._id });
        const ordersCount = await Order.countDocuments({ 'items.seller': s._id });
        return {
          ...s.toObject(),
          productCount,
          ordersCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      shops: shopsWithStats,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Block or Unblock a User or Seller
// @route   PUT /api/admin/users/:id/toggle-block
// @access  Private (Admin)
const toggleBlockUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Account not found',
      });
    }

    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot block administrator accounts.',
      });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.status(200).json({
      success: true,
      message: `Account has been ${user.isBlocked ? 'blocked' : 'unblocked'} successfully.`,
      isBlocked: user.isBlocked,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a User or Seller
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Account not found',
      });
    }

    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete administrator account.',
      });
    }

    // If seller or shop, remove their product listings
    if (user.role === 'seller' || user.role === 'shop') {
      await Product.deleteMany({ seller: user._id });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Account and associated records deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders platform-wide
// @route   GET /api/admin/orders
// @access  Private (Admin)
const getAllOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 15 } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.orderStatus = status;
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .populate('items.product', 'name images')
      .populate('items.seller', 'name email sellerProfile')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin update overall order status
// @route   PUT /api/admin/orders/:id/status
// @access  Private (Admin)
const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, paymentStatus } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (orderStatus) {
      order.orderStatus = orderStatus;
      if (orderStatus === 'Delivered') {
        order.deliveredAt = Date.now();
        order.paymentStatus = 'Paid';
        // mark items as delivered
        order.items.forEach((item) => {
          item.status = 'Delivered';
        });
      } else if (orderStatus === 'Cancelled') {
        order.items.forEach((item) => {
          item.status = 'Cancelled';
        });
      }
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order updated successfully!',
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle product featured status
// @route   PUT /api/admin/products/:id/toggle-featured
// @access  Private (Admin)
const toggleProductFeatured = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    product.isFeatured = !product.isFeatured;
    await product.save();

    res.status(200).json({
      success: true,
      message: `Product is now ${product.isFeatured ? 'Featured' : 'Standard'}`,
      isFeatured: product.isFeatured,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  getAllSellers,
  getAllShops,
  toggleBlockUser,
  deleteUser,
  getAllOrders,
  updateOrderStatus,
  toggleProductFeatured,
};

