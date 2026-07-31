import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const savedUser = localStorage.getItem('nexora_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('nexora_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await API.post('/auth/login', { email, password });
      const userData = res.data;
      setUser(userData);
      localStorage.setItem('nexora_user', JSON.stringify(userData));
      addToast(`Welcome back to NEXORA, ${userData.name}!`, 'success');
      return { success: true, user: userData };
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed. Please check your credentials.';
      addToast(msg, 'error');
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const res = await API.post('/auth/register', { name, email, password });
      const userData = res.data;
      setUser(userData);
      localStorage.setItem('nexora_user', JSON.stringify(userData));
      addToast(`Account created! Welcome to NEXORA, ${userData.name}!`, 'success');
      return { success: true, user: userData };
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed.';
      addToast(msg, 'error');
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nexora_user');
    addToast('You have been signed out from NEXORA.', 'info');
  };

  const updateUserProfile = (updatedData) => {
    const newUserData = { ...user, ...updatedData };
    setUser(newUserData);
    localStorage.setItem('nexora_user', JSON.stringify(newUserData));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUserProfile,
        isAdmin: user?.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
