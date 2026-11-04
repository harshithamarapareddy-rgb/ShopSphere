import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import CategoriesPage from './pages/CategoriesPage';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import Login from './pages/Login';
import Register from './pages/Register';
import LoginUser from './pages/auth/LoginUser';
import LoginSeller from './pages/auth/LoginSeller';
import LoginShop from './pages/auth/LoginShop';
import LoginAdmin from './pages/auth/LoginAdmin';
import RegisterUser from './pages/auth/RegisterUser';
import RegisterSeller from './pages/auth/RegisterSeller';
import RegisterShop from './pages/auth/RegisterShop';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSellers from './pages/admin/AdminSellers';
import AdminShops from './pages/admin/AdminShops';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminCities from './pages/admin/AdminCities';

// User Pages
import UserDashboard from './pages/user/UserDashboard';
import MyInterests from './pages/user/MyInterests';
import UserProfile from './pages/user/UserProfile';

// Seller Pages
import SellerDashboard from './pages/seller/SellerDashboard';
import SellerProducts from './pages/seller/SellerProducts';
import AddProduct from './pages/seller/AddProduct';
import EditProduct from './pages/seller/EditProduct';
import SellerInterests from './pages/seller/SellerInterests';
import SellerProfile from './pages/seller/SellerProfile';

function App() {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/cart" element={<Navigate to="/products" replace />} />
          <Route path="/checkout" element={<Navigate to="/products" replace />} />
          <Route path="/order-success/:id" element={<Navigate to="/products" replace />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login/home" element={<Login />} />
          <Route path="/login/user" element={<LoginUser />} />
          <Route path="/login/seller" element={<LoginSeller />} />
          <Route path="/login/shop" element={<LoginShop />} />
          <Route path="/login/admin" element={<LoginAdmin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/sellers"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminSellers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/shops"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminShops />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminCategories />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/cities"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminCities />
              </ProtectedRoute>
            }
          />
          <Route path="/register" element={<Register />} />
          <Route path="/register/user" element={<RegisterUser />} />
          <Route path="/register/seller" element={<RegisterSeller />} />
          <Route path="/register/shop" element={<RegisterShop />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* User Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['user', 'seller', 'shop', 'admin']}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/dashboard/orders" element={<Navigate to="/dashboard/interests" replace />} />
          <Route
            path="/dashboard/interests"
            element={
              <ProtectedRoute allowedRoles={['user', 'seller', 'shop', 'admin']}>
                <MyInterests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/profile"
            element={
              <ProtectedRoute allowedRoles={['user', 'seller', 'shop', 'admin']}>
                <UserProfile />
              </ProtectedRoute>
            }
          />

          {/* Seller Protected Routes */}
          <Route
            path="/seller"
            element={
              <ProtectedRoute allowedRoles={['seller', 'shop', 'admin']}>
                <SellerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/products"
            element={
              <ProtectedRoute allowedRoles={['seller', 'shop', 'admin']}>
                <SellerProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/add-product"
            element={
              <ProtectedRoute allowedRoles={['seller', 'shop', 'admin']}>
                <AddProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/edit-product/:id"
            element={
              <ProtectedRoute allowedRoles={['seller', 'shop', 'admin']}>
                <EditProduct />
              </ProtectedRoute>
            }
          />
          <Route path="/seller/orders" element={<Navigate to="/seller/interests" replace />} />
          <Route
            path="/seller/interests"
            element={
              <ProtectedRoute allowedRoles={['seller', 'shop', 'admin']}>
                <SellerInterests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/profile"
            element={
              <ProtectedRoute allowedRoles={['seller', 'shop', 'admin']}>
                <SellerProfile />
              </ProtectedRoute>
            }
          />

          {/* Fallback Catch-All */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
