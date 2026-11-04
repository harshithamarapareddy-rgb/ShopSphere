const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getSellerOrders,
  updateOrderItemStatus,
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect); // All order routes require authentication

router.post('/', createOrder);
router.get('/my-orders', getMyOrders);
router.get('/seller/orders', authorize('seller', 'shop', 'admin'), getSellerOrders);
router.get('/:id', getOrderById);
router.put(
  '/:orderId/items/:itemId/status',
  authorize('seller', 'shop', 'admin'),
  updateOrderItemStatus
);

module.exports = router;

