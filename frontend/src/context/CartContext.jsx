import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [cartItems, setCartItems] = useState([]);
  const [savedForLater, setSavedForLater] = useState([]);
  const [discountCode, setDiscountCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  const fetchCart = async () => {
    if (user?.token) {
      try {
        const res = await API.get('/cart');
        setCartItems(res.data.items || []);
      } catch (error) {
        console.error('Error fetching user cart:', error);
      }
    } else {
      const savedCart = localStorage.getItem('nexora_guest_cart');
      if (savedCart) setCartItems(JSON.parse(savedCart));
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const saveLocalCart = (items) => {
    setCartItems(items);
    if (!user?.token) {
      localStorage.setItem('nexora_guest_cart', JSON.stringify(items));
    }
  };

  const addToCart = async (product, quantity = 1) => {
    const productId = product._id;
    if (user?.token) {
      try {
        const res = await API.post('/cart', { productId, quantity });
        setCartItems(res.data.items || []);
        addToast(`Added "${product.title}" to bag!`, 'success');
      } catch (e) {
        addToast('Failed to update cart', 'error');
      }
    } else {
      const existingIdx = cartItems.findIndex(
        (item) => (item.product?._id || item.product || item._id) === productId
      );
      let updated;
      if (existingIdx > -1) {
        updated = [...cartItems];
        updated[existingIdx].quantity += quantity;
      } else {
        updated = [
          ...cartItems,
          {
            _id: `guest-${Date.now()}`,
            product: productId,
            productData: product,
            quantity
          }
        ];
      }
      saveLocalCart(updated);
      addToast(`Added "${product.title}" to bag!`, 'success');
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    if (user?.token) {
      try {
        const res = await API.put(`/cart/${cartItemId}`, { quantity });
        setCartItems(res.data.items || []);
      } catch (e) {
        addToast('Failed to update quantity', 'error');
      }
    } else {
      const updated = cartItems.map((item) =>
        item._id === cartItemId ? { ...item, quantity } : item
      );
      saveLocalCart(updated);
    }
  };

  const removeFromCart = async (cartItemId) => {
    if (user?.token) {
      try {
        const res = await API.delete(`/cart/${cartItemId}`);
        setCartItems(res.data.items || []);
        addToast('Item removed from shopping bag', 'info');
      } catch (e) {
        addToast('Failed to remove item', 'error');
      }
    } else {
      const updated = cartItems.filter((item) => item._id !== cartItemId);
      saveLocalCart(updated);
      addToast('Item removed from shopping bag', 'info');
    }
  };

  const clearCart = async () => {
    if (user?.token) {
      try {
        await API.delete('/cart');
        setCartItems([]);
      } catch (e) {
        console.error(e);
      }
    } else {
      saveLocalCart([]);
    }
  };

  const saveForLaterItem = (cartItem) => {
    setSavedForLater([...savedForLater, cartItem]);
    removeFromCart(cartItem._id);
    addToast('Item saved for later', 'info');
  };

  const moveSavedToCart = (savedItem) => {
    setSavedForLater(savedForLater.filter((item) => item._id !== savedItem._id));
    const p = savedItem.productData || savedItem.product;
    addToCart(p, savedItem.quantity || 1);
  };

  const applyCoupon = (code) => {
    const formatted = code.trim().toUpperCase();
    if (formatted === 'NEXORA10') {
      setDiscountCode('NEXORA10');
      setDiscountPercent(10);
      addToast('Promo code NEXORA10 applied: 10% discount!', 'success');
    } else if (formatted === 'LUXURY20' || formatted === 'SMART20') {
      setDiscountCode('SMART20');
      setDiscountPercent(20);
      addToast('VIP Promo code SMART20 applied: 20% discount!', 'success');
    } else {
      addToast('Invalid promo code. Try NEXORA10', 'error');
    }
  };

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => {
    const p = item.productData || item.product || {};
    const price = p.discountPrice > 0 ? p.discountPrice : p.price || 0;
    return acc + price * item.quantity;
  }, 0);

  const discountAmount = (subtotal * discountPercent) / 100;
  const shippingCharges = subtotal > 50 || subtotal === 0 ? 0 : 9.99;
  const taxAmount = (subtotal - discountAmount) * 0.05;
  const totalAmount = Math.max(0, subtotal - discountAmount + shippingCharges + taxAmount);
  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        savedForLater,
        subtotal,
        discountCode,
        discountPercent,
        discountAmount,
        shippingCharges,
        taxAmount,
        totalAmount,
        itemCount,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        saveForLaterItem,
        moveSavedToCart,
        applyCoupon,
        fetchCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
