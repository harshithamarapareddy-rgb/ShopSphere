import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FaArrowLeft, FaCheckCircle, FaKey, FaLock, FaShieldAlt } from 'react-icons/fa';
import API from '../../services/api';
import { useToast } from '../../components/Toast';
import PasswordRequirements from '../../components/PasswordRequirements';
import { isStrongPassword, PASSWORD_MESSAGE } from '../../utils/passwordPolicy';
import { ROLE_CONFIG } from './roleConfig';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();

  const token = searchParams.get('token') || '';
  const role = searchParams.get('role') || 'user';
  const config = ROLE_CONFIG[role] || ROLE_CONFIG.user;

  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isStrongPassword(formData.password)) {
      toast.error(PASSWORD_MESSAGE);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      const res = await API.post(`/auth/reset-password/${encodeURIComponent(token)}`, {
        password: formData.password,
      });
      setSuccess(true);
      toast.success('Password reset successfully.');
      setTimeout(() => navigate(res.data.loginPath || config.loginPath, { replace: true }), 1600);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to reset your password. Please request a new link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '3.5rem 0 6rem', background: '#f8fafc' }}>
      <div className="container" style={{ maxWidth: '560px' }}>
        <Link
          to={config.loginPath}
          className="btn btn-secondary btn-sm"
          style={{ marginBottom: '1.25rem' }}
        >
          <FaArrowLeft /> Back to sign in
        </Link>

        <div
          className="card"
          style={{
            padding: '2.25rem',
            background: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-xl)',
            borderTop: `4px solid ${config.accent}`,
          }}
        >
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '14px',
              background: config.accentLight,
              color: config.accent,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.375rem',
              marginBottom: '1rem',
            }}
          >
            <FaKey />
          </div>

          <h1 className="title-lg" style={{ marginBottom: '0.5rem' }}>Create a new password</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Choose a strong password for your {config.label.toLowerCase()} account. The reset link can only be used once.
          </p>

          {!token ? (
            <div>
              <div
                style={{
                  padding: '1rem',
                  background: 'var(--danger-light)',
                  border: '1px solid #fecaca',
                  borderRadius: 'var(--radius-md)',
                  color: '#991b1b',
                  fontSize: '0.875rem',
                  lineHeight: 1.6,
                  marginBottom: '1.25rem',
                }}
              >
                This reset link is missing its security token. Please request a new password reset email.
              </div>
              <Link to={`/forgot-password?role=${config.key}`} className="btn btn-primary btn-block">
                Request a new reset link
              </Link>
            </div>
          ) : success ? (
            <div>
              <div
                style={{
                  display: 'flex',
                  gap: '0.75rem',
                  padding: '1rem',
                  background: 'var(--success-light)',
                  border: '1px solid #a7f3d0',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1.25rem',
                }}
              >
                <FaCheckCircle style={{ color: 'var(--success)', flexShrink: 0, marginTop: '0.15rem' }} />
                <div style={{ fontSize: '0.875rem', color: '#065f46', lineHeight: 1.6 }}>
                  Your password has been updated. Redirecting you to sign in...
                </div>
              </div>
              <Link to={config.loginPath} className="btn btn-primary btn-block">
                Sign in now
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">New Password</label>
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
                <PasswordRequirements password={formData.password} />
              </div>

              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Repeat your new password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-block btn-lg"
                style={{ background: config.accent, color: '#ffffff', marginTop: '0.5rem' }}
              >
                <FaShieldAlt /> {loading ? 'Updating password...' : 'Reset password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
