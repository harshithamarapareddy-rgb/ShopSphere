import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaTruck,
  FaUndoAlt,
  FaHeadset,
} from 'react-icons/fa';

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: '#0f172a',
        color: '#94a3b8',
        marginTop: 'auto',
        borderTop: '1px solid #1e293b',
      }}
    >
      {/* Features Bar */}
      <div style={{ borderBottom: '1px solid #1e293b', padding: '2.5rem 0' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(37, 99, 235, 0.15)',
                  color: '#38bdf8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                }}
              >
                <FaTruck />
              </div>
              <div>
                <h4 style={{ color: '#ffffff', fontSize: '0.9375rem', fontWeight: 700 }}>
                  Reliable Nationwide Delivery
                </h4>
                <p style={{ fontSize: '0.8125rem' }}>Direct from verified sellers</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#34d399',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                }}
              >
                <FaShieldAlt />
              </div>
              <div>
                <h4 style={{ color: '#ffffff', fontSize: '0.9375rem', fontWeight: 700 }}>
                  Secure Transactions
                </h4>
                <p style={{ fontSize: '0.8125rem' }}>Encrypted payments & buyer protection</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(245, 158, 11, 0.15)',
                  color: '#fbbf24',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                }}
              >
                <FaUndoAlt />
              </div>
              <div>
                <h4 style={{ color: '#ffffff', fontSize: '0.9375rem', fontWeight: 700 }}>
                  Authenticity Verified
                </h4>
                <p style={{ fontSize: '0.8125rem' }}>Certified classified conditions</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(168, 85, 247, 0.15)',
                  color: '#c084fc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                }}
              >
                <FaHeadset />
              </div>
              <div>
                <h4 style={{ color: '#ffffff', fontSize: '0.9375rem', fontWeight: 700 }}>
                  24/7 Dedicated Support
                </h4>
                <p style={{ fontSize: '0.8125rem' }}>Always ready to assist you</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div style={{ padding: '3.5rem 0' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '2.5rem',
            }}
          >
            {/* Column 1: Brand & Bio */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: '#2563eb',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                  }}
                >
                  SS
                </div>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
                  SHOP<span style={{ color: '#38bdf8' }}>SPHERE</span>
                </span>
              </div>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                SHOP SPHERE is a next-generation online classified advertisement and shopping platform.
                Connecting verified sellers with buyers nationwide for electronics, vehicles, fashion, and home goods.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8125rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FaMapMarkerAlt style={{ color: '#38bdf8' }} /> 100 Market St, San Francisco, CA
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FaPhoneAlt style={{ color: '#38bdf8' }} /> +1 (800) 555-SPHERE
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FaEnvelope style={{ color: '#38bdf8' }} /> support@shopsphere.com
                </div>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>
                Navigation
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.875rem' }}>
                <li><Link to="/" style={{ color: '#cbd5e1' }}>Home</Link></li>
                <li><Link to="/products" style={{ color: '#cbd5e1' }}>Browse Products</Link></li>
                <li><Link to="/categories" style={{ color: '#cbd5e1' }}>Categories Directory</Link></li>
                <li><Link to="/about" style={{ color: '#cbd5e1' }}>About Us</Link></li>
                <li><Link to="/contact" style={{ color: '#cbd5e1' }}>Contact Support</Link></li>
              </ul>
            </div>

            {/* Column 3: Seller Portal */}
            <div>
              <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>
                Merchant & Portals
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.875rem' }}>
                <li><Link to="/register" style={{ color: '#cbd5e1' }}>Become a Seller</Link></li>
                <li><Link to="/seller" style={{ color: '#cbd5e1' }}>Seller Dashboard</Link></li>
                <li><Link to="/seller/add-product" style={{ color: '#cbd5e1' }}>Post Classified Listing</Link></li>
                <li><Link to="/login" style={{ color: '#cbd5e1' }}>User & Seller Login</Link></li>
              </ul>
            </div>

            {/* Column 4: Newsletter */}
            <div>
              <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>
                Stay Informed
              </h4>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                Subscribe to get daily updates on freshly listed classifieds, exclusive discounts, and marketplace promotions.
              </p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="email"
                  placeholder="Your email address"
                  style={{
                    flex: 1,
                    padding: '0.625rem 0.875rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid #334155',
                    background: '#1e293b',
                    color: '#ffffff',
                    fontSize: '0.875rem',
                    outline: 'none',
                  }}
                />
                <button className="btn btn-primary btn-sm" type="button">
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div style={{ borderTop: '1px solid #1e293b', padding: '1.25rem 0', textAlign: 'center', fontSize: '0.8125rem' }}>
        <div className="container">
          <p>© {new Date().getFullYear()} SHOP SPHERE Inc. All rights reserved. Built with the MERN Stack.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
