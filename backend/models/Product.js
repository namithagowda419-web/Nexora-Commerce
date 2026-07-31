const mongoose = require('mongoose');

const specificationSchema = new mongoose.Schema({
  key: { type: String, required: true },
  value: { type: String, required: true }
});

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  discountPrice: { type: Number, default: 0 },
  stock: { type: Number, required: true, default: 20 },
  category: {
    type: String,
    required: true,
    enum: [
      'electronics',
      'fashion',
      'shoes',
      'beauty',
      'home-kitchen',
      'furniture',
      'sports',
      'books',
      'grocery',
      'accessories'
    ]
  },
  categoryName: { type: String, required: true },
  brand: { type: String, required: true },
  images: [{ type: String, required: true }],
  description: { type: String, required: true },
  shortDescription: { type: String, default: '' },
  specifications: [specificationSchema],
  tags: [{ type: String }],
  rating: { type: Number, default: 4.8 },
  numReviews: { type: Number, default: 15 },
  isFeatured: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  isBestSeller: { type: Boolean, default: false },
  isFlashSale: { type: Boolean, default: false },
  isTrending: { type: Boolean, default: false },
  isTopRated: { type: Boolean, default: false },
  salesCount: { type: Number, default: 50 },
  regionPopularity: { type: String, default: 'Global' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
