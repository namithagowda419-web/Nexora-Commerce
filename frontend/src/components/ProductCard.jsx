import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Eye, Layers, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { formatCurrency } from '../utils/formatters';

const ProductCard = ({ product, onQuickView, onCompare, isCompared }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToast } = useToast();

  const [tiltStyle, setTiltStyle] = useState({});
  const isWishlisted = isInWishlist(product._id);
  const mainImage = product.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800';
  const currentPrice = product.discountPrice > 0 ? product.discountPrice : product.price;

  // Interactive 3D Card Mouse Tilt Effect with Soft Cyan Glow on Hover
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: 'transform 0.1s ease-out'
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.5s ease-out'
    });
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    addToast(`Added "${product.title}" to bag!`, 'success');
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) onQuickView(product);
  };

  const handleCompare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onCompare) onCompare(product);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={tiltStyle}
      className="group relative bg-[#1B1C3A] rounded-3xl border border-[#7C3AED]/30 p-4 shadow-3d-glow hover:border-[#67E8F9] hover-cyan-glow transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        {/* Large Product Image Container */}
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#0F1021] mb-3 shadow-inner">
          <img
            src={mainImage}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Discount Badge - Neon Coral */}
          {product.discountPrice > 0 && (
            <span className="absolute top-3 left-3 bg-gradient-to-r from-[#FF6B8A] to-[#E11D48] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-md">
              SAVE {Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
            </span>
          )}

          {/* Stock Status Badge */}
          <span className={`absolute top-3 right-3 text-[9px] font-bold px-2.5 py-0.5 rounded-full shadow ${
            product.stock > 0 ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40' : 'bg-rose-950/80 text-rose-300 border border-rose-500/40'
          }`}>
            {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
          </span>

          {/* Floating Hover Action Overlay */}
          <div className="absolute inset-0 bg-[#0F1021]/60 backdrop-blur-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2.5 z-10">
            <button
              onClick={handleQuickView}
              className="p-3 bg-[#1B1C3A] text-[#67E8F9] border border-[#67E8F9]/40 rounded-2xl shadow-lg hover:bg-[#7C3AED] hover:text-white transition transform hover:scale-110"
              title="Quick View"
            >
              <Eye className="w-4 h-4" />
            </button>

            <button
              onClick={handleWishlist}
              className={`p-3 rounded-2xl shadow-lg transition transform hover:scale-110 ${
                isWishlisted
                  ? 'bg-[#FF6B8A] text-white'
                  : 'bg-[#1B1C3A] text-white border border-[#FF6B8A]/40 hover:bg-[#FF6B8A]'
              }`}
              title="Wishlist"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
            </button>

            {onCompare && (
              <button
                onClick={handleCompare}
                className={`p-3 rounded-2xl shadow-lg transition transform hover:scale-110 ${
                  isCompared
                    ? 'bg-[#7C3AED] text-white'
                    : 'bg-[#1B1C3A] text-white border border-[#7C3AED]/40 hover:bg-[#7C3AED]'
                }`}
                title="Compare Product"
              >
                <Layers className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-1 px-1">
          <div className="flex justify-between items-center text-[10px] font-bold text-[#D8B4FE] uppercase tracking-wider">
            <span>{product.brand}</span>
            <span>{product.categoryName || product.category}</span>
          </div>

          <Link to={`/product/${product.slug || product._id}`} className="block">
            <h3 className="font-bold text-sm text-white line-clamp-1 group-hover:text-[#67E8F9] transition-colors">
              {product.title}
            </h3>
          </Link>

          {/* Star Rating */}
          <div className="flex items-center gap-1">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
            </div>
            <span className="text-xs font-bold text-white">{product.rating || 4.8}</span>
            <span className="text-[10px] text-gray-400">({product.numReviews || 12})</span>
          </div>
        </div>
      </div>

      {/* Bottom Price & Add to Cart Button */}
      <div className="flex items-center justify-between pt-3 mt-2 border-t border-white/10 px-1">
        <div className="flex flex-col">
          <span className="font-bold text-base text-[#67E8F9]">
            {formatCurrency(currentPrice)}
          </span>
          {product.discountPrice > 0 && (
            <span className="text-[10px] line-through text-gray-400 font-medium">
              {formatCurrency(product.price)}
            </span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          className="btn-gradient-nexora p-2.5 text-white rounded-xl shadow-md flex items-center justify-center"
          title="Add to Cart"
        >
          <ShoppingBag className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
