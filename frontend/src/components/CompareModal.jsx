import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingBag, Star, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatters';

const CompareModal = ({ isOpen, onClose, compareList = [], onRemoveCompare, onClearCompare }) => {
  const { addToCart } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F1021]/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-5xl bg-[#1B1C3A] rounded-3xl border border-[#7C3AED]/40 shadow-3d-glow p-6 text-white max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <h2 className="text-xl font-extrabold text-white">Compare Products</h2>
            <p className="text-xs text-[#D8B4FE]">Side-by-side feature comparison</p>
          </div>
          <button onClick={onClose} className="p-2 bg-[#0F1021] text-gray-400 hover:text-white rounded-full border border-[#7C3AED]/40">
            <X className="w-5 h-5" />
          </button>
        </div>

        {compareList.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#D8B4FE]">
            No products selected for comparison. Click the compare icon on product cards!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            {compareList.map((product) => (
              <div key={product._id} className="bg-[#0F1021] rounded-2xl border border-[#7C3AED]/30 p-4 space-y-4 relative">
                <button
                  onClick={() => onRemoveCompare(product._id)}
                  className="absolute top-3 right-3 p-1.5 bg-[#1B1C3A] text-rose-400 hover:text-white rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <img src={product.images?.[0]} alt={product.title} className="w-full h-40 object-cover rounded-xl" />
                <h4 className="font-bold text-sm text-white line-clamp-1">{product.title}</h4>
                <span className="font-extrabold text-base text-[#67E8F9]">{formatCurrency(product.discountPrice || product.price)}</span>

                <div className="space-y-2 text-xs text-[#D8B4FE]">
                  <p><strong>Brand:</strong> {product.brand}</p>
                  <p><strong>Department:</strong> {product.categoryName || product.category}</p>
                  <p><strong>Rating:</strong> ★ {product.rating || 4.8}</p>
                  <p><strong>Stock:</strong> {product.stock > 0 ? 'In Stock' : 'Out of Stock'}</p>
                </div>

                <button
                  onClick={() => addToCart(product, 1)}
                  className="w-full btn-gradient-nexora text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add to Bag</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CompareModal;
