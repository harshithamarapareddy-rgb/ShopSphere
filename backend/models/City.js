const mongoose = require('mongoose');

const citySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide city name'],
      unique: true,
      trim: true,
      maxlength: [80, 'City name cannot exceed 80 characters'],
    },
    state: {
      type: String,
      default: '',
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('City', citySchema);
