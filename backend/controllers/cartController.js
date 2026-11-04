const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get current user's cart
// @route   GET /api/cart
// @access  Private (User)
const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      select: 'name price originalPrice images condition availabilityStatus stockQuantity seller',
      populate: {
        path: 'seller',
        select: 'name sellerProfile',
      },
    });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    // Filter out any items where the product might have been deleted
    const validItems = cart.items.filter((item) => item.product !== null);
    if (validItems.length !== cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    // Compute totals
    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    res.status(200).json({
      success: true,
      cart: {
        _id: cart._id,
        items: cart.items,
        totalItems: cart.items.reduce((acc, item) => acc + item.quantity, 0),
        subtotal,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private (User)
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    if (product.availabilityStatus !== 'In Stock' || product.stockQuantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'This product is currently out of stock.',
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    const qtyToAdd = parseInt(quantity, 10) || 1;

    if (existingItemIndex > -1) {
      const newQty = cart.items[existingItemIndex].quantity + qtyToAdd;
      if (newQty > product.stockQuantity) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stockQuantity} items in stock.`,
        });
      }
      cart.items[existingItemIndex].quantity = newQty;
      cart.items[existingItemIndex].price = product.price;
    } else {
      if (qtyToAdd > product.stockQuantity) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stockQuantity} items in stock.`,
        });
      }
      cart.items.push({
        product: product._id,
        quantity: qtyToAdd,
        price: product.price,
      });
    }

    await cart.save();

    // Return populated cart
    const populatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name price originalPrice images condition availabilityStatus stockQuantity seller',
      populate: {
        path: 'seller',
        select: 'name sellerProfile',
      },
    });

    const subtotal = populatedCart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    res.status(200).json({
      success: true,
      message: 'Product added to cart!',
      cart: {
        _id: populatedCart._id,
        items: populatedCart.items,
        totalItems: populatedCart.items.reduce((acc, item) => acc + item.quantity, 0),
        subtotal,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update item quantity in cart
// @route   PUT /api/cart/update
// @access  Private (User)
const updateCartItem = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Product ID and quantity are required',
      });
    }

    const qty = parseInt(quantity, 10);
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: 'Item not in cart' });
    }

    if (qty <= 0) {
      // Remove item if quantity is zero or negative
      cart.items.splice(itemIndex, 1);
    } else {
      const product = await Product.findById(productId);
      if (product && qty > product.stockQuantity) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stockQuantity} items available in stock.`,
        });
      }
      cart.items[itemIndex].quantity = qty;
    }

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name price originalPrice images condition availabilityStatus stockQuantity seller',
      populate: {
        path: 'seller',
        select: 'name sellerProfile',
      },
    });

    const subtotal = populatedCart.items.reduce(
      (sum, item) => sum + (item.product ? item.product.price * item.quantity : 0),
      0
    );

    res.status(200).json({
      success: true,
      message: 'Cart updated',
      cart: {
        _id: populatedCart._id,
        items: populatedCart.items,
        totalItems: populatedCart.items.reduce((acc, item) => acc + item.quantity, 0),
        subtotal,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:productId
// @access  Private (User)
const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name price originalPrice images condition availabilityStatus stockQuantity seller',
      populate: {
        path: 'seller',
        select: 'name sellerProfile',
      },
    });

    const subtotal = populatedCart.items.reduce(
      (sum, item) => sum + (item.product ? item.product.price * item.quantity : 0),
      0
    );

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      cart: {
        _id: populatedCart._id,
        items: populatedCart.items,
        totalItems: populatedCart.items.reduce((acc, item) => acc + item.quantity, 0),
        subtotal,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart/clear
// @access  Private (User)
const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      cart: { items: [], totalItems: 0, subtotal: 0 },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};

