import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { message } from 'antd';

const CartContext = createContext();

// Use environment variable for API URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalItems: 0, totalAmount: 0 });
  const [loading, setLoading] = useState(false);

  // Get or create session ID
  const getSessionId = () => {
    let sessionId = localStorage.getItem('cart_session_id');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('cart_session_id', sessionId);
    }
    return sessionId;
  };

  // Get user ID if logged in
  const getUserId = () => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const parsed = JSON.parse(user);
        return parsed.id;
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  // Fetch cart from server
  const fetchCart = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const userId = getUserId();
      const sessionId = getSessionId();
      
      const params = userId ? { userId } : { sessionId };
      const response = await axios.get(`${API_BASE_URL}/cart`, { params });
      
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  // Add item to cart
  const addToCart = async (serviceId, quantity = 1) => {
    try {
      setLoading(true);
      const userId = getUserId();
      const sessionId = getSessionId();

      const params = userId ? { userId } : {};
      await axios.post(
        `${API_BASE_URL}/cart/add`,
        { serviceId, quantity, sessionId },
        { params }
      );

      // Fetch fresh cart data to ensure all fields are populated
      await fetchCart(false);
      
      message.success('Đã thêm vào giỏ hàng!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      message.error('Lỗi khi thêm vào giỏ hàng');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update cart item quantity
  const updateCartItem = async (itemId, quantity) => {
    try {
      setLoading(true);
      const userId = getUserId();
      const sessionId = getSessionId();

      const params = { quantity };
      if (userId) params.userId = userId;
      else params.sessionId = sessionId;

      const response = await axios.put(
        `${API_BASE_URL}/cart/items/${itemId}`,
        null,
        { params }
      );

      // Force new object to trigger re-render
      setCart({
        ...response.data,
        items: [...response.data.items]
      });
      return response.data;
    } catch (error) {
      console.error('Error updating cart item:', error);
      message.error('Lỗi khi cập nhật giỏ hàng');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeCartItem = async (itemId) => {
    try {
      setLoading(true);
      const userId = getUserId();
      const sessionId = getSessionId();

      const params = userId ? { userId } : { sessionId };
      const response = await axios.delete(
        `${API_BASE_URL}/cart/items/${itemId}`,
        { params }
      );

      // Force new object to trigger re-render
      setCart({
        ...response.data,
        items: [...response.data.items]
      });
      message.success('Đã xóa khỏi giỏ hàng');
      return response.data;
    } catch (error) {
      console.error('Error removing cart item:', error);
      message.error('Lỗi khi xóa khỏi giỏ hàng');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      setLoading(true);
      const userId = getUserId();
      const sessionId = getSessionId();

      const params = userId ? { userId } : { sessionId };
      await axios.delete(`${API_BASE_URL}/cart/clear`, { params });

      setCart({ items: [], totalItems: 0, totalAmount: 0 });
      message.success('Đã xóa toàn bộ giỏ hàng');
    } catch (error) {
      console.error('Error clearing cart:', error);
      message.error('Lỗi khi xóa giỏ hàng');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Reset cart (for logout)
  const resetCart = () => {
    localStorage.removeItem('cart_session_id');
    setCart({ items: [], totalItems: 0, totalAmount: 0 });
  };

  // Merge session cart into user cart after login
  const mergeCart = async (userId) => {
    try {
      const sessionId = localStorage.getItem('cart_session_id');
      
      // If no session cart, just fetch user cart
      if (!sessionId) {
        await fetchCart(false);
        return;
      }

      // Call merge endpoint
      const response = await axios.post(`${API_BASE_URL}/cart/merge`, null, {
        params: { userId, sessionId }
      });

      // Update cart with merged data
      setCart(response.data);
      
      // Clear session ID after merge
      localStorage.removeItem('cart_session_id');
      
      console.log('Cart merged successfully');
    } catch (error) {
      console.error('Error merging cart:', error);
      // If merge fails, just fetch user cart
      await fetchCart(false);
    }
  };

  // Load cart on mount
  useEffect(() => {
    fetchCart();
  }, []);

  // Listen for logout event to clear cart
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'cart_session_id' && e.newValue === null) {
        // Session was cleared (logout), reset cart
        setCart({ items: [], totalItems: 0, totalAmount: 0 });
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const value = {
    cart,
    loading,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
    resetCart,
    refreshCart: fetchCart,
    mergeCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
