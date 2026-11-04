import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaHeart,
  FaStore,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaTrashAlt,
  FaEnvelope,
  FaPhoneAlt,
  FaArrowRight,
} from 'react-icons/fa';
import API from '../../services/api';
import Loader from '../../components/Loader';
import { useToast } from '../../components/Toast';

const statusClass = {
  Pending: 'badge-warning',
  Contacted: 'badge-success',
  Closed: 'badge-secondary',
};

const MyInterests = () => {
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [withdrawingId, setWithdrawingId] = useState(null);
  const toast = useToast();

  const fetchInterests = async () => {
    try {
      setLoading(true);
      const res = await API.get('/interests/my');
      if (res.data.success) setInterests(res.data.interests);
    } catch (err) {
      toast.error('Failed to load your interested products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterests();
  }, []);

  const handleWithdraw = async (id) => {
    try {
      setWithdrawingId(id);
      const res = await API.delete(`/interests/${id}`);
      if (res.data.success) {
        toast.success('Interest withdrawn.');
        setInterests((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not withdraw interest.');
    } finally {
      setWithdrawingId(null);
    }
  };

  const getFullImageUrl = (img) => {
    if (!img) return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600';
    return img.startsWith('http') ? img : `http://localhost:5000${img}`;
  };

  const pendingCount = interests.filter((item) => item.status === 'Pending').length;
  const contactedCount = interests.filter((item) => item.status === 'Contacted').length;

  return (
    <div style={{ padding: '2.5rem 0 4rem' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
            marginBottom: '2rem',
          }}
        >
          <div>
            <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>
              Buyer Interests
            </span>
            <h1 className="title-lg">Products I'm Interested In</h1>
            <p className="subtitle">
              Sellers can view your contact details and reach out about these listings.
            </p>
          </div>
          <Link to="/products" className="btn btn-primary">
            Browse Products <FaArrowRight />
          </Link>
        </div>

        <div className="stats-grid" style={{ marginBottom: '2rem' }}>
          <div className="stat-card">
            <div className="stat-info">
              <div className="stat-title">Total Interests</div>
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
              <FaCalendarAlt />
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <div className="stat-title">Seller Contacted</div>
              <div className="stat-value">{contactedCount}</div>
            </div>
            <div className="stat-icon" style={{ background: 'var(--success-light)', color: 'var(--success)' }}>
              <FaStore />
            </div>
          </div>
        </div>

        {loading ? (
          <Loader text="Loading your interests..." />
        ) : interests.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {interests.map((interest) => {
              const product = interest.product;
              const seller = interest.seller;

              return (
                <div key={interest._id} className="card" style={{ padding: '1.25rem', background: '#ffffff' }}>
                  <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
                    <img
                      src={getFullImageUrl(product?.images?.[0])}
                      alt={product?.name || 'Product'}
                      style={{
                        width: '100px',
                        height: '100px',
                        objectFit: 'cover',
                        borderRadius: 'var(--radius-md)',
                        flexShrink: 0,
                      }}
                    />

                    <div style={{ flex: 1, minWidth: '220px' }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          gap: '0.75rem',
                          flexWrap: 'wrap',
                        }}
                      >
                        <div>
                          <Link
                            to={`/products/${product?._id}`}
                            style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--secondary)' }}
                          >
                            {product?.name || 'Listing unavailable'}
                          </Link>
                          <div
                            style={{
                              display: 'flex',
                              gap: '1rem',
                              flexWrap: 'wrap',
                              fontSize: '0.8125rem',
                              color: 'var(--text-muted)',
                              marginTop: '0.375rem',
                            }}
                          >
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                              <FaMapMarkerAlt style={{ color: 'var(--primary)' }} />
                              {product?.city || product?.location || 'Online'}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                              <FaCalendarAlt /> Sent {new Date(interest.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <span className={`badge ${statusClass[interest.status] || 'badge-primary'}`}>
                          {interest.status}
                        </span>
                      </div>

                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)', margin: '0.75rem 0' }}>
                        ₹{(product?.price || 0).toLocaleString('en-IN')}
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          gap: '1rem',
                          flexWrap: 'wrap',
                          fontSize: '0.8125rem',
                          color: 'var(--text-muted)',
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <FaStore style={{ color: 'var(--primary)' }} />
                          {seller?.sellerProfile?.shopName || seller?.name || 'Seller'}
                        </span>
                        {seller?.email && (
                          <a href={`mailto:${seller.email}`} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <FaEnvelope /> {seller.email}
                          </a>
                        )}
                        {(seller?.sellerProfile?.businessPhone || seller?.phone) && (
                          <a
                            href={`tel:${seller.sellerProfile?.businessPhone || seller.phone}`}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                          >
                            <FaPhoneAlt /> {seller.sellerProfile?.businessPhone || seller.phone}
                          </a>
                        )}
                      </div>

                      {interest.message && (
                        <p
                          style={{
                            marginTop: '0.75rem',
                            padding: '0.75rem',
                            background: '#f8fafc',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '0.8125rem',
                            color: 'var(--text-muted)',
                          }}
                        >
                          <strong>Your message:</strong> {interest.message}
                        </p>
                      )}

                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                        <Link to={`/products/${product?._id}`} className="btn btn-secondary btn-sm">
                          View Listing
                        </Link>
                        {interest.status !== 'Closed' && (
                          <button
                            onClick={() => handleWithdraw(interest._id)}
                            disabled={withdrawingId === interest._id}
                            className="btn btn-outline btn-sm"
                            style={{ color: 'var(--danger)' }}
                          >
                            <FaTrashAlt /> {withdrawingId === interest._id ? 'Withdrawing...' : 'Withdraw'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">
              <FaHeart />
            </div>
            <h3>No Interests Yet</h3>
            <p>Mark a listing as interested and the seller will be able to contact you directly.</p>
            <Link to="/products" className="btn btn-primary">
              Explore Marketplace
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyInterests;
