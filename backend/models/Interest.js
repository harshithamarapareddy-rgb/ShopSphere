const mongoose = require('mongoose');

const interestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      trim: true,
      maxlength: [600, 'Message cannot exceed 600 characters'],
      default: '',
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['Pending', 'Contacted', 'Closed'],
      default: 'Pending',
    },
    sellerNote: {
      type: String,
      trim: true,
      maxlength: [600, 'Seller note cannot exceed 600 characters'],
      default: '',
    },
    contactedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

interestSchema.index({ user: 1, product: 1 }, { unique: true });
interestSchema.index({ seller: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model('Interest', interestSchema);
