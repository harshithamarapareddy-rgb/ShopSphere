const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  getAllSellers,
  getAllShops,
  toggleBlockUser,
  deleteUser,
  getAllOrders,
  updateOrderStatus,
  toggleProductFeatured,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('admin')); // All admin routes restricted to admin role

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/sellers', getAllSellers);
router.get('/shops', getAllShops);
router.put('/users/:id/toggle-block', toggleBlockUser);
router.delete('/users/:id', deleteUser);
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.put('/products/:id/toggle-featured', toggleProductFeatured);

module.exports = router;

