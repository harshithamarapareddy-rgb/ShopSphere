import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaHeart,
  FaClock,
  FaCheckCircle,
  FaUserCheck,
  FaMapMarkerAlt,
  FaArrowRight,
  FaStore,
} from 'react-icons/fa';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/Loader';

const statusClass = {
  Pending: 'badge-warning',
  Contacted: 'badge-success',
  Closed: 'badge-secondary',
};

const UserDashboard = () => {
  const { user } = useAuth();
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const res = await API.get('/interests/my');
        if (res.data.success) {
          setInterests(res.data.interests);
        }
      } catch (err) {
        console.error('Failed to load user interests:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const pendingCount = interests.filter((item) => item.status === 'Pending').length;
  const contactedCount = interests.filter((item) => item.status === 'Contacted').length;

  return (
    <div style={{ padding: '2.5rem 0 4rem' }}>
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>
            Buyer Dashboard
          </span>
          <h1 className="title-lg">Hello, {user?.name}!</h1>
          <p className="subtitle">
            Track products you are interested in and connect directly with sellers.
          </p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-info">
              <div className="stat-title">Interested Products</div>
              <div className="stat-value">{interests.length}</div>
            </div>
            <div className="stat-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
              <FaHeart />
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-info">
              <div className="stat-title">Awaiting Seller</div>
              <div className="stat-value">{pendingCount}</div>
            </div>
            <div className="stat-icon" style={{ background: 'var(--accent-light)', color: '#b45309' }}>
              <FaClock />
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-info">
              <div className="stat-title">Seller Contacted</div>
              <div className="stat-value">{contactedCount}</div>
            </div>
            <div className="stat-icon" style={{ background: 'var(--success-light)', color: 'var(--success)' }}>
              <FaCheckCircle />
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-info">
              <div className="stat-title">Account Status</div>
              <div className="stat-value" style={{ fontSize: '1.25rem', color: 'var(--success)' }}>
                Active & Verified
              </div>
            </div>
            <div className="stat-icon" style={{ background: '#f1f5f9', color: 'var(--text-muted)' }}>
              <FaUserCheck />
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
          }}
        >
          <div style={{ flex: '2' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
              }}
            >
              <h2 className="title-md">Recent Interests</h2>
              <Link to="/dashboard/interests" className="btn btn-outline btn-sm">
                View All Interests <FaArrowRight />
              </Link>
            </div>

            {loading ? (
              <Loader text="Loading your interests..." />
            ) : interests.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {interests.slice(0, 3).map((interest) => (
                  <div
                    key={interest._id}
                    className="card"
                    style={{ padding: '1.25rem', background: '#ffffff' }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottom: '1px solid var(--border-color)',
                        paddingBottom: '0.75rem',
                        marginBottom: '0.75rem',
                        flexWrap: 'wrap',
                        gap: '0.5rem',
                      }}
                    >
                      <div>
                        <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '0.9375rem' }}>
                          {interest.product?.name || 'Listing unavailable'}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginLeft: '0.5rem' }}>
                          • {new Date(interest.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <span className={`badge ${statusClass[interest.status] || 'badge-primary'}`}>
                        {interest.status}
                      </span>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '1rem',
                        flexWrap: 'wrap',
                        fontSize: '0.875rem',
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)' }}>
                        <FaMapMarkerAlt style={{ color: 'var(--primary)' }} />
                        {interest.product?.city || interest.product?.location || 'Online'}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)' }}>
                        <FaStore style={{ color: 'var(--primary)' }} />
                        {interest.seller?.sellerProfile?.shopName || interest.seller?.name || 'Seller'}
                      </span>
                      <span style={{ fontSize: '1.125rem', fontWeight: 800 }}>
                        ₹{(interest.product?.price || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card" style={{ padding: '2.5rem', textAlign: 'center', background: '#ffffff' }}>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  You have not marked interest in any products yet.
                </p>
                <Link to="/products" className="btn btn-primary btn-sm">
                  Browse Products
                </Link>
              </div>
            )}
          </div>

          <div>
            <h2 className="title-md" style={{ marginBottom: '1rem' }}>
              Profile & Contact
            </h2>
            <div className="card" style={{ padding: '1.5rem', background: '#ffffff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                <div className="sidebar-avatar" style={{ width: '56px', height: '56px', fontSize: '1.5rem' }}>
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>{user?.name}</h3>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{user?.email}</p>
                  <span className="badge badge-primary" style={{ marginTop: '0.25rem' }}>
                    {user?.role}
                  </span>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  fontSize: '0.875rem',
                  borderTop: '1px solid var(--border-color)',
                  paddingTop: '1rem',
                  marginBottom: '1.5rem',
                }}
              >
                <div>
                  <strong style={{ color: 'var(--text-muted)' }}>Phone:</strong>{' '}
                  {user?.phone || 'Not set'}
                </div>
                <div>
                  <strong style={{ color: 'var(--text-muted)' }}>Default Address:</strong>
                  <p style={{ color: 'var(--text-main)', marginTop: '0.25rem' }}>
                    {user?.address?.street ? (
                      <>
                        {user.address.street}, {user.address.city}, {user.address.state} {user.address.zipCode}
                      </>
                    ) : (
                      'No default address added yet'
                    )}
                  </p>
                </div>
              </div>

              <Link to="/dashboard/profile" className="btn btn-secondary btn-block">
                Edit Profile & Change Password
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
