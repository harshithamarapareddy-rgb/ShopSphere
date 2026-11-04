const City = require('../models/City');

// @desc    Get all cities
// @route   GET /api/cities
// @access  Public
const getAllCities = async (req, res, next) => {
  try {
    const query = {};
    if (req.query.active === 'true') {
      query.isActive = true;
    }

    const cities = await City.find(query).sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: cities.length,
      cities,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a city (Admin)
// @route   POST /api/cities
// @access  Private (Admin)
const createCity = async (req, res, next) => {
  try {
    const { name, state, isActive } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'City name is required.',
      });
    }

    const existing = await City.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A city with this name already exists.',
      });
    }

    const city = await City.create({
      name: name.trim(),
      state: state || '',
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json({
      success: true,
      message: 'City added successfully!',
      city,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a city (Admin)
// @route   PUT /api/cities/:id
// @access  Private (Admin)
const updateCity = async (req, res, next) => {
  try {
    const { name, state, isActive } = req.body;

    const city = await City.findById(req.params.id);
    if (!city) {
      return res.status(404).json({
        success: false,
        message: 'City not found.',
      });
    }

    if (name) city.name = name.trim();
    if (state !== undefined) city.state = state;
    if (isActive !== undefined) city.isActive = isActive;

    await city.save();

    res.status(200).json({
      success: true,
      message: 'City updated successfully!',
      city,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a city (Admin)
// @route   DELETE /api/cities/:id
// @access  Private (Admin)
const deleteCity = async (req, res, next) => {
  try {
    const city = await City.findById(req.params.id);
    if (!city) {
      return res.status(404).json({
        success: false,
        message: 'City not found.',
      });
    }

    await city.deleteOne();

    res.status(200).json({
      success: true,
      message: 'City deleted successfully!',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCities,
  createCity,
  updateCity,
  deleteCity,
};
