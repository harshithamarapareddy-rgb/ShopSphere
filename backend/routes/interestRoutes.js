const express = require('express');
const router = express.Router();
const {
  createInterest,
  getMyInterests,
  checkInterest,
  getSellerInterests,
  updateInterestStatus,
  withdrawInterest,
} = require('../controllers/interestController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', createInterest);
router.get('/my', getMyInterests);
router.get('/seller', authorize('seller', 'shop', 'admin'), getSellerInterests);
router.get('/check/:productId', checkInterest);
router.put('/:id/status', authorize('seller', 'shop', 'admin'), updateInterestStatus);
router.delete('/:id', withdrawInterest);

module.exports = router;
