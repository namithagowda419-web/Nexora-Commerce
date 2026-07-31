const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

const FALLBACK_ORDERS = [
  {
    _id: 'ord-1001',
    orderNumber: 'NEX-882910',
    user: { _id: 'user-customer-1', name: 'Jane Customer', email: 'user@nexora.com' },
    orderItems: [
      {
        title: 'Quantum X-1 Pro Wireless Headphones',
        price: 299.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800'
      }
    ],
    shippingAddress: { fullName: 'Jane Customer', address: '456 Innovation Way', city: 'Austin', postalCode: '78701', country: 'USA' },
    paymentMethod: 'Credit Card (Stripe)',
    itemsPrice: 299.99,
    taxPrice: 15.00,
    shippingPrice: 0,
    discountAmount: 0,
    totalPrice: 314.99,
    isPaid: true,
    paidAt: new Date(),
    status: 'Processing',
    createdAt: new Date()
  }
];

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      discountAmount,
      totalPrice
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items specified' });
    }

    const orderNumber = 'NEX-' + Math.floor(100000 + Math.random() * 900000);

    if (req.dbConnected) {
      const order = new Order({
        orderNumber,
        user: req.user._id,
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        discountAmount: discountAmount || 0,
        totalPrice,
        isPaid: paymentMethod !== 'Cash on Delivery',
        paidAt: paymentMethod !== 'Cash on Delivery' ? Date.now() : null,
        status: 'Processing'
      });

      const createdOrder = await order.save();

      for (const item of orderItems) {
        const product = await Product.findById(item.product);
        if (product) {
          product.stock = Math.max(0, product.stock - item.quantity);
          await product.save();
        }
      }

      await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
      return res.status(201).json(createdOrder);
    }

    // Fallback in-memory order creation
    const newFallbackOrder = {
      _id: `ord-${Date.now()}`,
      orderNumber,
      user: req.user || { _id: 'user-customer-1', name: 'Jane Customer', email: 'user@nexora.com' },
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      discountAmount: discountAmount || 0,
      totalPrice,
      isPaid: paymentMethod !== 'Cash on Delivery',
      paidAt: paymentMethod !== 'Cash on Delivery' ? new Date() : null,
      status: 'Processing',
      createdAt: new Date()
    };
    FALLBACK_ORDERS.unshift(newFallbackOrder);
    res.status(201).json(newFallbackOrder);
  } catch (error) {
    const orderNumber = 'NEX-' + Math.floor(100000 + Math.random() * 900000);
    const newFallbackOrder = {
      _id: `ord-${Date.now()}`,
      orderNumber,
      user: req.user || { _id: 'user-customer-1', name: 'Jane Customer', email: 'user@nexora.com' },
      orderItems: req.body.orderItems || [],
      shippingAddress: req.body.shippingAddress || {},
      paymentMethod: req.body.paymentMethod || 'Credit Card',
      itemsPrice: req.body.itemsPrice || 0,
      taxPrice: req.body.taxPrice || 0,
      shippingPrice: req.body.shippingPrice || 0,
      discountAmount: req.body.discountAmount || 0,
      totalPrice: req.body.totalPrice || 0,
      isPaid: true,
      paidAt: new Date(),
      status: 'Processing',
      createdAt: new Date()
    };
    FALLBACK_ORDERS.unshift(newFallbackOrder);
    res.status(201).json(newFallbackOrder);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    if (req.dbConnected) {
      const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
      if (orders && orders.length > 0) return res.json(orders);
    }
    const userOrders = FALLBACK_ORDERS.filter(
      (o) => (o.user._id || o.user) === (req.user?._id || 'user-customer-1')
    );
    res.json(userOrders.length ? userOrders : FALLBACK_ORDERS);
  } catch (error) {
    res.json(FALLBACK_ORDERS);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    if (req.dbConnected) {
      const order = await Order.findById(req.params.id).populate('user', 'name email');
      if (order) return res.json(order);
    }
    const found = FALLBACK_ORDERS.find((o) => o._id === req.params.id || o.orderNumber === req.params.id);
    res.json(found || FALLBACK_ORDERS[0]);
  } catch (error) {
    const found = FALLBACK_ORDERS.find((o) => o._id === req.params.id || o.orderNumber === req.params.id);
    res.json(found || FALLBACK_ORDERS[0]);
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res) => {
  try {
    if (req.dbConnected) {
      const order = await Order.findById(req.params.id);
      if (order) {
        order.status = 'Cancelled';
        const updatedOrder = await order.save();
        return res.json(updatedOrder);
      }
    }
    const found = FALLBACK_ORDERS.find((o) => o._id === req.params.id);
    if (found) {
      found.status = 'Cancelled';
      return res.json(found);
    }
    res.status(404).json({ message: 'Order not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    if (req.dbConnected) {
      const orders = await Order.find({}).populate('user', 'id name email').sort({ createdAt: -1 });
      if (orders && orders.length > 0) return res.json(orders);
    }
    res.json(FALLBACK_ORDERS);
  } catch (error) {
    res.json(FALLBACK_ORDERS);
  }
};

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (req.dbConnected) {
      const order = await Order.findById(req.params.id);
      if (order) {
        order.status = status;
        if (status === 'Delivered') {
          order.deliveredAt = Date.now();
          order.isPaid = true;
        }
        const updatedOrder = await order.save();
        return res.json(updatedOrder);
      }
    }
    const found = FALLBACK_ORDERS.find((o) => o._id === req.params.id);
    if (found) {
      found.status = status;
      return res.json(found);
    }
    res.status(404).json({ message: 'Order not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus
};

