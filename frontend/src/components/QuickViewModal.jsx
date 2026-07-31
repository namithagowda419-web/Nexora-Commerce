import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, ShoppingBag, Heart, Layers, Check, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { formatCurrency } from '../utils/formatters';

const QuickViewModal = ({ product, onClose, onCompare }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToast } = useToast();

  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!product) return null;

  const isWishlisted = isInWishlist(product._id);
  const images = product.images && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'];
  const currentPrice = product.discountPrice > 0 ? product.discountPrice : product.price;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    addToast(`Added ${quantity} x "${product.title}" to bag!`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F1021]/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-4xl bg-[#1B1C3A] rounded-3xl border border-[#7C3AED]/40 shadow-3d-glow overflow-hidden text-white max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-[#0F1021] text-gray-400 hover:text-white border border-[#7C3AED]/40 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 p-6 gap-6">
          {/* Product Gallery */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-[#0F1021] border border-[#7C3AED]/30">
              <img
                src={images[activeImageIndex]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-4 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-[#67E8F9] uppercase tracking-wider">
                {product.brand} • {product.categoryName || product.category}
              </span>
              <h2 className="text-xl font-extrabold text-white mt-1">{product.title}</h2>

              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                </div>
                <span className="text-xs font-bold text-white">{product.rating || 4.8}</span>
                <span className="text-xs text-gray-400">({product.numReviews || 12} reviews)</span>
              </div>

              <div className="flex items-baseline gap-3 mt-4">
                <span className="text-2xl font-extrabold text-[#67E8F9]">
                  {formatCurrency(currentPrice)}
                </span>
                {product.discountPrice > 0 && (
                  <span className="text-sm line-through text-gray-400">
                    {formatCurrency(product.price)}
                  </span>
                )}
              </div>

              <p className="text-xs text-[#D8B4FE]/80 mt-3 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-[#0F1021] rounded-2xl border border-[#7C3AED]/40 px-3 py-1.5">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-2 font-bold text-white">-</button>
                  <span className="px-3 font-bold text-sm text-white">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="px-2 font-bold text-white">+</button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 btn-gradient-nexora text-white font-bold py-3 px-6 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default QuickViewModal;
