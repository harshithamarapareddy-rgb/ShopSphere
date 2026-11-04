import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('shopsphere_token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('shopsphere_token');
      if (savedToken) {
        try {
          const res = await API.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.user);
          }
        } catch (err) {
          console.error('Session restoration failed:', err.response?.data?.message || err.message);
          localStorage.removeItem('shopsphere_token');
          localStorage.removeItem('shopsphere_user');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Login handler (role is optional and enforces the correct portal)
  const login = async (email, password, role) => {
    const res = await API.post('/auth/login', { email, password, role });
    if (res.data.success) {
      const { token: receivedToken, user: receivedUser } = res.data;
      localStorage.setItem('shopsphere_token', receivedToken);
      localStorage.setItem('shopsphere_user', JSON.stringify(receivedUser));
      setToken(receivedToken);
      setUser(receivedUser);
      return receivedUser;
    }
  };

  // User Registration
  const register = async (userData) => {
    const res = await API.post('/auth/register', userData);
    if (res.data.success) {
      const { token: receivedToken, user: receivedUser } = res.data;
      if (receivedToken && receivedUser) {
        localStorage.setItem('shopsphere_token', receivedToken);
        localStorage.setItem('shopsphere_user', JSON.stringify(receivedUser));
        setToken(receivedToken);
        setUser(receivedUser);
      }
      return res.data;
    }
  };

  // Seller Registration
  const registerSeller = async (sellerData) => {
    const res = await API.post('/auth/register-seller', sellerData);
    if (res.data.success) {
      const { token: receivedToken, user: receivedUser } = res.data;
      if (receivedToken && receivedUser) {
        localStorage.setItem('shopsphere_token', receivedToken);
        localStorage.setItem('shopsphere_user', JSON.stringify(receivedUser));
        setToken(receivedToken);
        setUser(receivedUser);
      }
      return res.data;
    }
  };

  // Shop Registration
  const registerShop = async (shopData) => {
    const res = await API.post('/auth/register-shop', shopData);
    if (res.data.success) {
      const { token: receivedToken, user: receivedUser } = res.data;
      if (receivedToken && receivedUser) {
        localStorage.setItem('shopsphere_token', receivedToken);
        localStorage.setItem('shopsphere_user', JSON.stringify(receivedUser));
        setToken(receivedToken);
        setUser(receivedUser);
      }
      return res.data;
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('shopsphere_token');
    localStorage.removeItem('shopsphere_user');
    setToken(null);
    setUser(null);
  };

  // Update user profile in local context
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('shopsphere_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        registerSeller,
        registerShop,
        logout,
        updateUser,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isSeller: user?.role === 'seller',
        isShop: user?.role === 'shop',
        isCustomer: user?.role === 'user',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
