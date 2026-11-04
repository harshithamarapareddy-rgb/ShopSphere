import React, { useState, useEffect } from 'react';
import {
  FaHeart,
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaBoxOpen,
  FaCheckCircle,
  FaClock,
} from 'react-icons/fa';
import API from '../../services/api';
import Loader from '../../components/Loader';
import { useToast } from '../../components/Toast';

const statusClass = {
  Pending: 'badge-warning',
  Contacted: 'badge-success',
  Closed: 'badge-secondary',
};

const SellerInterests = () => {
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [updatingId, setUpdatingId] = useState(null);
  const toast = useToast();

  const fetchInterests = async () => {
    try {
      setLoading(true);
      const res = await API.get('/interests/seller');
      if (res.data.success) setInterests(res.data.interests);
    } catch (err) {
      toast.error('Failed to load interested buyers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterests();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      setUpdatingId(id);
      const res = await API.put(`/interests/${id}/status`, { status });
      if (res.data.success) {
        setInterests((prev) =>
          prev.map((item) => (item._id === id ? res.data.interest : item))
        );
        toast.success(`Buyer marked as ${status.toLowerCase()}.`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update buyer status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const getFullImageUrl = (img) => {
    if (!img) return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600';
    return img.startsWith('http') ? img : `http://localhost:5000${img}`;
  };

  const pendingCount = interests.filter((item) => item.status === 'Pending').length;
  const contactedCount = interests.filter((item) => item.status === 'Contacted').length;
  const filteredInterests =
    filter === 'All' ? interests : interests.filter((item) => item.status === filter);

  return (
    <div style={{ padding: '2.5rem 0 4rem' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        <div style={{ marginBottom: '2rem' }}>
          <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>
            Seller Leads
          </span>
          <h1 className="title-lg">Interested Buyers</h1>
          <p className="subtitle">
            See who wants your products, contact them directly, and track each lead.
          </p>
        </div>

        <div className="stats-grid" style={{ marginBottom: '2rem' }}>
          <div className="stat-card">
            <div className="stat-info">
              <div className="stat-title">Total Interested Buyers</div>
              <div className="stat-value">{interests.length}</div>
            </div>
            <div className="stat-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
              <FaHeart />
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <div className="stat-title">Waiting for Contact</div>
              <div className="stat-value">{pendingCount}</div>
            </div>
            <div className="stat-icon" style={{ background: 'var(--accent-light)', color: '#b45309' }}>
              <FaClock />
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <div className="stat-title">Contacted</div>
              <div className="stat-value">{contactedCount}</div>
            </div>
            <div className="stat-icon" style={{ background: 'var(--success-light)', color: 'var(--success)' }}>
              <FaCheckCircle />
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
            marginBottom: '1.25rem',
          }}
        >
          <h2 className="title-md" style={{ margin: 0 }}>
            Buyer Leads
          </h2>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="form-control"
            style={{ width: 'auto', minWidth: '180px' }}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Contacted">Contacted</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        {loading ? (
          <Loader text="Loading interested buyers..." />
        ) : filteredInterests.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {filteredInterests.map((interest) => {
              const product = interest.product;
              const buyer = interest.user;

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

                    <div style={{ flex: 1, minWidth: '240px' }}>
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
                          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--secondary)' }}>
                            {product?.name || 'Listing unavailable'}
                          </h3>
                          <div
                            style={{
                              display: 'flex',
                              gap: '1rem',
                              flexWrap: 'wrap',
                              fontSize: '0.8125rem',
                              color: 'var(--text-muted)',
                              marginTop: '0.25rem',
                            }}
                          >
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                              <FaMapMarkerAlt style={{ color: 'var(--primary)' }} />
                              {product?.city || product?.location || 'Online'}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                              <FaCalendarAlt />{' '}
                              {new Date(interest.createdAt).toLocaleString('en-IN', {
                                dateStyle: 'medium',
                                timeStyle: 'short',
                              })}
                            </span>
                            <span style={{ fontWeight: 700, color: 'var(--primary)' }}>
                              ₹{(product?.price || 0).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                        <span className={`badge ${statusClass[interest.status] || 'badge-primary'}`}>
                          {interest.status}
                        </span>
                      </div>

                      <div
                        style={{
                          marginTop: '0.875rem',
                          padding: '0.875rem',
                          background: '#f8fafc',
                          borderRadius: 'var(--radius-md)',
                          display: 'flex',
                          gap: '1rem',
                          flexWrap: 'wrap',
                          fontSize: '0.8125rem',
                          color: 'var(--text-muted)',
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, color: 'var(--text-main)' }}>
                          <FaUser style={{ color: 'var(--primary)' }} />
                          {buyer?.name || 'Buyer'}
                        </span>
                        {buyer?.email && (
                          <a href={`mailto:${buyer.email}`} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <FaEnvelope style={{ color: 'var(--primary)' }} /> {buyer.email}
                          </a>
                        )}
                        {(interest.phone || buyer?.phone) && (
                          <a
                            href={`tel:${interest.phone || buyer.phone}`}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                          >
                            <FaPhoneAlt style={{ color: 'var(--primary)' }} /> {interest.phone || buyer.phone}
                          </a>
                        )}
                        {buyer?.address?.city && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <FaMapMarkerAlt style={{ color: 'var(--primary)' }} /> {buyer.address.city}
                          </span>
                        )}
                      </div>

                      {interest.message && (
                        <p
                          style={{
                            marginTop: '0.75rem',
                            fontSize: '0.85rem',
                            color: 'var(--text-muted)',
                            lineHeight: 1.6,
                          }}
                        >
                          <strong>Buyer message:</strong> {interest.message}
                        </p>
                      )}

                      <div
                        style={{
                          display: 'flex',
                          gap: '1rem',
                          flexWrap: 'wrap',
                          alignItems: 'center',
                          marginTop: '0.875rem',
                        }}
                      >
                        <label className="form-label" style={{ margin: 0 }}>
                          Lead status:
                        </label>
                        <select
                          value={interest.status}
                          disabled={updatingId === interest._id}
                          onChange={(e) => handleStatusChange(interest._id, e.target.value)}
                          className="form-control"
                          style={{ width: 'auto', padding: '0.45rem 0.75rem', fontSize: '0.8125rem' }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Closed">Closed</option>
                        </select>
                        {interest.contactedAt && (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                            Contacted {new Date(interest.contactedAt).toLocaleDateString()}
                          </span>
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
              <FaBoxOpen />
            </div>
            <h3>{filter === 'All' ? 'No Interested Buyers Yet' : `No ${filter} Leads`}</h3>
            <p>
              {filter === 'All'
                ? 'When buyers mark interest in your listings, their contact details will appear here.'
                : 'Try a different status filter to see other leads.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerInterests;
