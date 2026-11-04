import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaEnvelope,
  FaPhone,
  FaLock,
  FaArrowLeft,
  FaUserPlus,
  FaStore,
  FaMapMarkerAlt,
  FaCheckCircle,
} from 'react-icons/fa';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Toast';
import PasswordRequirements from '../../components/PasswordRequirements';
import { isStrongPassword, PASSWORD_MESSAGE } from '../../utils/passwordPolicy';
import { ROLE_CONFIG } from './roleConfig';

const RoleRegister = ({ role = 'user' }) => {
  const config = ROLE_CONFIG[role] || ROLE_CONFIG.user;
  const RoleIcon = role === 'user' ? FaUserPlus : role === 'shop' ? config.icon : FaStore;
  const isMerchant = role === 'seller' || role === 'shop';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    shopName: '',
    shopDescription: '',
    businessPhone: '',
    businessEmail: '',
    category: '',
    city: '',
    address: '',
  });
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);

  const { register, registerSeller, registerShop } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await API.get('/cities?active=true');
        if (res.data.success) setCities(res.data.cities);
      } catch (err) {
        setCities([]);
      }
    };
    fetchCities();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const selectedCity = cities.find((c) => c.name === formData.city);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    if (!isStrongPassword(formData.password)) {
      toast.error(PASSWORD_MESSAGE);
      return;
    }
    if (isMerchant && !formData.shopName.trim()) {
      toast.error('Please provide a name for your shop.');
      return;
    }

    try {
      setLoading(true);

      if (role === 'seller') {
        const result = await registerSeller({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          shopName: formData.shopName,
          shopDescription: formData.shopDescription,
          businessPhone: formData.businessPhone || formData.phone,
          businessEmail: formData.businessEmail || formData.email,
          address: formData.address,
          city: formData.city,
          category: formData.category,
        });
        toast.success(result.message);
        navigate('/login/seller', { replace: true, state: { email: formData.email } });
      } else if (role === 'shop') {
        const result = await registerShop({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          shopName: formData.shopName,
          shopDescription: formData.shopDescription,
          businessPhone: formData.businessPhone || formData.phone,
          businessEmail: formData.businessEmail || formData.email,
          address: formData.address,
          city: formData.city,
          category: formData.category,
        });
        toast.success(result.message);
        navigate('/login/shop', { replace: true, state: { email: formData.email } });
      } else {
        const result = await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          address: {
            street: formData.address,
            city: formData.city,
            state: selectedCity?.state || '',
          },
        });
        toast.success(result.message);
        navigate('/login/user', { replace: true, state: { email: formData.email } });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '3rem 0 6rem', background: '#f8fafc' }}>
      <div className="container" style={{ maxWidth: '720px' }}>
        <Link to="/register" className="btn btn-secondary btn-sm" style={{ marginBottom: '1.25rem' }}>
          <FaArrowLeft /> All signup options
        </Link>

        <div
          className="card"
          style={{
            background: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-xl)',
            overflow: 'hidden',
            border: '1px solid var(--border-color)',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '2rem 2.5rem',
              background: `linear-gradient(135deg, ${config.accent} 0%, ${config.accent}dd 100%)`,
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '14px',
                background: 'rgba(255,255,255,0.18)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                flexShrink: 0,
              }}
            >
              <RoleIcon />
            </div>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 900, lineHeight: 1.2 }}>
                Create your {config.label} account
              </h2>
              <p style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                Join SHOP SPHERE in under a minute
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleRegister} style={{ padding: '2rem 2.5rem 2.5rem' }}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="form-control"
                placeholder="e.g. John Doe"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="form-control"
                    style={{ paddingLeft: '2.5rem' }}
                    placeholder="you@example.com"
                  />
                  <FaEnvelope
                    style={{
                      position: 'absolute',
                      left: '0.875rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-light)',
                    }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-control"
                    style={{ paddingLeft: '2.5rem' }}
                    placeholder="+91 98765 43210"
                  />
                  <FaPhone
                    style={{
                      position: 'absolute',
                      left: '0.875rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-light)',
                    }}
                  />
                </div>
              </div>
            </div>

            {isMerchant && (
              <div
                style={{
                  background: config.accentLight,
                  border: `1px solid ${config.accent}33`,
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  margin: '0.5rem 0 1.25rem',
                }}
              >
                <h4 style={{ fontSize: '0.9375rem', fontWeight: 800, color: config.accent, marginBottom: '0.875rem' }}>
                  {role === 'shop' ? 'Shop details' : 'Seller / business details'}
                </h4>

                <div className="form-group">
                  <label className="form-label">Shop / Business Name *</label>
                  <input
                    type="text"
                    name="shopName"
                    required
                    value={formData.shopName}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="e.g. Apex Electronics Co."
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Business Category</label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="e.g. Electronics"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Business Phone</label>
                    <input
                      type="tel"
                      name="businessPhone"
                      value={formData.businessPhone}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                {role === 'shop' && (
                  <div className="form-group">
                    <label className="form-label">Business Email</label>
                    <input
                      type="email"
                      name="businessEmail"
                      value={formData.businessEmail}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="shop@example.com"
                    />
                  </div>
                )}

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Shop Description</label>
                  <textarea
                    name="shopDescription"
                    rows="2"
                    value={formData.shopDescription}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="What will your shop sell?"
                  />
                </div>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">City</label>
                <div style={{ position: 'relative' }}>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="form-control"
                    style={{ paddingLeft: '2.5rem' }}
                  >
                    <option value="">Select a city</option>
                    {cities.map((city) => (
                      <option key={city._id} value={city.name}>
                        {city.name}
                        {city.state ? `, ${city.state}` : ''}
                      </option>
                    ))}
                  </select>
                  <FaMapMarkerAlt
                    style={{
                      position: 'absolute',
                      left: '0.875rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-light)',
                    }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Address / Area</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Street, area or locality"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Password *</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="form-control"
                    style={{ paddingLeft: '2.5rem' }}
                    placeholder="Create a strong password"
                  />
                  <FaLock
                    style={{
                      position: 'absolute',
                      left: '0.875rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-light)',
                    }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Repeat password"
                />
              </div>
            </div>

            <PasswordRequirements password={formData.password} style={{ marginTop: '-0.5rem', marginBottom: '1rem' }} />

            <button
              type="submit"
              disabled={loading}
              className="btn btn-block btn-lg"
              style={{ background: config.accent, color: '#ffffff', marginTop: '0.5rem' }}
            >
              <FaUserPlus />{' '}
              {loading ? 'Creating account...' : `Create ${config.label} account`}
            </button>

            <div style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '1.25rem' }}>
              Already have an account?{' '}
              <Link to={config.loginPath} style={{ color: config.accent, fontWeight: 700 }}>
                Sign in
              </Link>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-light)' }}>
              <FaCheckCircle /> Your data is encrypted and never shared.
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RoleRegister;
