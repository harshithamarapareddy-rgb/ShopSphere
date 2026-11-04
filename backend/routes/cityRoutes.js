const express = require('express');
const router = express.Router();
const {
  getAllCities,
  createCity,
  updateCity,
  deleteCity,
} = require('../controllers/cityController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getAllCities);
router.post('/', protect, authorize('admin'), createCity);
router.put('/:id', protect, authorize('admin'), updateCity);
router.delete('/:id', protect, authorize('admin'), deleteCity);

module.exports = router;
