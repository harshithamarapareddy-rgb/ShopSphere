const Product = require('../models/Product');
const Category = require('../models/Category');

const escapeRegex = (value = '') => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// @desc    Get all products with filtering, search, sorting, and pagination
// @route   GET /api/products
// @access  Public
const getAllProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      condition,
      minPrice,
      maxPrice,
      location,
      city,
      availability,
      sort,
      page = 1,
      limit = 12,
      featured,
    } = req.query;

    const query = {};

    // Keyword search in name and description
    if (search && search.trim() !== '') {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    // Filter by Category
    if (category && category !== 'all') {
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        query.category = category;
      } else {
        const foundCat = await Category.findOne({ slug: category });
        if (foundCat) {
          query.category = foundCat._id;
        }
      }
    }

    // Filter by Condition
    if (condition && condition !== 'all') {
      query.condition = condition;
    }

    // Filter by Availability
    if (availability && availability !== 'all') {
      query.availabilityStatus = availability;
    }

    // Filter by City (fall back to legacy location values when city is not populated)
    if (city && city !== 'all' && city.trim() !== '') {
      const cityTerm = city.trim();
      const cityFilter = {
        $or: [
          { city: { $regex: new RegExp(`^${escapeRegex(cityTerm)}$`, 'i') } },
          {
            city: { $in: ['', null] },
            location: { $regex: new RegExp(escapeRegex(cityTerm), 'i') },
          },
        ],
      };

      if (query.$or) {
        query.$and = [{ $or: query.$or }, cityFilter];
        delete query.$or;
      } else {
        query.$or = cityFilter.$or;
      }
    }

    // Filter by Location
    if (location && location.trim() !== '') {
      query.location = { $regex: escapeRegex(location.trim()), $options: 'i' };
    }

    // Filter by Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Featured filter
    if (featured === 'true') {
      query.isFeatured = true;
    }

    // Sorting
    let sortOption = { createdAt: -1 };
    if (sort === 'price-asc') {
      sortOption = { price: 1 };
    } else if (sort === 'price-desc') {
      sortOption = { price: -1 };
    } else if (sort === 'popular') {
      sortOption = { views: -1 };
    } else if (sort === 'oldest') {
      sortOption = { createdAt: 1 };
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name slug icon')
      .populate('seller', 'name email sellerProfile')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Featured Products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isFeatured: true })
      .populate('category', 'name slug')
      .populate('seller', 'name sellerProfile')
      .sort({ createdAt: -1 })
      .limit(8);

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Recently Added Products
// @route   GET /api/products/recent
// @access  Public
const getRecentProducts = async (req, res, next) => {
  try {
    const products = await Product.find()
      .populate('category', 'name slug')
      .populate('seller', 'name sellerProfile')
      .sort({ createdAt: -1 })
      .limit(8);

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Single Product details
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug icon description')
      .populate('seller', 'name email phone avatar sellerProfile createdAt');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product listing not found',
      });
    }

    // Increment view count asynchronously
    product.views += 1;
    await product.save({ validateBeforeSave: false });

    // Also fetch related products in same category
    const relatedProducts = await Product.find({
      category: product.category._id,
      _id: { $ne: product._id },
    })
      .limit(4)
      .populate('category', 'name slug')
      .populate('seller', 'name sellerProfile');

    res.status(200).json({
      success: true,
      product,
      relatedProducts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new Product
// @route   POST /api/products
// @access  Private (Seller, Admin)
const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      originalPrice,
      category,
      condition,
      location,
      city,
      availabilityStatus,
      stockQuantity,
      isFeatured,
      imageUrls,
    } = req.body;

    // Handle images: Multer files + optional provided URLs
    let images = [];
    if (req.files && req.files.length > 0) {
      const filePaths = req.files.map((file) => `/uploads/${file.filename}`);
      images.push(...filePaths);
    }

    if (imageUrls) {
      if (Array.isArray(imageUrls)) {
        images.push(...imageUrls);
      } else if (typeof imageUrls === 'string') {
        images.push(imageUrls);
      }
    }

    if (images.length === 0) {
      images = ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'];
    }

    const listingLocation = location ? String(location).trim() : 'Online';
    const listingCity = city
      ? String(city).trim()
      : listingLocation.split(',')[0].trim();

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : 0,
      category,
      seller: req.user._id,
      condition: condition || 'Brand New',
      location: listingLocation,
      city: listingCity,
      availabilityStatus: availabilityStatus || 'In Stock',
      stockQuantity: stockQuantity ? Number(stockQuantity) : 1,
      isFeatured: isFeatured === 'true' || isFeatured === true,
      images,
    });

    const populatedProduct = await Product.findById(product._id)
      .populate('category', 'name slug')
      .populate('seller', 'name email sellerProfile');

    res.status(201).json({
      success: true,
      message: 'Product created successfully!',
      product: populatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a Product
// @route   PUT /api/products/:id
// @access  Private (Seller, Admin)
const updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Verify ownership or admin privileges
    if (
      product.seller.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this product listing.',
      });
    }

    const {
      name,
      description,
      price,
      originalPrice,
      category,
      condition,
      location,
      city,
      availabilityStatus,
      stockQuantity,
      isFeatured,
      existingImages,
    } = req.body;

    let updatedImages = [];

    // Keep existing images if passed
    if (existingImages) {
      try {
        const parsed = typeof existingImages === 'string' ? JSON.parse(existingImages) : existingImages;
        if (Array.isArray(parsed)) {
          updatedImages.push(...parsed);
        }
      } catch (e) {
        if (typeof existingImages === 'string') updatedImages.push(existingImages);
      }
    } else {
      updatedImages = [...product.images];
    }

    // Add newly uploaded files
    if (req.files && req.files.length > 0) {
      const newFilePaths = req.files.map((file) => `/uploads/${file.filename}`);
      updatedImages.push(...newFilePaths);
    }

    if (name) product.name = name;
    if (description) product.description = description;
    if (price !== undefined) product.price = Number(price);
    if (originalPrice !== undefined) product.originalPrice = Number(originalPrice);
    if (category) product.category = category;
    if (condition) product.condition = condition;
    if (location) product.location = location;
    if (city !== undefined) {
      product.city = String(city).trim();
    } else if (location && !product.city) {
      product.city = String(location).split(',')[0].trim();
    }
    if (availabilityStatus) product.availabilityStatus = availabilityStatus;
    if (stockQuantity !== undefined) product.stockQuantity = Number(stockQuantity);
    if (isFeatured !== undefined) {
      product.isFeatured = isFeatured === 'true' || isFeatured === true;
    }
    if (updatedImages.length > 0) {
      product.images = updatedImages;
    }

    await product.save();

    const populated = await Product.findById(product._id)
      .populate('category', 'name slug')
      .populate('seller', 'name email sellerProfile');

    res.status(200).json({
      success: true,
      message: 'Product updated successfully!',
      product: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a Product
// @route   DELETE /api/products/:id
// @access  Private (Seller, Admin)
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Check ownership or admin
    if (
      product.seller.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this product listing.',
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Product listing removed successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Products Listed by Current Seller
// @route   GET /api/products/seller/me
// @access  Private (Seller)
const getSellerProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ seller: req.user._id })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProducts,
  getFeaturedProducts,
  getRecentProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getSellerProducts,
};

