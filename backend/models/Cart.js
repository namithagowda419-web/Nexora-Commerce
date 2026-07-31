const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productData: {
    title: String,
    price: Number,
    discountPrice: Number,
    image: String,
    brand: String,
    category: String,
    stock: Number
  },
  quantity: { type: Number, required: true, default: 1, min: 1 },
  selectedColor: { type: String, default: '' },
  selectedSize: { type: String, default: '' }
});

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [cartItemSchema],
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cart', cartSchema);
