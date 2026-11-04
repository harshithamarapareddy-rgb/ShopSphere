const express = require('express');
const router = express.Router();
const {
  submitEnquiry,
  getAllEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
} = require('../controllers/enquiryController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public route to submit an enquiry
router.post('/', submitEnquiry);

// Admin protected routes
router.get('/admin', protect, authorize('admin'), getAllEnquiries);
router.put('/admin/:id/status', protect, authorize('admin'), updateEnquiryStatus);
router.delete('/admin/:id', protect, authorize('admin'), deleteEnquiry);

module.exports = router;

