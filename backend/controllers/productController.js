const Product = require('../models/Product');

// @desc    Fetch all products with filters, sorting, and pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const query = {};

    // Search keyword
    if (req.query.keyword) {
      query.$or = [
        { title: { $regex: req.query.keyword, $options: 'i' } },
        { description: { $regex: req.query.keyword, $options: 'i' } },
        { brand: { $regex: req.query.keyword, $options: 'i' } },
        { tags: { $in: [new RegExp(req.query.keyword, 'i')] } }
      ];
    }

    // Category filter
    if (req.query.category && req.query.category !== 'all') {
      query.category = req.query.category;
    }

    // Brand filter
    if (req.query.brand && req.query.brand !== 'all') {
      query.brand = req.query.brand;
    }

    // Price filter
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }

    // Rating filter
    if (req.query.rating) {
      query.rating = { $gte: Number(req.query.rating) };
    }

    // Sorting
    let sort = { createdAt: -1 };
    if (req.query.sort === 'price-asc') {
      sort = { price: 1 };
    } else if (req.query.sort === 'price-desc') {
      sort = { price: -1 };
    } else if (req.query.sort === 'rating') {
      sort = { rating: -1 };
    } else if (req.query.sort === 'newest') {
      sort = { createdAt: -1 };
    } else if (req.query.sort === 'popular') {
      sort = { numReviews: -1 };
    }

    const count = await Product.countDocuments(query);
    const products = await Product.find(query).sort(sort).skip(skip).limit(limit);

    // Get unique brands for filter options
    const allBrands = await Product.distinct('brand');

    res.json({
      products,
      page,
      pages: Math.ceil(count / limit),
      totalProducts: count,
      brands: allBrands
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single product by ID or Slug
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    let product;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id);
    }
    if (!product) {
      product = await Product.findOne({ slug: id });
    }

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true }).limit(8);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get flash sale products
// @route   GET /api/products/flash-sale
// @access  Public
const getFlashSaleProducts = async (req, res) => {
  try {
    const products = await Product.find({ isFlashSale: true }).limit(8);
    res.json(products.length ? products : await Product.find({ discountPrice: { $gt: 0 } }).limit(8));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get trending products
// @route   GET /api/products/trending
// @access  Public
const getTrendingProducts = async (req, res) => {
  try {
    const products = await Product.find({ isTrending: true }).limit(8);
    res.json(products.length ? products : await Product.find({}).sort({ salesCount: -1 }).limit(8));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get top rated products
// @route   GET /api/products/top-rated
// @access  Public
const getTopRatedProducts = async (req, res) => {
  try {
    const products = await Product.find({ rating: { $gte: 4.8 } }).sort({ rating: -1 }).limit(8);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get new arrivals
// @route   GET /api/products/new-arrivals
// @access  Public
const getNewArrivals = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 }).limit(8);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get best sellers
// @route   GET /api/products/best-sellers
// @access  Public
const getBestSellers = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ numReviews: -1 }).limit(8);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get related products
// @route   GET /api/products/related/:category
// @access  Public
const getRelatedProducts = async (req, res) => {
  try {
    const { category } = req.params;
    const excludeId = req.query.exclude;
    const query = { category };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    const products = await Product.find(query).limit(6);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product (Admin)
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const {
      title,
      price,
      discountPrice,
      stock,
      category,
      categoryName,
      brand,
      images,
      description,
      shortDescription,
      specifications,
      tags,
      isFeatured,
      isNewArrival,
      isBestSeller,
      isFlashSale,
      isTrending
    } = req.body;

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now();

    const product = new Product({
      title,
      slug,
      price,
      discountPrice: discountPrice || 0,
      stock: stock || 20,
      category,
      categoryName: categoryName || category,
      brand,
      images: images && images.length ? images : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'],
      description,
      shortDescription,
      specifications: specifications || [],
      tags: tags || [],
      isFeatured: Boolean(isFeatured),
      isNewArrival: Boolean(isNewArrival),
      isBestSeller: Boolean(isBestSeller),
      isFlashSale: Boolean(isFlashSale),
      isTrending: Boolean(isTrending)
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product (Admin)
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.title = req.body.title || product.title;
      product.price = req.body.price !== undefined ? req.body.price : product.price;
      product.discountPrice = req.body.discountPrice !== undefined ? req.body.discountPrice : product.discountPrice;
      product.stock = req.body.stock !== undefined ? req.body.stock : product.stock;
      product.category = req.body.category || product.category;
      product.categoryName = req.body.categoryName || product.categoryName;
      product.brand = req.body.brand || product.brand;
      if (req.body.images) product.images = req.body.images;
      product.description = req.body.description || product.description;
      product.shortDescription = req.body.shortDescription || product.shortDescription;
      if (req.body.specifications) product.specifications = req.body.specifications;
      if (req.body.isFeatured !== undefined) product.isFeatured = req.body.isFeatured;
      if (req.body.isNewArrival !== undefined) product.isNewArrival = req.body.isNewArrival;
      if (req.body.isBestSeller !== undefined) product.isBestSeller = req.body.isBestSeller;
      if (req.body.isFlashSale !== undefined) product.isFlashSale = req.body.isFlashSale;
      if (req.body.isTrending !== undefined) product.isTrending = req.body.isTrending;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product (Admin)
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  getFeaturedProducts,
  getFlashSaleProducts,
  getTrendingProducts,
  getTopRatedProducts,
  getNewArrivals,
  getBestSellers,
  getRelatedProducts,
  createProduct,
  updateProduct,
  deleteProduct
};
