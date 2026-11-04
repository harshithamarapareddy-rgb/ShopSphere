const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getFeaturedProducts,
  getRecentProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getSellerProducts,
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/recent', getRecentProducts);
router.get('/seller/me', protect, authorize('seller', 'shop', 'admin'), getSellerProducts);
router.get('/:id', getProductById);

router.post(
  '/',
  protect,
  authorize('seller', 'shop', 'admin'),
  upload.array('images', 5),
  createProduct
);

router.put(
  '/:id',
  protect,
  authorize('seller', 'shop', 'admin'),
  upload.array('images', 5),
  updateProduct
);

router.delete('/:id', protect, authorize('seller', 'shop', 'admin'), deleteProduct);

module.exports = router;

