const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Create a new Order
// @route   POST /api/orders
// @access  Private (User)
const createOrder = async (req, res, next) => {
  try {
    return res.status(403).json({
      success: false,
      message: 'Direct ordering is disabled. Mark the product as Interested so the seller can contact you.',
    });

    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items specified.',
      });
    }

    if (!shippingAddress || !shippingAddress.addressLine || !shippingAddress.city) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid shipping address.',
      });
    }

    // Verify products, compute price, check seller
    const orderItems = [];
    let itemsPrice = 0;

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.name || item.product} not found.`,
        });
      }

      if (product.stockQuantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Product "${product.name}" only has ${product.stockQuantity} items in stock.`,
        });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.images[0] || '',
        seller: product.seller,
        status: 'Pending',
      });

      itemsPrice += product.price * item.quantity;

      // Deduct stock quantity and update availability
      product.stockQuantity -= item.quantity;
      if (product.stockQuantity <= 0) {
        product.availabilityStatus = 'Out of Stock';
      }
      await product.save();
    }

    // Calculate shipping (free above ₹999, else ₹99) and tax (5% GST)
    const shippingPrice = itemsPrice >= 999 ? 0 : 99;
    const taxPrice = Number((0.05 * itemsPrice).toFixed(2));
    const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'Cash on Delivery',
      paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid',
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      orderStatus: 'Pending',
    });

    // Clear user's cart after successful order creation
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's orders
// @route   GET /api/orders/my-orders
// @access  Private (User)
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name images')
      .populate('items.seller', 'name sellerProfile')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private (Owner, Seller of item, Admin)
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('items.product', 'name images category')
      .populate('items.seller', 'name email sellerProfile');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Authorization check: User who placed it, Admin, or Seller who has an item in it
    const isOwner = order.user._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    const isSeller = order.items.some(
      (item) => item.seller._id.toString() === req.user._id.toString()
    );

    if (!isOwner && !isAdmin && !isSeller) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order details',
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get orders for current Seller
// @route   GET /api/orders/seller/orders
// @access  Private (Seller)
const getSellerOrders = async (req, res, next) => {
  try {
    // Find all orders that contain at least one item sold by this seller
    const orders = await Order.find({ 'items.seller': req.user._id })
      .populate('user', 'name email phone')
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 });

    // Format response so seller easily sees their items and buyer info
    const sellerOrders = orders.map((order) => {
      const myItems = order.items.filter(
        (item) => item.seller.toString() === req.user._id.toString()
      );
      const sellerSubtotal = myItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      return {
        _id: order._id,
        orderNumber: order.orderNumber,
        buyer: order.user,
        shippingAddress: order.shippingAddress,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt,
        overallStatus: order.orderStatus,
        items: myItems,
        sellerSubtotal,
      };
    });

    res.status(200).json({
      success: true,
      count: sellerOrders.length,
      orders: sellerOrders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Seller updates status of their item in the order
// @route   PUT /api/orders/:orderId/items/:itemId/status
// @access  Private (Seller, Admin)
const updateOrderItemStatus = async (req, res, next) => {
  try {
    const { orderId, itemId } = req.params;
    const { status } = req.body;

    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const item = order.items.id(itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Order item not found' });
    }

    // Verify seller owns this item or user is admin
    if (
      item.seller.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this item.',
      });
    }

    item.status = status;

    // Check if all items in order have reached the same status or delivered
    const allDelivered = order.items.every((it) => it.status === 'Delivered');
    const allCancelled = order.items.every((it) => it.status === 'Cancelled');
    const anyShipped = order.items.some((it) => it.status === 'Shipped');

    if (allDelivered) {
      order.orderStatus = 'Delivered';
      order.deliveredAt = Date.now();
      order.paymentStatus = 'Paid';
    } else if (allCancelled) {
      order.orderStatus = 'Cancelled';
    } else if (anyShipped) {
      order.orderStatus = 'Shipped';
    } else {
      order.orderStatus = 'Processing';
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: `Item status updated to ${status}`,
      order,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getSellerOrders,
  updateOrderItemStatus,
};

