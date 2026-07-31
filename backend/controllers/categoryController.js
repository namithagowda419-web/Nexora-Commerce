const Category = require('../models/Category');
const Product = require('../models/Product');
const { sampleCategories } = require('../utils/seedData');

const FALLBACK_CATEGORIES = sampleCategories.map((c, idx) => ({
  _id: `cat-${idx + 1}`,
  ...c,
  productCount: Math.floor(12 + Math.random() * 15)
}));

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    if (req.dbConnected) {
      const categories = await Category.find({}).sort({ name: 1 });
      if (categories && categories.length > 0) {
        const categoriesWithCount = await Promise.all(
          categories.map(async (cat) => {
            const count = await Product.countDocuments({ category: cat.slug });
            return {
              ...cat.toObject(),
              productCount: count
            };
          })
        );
        return res.json(categoriesWithCount);
      }
    }
    res.json(FALLBACK_CATEGORIES);
  } catch (error) {
    res.json(FALLBACK_CATEGORIES);
  }
};

// @desc    Create a category (Admin)
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res) => {
  try {
    const { name, image, description } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    if (req.dbConnected) {
      const categoryExists = await Category.findOne({ slug });
      if (categoryExists) {
        return res.status(400).json({ message: 'Category already exists' });
      }

      const category = new Category({
        name,
        slug,
        image,
        description
      });

      const createdCategory = await category.save();
      return res.status(201).json(createdCategory);
    }

    const fallbackCat = {
      _id: `cat-${Date.now()}`,
      name,
      slug,
      image: image || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800',
      description: description || '',
      productCount: 0
    };
    FALLBACK_CATEGORIES.push(fallbackCat);
    res.status(201).json(fallbackCat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a category (Admin)
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res) => {
  try {
    if (req.dbConnected) {
      const category = await Category.findById(req.params.id);
      if (category) {
        category.name = req.body.name || category.name;
        if (req.body.name) {
          category.slug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        }
        category.image = req.body.image || category.image;
        category.description = req.body.description !== undefined ? req.body.description : category.description;

        const updatedCategory = await category.save();
        return res.json(updatedCategory);
      }
    }
    const found = FALLBACK_CATEGORIES.find((c) => c._id === req.params.id || c.slug === req.params.id);
    if (found) {
      found.name = req.body.name || found.name;
      found.image = req.body.image || found.image;
      found.description = req.body.description !== undefined ? req.body.description : found.description;
      return res.json(found);
    }
    res.status(404).json({ message: 'Category not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a category (Admin)
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res) => {
  try {
    if (req.dbConnected) {
      const category = await Category.findById(req.params.id);
      if (category) {
        await category.deleteOne();
        return res.json({ message: 'Category removed' });
      }
    }
    const idx = FALLBACK_CATEGORIES.findIndex((c) => c._id === req.params.id || c.slug === req.params.id);
    if (idx !== -1) {
      FALLBACK_CATEGORIES.splice(idx, 1);
      return res.json({ message: 'Category removed' });
    }
    res.status(404).json({ message: 'Category not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
};

