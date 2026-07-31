import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';
import { useToast } from './ToastContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const [wishlistItems, setWishlistItems] = useState([]);

  const fetchWishlist = async () => {
    if (user?.token) {
      try {
        const res = await API.get('/wishlist');
        setWishlistItems(res.data.products || []);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      }
    } else {
      const saved = localStorage.getItem('nexora_guest_wishlist');
      if (saved) setWishlistItems(JSON.parse(saved));
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [user]);

  const saveLocalWishlist = (items) => {
    setWishlistItems(items);
    if (!user?.token) {
      localStorage.setItem('nexora_guest_wishlist', JSON.stringify(items));
    }
  };

  const toggleWishlist = async (product) => {
    const productId = product._id;
    const exists = wishlistItems.some((item) => (item._id || item) === productId);

    if (exists) {
      if (user?.token) {
        try {
          const res = await API.delete(`/wishlist/${productId}`);
          setWishlistItems(res.data.products || []);
          addToast(`Removed "${product.title}" from wishlist`, 'info');
        } catch (e) {
          addToast('Failed to remove from wishlist', 'error');
        }
      } else {
        const updated = wishlistItems.filter((item) => (item._id || item) !== productId);
        saveLocalWishlist(updated);
        addToast(`Removed "${product.title}" from wishlist`, 'info');
      }
    } else {
      if (user?.token) {
        try {
          const res = await API.post('/wishlist', { productId });
          setWishlistItems(res.data.products || []);
          addToast(`Added "${product.title}" to wishlist`, 'success');
        } catch (e) {
          addToast('Failed to add to wishlist', 'error');
        }
      } else {
        const updated = [...wishlistItems, product];
        saveLocalWishlist(updated);
        addToast(`Added "${product.title}" to wishlist`, 'success');
      }
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => (item._id || item) === productId);
  };

  const moveToCart = (product) => {
    addToCart(product, 1);
    toggleWishlist(product);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        toggleWishlist,
        isInWishlist,
        moveToCart,
        fetchWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
