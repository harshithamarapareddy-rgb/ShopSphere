import React, { useState } from 'react';
import { FaStore, FaSave, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Toast';

const SellerProfile = () => {
  const { user, updateUser } = useAuth();
  const toast = useToast();

  const [formData, setFormData] = useState({
    shopName: user?.sellerProfile?.shopName || '',
    shopDescription: user?.sellerProfile?.shopDescription || '',
    businessPhone: user?.sellerProfile?.businessPhone || user?.phone || '',
    businessEmail: user?.sellerProfile?.businessEmail || user?.email || '',
    address: user?.sellerProfile?.address || '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await API.put('/auth/profile', {
        sellerProfile: formData,
      });

      if (res.data.success) {
        updateUser(res.data.user);
        toast.success('Seller store profile updated successfully!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update store details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2.5rem 0 4rem' }}>
      <div className="container" style={{ maxWidth: '720px' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 className="title-lg">Merchant Shop Profile & Branding</h1>
          <p className="subtitle">
            Configure how your shop appears to buyers across all classified listings
          </p>
        </div>

        <div className="card" style={{ padding: '2.5rem', background: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1.5rem' }}>
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '12px',
                background: 'var(--success-light)',
                color: 'var(--success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
              }}
            >
              <FaStore />
            </div>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800 }}>Store Information</h3>
              <span className="badge badge-success">Verified Merchant Partner</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Shop / Store Display Name *</label>
              <input
                type="text"
                name="shopName"
                required
                value={formData.shopName}
                onChange={handleChange}
                className="form-control"
                placeholder="e.g. Modern Living Supplies"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Shop Bio / Description</label>
              <textarea
                name="shopDescription"
                rows="3"
                value={formData.shopDescription}
                onChange={handleChange}
                className="form-control"
                placeholder="Briefly describe what your shop specializes in..."
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Customer Support Phone</label>
                <input
                  type="tel"
                  name="businessPhone"
                  value={formData.businessPhone}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Business Inquiries Email</label>
                <input
                  type="email"
                  name="businessEmail"
                  value={formData.businessEmail}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="shop@example.com"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Physical Location / Shipping Origin</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="form-control"
                placeholder="e.g. 45 Silicon Blvd, San Jose, CA"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-block btn-lg"
              style={{ marginTop: '1rem' }}
            >
              <FaSave /> {loading ? 'Saving Changes...' : 'Save Store Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;

