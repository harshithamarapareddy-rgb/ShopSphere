import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // Sync / fetch cart on authentication change
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      // Load guest cart from localStorage
      const guestCart = JSON.parse(localStorage.getItem('shopsphere_guest_cart') || '[]');
      setCartItems(guestCart);
      calculateTotals(guestCart);
    }
  }, [isAuthenticated]);

  const calculateTotals = (items) => {
    const total = items.reduce((acc, item) => acc + (item.quantity || 1), 0);
    const sum = items.reduce((acc, item) => {
      const price = item.product?.price || item.price || 0;
      return acc + price * (item.quantity || 1);
    }, 0);
    setTotalItems(total);
    setSubtotal(Number(sum.toFixed(2)));
  };

  const fetchCart = async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const res = await API.get('/cart');
      if (res.data.success) {
        setCartItems(res.data.cart.items);
        setTotalItems(res.data.cart.totalItems);
        setSubtotal(res.data.cart.subtotal);
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    const qty = parseInt(quantity, 10) || 1;

    if (isAuthenticated) {
      try {
        const res = await API.post('/cart/add', {
          productId: product._id,
          quantity: qty,
        });
        if (res.data.success) {
          setCartItems(res.data.cart.items);
          setTotalItems(res.data.cart.totalItems);
          setSubtotal(res.data.cart.subtotal);
          return { success: true, message: res.data.message };
        }
      } catch (err) {
        return {
          success: false,
          message: err.response?.data?.message || 'Failed to add item to cart',
        };
      }
    } else {
      // Guest cart
      const current = [...cartItems];
      const index = current.findIndex((item) => (item.product?._id || item.product) === product._id);
      if (index > -1) {
        current[index].quantity += qty;
      } else {
        current.push({
          product,
          quantity: qty,
          price: product.price,
        });
      }
      setCartItems(current);
      calculateTotals(current);
      localStorage.setItem('shopsphere_guest_cart', JSON.stringify(current));
      return { success: true, message: 'Added to cart!' };
    }
  };

  const updateQuantity = async (productId, quantity) => {
    const qty = parseInt(quantity, 10);
    if (isAuthenticated) {
      try {
        const res = await API.put('/cart/update', {
          productId,
          quantity: qty,
        });
        if (res.data.success) {
          setCartItems(res.data.cart.items);
          setTotalItems(res.data.cart.totalItems);
          setSubtotal(res.data.cart.subtotal);
        }
      } catch (err) {
        console.error('Update quantity error:', err);
      }
    } else {
      let current = [...cartItems];
      const index = current.findIndex((item) => (item.product?._id || item.product) === productId);
      if (index > -1) {
        if (qty <= 0) {
          current.splice(index, 1);
        } else {
          current[index].quantity = qty;
        }
        setCartItems(current);
        calculateTotals(current);
        localStorage.setItem('shopsphere_guest_cart', JSON.stringify(current));
      }
    }
  };

  const removeFromCart = async (productId) => {
    if (isAuthenticated) {
      try {
        const res = await API.delete(`/cart/remove/${productId}`);
        if (res.data.success) {
          setCartItems(res.data.cart.items);
          setTotalItems(res.data.cart.totalItems);
          setSubtotal(res.data.cart.subtotal);
        }
      } catch (err) {
        console.error('Remove item error:', err);
      }
    } else {
      const filtered = cartItems.filter((item) => (item.product?._id || item.product) !== productId);
      setCartItems(filtered);
      calculateTotals(filtered);
      localStorage.setItem('shopsphere_guest_cart', JSON.stringify(filtered));
    }
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await API.delete('/cart/clear');
      } catch (err) {
        console.error('Clear cart error:', err);
      }
    }
    setCartItems([]);
    setTotalItems(0);
    setSubtotal(0);
    localStorage.removeItem('shopsphere_guest_cart');
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItems,
        subtotal,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

