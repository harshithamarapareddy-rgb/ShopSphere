import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaBoxOpen,
  FaHeart,
  FaPlus,
  FaStore,
  FaClock,
  FaArrowRight,
  FaCheckCircle,
  FaUser,
} from 'react-icons/fa';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/Loader';

const statusClass = {
  Pending: 'badge-warning',
  Contacted: 'badge-success',
  Closed: 'badge-secondary',
};

const SellerDashboard = () => {
  const { user } = useAuth();
  const isShop = user?.role === 'shop';
  const [products, setProducts] = useState([]);
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        setLoading(true);
        const [prodRes, interestRes] = await Promise.all([
          API.get('/products/seller/me'),
          API.get('/interests/seller'),
        ]);

        if (prodRes.data.success) setProducts(prodRes.data.products);
        if (interestRes.data.success) setInterests(interestRes.data.interests);
      } catch (err) {
        console.error('Failed to load seller metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSellerData();
  }, []);

  const pendingInterests = interests.filter((item) => item.status === 'Pending');
  const contactedInterests = interests.filter((item) => item.status === 'Contacted');

  return (
    <div style={{ padding: '2.5rem 0 4rem' }}>
      <div className="container">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-success">{isShop ? 'Shop Hub' : 'Seller Merchant Hub'}</span>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                • {user?.sellerProfile?.shopName || user?.name}
              </span>
            </div>
            <h1 className="title-lg">
              {isShop ? 'Shop Overview & Leads' : 'Merchant Overview & Leads'}
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/seller/add-product" className="btn btn-primary">
              <FaPlus /> Post New Listing
            </Link>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-info">
              <div className="stat-title">Total Listed Products</div>
              <div className="stat-value">{products.length}</div>
            </div>
            <div className="stat-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
              <FaBoxOpen />
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-info">
              <div className="stat-title">Interested Buyers</div>
              <div className="stat-value">{interests.length}</div>
            </div>
            <div className="stat-icon" style={{ background: 'var(--success-light)', color: 'var(--success)' }}>
              <FaHeart />
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-info">
              <div className="stat-title">Waiting for Contact</div>
              <div className="stat-value">{pendingInterests.length}</div>
            </div>
            <div className="stat-icon" style={{ background: 'var(--accent-light)', color: '#b45309' }}>
              <FaClock />
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-info">
              <div className="stat-title">Contacted Leads</div>
              <div className="stat-value">{contactedInterests.length}</div>
            </div>
            <div className="stat-icon" style={{ background: '#f1f5f9', color: 'var(--text-main)' }}>
              <FaCheckCircle />
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1rem',
            marginBottom: '2.5rem',
          }}
        >
          <Link
            to="/seller/products"
            className="card card-hover"
            style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
              }}
            >
              <FaBoxOpen />
            </div>
            <div>
              <h4 style={{ fontSize: '0.9375rem', fontWeight: 700 }}>Manage Listings</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Edit prices, city, images, or stock
              </p>
            </div>
          </Link>

          <Link
            to="/seller/interests"
            className="card card-hover"
            style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: 'var(--success-light)',
                color: 'var(--success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
              }}
            >
              <FaHeart />
            </div>
            <div>
              <h4 style={{ fontSize: '0.9375rem', fontWeight: 700 }}>Contact Interested Buyers</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                View phone, email, and buyer messages
              </p>
            </div>
          </Link>

          <Link
            to="/seller/profile"
            className="card card-hover"
            style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: 'var(--accent-light)',
                color: '#b45309',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
              }}
            >
              <FaStore />
            </div>
            <div>
              <h4 style={{ fontSize: '0.9375rem', fontWeight: 700 }}>Shop Branding</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Update business phone, bio, and address
              </p>
            </div>
          </Link>
        </div>

        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
            }}
          >
            <h2 className="title-md">Recent Interested Buyers</h2>
            <Link to="/seller/interests" className="btn btn-outline btn-sm">
              View All Leads <FaArrowRight />
            </Link>
          </div>

          {loading ? (
            <Loader text="Loading your leads..." />
          ) : interests.length > 0 ? (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Buyer</th>
                    <th>City</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {interests.slice(0, 5).map((interest) => (
                    <tr key={interest._id}>
                      <td style={{ fontWeight: 700, color: 'var(--primary)' }}>
                        {interest.product?.name || 'Listing'}
                      </td>
                      <td>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <FaUser style={{ color: 'var(--text-light)' }} />
                          {interest.user?.name || 'Buyer'}
                        </span>
                      </td>
                      <td>{interest.product?.city || interest.product?.location || 'Online'}</td>
                      <td>
                        <span className={`badge ${statusClass[interest.status] || 'badge-primary'}`}>
                          {interest.status}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.8125rem' }}>
                        {new Date(interest.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <Link to="/seller/interests" className="btn btn-secondary btn-sm">
                          Contact
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="card" style={{ padding: '2.5rem', textAlign: 'center', background: '#ffffff' }}>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                No interested buyers yet. Add complete listings with an accurate city to attract local buyers.
              </p>
              <Link to="/seller/add-product" className="btn btn-primary btn-sm">
                Add More Products
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
