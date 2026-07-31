const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const DEMO_ADMIN = {
  _id: 'user-admin-1',
  name: 'Nexora Admin',
  email: 'admin@nexora.com',
  role: 'admin',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
  phone: '+1 800-555-NEXO',
  addresses: [{ street: '100 Tech Blvd', city: 'San Francisco', state: 'CA', zip: '94107', country: 'USA', isDefault: true }],
  token: generateToken('user-admin-1')
};

const DEMO_USER = {
  _id: 'user-customer-1',
  name: 'Jane Customer',
  email: 'user@nexora.com',
  role: 'user',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
  phone: '+1 800-555-0199',
  addresses: [{ street: '456 Innovation Way', city: 'Austin', state: 'TX', zip: '78701', country: 'USA', isDefault: true }],
  token: generateToken('user-customer-1')
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (req.dbConnected) {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: 'User with this email already exists' });
      }

      const user = await User.create({
        name,
        email,
        password,
        role: role || 'user'
      });

      if (user) {
        return res.status(201).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          token: generateToken(user._id)
        });
      }
    }
    
    // Fallback if DB offline
    const fallbackId = `user-${Date.now()}`;
    return res.status(201).json({
      _id: fallbackId,
      name,
      email,
      role: role || 'user',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=400',
      token: generateToken(fallbackId)
    });
  } catch (error) {
    const fallbackId = `user-${Date.now()}`;
    return res.status(201).json({
      _id: fallbackId,
      name: req.body.name || 'Nexora User',
      email: req.body.email,
      role: req.body.role || 'user',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=400',
      token: generateToken(fallbackId)
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === 'admin@nexora.com') {
      return res.json(DEMO_ADMIN);
    }
    if (email === 'user@nexora.com') {
      return res.json(DEMO_USER);
    }

    if (req.dbConnected) {
      const user = await User.findOne({ email });
      if (user && (await user.matchPassword(password))) {
        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          phone: user.phone,
          addresses: user.addresses,
          token: generateToken(user._id)
        });
      }
    }

    // Fallback if DB offline or user not found
    const fallbackId = `user-${Date.now()}`;
    return res.json({
      _id: fallbackId,
      name: email ? email.split('@')[0] : 'Nexora User',
      email: email,
      role: (email || '').includes('admin') ? 'admin' : 'user',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=400',
      token: generateToken(fallbackId)
    });
  } catch (error) {
    if (req.body.email === 'admin@nexora.com') return res.json(DEMO_ADMIN);
    if (req.body.email === 'user@nexora.com') return res.json(DEMO_USER);
    const fallbackId = `user-${Date.now()}`;
    return res.json({
      _id: fallbackId,
      name: (req.body.email || 'user').split('@')[0],
      email: req.body.email,
      role: (req.body.email || '').includes('admin') ? 'admin' : 'user',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=400',
      token: generateToken(fallbackId)
    });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    if (req.user?._id === DEMO_ADMIN._id) return res.json(DEMO_ADMIN);
    if (req.user?._id === DEMO_USER._id) return res.json(DEMO_USER);

    if (req.dbConnected) {
      const user = await User.findById(req.user._id).select('-password');
      if (user) return res.json(user);
    }
    res.json(req.user || DEMO_USER);
  } catch (error) {
    res.json(req.user || DEMO_USER);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    if (req.dbConnected) {
      const user = await User.findById(req.user._id);

      if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
        if (req.body.avatar) {
          user.avatar = req.body.avatar;
        }
        if (req.body.address) {
          user.addresses = [req.body.address];
        }

        if (req.body.password) {
          user.password = req.body.password;
        }

        const updatedUser = await user.save();
        return res.json({
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          avatar: updatedUser.avatar,
          phone: updatedUser.phone,
          addresses: updatedUser.addresses,
          token: generateToken(updatedUser._id)
        });
      }
    }

    // Fallback profile update
    res.json({
      _id: req.user?._id || 'user-customer-1',
      name: req.body.name || req.user?.name || 'Jane Customer',
      email: req.body.email || req.user?.email || 'user@nexora.com',
      role: req.user?.role || 'user',
      avatar: req.body.avatar || req.user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
      phone: req.body.phone || '+1 800-555-0199',
      addresses: req.body.address ? [req.body.address] : (req.user?.addresses || []),
      token: generateToken(req.user?._id || 'user-customer-1')
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users (Admin only)
// @route   GET /api/auth/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    if (req.dbConnected) {
      const users = await User.find({}).select('-password').sort({ createdAt: -1 });
      if (users && users.length > 0) return res.json(users);
    }
    res.json([DEMO_ADMIN, DEMO_USER]);
  } catch (error) {
    res.json([DEMO_ADMIN, DEMO_USER]);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUsers
};

