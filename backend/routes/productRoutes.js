const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/productController');

const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getProducts).post(protect, admin, createProduct);

// Specific filter routes (placed BEFORE /:id to avoid ID conflict)
router.get('/featured', getFeaturedProducts);
router.get('/flash-sale', getFlashSaleProducts);
router.get('/trending', getTrendingProducts);
router.get('/top-rated', getTopRatedProducts);
router.get('/new-arrivals', getNewArrivals);
router.get('/best-sellers', getBestSellers);
router.get('/related/:category', getRelatedProducts);

router.route('/:id').get(getProductById).put(protect, admin, updateProduct).delete(protect, admin, deleteProduct);

module.exports = router;
