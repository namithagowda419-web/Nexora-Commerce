const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const { sampleProducts, sampleCategories } = require('./utils/seedData');
const Product = require('./models/Product');
const Category = require('./models/Category');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const cartRoutes = require('./routes/cartRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();

// Middleware
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// DB Connection Middleware Flag
app.use((req, res, next) => {
  req.dbConnected = require('mongoose').connection.readyState === 1;
  next();
});

// Prepare 100 Fallback Products Memory Store for NEXORA
const FALLBACK_PRODUCTS = sampleProducts.map((p, idx) => ({
  _id: `nex-${idx + 1}`,
  ...p
}));

const FALLBACK_CATEGORIES = sampleCategories.map((c, idx) => ({
  _id: `cat-${idx + 1}`,
  ...c
}));

// Fallback API Interceptors for Dual-Resilience Mode
app.get('/api/categories', async (req, res, next) => {
  if (req.dbConnected) {
    try {
      const dbCats = await Category.find({});
      if (dbCats && dbCats.length > 0) return res.json(dbCats);
    } catch (e) {}
  }
  res.json(FALLBACK_CATEGORIES);
});

app.get('/api/products', async (req, res, next) => {
  if (req.dbConnected) {
    try {
      const count = await Product.countDocuments();
      if (count > 0) return next();
    } catch (e) {}
  }

  // Serve from 100 fallback memory store
  let list = [...FALLBACK_PRODUCTS];

  if (req.query.category && req.query.category !== 'all') {
    list = list.filter((p) => p.category === req.query.category);
  }

  if (req.query.brand && req.query.brand !== 'all') {
    list = list.filter((p) => p.brand.toLowerCase() === req.query.brand.toLowerCase());
  }

  if (req.query.keyword) {
    const k = req.query.keyword.toLowerCase();
    list = list.filter((p) => p.title.toLowerCase().includes(k) || p.brand.toLowerCase().includes(k) || p.categoryName.toLowerCase().includes(k));
  }

  if (req.query.rating) {
    list = list.filter((p) => p.rating >= Number(req.query.rating));
  }

  if (req.query.minPrice) {
    list = list.filter((p) => (p.discountPrice || p.price) >= Number(req.query.minPrice));
  }

  if (req.query.maxPrice) {
    list = list.filter((p) => (p.discountPrice || p.price) <= Number(req.query.maxPrice));
  }

  // Sorting
  if (req.query.sort === 'price-asc') {
    list.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
  } else if (req.query.sort === 'price-desc') {
    list.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
  } else if (req.query.sort === 'rating') {
    list.sort((a, b) => b.rating - a.rating);
  } else if (req.query.sort === 'popular') {
    list.sort((a, b) => b.numReviews - a.numReviews);
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 12;
  const startIndex = (page - 1) * limit;
  const paginatedProducts = list.slice(startIndex, startIndex + limit);
  const allBrands = Array.from(new Set(FALLBACK_PRODUCTS.map((p) => p.brand)));

  res.json({
    products: paginatedProducts,
    page,
    pages: Math.ceil(list.length / limit) || 1,
    totalProducts: list.length,
    brands: allBrands
  });
});

app.get('/api/products/featured', async (req, res, next) => {
  if (req.dbConnected) {
    try {
      const count = await Product.countDocuments({ isFeatured: true });
      if (count > 0) return next();
    } catch (e) {}
  }
  res.json(FALLBACK_PRODUCTS.filter((p) => p.isFeatured).slice(0, 8));
});

app.get('/api/products/flash-sale', async (req, res, next) => {
  if (req.dbConnected) {
    try {
      const count = await Product.countDocuments({ isFlashSale: true });
      if (count > 0) return next();
    } catch (e) {}
  }
  res.json(FALLBACK_PRODUCTS.filter((p) => p.isFlashSale).slice(0, 8));
});

app.get('/api/products/trending', async (req, res, next) => {
  if (req.dbConnected) {
    try {
      const count = await Product.countDocuments({ isTrending: true });
      if (count > 0) return next();
    } catch (e) {}
  }
  res.json(FALLBACK_PRODUCTS.filter((p) => p.isTrending).slice(0, 8));
});

app.get('/api/products/top-rated', async (req, res, next) => {
  if (req.dbConnected) {
    try {
      const count = await Product.countDocuments({ rating: { $gte: 4.8 } });
      if (count > 0) return next();
    } catch (e) {}
  }
  res.json(FALLBACK_PRODUCTS.filter((p) => p.rating >= 4.8).slice(0, 8));
});

app.get('/api/products/best-sellers', async (req, res, next) => {
  if (req.dbConnected) {
    try {
      const count = await Product.countDocuments({ isBestSeller: true });
      if (count > 0) return next();
    } catch (e) {}
  }
  res.json(FALLBACK_PRODUCTS.filter((p) => p.isBestSeller).slice(0, 8));
});

app.get('/api/products/new-arrivals', async (req, res, next) => {
  if (req.dbConnected) {
    try {
      const count = await Product.countDocuments({ isNewArrival: true });
      if (count > 0) return next();
    } catch (e) {}
  }
  res.json(FALLBACK_PRODUCTS.filter((p) => p.isNewArrival).slice(0, 8));
});

app.get('/api/products/:id', async (req, res, next) => {
  if (req.dbConnected) {
    try {
      const p = await Product.findById(req.params.id);
      if (p) return next();
    } catch (e) {}
  }
  const found = FALLBACK_PRODUCTS.find((p) => p._id === req.params.id || p.slug === req.params.id);
  res.json(found || FALLBACK_PRODUCTS[0]);
});


// Connect to MongoDB & Auto-Seed Check
connectDB().then(async (isConnected) => {
  if (isConnected) {
    try {
      const productCount = await Product.countDocuments();
      if (productCount === 0) {
        console.log('[NEXORA Auto-Seed] Database is empty. Inserting 100 sample products...');
        await Product.insertMany(sampleProducts);
        await Category.insertMany(sampleCategories);
        console.log('[NEXORA Auto-Seed] Auto-seeding completed cleanly!');
      }
    } catch (err) {
      console.error('[NEXORA Auto-Seed Warning]', err.message);
    }
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);

// Base route for health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'NEXORA — Shop Smarter. Live Better. API is active',
    totalFallbackProducts: FALLBACK_PRODUCTS.length,
    timestamp: new Date()
  });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[NEXORA Server] Modern 3D Tech E-Commerce Backend running on http://localhost:${PORT}`);
  });
}

module.exports = app;
