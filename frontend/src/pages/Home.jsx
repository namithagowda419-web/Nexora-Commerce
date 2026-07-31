import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Flame,
  Zap,
  Star,
  Award,
  Sparkles,
  TrendingUp,
  Clock,
  ArrowRight,
  ShieldCheck,
  Package,
  Layers,
  ChevronRight,
  Users,
  Building2,
  CheckCircle2
} from 'lucide-react';
import HeroSection from '../components/HeroSection';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import CompareModal from '../components/CompareModal';
import RecommendationSection from '../components/RecommendationSection';
import API from '../services/api';

const Home = ({ compareList = [], onCompare, onRemoveCompare, onClearCompare }) => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [flashSaleProducts, setFlashSaleProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [compareModalOpen, setCompareModalOpen] = useState(false);

  // Flash sale countdown timer state
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 35, seconds: 20 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [featRes, flashRes, trendRes, bestRes, newRes] = await Promise.all([
          API.get('/products/featured'),
          API.get('/products/flash-sale'),
          API.get('/products/trending'),
          API.get('/products/best-sellers'),
          API.get('/products/new-arrivals')
        ]);
        setFeaturedProducts(featRes.data || []);
        setFlashSaleProducts(flashRes.data || []);
        setTrendingProducts(trendRes.data || []);
        setBestSellers(bestRes.data || []);
        setNewArrivals(newRes.data || []);
      } catch (e) {
        console.error('Error fetching NEXORA home data:', e);
      }
    };
    fetchHomeData();
  }, []);

  const CATEGORY_CARDS = [
    { name: 'Electronics', slug: 'electronics', icon: '💻', image: 'https://images.unsplash.com/photo-1498049860654-af1a5c570f1a?w=800' },
    { name: 'Fashion', slug: 'fashion', icon: '👔', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800' },
    { name: 'Shoes', slug: 'shoes', icon: '👟', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800' },
    { name: 'Beauty', slug: 'beauty', icon: '💄', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800' },
    { name: 'Home & Kitchen', slug: 'home-kitchen', icon: '☕', image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800' },
    { name: 'Furniture', slug: 'furniture', icon: '🛋️', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800' },
    { name: 'Sports', slug: 'sports', icon: '🚴', image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800' },
    { name: 'Books', slug: 'books', icon: '📚', image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800' },
    { name: 'Grocery', slug: 'grocery', icon: '🥑', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800' },
    { name: 'Accessories', slug: 'accessories', icon: '🕶️', image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800' }
  ];

  return (
    <div className="bg-[#0F1021] min-h-screen text-white font-inter">
      {/* 1. HERO BANNER */}
      <HeroSection />

      {/* 2. SHOP BY CATEGORY (10 DEPARTMENTS) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-white/10">
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="text-xs font-bold text-[#67E8F9] uppercase tracking-widest">Browse Departments</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Shop By Category</h2>
          </div>
          <Link to="/shop" className="text-xs font-bold text-[#FF6B8A] hover:text-[#67E8F9] flex items-center gap-1">
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {CATEGORY_CARDS.map((cat) => (
            <Link
              key={cat.slug}
              to={`/shop?category=${cat.slug}`}
              className="group glass-panel-3d rounded-2xl p-4 text-center hover-cyan-glow transition transform hover:-translate-y-1"
            >
              <div className="w-16 h-16 mx-auto mb-3 rounded-xl overflow-hidden bg-[#0F1021] relative shadow-md">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
              </div>
              <span className="text-xs font-bold text-white group-hover:text-[#67E8F9] transition line-clamp-1">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FLASH SALE WITH COUNTDOWN TIMER */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-white/10 relative overflow-hidden">
        <div className="glass-panel-3d rounded-3xl p-6 sm:p-8 border border-[#FF6B8A]/40 mb-8 shadow-3d-glow">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="p-3 bg-[#FF6B8A]/20 border border-[#FF6B8A]/40 rounded-2xl">
                <Flame className="w-8 h-8 text-[#FF6B8A]" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#FF6B8A] uppercase tracking-widest">Limited Time Deals</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">NEXORA Flash Sale</h2>
              </div>
            </div>

            {/* Countdown Box */}
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#67E8F9]" />
              <span className="text-xs font-bold text-[#D8B4FE]">Ends in:</span>
              <div className="flex gap-1.5 font-mono text-sm font-bold">
                <span className="bg-[#0F1021] px-3 py-1.5 rounded-xl border border-[#7C3AED]/50 text-white">{String(timeLeft.hours).padStart(2, '0')}h</span>
                <span className="bg-[#0F1021] px-3 py-1.5 rounded-xl border border-[#7C3AED]/50 text-white">{String(timeLeft.minutes).padStart(2, '0')}m</span>
                <span className="bg-[#0F1021] px-3 py-1.5 rounded-xl border border-[#FF6B8A]/50 text-[#FF6B8A]">{String(timeLeft.seconds).padStart(2, '0')}s</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {flashSaleProducts.slice(0, 4).map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onQuickView={(p) => setQuickViewProduct(p)}
              onCompare={onCompare}
              isCompared={compareList.some((item) => item._id === product._id)}
            />
          ))}
        </div>
      </section>

      {/* 4. TRENDING PRODUCTS */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-white/10">
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="text-xs font-bold text-[#67E8F9] uppercase tracking-widest">Most Popular</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Trending Now</h2>
          </div>
          <Link to="/shop?sort=popular" className="text-xs font-bold text-[#FF6B8A] hover:text-[#67E8F9] flex items-center gap-1">
            <span>Explore All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {trendingProducts.slice(0, 4).map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onQuickView={(p) => setQuickViewProduct(p)}
              onCompare={onCompare}
              isCompared={compareList.some((item) => item._id === product._id)}
            />
          ))}
        </div>
      </section>

      {/* 5. RECOMMENDED FOR YOU */}
      <div className="py-8">
        <RecommendationSection
          type="recommended"
          title="Recommended For You"
          onQuickView={(p) => setQuickViewProduct(p)}
          onCompare={onCompare}
          compareList={compareList}
        />
      </div>

      {/* 6. BEST SELLERS */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-white/10">
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="text-xs font-bold text-[#67E8F9] uppercase tracking-widest">Top Rated</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Best Sellers</h2>
          </div>
          <Link to="/shop?sort=rating" className="text-xs font-bold text-[#FF6B8A] hover:text-[#67E8F9] flex items-center gap-1">
            <span>Shop Best Sellers</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {bestSellers.slice(0, 4).map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onQuickView={(p) => setQuickViewProduct(p)}
              onCompare={onCompare}
              isCompared={compareList.some((item) => item._id === product._id)}
            />
          ))}
        </div>
      </section>

      {/* 7. ANIMATED STATISTICS COUNTER */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-white/10">
        <div className="glass-panel-3d rounded-3xl p-8 sm:p-12 border border-[#7C3AED]/40 shadow-3d-glow grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-2">
            <h3 className="font-extrabold text-4xl sm:text-5xl text-[#67E8F9]">100+</h3>
            <p className="text-xs text-[#D8B4FE] font-medium">Seeded Quality Products</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-extrabold text-4xl sm:text-5xl text-[#FF6B8A]">50,000+</h3>
            <p className="text-xs text-[#D8B4FE] font-medium">Satisfied Happy Customers</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-extrabold text-4xl sm:text-5xl text-[#7C3AED]">99.9%</h3>
            <p className="text-xs text-[#D8B4FE] font-medium">On-Time Express Dispatch</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-extrabold text-4xl sm:text-5xl text-emerald-400">4.9★</h3>
            <p className="text-xs text-[#D8B4FE] font-medium">Average Customer Rating</p>
          </div>
        </div>
      </section>

      {/* 8. POPULAR BRANDS */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-white/10">
        <div className="text-center mb-8">
          <span className="text-xs font-bold text-[#67E8F9] uppercase tracking-widest">Official Partners</span>
          <h2 className="text-2xl font-extrabold text-white">Popular Brands on NEXORA</h2>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8 opacity-80">
          {['Sony', 'Apple', 'Samsung', 'Bose', 'Nike', 'Adidas', 'Dyson', 'Philips', 'West Elm', 'Ray-Ban', 'Garmin', 'Levi\'s'].map((b) => (
            <div key={b} className="glass-panel-3d px-6 py-3 rounded-2xl font-extrabold text-sm text-[#D8B4FE] hover:text-white transition">
              {b}
            </div>
          ))}
        </div>
      </section>

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

export default Home;
