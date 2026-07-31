const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  quantity: { type: Number, required: true },
  selectedColor: { type: String, default: '' },
  selectedSize: { type: String, default: '' }
});

const shippingAddressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, default: 'United States' },
  phone: { type: String, required: true }
});

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderItems: [orderItemSchema],
  shippingAddress: shippingAddressSchema,
  paymentMethod: { type: String, required: true, default: 'Cash on Delivery' },
  paymentResult: {
    id: String,
    status: String,
    updateTime: String,
    emailAddress: String
  },
  itemsPrice: { type: Number, required: true },
  taxPrice: { type: Number, required: true, default: 0 },
  shippingPrice: { type: Number, required: true, default: 0 },
  discountAmount: { type: Number, default: 0 },
  totalPrice: { type: Number, required: true },
  isPaid: { type: Boolean, default: false },
  paidAt: { type: Date },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Processing'
  },
  deliveredAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
