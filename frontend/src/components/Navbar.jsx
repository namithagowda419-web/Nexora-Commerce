import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  Moon,
  Sun,
  Menu,
  X,
  Zap,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  PackageCheck,
  UserCircle,
  Layers,
  Box
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useTheme } from '../context/ThemeContext';
import API from '../services/api';
import { formatCurrency } from '../utils/formatters';

const Navbar = ({ compareCount = 0, onOpenCompare }) => {
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  const { itemCount, subtotal } = useCart();
  const { wishlistItems } = useWishlist();
  const { darkMode, toggleDarkMode } = useTheme();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchPopup, setShowSearchPopup] = useState(false);

  // Search autocomplete handler
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true);
        try {
          const res = await API.get(`/products?keyword=${encodeURIComponent(searchQuery)}&limit=5`);
          setSearchResults(res.data.products || []);
          setShowSearchPopup(true);
        } catch (e) {
          console.error(e);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setShowSearchPopup(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearchPopup(false);
    }
  };

  const CATEGORY_ITEMS = [
    { name: 'Electronics', slug: 'electronics' },
    { name: 'Fashion', slug: 'fashion' },
    { name: 'Shoes', slug: 'shoes' },
    { name: 'Beauty', slug: 'beauty' },
    { name: 'Home & Kitchen', slug: 'home-kitchen' },
    { name: 'Furniture', slug: 'furniture' },
    { name: 'Sports', slug: 'sports' },
    { name: 'Books', slug: 'books' },
    { name: 'Grocery', slug: 'grocery' },
    { name: 'Accessories', slug: 'accessories' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-nav-nexora transition-all font-inter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo - 3D Gradient Cube Badge with Stylized N */}
        <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
          <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#7C3AED] via-[#A78BFA] to-[#FF6B8A] p-0.5 shadow-3d-glow transform group-hover:rotate-6 transition-all duration-300">
            <div className="w-full h-full bg-[#0F1021] rounded-[14px] flex items-center justify-center relative overflow-hidden">
              <Zap className="w-6 h-6 text-[#67E8F9] drop-shadow-[0_0_8px_rgba(103,232,249,0.8)]" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-2xl tracking-tight text-white bg-gradient-to-r from-white via-[#D8B4FE] to-[#FF6B8A] bg-clip-text text-transparent">
              NEXORA
            </span>
            <span className="text-[9px] font-semibold tracking-wider text-[#67E8F9] -mt-1 font-inter">
              Shop Smarter. Live Better.
            </span>
          </div>
        </Link>

        {/* Navigation Categories */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-[#F8FAFC]">
          <Link to="/" className="hover:text-[#67E8F9] transition-colors">
            Home
          </Link>
          <Link to="/shop" className="hover:text-[#67E8F9] transition-colors">
            All Products
          </Link>

          {/* Department Mega Dropdown */}
          <div className="relative">
            <button
              onClick={() => setCategoriesDropdownOpen(!categoriesDropdownOpen)}
              className="flex items-center gap-1 hover:text-[#67E8F9] transition-colors"
            >
              <span>Categories</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            <AnimatePresence>
              {categoriesDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute left-0 top-8 w-56 bg-[#1B1C3A] rounded-2xl shadow-3d-glow border border-[#7C3AED]/30 p-2 z-50 text-[#F8FAFC]"
                >
                  {CATEGORY_ITEMS.map((cat) => (
                    <Link
                      key={cat.slug}
                      to={`/shop?category=${cat.slug}`}
                      onClick={() => setCategoriesDropdownOpen(false)}
                      className="block px-3 py-2 text-xs hover:bg-[#7C3AED]/20 hover:text-[#67E8F9] rounded-xl font-medium transition"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link to="/about" className="hover:text-[#67E8F9] transition-colors">
            About NEXORA
          </Link>
        </nav>

        {/* Search Input Bar */}
        <div className="relative hidden md:block max-w-xs w-full">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search electronics, fashion, shoes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.length >= 2 && setShowSearchPopup(true)}
              className="w-full bg-[#1B1C3A]/90 text-white placeholder-[#D8B4FE]/50 border border-[#7C3AED]/40 rounded-full px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#67E8F9] transition"
            />
            <button type="submit" className="absolute right-3 top-2.5 text-[#67E8F9] hover:text-white">
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Autocomplete Popup */}
          <AnimatePresence>
            {showSearchPopup && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute left-0 right-0 top-12 bg-[#1B1C3A] rounded-2xl shadow-3d-glow border border-[#7C3AED]/40 p-2 z-50 text-white"
              >
                {searchResults.length > 0 ? (
                  searchResults.map((item) => (
                    <Link
                      key={item._id}
                      to={`/product/${item.slug || item._id}`}
                      onClick={() => setShowSearchPopup(false)}
                      className="flex items-center gap-3 p-2 hover:bg-[#7C3AED]/20 rounded-xl transition"
                    >
                      <img src={item.images[0]} alt={item.title} className="w-10 h-10 rounded-lg object-cover" />
                      <div className="flex flex-col text-left">
                        <span className="text-xs font-semibold line-clamp-1">{item.title}</span>
                        <span className="text-[11px] text-[#67E8F9] font-medium">{formatCurrency(item.discountPrice || item.price)}</span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="p-3 text-center text-xs text-gray-400">
                    {isSearching ? 'Searching...' : 'No products found'}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-3 text-white">
          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-white/10 transition text-[#D8B4FE] hover:text-[#67E8F9]"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Compare Trigger */}
          {onOpenCompare && (
            <button
              onClick={onOpenCompare}
              className="relative p-2 rounded-full hover:bg-white/10 transition text-[#D8B4FE] hover:text-[#67E8F9]"
              title="Compare Products"
            >
              <Layers className="w-5 h-5" />
              {compareCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#FF6B8A] text-white font-bold text-[10px] rounded-full flex items-center justify-center">
                  {compareCount}
                </span>
              )}
            </button>
          )}

          {/* Wishlist Icon */}
          <Link
            to="/wishlist"
            className="relative p-2 rounded-full hover:bg-white/10 transition text-[#D8B4FE] hover:text-[#67E8F9]"
            title="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlistItems.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#FF6B8A] text-white font-bold text-[10px] rounded-full flex items-center justify-center">
                {wishlistItems.length}
              </span>
            )}
          </Link>

          {/* Cart Icon */}
          <Link
            to="/cart"
            className="relative p-2 rounded-full hover:bg-white/10 transition text-[#D8B4FE] hover:text-[#67E8F9] flex items-center gap-2"
            title="Shopping Cart"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-[#67E8F9]" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF6B8A] text-white font-bold text-[10px] rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </div>
            <span className="hidden xl:inline text-xs font-bold text-white">
              {formatCurrency(subtotal)}
            </span>
          </Link>

          {/* User Account Menu */}
          <div className="relative">
            {user ? (
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full hover:bg-white/10 transition"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover border border-[#7C3AED]"
                />
                <span className="hidden sm:inline text-xs font-semibold text-white">{user.name.split(' ')[0]}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#D8B4FE]" />
              </button>
            ) : (
              <Link
                to="/login"
                className="btn-gradient-nexora text-white text-xs font-bold px-4 py-2 rounded-full shadow-md hover:scale-105 transition"
              >
                Sign In
              </Link>
            )}

            {/* Dropdown Menu */}
            <AnimatePresence>
              {userDropdownOpen && user && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 top-12 w-48 bg-[#1B1C3A] rounded-2xl shadow-3d-glow border border-[#7C3AED]/40 p-2 z-50 text-white"
                >
                  <div className="px-3 py-2 border-b border-white/10">
                    <p className="text-xs font-bold truncate">{user.name}</p>
                    <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs hover:bg-[#7C3AED]/20 hover:text-[#67E8F9] rounded-xl transition"
                  >
                    <UserCircle className="w-4 h-4 text-[#7C3AED]" />
                    <span>My Profile</span>
                  </Link>

                  <Link
                    to="/orders"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs hover:bg-[#7C3AED]/20 hover:text-[#67E8F9] rounded-xl transition"
                  >
                    <PackageCheck className="w-4 h-4 text-[#7C3AED]" />
                    <span>My Orders</span>
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#FF6B8A] hover:bg-[#7C3AED]/20 rounded-xl transition"
                    >
                      <LayoutDashboard className="w-4 h-4 text-[#FF6B8A]" />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-400 hover:bg-rose-950/40 rounded-xl transition mt-1"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#0F1021] text-white px-6 py-6 border-t border-[#7C3AED]/30 flex flex-col gap-3"
          >
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium py-1">
              Home
            </Link>
            <Link to="/shop" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium py-1">
              All Products
            </Link>

            <span className="text-xs font-bold uppercase text-[#67E8F9] pt-2">Departments</span>
            {CATEGORY_ITEMS.map((c) => (
              <Link
                key={c.slug}
                to={`/shop?category=${c.slug}`}
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs text-[#D8B4FE] py-1 pl-2 hover:text-[#67E8F9]"
              >
                {c.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
