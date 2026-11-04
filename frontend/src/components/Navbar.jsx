import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FaHeart,
  FaSearch,
  FaUser,
  FaBars,
  FaTimes,
  FaStore,
  FaSignOutAlt,
  FaBoxOpen,
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, isSeller, isShop, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  const isActiveLink = (path) => {
    return location.pathname === path ? { color: 'var(--primary)', fontWeight: 700 } : {};
  };

  const interestsPath =
    isSeller || isShop || isAdmin
      ? '/seller/interests'
      : isAuthenticated
      ? '/dashboard/interests'
      : '/login/user';

  return (
    <header
      style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid var(--border-color)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '74px',
            gap: '1rem',
          }}
        >
          {/* Brand Logo */}
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.625rem',
              textDecoration: 'none',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 900,
                fontSize: '1.25rem',
                boxShadow: '0 4px 10px rgba(37, 99, 235, 0.3)',
              }}
            >
              SS
            </div>
            <div>
              <span
                style={{
                  fontSize: '1.375rem',
                  fontWeight: 900,
                  letterSpacing: '-0.03em',
                  color: 'var(--secondary)',
                }}
              >
                SHOP<span style={{ color: 'var(--primary)' }}>SPHERE</span>
              </span>
              <span
                style={{
                  display: 'block',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  color: 'var(--text-light)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  lineHeight: 1,
                }}
              >
                Classifieds & Store
              </span>
            </div>
          </Link>

          {/* Desktop Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            style={{
              display: 'flex',
              alignItems: 'center',
              flex: '1',
              maxWidth: '420px',
              position: 'relative',
            }}
            className="navbar-search"
          >
            <input
              type="text"
              placeholder="Search classifieds, electronics, furniture..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.625rem 2.5rem 0.625rem 1rem',
                fontSize: '0.875rem',
                borderRadius: 'var(--radius-full)',
                border: '1.5px solid var(--border-color)',
                outline: 'none',
                background: '#f8fafc',
                transition: 'var(--transition)',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border-color)')}
            />
            <button
              type="submit"
              style={{
                position: 'absolute',
                right: '0.75rem',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FaSearch />
            </button>
          </form>

          {/* Navigation Links */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
            }}
            className="navbar-desktop-nav"
          >
            <Link to="/" style={{ fontSize: '0.9375rem', fontWeight: 600, ...isActiveLink('/') }}>
              Home
            </Link>
            <Link
              to="/categories"
              style={{ fontSize: '0.9375rem', fontWeight: 600, ...isActiveLink('/categories') }}
            >
              Categories
            </Link>
            <Link
              to="/products"
              style={{ fontSize: '0.9375rem', fontWeight: 600, ...isActiveLink('/products') }}
            >
              Products
            </Link>
            <Link
              to="/about"
              style={{ fontSize: '0.9375rem', fontWeight: 600, ...isActiveLink('/about') }}
            >
              About Us
            </Link>
            <Link
              to="/contact"
              style={{ fontSize: '0.9375rem', fontWeight: 600, ...isActiveLink('/contact') }}
            >
              Contact
            </Link>
          </nav>

          {/* Right Action Icons: Cart & Auth */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            {/* Interests Button */}
            <Link
              to={interestsPath}
              className="btn btn-secondary"
              style={{
                position: 'relative',
                padding: '0.5rem 0.875rem',
                borderRadius: 'var(--radius-full)',
              }}
              title="Interested Products & Buyers"
            >
              <FaHeart style={{ fontSize: '1.125rem', color: 'var(--primary)' }} />
            </Link>

            {/* Authenticated Dropdown / Login Button */}
            {isAuthenticated ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.375rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'var(--primary)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.875rem',
                      fontWeight: 700,
                    }}
                  >
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      maxWidth: '100px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {user?.name?.split(' ')[0]}
                  </span>
                </button>

                {dropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: '120%',
                      width: '220px',
                      backgroundColor: '#ffffff',
                      borderRadius: 'var(--radius-md)',
                      boxShadow: 'var(--shadow-xl)',
                      border: '1px solid var(--border-color)',
                      padding: '0.5rem 0',
                      zIndex: 2000,
                      animation: 'fadeIn 0.15s ease',
                    }}
                  >
                    <div
                      style={{
                        padding: '0.75rem 1rem',
                        borderBottom: '1px solid var(--border-color)',
                        marginBottom: '0.25rem',
                      }}
                    >
                      <p style={{ fontSize: '0.875rem', fontWeight: 700 }}>{user?.name}</p>
                      <p
                        style={{
                          fontSize: '0.75rem',
                          color: 'var(--text-muted)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {user?.email}
                      </p>
                      <span className="badge badge-primary" style={{ marginTop: '0.375rem' }}>
                        {user?.role}
                      </span>
                    </div>

                    {/* Role-Specific Links */}
                    {(isSeller || isShop) && (
                      <>
                        <Link
                          to="/seller"
                          onClick={() => setDropdownOpen(false)}
                          className="sidebar-link"
                          style={{ padding: '0.5rem 1rem' }}
                        >
                          <FaStore style={{ color: 'var(--primary)' }} />{' '}
                          {isShop ? 'Shop Hub' : 'Seller Hub'}
                        </Link>
                        <Link
                          to="/seller/add-product"
                          onClick={() => setDropdownOpen(false)}
                          className="sidebar-link"
                          style={{ padding: '0.5rem 1rem' }}
                        >
                          <FaBoxOpen /> Add Listing
                        </Link>
                        <Link
                          to="/seller/interests"
                          onClick={() => setDropdownOpen(false)}
                          className="sidebar-link"
                          style={{ padding: '0.5rem 1rem' }}
                        >
                          <FaHeart style={{ color: 'var(--primary)' }} /> Interested Buyers
                        </Link>
                      </>
                    )}

                    {!isAdmin && !isSeller && !isShop && (
                      <>
                        <Link
                          to="/dashboard"
                          onClick={() => setDropdownOpen(false)}
                          className="sidebar-link"
                          style={{ padding: '0.5rem 1rem' }}
                        >
                          <FaUser /> My Dashboard
                        </Link>
                        <Link
                          to="/dashboard/interests"
                          onClick={() => setDropdownOpen(false)}
                          className="sidebar-link"
                          style={{ padding: '0.5rem 1rem' }}
                        >
                          <FaHeart style={{ color: 'var(--primary)' }} /> My Interests
                        </Link>
                      </>
                    )}

                    <Link
                      to="/dashboard/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="sidebar-link"
                      style={{ padding: '0.5rem 1rem' }}
                    >
                      <FaUser /> Profile Settings
                    </Link>

                    <div
                      style={{
                        borderTop: '1px solid var(--border-color)',
                        marginTop: '0.25rem',
                        paddingTop: '0.25rem',
                      }}
                    >
                      <button
                        onClick={handleLogout}
                        className="sidebar-link"
                        style={{
                          width: '100%',
                          color: 'var(--danger)',
                          padding: '0.5rem 1rem',
                          textAlign: 'left',
                        }}
                      >
                        <FaSignOutAlt /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Link to="/login" className="btn btn-secondary btn-sm">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                fontSize: '1.25rem',
                color: 'var(--text-main)',
                display: 'none',
                padding: '0.5rem',
              }}
              className="navbar-mobile-toggle"
            >
              {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderTop: '1px solid var(--border-color)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              placeholder="Search products..."
              className="form-control"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">
              <FaSearch />
            </button>
          </form>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600 }}>
              Home
            </Link>
            <Link
              to="/categories"
              onClick={() => setMobileMenuOpen(false)}
              style={{ fontWeight: 600 }}
            >
              Categories
            </Link>
            <Link
              to="/products"
              onClick={() => setMobileMenuOpen(false)}
              style={{ fontWeight: 600 }}
            >
              All Products
            </Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600 }}>
              About Us
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              style={{ fontWeight: 600 }}
            >
              Contact Us
            </Link>
          </nav>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .navbar-desktop-nav, .navbar-search {
            display: none !important;
          }
          .navbar-mobile-toggle {
            display: block !important;
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
