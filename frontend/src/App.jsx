import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import WishlistPage from './pages/WishlistPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminOrders from './pages/AdminOrders';
import AdminCategories from './pages/AdminCategories';
import AdminUsers from './pages/AdminUsers';

import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import FAQPage from './pages/FAQPage';
import TermsPage from './pages/TermsPage';
import NotFoundPage from './pages/NotFoundPage';

// Scroll to top helper
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Protected Routes
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const AdminRoute = ({ children }) => {
  const { user, isAdmin } = useAuth();
  if (!user || !isAdmin) return <Navigate to="/" replace />;
  return children;
};

function App() {
  return (
    <ToastProvider>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <ScrollToTop />
              <div className="min-h-screen flex flex-col justify-between font-poppins">
                <Navbar />
                <main className="flex-grow">
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/wishlist" element={<WishlistPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/faq" element={<FAQPage />} />
                    <Route path="/terms" element={<TermsPage />} />

                    {/* Customer Protected Routes */}
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/order-confirmation/:id" element={<OrderConfirmationPage />} />
                    <Route path="/orders" element={<ProtectedRoute><OrderHistoryPage /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

                    {/* Admin Protected Routes */}
                    <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                    <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
                    <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
                    <Route path="/admin/categories" element={<AdminRoute><AdminCategories /></AdminRoute>} />
                    <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />

                    {/* 404 */}
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </ToastProvider>
  );
}

export default App;
