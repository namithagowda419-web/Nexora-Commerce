import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, SlidersHorizontal, Grid, List, Search, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import CompareModal from '../components/CompareModal';
import RecommendationSection from '../components/RecommendationSection';
import API from '../services/api';
import { formatCurrency } from '../utils/formatters';

const Shop = ({ compareList = [], onCompare, onRemoveCompare, onClearCompare }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [brands, setBrands] = useState([]);

  // View state
  const [viewMode, setViewMode] = useState('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [compareModalOpen, setCompareModalOpen] = useState(false);

  // Filter states
  const categoryParam = searchParams.get('category') || 'all';
  const searchParam = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState('0');
  const [sortBy, setSortBy] = useState('newest');
  const [keyword, setKeyword] = useState(searchParam);

  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || 'all');
    setKeyword(searchParams.get('search') || '');
  }, [searchParams]);

  const CATEGORIES = [
    { name: 'All Departments', slug: 'all' },
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

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let query = `/products?page=${page}&limit=12&sort=${sortBy}`;
      if (selectedCategory !== 'all') query += `&category=${selectedCategory}`;
      if (selectedBrand !== 'all') query += `&brand=${selectedBrand}`;
      if (keyword.trim()) query += `&keyword=${encodeURIComponent(keyword.trim())}`;
      if (minPrice) query += `&minPrice=${minPrice}`;
      if (maxPrice) query += `&maxPrice=${maxPrice}`;
      if (minRating !== '0') query += `&rating=${minRating}`;

      const res = await API.get(query);
      const data = res.data;

      setProducts(data.products || []);
      setTotalProducts(data.totalProducts || data.products?.length || 0);
      setPages(data.pages || 1);
      if (data.brands && data.brands.length > 0) setBrands(data.brands);
    } catch (error) {
      console.error('Error fetching NEXORA shop products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedBrand, minPrice, maxPrice, minRating, sortBy, keyword, page]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedBrand('all');
    setMinPrice('');
    setMaxPrice('');
    setMinRating('0');
    setSortBy('newest');
    setKeyword('');
    setPage(1);
    setSearchParams({});
  };

  return (
    <div className="bg-[#0F1021] min-h-screen text-white font-inter py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-white/10">
          <div>
            <span className="text-xs font-bold text-[#67E8F9] uppercase tracking-widest">NEXORA Marketplace</span>
            <h1 className="text-3xl font-extrabold text-white">All Products</h1>
            <p className="text-xs text-[#D8B4FE]">Showing {products.length} of {totalProducts} items</p>
          </div>

          {/* Search & Layout Toggles */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <input
                type="text"
                placeholder="Search products..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full bg-[#1B1C3A] text-white placeholder-[#D8B4FE]/50 border border-[#7C3AED]/40 rounded-2xl px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#67E8F9]"
              />
              <Search className="w-4 h-4 text-[#67E8F9] absolute right-3 top-2.5" />
            </div>

            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="p-2 bg-[#1B1C3A] border border-[#7C3AED]/40 rounded-xl text-[#67E8F9] hover:bg-[#7C3AED] hover:text-white transition"
              title="Toggle Layout"
            >
              {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar Filter Drawer */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="glass-panel-3d rounded-3xl p-6 space-y-6 border border-[#7C3AED]/30 shadow-3d-glow">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#67E8F9]" />
                  <h3 className="font-bold text-sm">Filters</h3>
                </div>
                <button onClick={handleResetFilters} className="text-xs text-[#FF6B8A] hover:underline flex items-center gap-1 font-semibold">
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Department Categories Filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#67E8F9] uppercase tracking-wider">Department</label>
                <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => {
                        setSelectedCategory(cat.slug);
                        setPage(1);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                        selectedCategory === cat.slug
                          ? 'bg-gradient-to-r from-[#7C3AED] to-[#FF6B8A] text-white shadow'
                          : 'text-[#D8B4FE] hover:bg-white/5'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="space-y-2 pt-4 border-t border-white/10">
                <label className="text-xs font-bold text-[#67E8F9] uppercase tracking-wider">Price Range ($)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full bg-[#0F1021] border border-[#7C3AED]/40 rounded-xl px-3 py-1.5 text-xs text-white placeholder-gray-500"
                  />
                  <span className="text-gray-500 text-xs">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full bg-[#0F1021] border border-[#7C3AED]/40 rounded-xl px-3 py-1.5 text-xs text-white placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Sort By */}
              <div className="space-y-2 pt-4 border-t border-white/10">
                <label className="text-xs font-bold text-[#67E8F9] uppercase tracking-wider">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-[#0F1021] border border-[#7C3AED]/40 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Customer Rating</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Right Product Grid Display */}
          <main className="lg:col-span-9 space-y-8">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-80 bg-[#1B1C3A] rounded-3xl animate-pulse" />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6' : 'space-y-4'}>
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onQuickView={(p) => setQuickViewProduct(p)}
                    onCompare={onCompare}
                    isCompared={compareList.some((item) => item._id === product._id)}
                  />
                ))}
              </div>
            ) : (
              <div className="glass-panel-3d rounded-3xl p-12 text-center space-y-4">
                <p className="text-base text-[#D8B4FE]">No products found matching your search filters.</p>
                <button onClick={handleResetFilters} className="btn-gradient-nexora text-white px-6 py-2.5 rounded-full text-xs font-bold">
                  Reset All Filters
                </button>
              </div>
            )}

            {/* Pagination Controls */}
            {pages > 1 && (
              <div className="flex justify-center items-center gap-2 pt-6">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="p-2 bg-[#1B1C3A] border border-[#7C3AED]/40 rounded-xl text-white disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {[...Array(pages)].map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPage(idx + 1)}
                    className={`w-9 h-9 rounded-xl font-bold text-xs transition ${
                      page === idx + 1
                        ? 'btn-gradient-nexora text-white shadow'
                        : 'bg-[#1B1C3A] text-[#D8B4FE] hover:bg-[#7C3AED]/20'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}

                <button
                  disabled={page >= pages}
                  onClick={() => setPage(page + 1)}
                  className="p-2 bg-[#1B1C3A] border border-[#7C3AED]/40 rounded-xl text-white disabled:opacity-40"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* QUICK VIEW MODAL */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onCompare={onCompare}
        />
      )}

      {/* COMPARE MODAL */}
      <CompareModal
        isOpen={compareModalOpen}
        onClose={() => setCompareModalOpen(false)}
        compareList={compareList}
        onRemoveCompare={onRemoveCompare}
        onClearCompare={onClearCompare}
      />
    </div>
  );
};

export default Shop;
