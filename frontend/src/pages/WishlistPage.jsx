import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { formatCurrency } from '../utils/formatters';

const WishlistPage = () => {
  const { wishlistItems, toggleWishlist, moveToCart } = useWishlist();

  if (wishlistItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-rose-50 dark:bg-darkbg-card text-rose-500 rounded-full flex items-center justify-center mx-auto">
          <Heart className="w-10 h-10" />
        </div>
        <h2 className="font-playfair font-bold text-3xl text-charcoal dark:text-white">
          Your Wishlist is Empty
        </h2>
        <p className="text-xs text-charcoal-muted max-w-sm mx-auto">
          Save your favorite high jewelry and timepieces by tapping the heart icon on any piece.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 bg-plum-rich hover:bg-plum-primary text-white font-semibold px-8 py-3.5 rounded-2xl text-xs shadow-luxury transition"
        >
          <span>Discover Creations</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-lilac-soft dark:border-darkbg-border pb-6">
        <h1 className="font-playfair font-bold text-3xl sm:text-4xl text-charcoal dark:text-white">
          My Saved Wishlist ({wishlistItems.length})
        </h1>
        <p className="text-xs text-charcoal-muted dark:text-gray-400 mt-1">
          Your private curation of preferred luxury creations.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlistItems.map((product) => {
          const p = product._id ? product : product;
          return (
            <div
              key={p._id}
              className="bg-white dark:bg-darkbg-card rounded-3xl p-4 border border-lilac-soft dark:border-darkbg-border shadow-luxury flex flex-col justify-between"
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 bg-cream-warm">
                <img src={p.images?.[0] || p.image} alt={p.title} className="w-full h-full object-cover" />
                <button
                  onClick={() => toggleWishlist(p)}
                  className="absolute top-3 right-3 p-2 bg-rose-500 text-white rounded-full shadow"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-mauve-dusty">{p.brand}</span>
                <Link to={`/product/${p.slug || p._id}`}>
                  <h4 className="font-playfair font-bold text-sm text-charcoal dark:text-white hover:text-plum-primary line-clamp-1">
                    {p.title}
                  </h4>
                </Link>
                <div className="font-playfair font-bold text-base text-plum-primary">
                  {formatCurrency(p.discountPrice || p.price)}
                </div>
              </div>

              <button
                onClick={() => moveToCart(p)}
                className="w-full mt-4 bg-plum-rich hover:bg-plum-primary text-white text-xs font-semibold py-3 rounded-xl shadow flex items-center justify-center gap-2 transition"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Move to Bag</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WishlistPage;
