import React from 'react';
import { Link } from 'react-router-dom';
import { FaStore, FaShieldAlt, FaRocket, FaUsers, FaCheckCircle } from 'react-icons/fa';

const AboutUs = () => {
  return (
    <div style={{ padding: '3.5rem 0 5rem' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span
            style={{
              color: 'var(--primary)',
              fontWeight: 800,
              fontSize: '0.8125rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            About SHOP SPHERE
          </span>
          <h1 className="title-xl" style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>
            Empowering Modern Commerce & Classifieds
          </h1>
          <p className="subtitle" style={{ maxWidth: '680px', margin: '0 auto', fontSize: '1.125rem' }}>
            Born from the foundation of ClassifiedShop, redesigned from the ground up on the modern MERN Stack to connect buyers, verified sellers, and local communities seamlessly.
          </p>
        </div>

        {/* Story Section */}
        <div
          className="card"
          style={{
            padding: '2.5rem',
            background: '#ffffff',
            marginBottom: '3rem',
            lineHeight: 1.8,
            fontSize: '1rem',
            color: 'var(--text-muted)',
          }}
        >
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1rem' }}>
            Our Mission & Evolution
          </h2>
          <p style={{ marginBottom: '1.25rem' }}>
            <strong>SHOP SPHERE</strong> was engineered to bridge the gap between open classified advertisements and robust full-scale ecommerce. Originally inspired by our Java-based ClassifiedShop architecture, the platform has been completely reimagined using high-performance Node.js, Express, MongoDB, and React.js.
          </p>
          <p style={{ marginBottom: '1.25rem' }}>
            We provide individual sellers, entrepreneurs, and established businesses with enterprise-grade tools: complete product inventory management, real-time buyer interest tracking, image upload pipelines, and authenticated role-based access for Buyers, Sellers, and Platform Administrators.
          </p>
        </div>

        {/* Pillars Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3.5rem',
          }}
        >
          <div className="card" style={{ padding: '1.75rem', background: '#ffffff' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                marginBottom: '1rem',
              }}
            >
              <FaShieldAlt />
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Safety & Verification
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              All sellers undergo verification and are monitored by platform administrators to ensure legitimate listings and buyer protection.
            </p>
          </div>

          <div className="card" style={{ padding: '1.75rem', background: '#ffffff' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'var(--success-light)',
                color: 'var(--success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                marginBottom: '1rem',
              }}
            >
              <FaRocket />
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              High Performance Stack
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Powered by Vite, React Router, and MongoDB document indexing for lightning-fast catalog search, filtering, and instant checkout.
            </p>
          </div>

          <div className="card" style={{ padding: '1.75rem', background: '#ffffff' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'var(--accent-light)',
                color: '#b45309',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                marginBottom: '1rem',
              }}
            >
              <FaUsers />
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Community First
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Enabling local classifieds as well as nationwide shipping so buyers can discover deals both nearby and across the country.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0f172a, #1e293b)',
            borderRadius: 'var(--radius-lg)',
            padding: '3rem 2rem',
            color: 'white',
            textAlign: 'center',
          }}
        >
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            Join the Shop Sphere Marketplace
          </h2>
          <p style={{ color: '#cbd5e1', marginBottom: '1.5rem', maxWidth: '520px', margin: '0 auto 1.5rem' }}>
            Whether you want to browse certified classified items or expand your sales as a registered merchant, SHOP SPHERE is ready for you.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/products" className="btn btn-primary">
              Browse Listings
            </Link>
            <Link to="/register" className="btn btn-secondary">
              Become a Seller
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;

