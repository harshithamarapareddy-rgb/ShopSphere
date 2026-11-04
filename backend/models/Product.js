const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide product name'],
      trim: true,
      maxlength: [150, 'Product name cannot exceed 150 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide product description'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide product price'],
      min: [0, 'Price must be positive'],
    },
    originalPrice: {
      type: Number,
      default: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please specify a category'],
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please specify the seller'],
    },
    condition: {
      type: String,
      required: [true, 'Please specify condition'],
      enum: ['Brand New', 'Like New', 'Used - Excellent', 'Used - Good', 'Used - Fair'],
      default: 'Brand New',
    },
    location: {
      type: String,
      required: [true, 'Please provide listing location (City, State)'],
      trim: true,
      default: 'Online / Nationwide',
    },
    city: {
      type: String,
      trim: true,
      default: '',
      index: true,
    },
    availabilityStatus: {
      type: String,
      enum: ['In Stock', 'Out of Stock', 'Sold'],
      default: 'In Stock',
    },
    stockQuantity: {
      type: Number,
      default: 1,
      min: [0, 'Stock cannot be negative'],
    },
    images: {
      type: [String],
      default: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for dateAdded to match legacy ClassifiedShop terminology
productSchema.virtual('dateAdded').get(function () {
  return this.createdAt;
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);

