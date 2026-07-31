const Review = require('../models/Review');
const Product = require('../models/Product');

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add review for a product
// @route   POST /api/reviews
// @access  Private
const addReview = async (req, res) => {
  try {
    const { productId, rating, title, comment } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const alreadyReviewed = await Review.findOne({
      product: productId,
      user: req.user._id
    });

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    const review = new Review({
      product: productId,
      user: req.user._id,
      userName: req.user.name,
      userAvatar: req.user.avatar,
      rating: Number(rating),
      title,
      comment
    });

    await review.save();

    // Recalculate product rating & numReviews
    const reviews = await Review.find({ product: productId });
    product.numReviews = reviews.length;
    product.rating = (
      reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length
    ).toFixed(1);

    await product.save();

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete review (Admin or reviewer)
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (review) {
      if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to delete this review' });
      }

      const productId = review.product;
      await review.deleteOne();

      // Recalculate product rating
      const product = await Product.findById(productId);
      if (product) {
        const reviews = await Review.find({ product: productId });
        product.numReviews = reviews.length;
        product.rating = reviews.length
          ? (reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length).toFixed(1)
          : 5.0;
        await product.save();
      }

      res.json({ message: 'Review removed' });
    } else {
      res.status(404).json({ message: 'Review not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProductReviews,
  addReview,
  deleteReview
};
