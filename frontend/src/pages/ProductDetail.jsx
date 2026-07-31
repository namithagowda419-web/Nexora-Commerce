import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingBag, Truck, ShieldCheck, RefreshCw, Layers, Plus, Check } from 'lucide-react';
import API from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { formatCurrency } from '../utils/formatters';
import RecommendationSection from '../components/RecommendationSection';
import QuickViewModal from '../components/QuickViewModal';
import CompareModal from '../components/CompareModal';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToast } = useToast();

  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [customersAlsoBought, setCustomersAlsoBought] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('specs'); // 'specs' | 'reviews'

  // Quick View & Compare states
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [compareProducts, setCompareProducts] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/products/${id}`);
        const pData = res.data;
        setProduct(pData);
        setSelectedImgIndex(0);

        // Record to Recently Viewed LocalStorage
        if (pData) {
          const savedRV = JSON.parse(localStorage.getItem('veloura_recently_viewed') || '[]');
          const filteredRV = savedRV.filter((item) => item._id !== pData._id);
          const updatedRV = [pData, ...filteredRV].slice(0, 6);
          localStorage.setItem('veloura_recently_viewed', JSON.stringify(updatedRV));
        }

        // Fetch Similar & Customers Also Bought
        if (pData?.category) {
          const simRes = await API.get(`/products/related/${pData.category}?exclude=${pData._id}`);
          setSimilarProducts(simRes.data || []);
        }
        const alsoRes = await API.get('/products/trending');
        setCustomersAlsoBought((alsoRes.data || []).filter((p) => p._id !== pData?._id));

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center font-playfair text-2xl text-plum-primary">Loading Details...</div>;
  }

  if (!product) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-500">Product Not Found</div>;
  }

  const isWishlisted = isInWishlist(product._id);
  const images = product.images?.length ? product.images : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'];
  const currentPrice = product.discountPrice > 0 ? product.discountPrice : product.price;

  // Frequently Bought Together Bundle Item
  const bundleItem = similarProducts[0];
  const bundleTotal = bundleItem ? currentPrice + (bundleItem.discountPrice || bundleItem.price) : currentPrice;

  const handleAddBundleToCart = () => {
    addToCart(product, 1);
    if (bundleItem) addToCart(bundleItem, 1);
    addToast('Added Bundle to your Shopping Bag!', 'success');
  };

  const handleToggleCompare = (prod) => {
    if (compareProducts.some((p) => p._id === prod._id)) {
      setCompareProducts(compareProducts.filter((p) => p._id !== prod._id));
    } else {
      if (compareProducts.length >= 4) {
        alert('Maximum 4 items can be compared.');
        return;
      }
      setCompareProducts([...compareProducts, prod]);
    }
  };

  const comparedIds = compareProducts.map((p) => p._id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Product Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-square rounded-3xl overflow-hidden bg-cream-warm border border-lilac-soft shadow-luxury">
            <img
              src={images[selectedImgIndex]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>

          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImgIndex(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition ${
                    selectedImgIndex === idx ? 'border-plum-primary shadow' : 'border-lilac-soft opacity-60'
                  }`}
                >
                  <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Title, Specs, Price, Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex justify-between items-center text-xs font-bold text-mauve-dusty uppercase tracking-wider">
              <span>{product.brand}</span>
              <span>{product.categoryName || product.category}</span>
            </div>
            <h1 className="font-playfair font-bold text-3xl sm:text-4xl text-charcoal dark:text-white mt-1">
              {product.title}
            </h1>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center text-amber-400">
              <Star className="w-4 h-4 fill-amber-400" />
              <span className="text-sm font-bold text-charcoal dark:text-white ml-1">{product.rating}</span>
            </div>
            <span className="text-xs text-gray-400">({product.numReviews || 24} customer reviews)</span>
          </div>

          {/* Price Tag */}
          <div className="flex items-baseline gap-4">
            <span className="font-playfair font-bold text-3xl text-plum-primary dark:text-lavender-soft">
              {formatCurrency(currentPrice)}
            </span>
            {product.discountPrice > 0 && (
              <span className="text-lg line-through text-gray-400 font-medium">
                {formatCurrency(product.price)}
              </span>
            )}
            {product.discountPrice > 0 && (
              <span className="bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1 rounded-full">
                SAVE {Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
              </span>
            )}
          </div>

          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            {product.description}
          </p>

          {/* Quantity & Actions */}
          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center border border-lilac-soft rounded-2xl bg-cream-warm dark:bg-darkbg-input">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-3 text-sm font-bold text-gray-500 hover:text-plum-primary"
              >
                -
              </button>
              <span className="px-4 text-sm font-bold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 py-3 text-sm font-bold text-gray-500 hover:text-plum-primary"
              >
                +
              </button>
            </div>

            <button
              onClick={() => {
                addToCart(product, quantity);
                addToast(`Added ${quantity} x ${product.title} to bag!`, 'success');
              }}
              className="flex-1 bg-plum-rich hover:bg-plum-primary text-white font-semibold py-4 rounded-2xl shadow-luxury flex items-center justify-center gap-2 text-sm transition"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Shopping Bag</span>
            </button>

            <button
              onClick={() => toggleWishlist(product)}
              className={`p-4 rounded-2xl border transition ${
                isWishlisted ? 'bg-rose-50 text-rose-600 border-rose-200' : 'border-lilac-soft hover:bg-cream-warm text-gray-400'
              }`}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-600' : ''}`} />
            </button>

            <button
              onClick={() => handleToggleCompare(product)}
              className={`p-4 rounded-2xl border transition ${
                comparedIds.includes(product._id) ? 'bg-plum-primary text-white border-plum-primary' : 'border-lilac-soft hover:bg-cream-warm text-gray-400'
              }`}
              title="Compare"
            >
              <Layers className="w-5 h-5" />
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-lilac-soft/60 text-xs text-gray-600">
            <div className="flex flex-col items-center text-center gap-1">
              <Truck className="w-5 h-5 text-plum-primary" />
              <span className="font-bold">Free Express Delivery</span>
            </div>
            <div className="flex flex-col items-center text-center gap-1">
              <ShieldCheck className="w-5 h-5 text-plum-primary" />
              <span className="font-bold">100% Authentic</span>
            </div>
            <div className="flex flex-col items-center text-center gap-1">
              <RefreshCw className="w-5 h-5 text-plum-primary" />
              <span className="font-bold">30-Day Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Frequently Bought Together Bundle Box */}
      {bundleItem && (
        <div className="bg-white dark:bg-darkbg-card rounded-3xl p-6 border border-lilac-soft dark:border-darkbg-border shadow-luxury space-y-4">
          <h3 className="font-playfair font-bold text-xl text-charcoal dark:text-white">
            Frequently Bought Together
          </h3>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              {/* Product 1 */}
              <div className="flex items-center gap-3">
                <img src={images[0]} alt={product.title} className="w-16 h-16 rounded-2xl object-cover bg-cream-warm" />
                <div>
                  <p className="font-bold text-xs line-clamp-1">{product.title}</p>
                  <span className="text-xs text-plum-primary font-bold">{formatCurrency(currentPrice)}</span>
                </div>
              </div>

              <Plus className="w-5 h-5 text-gray-400" />

              {/* Product 2 */}
              <div className="flex items-center gap-3">
                <img src={bundleItem.images[0]} alt={bundleItem.title} className="w-16 h-16 rounded-2xl object-cover bg-cream-warm" />
                <div>
                  <p className="font-bold text-xs line-clamp-1">{bundleItem.title}</p>
                  <span className="text-xs text-plum-primary font-bold">{formatCurrency(bundleItem.discountPrice || bundleItem.price)}</span>
                </div>
              </div>
            </div>

            {/* Bundle Price & Add Button */}
            <div className="flex items-center gap-4">
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-semibold">Total Combo Price</span>
                <p className="font-playfair font-bold text-2xl text-plum-primary">{formatCurrency(bundleTotal)}</p>
              </div>
              <button
                onClick={handleAddBundleToCart}
                className="bg-plum-primary hover:bg-plum-rich text-white font-bold text-xs px-6 py-3 rounded-2xl shadow transition"
              >
                Buy Both Together
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Specifications & Reviews Tabs */}
      <div className="bg-white dark:bg-darkbg-card rounded-3xl p-6 sm:p-8 border border-lilac-soft dark:border-darkbg-border shadow-luxury space-y-6">
        <div className="flex gap-6 border-b border-lilac-soft/60 pb-4">
          <button
            onClick={() => setActiveTab('specs')}
            className={`font-playfair font-bold text-lg transition ${
              activeTab === 'specs' ? 'text-plum-primary border-b-2 border-plum-primary pb-1' : 'text-gray-400'
            }`}
          >
            Product Specifications
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`font-playfair font-bold text-lg transition ${
              activeTab === 'reviews' ? 'text-plum-primary border-b-2 border-plum-primary pb-1' : 'text-gray-400'
            }`}
          >
            Customer Reviews ({product.numReviews || 12})
          </button>
        </div>

        {activeTab === 'specs' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {product.specifications?.length ? (
              product.specifications.map((s, idx) => (
                <div key={idx} className="flex justify-between p-3 bg-cream-warm dark:bg-darkbg-input rounded-xl">
                  <span className="font-semibold text-gray-500">{s.key}</span>
                  <span className="font-bold text-charcoal dark:text-white">{s.value}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-400">Standard manufacturer warranty and specifications apply.</p>
            )}
          </div>
        ) : (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-cream-warm dark:bg-darkbg-input rounded-2xl border border-lilac-soft/40">
              <div className="flex justify-between items-center">
                <span className="font-bold">Lady Eleanor Vance</span>
                <span className="text-amber-400 font-bold">★ 5.0</span>
              </div>
              <p className="text-gray-600 mt-1">Excellent build quality and fast express delivery. Highly recommended!</p>
            </div>
          </div>
        )}
      </div>

      {/* Similar Products Recommendation */}
      <RecommendationSection
        type="similar-products"
        products={similarProducts}
        onQuickView={setQuickViewProduct}
        onCompare={handleToggleCompare}
        comparedProductIds={comparedIds}
      />

      {/* Customers Also Bought Recommendation */}
      <RecommendationSection
        type="customers-also-bought"
        products={customersAlsoBought}
        onQuickView={setQuickViewProduct}
        onCompare={handleToggleCompare}
        comparedProductIds={comparedIds}
      />

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}

      {/* Compare Modal */}
      {showCompareModal && (
        <CompareModal
          compareProducts={compareProducts}
          onRemove={(id) => setCompareProducts(compareProducts.filter((p) => p._id !== id))}
          onClearAll={() => setCompareProducts([])}
          onClose={() => setShowCompareModal(false)}
        />
      )}
    </div>
  );
};

export default ProductDetail;
