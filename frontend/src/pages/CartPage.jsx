import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Bookmark, ShoppingBag, ArrowRight, Tag, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatters';

const CartPage = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    savedForLater,
    subtotal,
    discountCode,
    discountAmount,
    shippingCharges,
    taxAmount,
    totalAmount,
    updateQuantity,
    removeFromCart,
    saveForLaterItem,
    moveSavedToCart,
    applyCoupon
  } = useCart();

  const [couponInput, setCouponInput] = useState('');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponInput.trim()) {
      applyCoupon(couponInput);
    }
  };

  if (cartItems.length === 0 && savedForLater.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-lilac-soft/50 rounded-full flex items-center justify-center mx-auto text-plum-primary">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="font-playfair font-bold text-3xl text-charcoal dark:text-white">
          Your Shopping Bag is Empty
        </h2>
        <p className="text-xs text-charcoal-muted max-w-sm mx-auto">
          Explore our high jewelry and luxury timepieces catalogue to add pieces to your bag.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 bg-plum-rich hover:bg-plum-primary text-white font-semibold px-8 py-3.5 rounded-2xl text-xs shadow-luxury transition"
        >
          <span>Explore Collections</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="border-b border-lilac-soft dark:border-darkbg-border pb-6">
        <h1 className="font-playfair font-bold text-3xl sm:text-4xl text-charcoal dark:text-white">
          Your Shopping Bag
        </h1>
        <p className="text-xs text-charcoal-muted dark:text-gray-400 mt-1">
          Review your selected luxury creations before proceeding to secure checkout.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Cart Items List & Save for Later */}
        <div className="lg:col-span-8 space-y-8">
          {/* Active Items */}
          <div className="space-y-4">
            {cartItems.map((item) => {
              const pData = item.productData || item.product || {};
              const unitPrice = pData.discountPrice > 0 ? pData.discountPrice : pData.price;
              const itemTotal = unitPrice * item.quantity;
              const img = pData.image || pData.images?.[0] || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400';

              return (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white dark:bg-darkbg-card p-4 sm:p-6 rounded-3xl border border-lilac-soft/60 dark:border-darkbg-border shadow-sm flex flex-col sm:flex-row gap-6 items-center justify-between"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <img src={img} alt={pData.title} className="w-20 h-20 rounded-2xl object-cover bg-cream-warm" />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-mauve-dusty">{pData.brand || 'Maison Veloura'}</span>
                      <h4 className="font-playfair font-bold text-sm text-charcoal dark:text-white">{pData.title}</h4>
                      <span className="text-xs font-semibold text-plum-primary dark:text-lavender-soft">
                        {formatCurrency(unitPrice)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                    {/* Quantity modifier */}
                    <div className="flex items-center border border-lilac-soft rounded-xl bg-cream-warm dark:bg-darkbg-input">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="px-3 py-1.5 text-xs text-gray-500 font-bold hover:text-plum-primary"
                      >
                        -
                      </button>
                      <span className="px-3 text-xs font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="px-3 py-1.5 text-xs text-gray-500 font-bold hover:text-plum-primary"
                      >
                        +
                      </button>
                    </div>

                    <span className="font-playfair font-bold text-sm text-charcoal dark:text-white min-w-[80px] text-right">
                      {formatCurrency(itemTotal)}
                    </span>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => saveForLaterItem(item)}
                        className="p-2 text-gray-400 hover:text-plum-primary transition"
                        title="Save for Later"
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="p-2 text-gray-400 hover:text-rose-500 transition"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Saved for Later Section */}
          {savedForLater.length > 0 && (
            <div className="pt-8 border-t border-lilac-soft dark:border-darkbg-border space-y-4">
              <h3 className="font-playfair font-bold text-xl text-charcoal dark:text-white">
                Saved for Later ({savedForLater.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {savedForLater.map((sItem) => {
                  const p = sItem.productData || sItem.product;
                  return (
                    <div key={sItem._id} className="bg-white dark:bg-darkbg-card p-4 rounded-2xl border border-lilac-soft flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={p.image || p.images?.[0]} alt={p.title} className="w-12 h-12 rounded-xl object-cover" />
                        <div>
                          <p className="font-semibold text-xs truncate max-w-[140px]">{p.title}</p>
                          <span className="text-xs text-plum-primary">{formatCurrency(p.discountPrice || p.price)}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => moveSavedToCart(sItem)}
                        className="text-xs font-semibold text-plum-primary hover:underline"
                      >
                        Move to Bag
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Order Summary & Voucher */}
        <div className="lg:col-span-4 bg-white dark:bg-darkbg-card rounded-3xl p-6 sm:p-8 border border-lilac-soft dark:border-darkbg-border shadow-luxury space-y-6">
          <h3 className="font-playfair font-bold text-xl text-charcoal dark:text-white border-b border-lilac-soft/60 pb-4">
            Order Summary
          </h3>

          {/* Promo Code Form */}
          <form onSubmit={handleApplyCoupon} className="space-y-2">
            <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-plum-primary" /> Promo Voucher Code
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Try VELOURA10 or LUXURY20"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                className="flex-1 bg-cream-warm dark:bg-darkbg-input border border-lilac-soft text-xs px-3 py-2 rounded-xl"
              />
              <button
                type="submit"
                className="bg-plum-primary hover:bg-plum-rich text-white text-xs font-semibold px-4 py-2 rounded-xl transition"
              >
                Apply
              </button>
            </div>
            {discountCode && (
              <p className="text-[11px] text-emerald-600 font-semibold pt-1">
                ✓ Coupon "{discountCode}" active ({discountAmount > 0 && formatCurrency(discountAmount)} savings)
              </p>
            )}
          </form>

          {/* Breakdown */}
          <div className="space-y-3 text-xs border-t border-b border-lilac-soft/60 py-4">
            <div className="flex justify-between text-gray-600 dark:text-gray-300">
              <span>Bag Subtotal</span>
              <span className="font-semibold text-charcoal dark:text-white">{formatCurrency(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-rose-600 font-medium">
                <span>Voucher Discount</span>
                <span>-{formatCurrency(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-600 dark:text-gray-300">
              <span>Insured Shipping</span>
              <span className="font-semibold text-charcoal dark:text-white">
                {shippingCharges === 0 ? 'Complimentary' : formatCurrency(shippingCharges)}
              </span>
            </div>
            <div className="flex justify-between text-gray-600 dark:text-gray-300">
              <span>Estimated Tax (5%)</span>
              <span className="font-semibold text-charcoal dark:text-white">{formatCurrency(taxAmount)}</span>
            </div>
          </div>

          <div className="flex justify-between items-baseline">
            <span className="font-playfair font-bold text-lg text-charcoal dark:text-white">Total Amount</span>
            <span className="font-playfair font-bold text-2xl text-plum-primary dark:text-lavender-soft">
              {formatCurrency(totalAmount)}
            </span>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full bg-plum-rich hover:bg-plum-primary text-white font-semibold py-4 rounded-2xl shadow-luxury flex items-center justify-center gap-2 text-sm transition"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 text-[11px] text-gray-400 justify-center">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>256-Bit Encrypted Secure Checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
