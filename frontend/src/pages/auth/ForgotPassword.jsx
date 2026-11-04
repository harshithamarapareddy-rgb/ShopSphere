import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaArrowLeft, FaCheckCircle, FaEnvelope, FaPaperPlane } from 'react-icons/fa';
import API from '../../services/api';
import { useToast } from '../../components/Toast';
import { ROLE_CONFIG } from './roleConfig';

const ForgotPassword = () => {
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'user';
  const config = ROLE_CONFIG[role] || ROLE_CONFIG.user;

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await API.post('/auth/forgot-password', { email });
      setResult(res.data);
      toast.success('Password reset request submitted.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to send the reset link. Please try again.');
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
          <FaArrowLeft /> Back to {config.label.toLowerCase()} login
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
            <FaEnvelope />
          </div>

          <h1 className="title-lg" style={{ marginBottom: '0.5rem' }}>Forgot your password?</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Enter the email address registered with your SHOP SPHERE {config.label.toLowerCase()} account.
            We will send you a secure link to create a new password.
          </p>

          {result ? (
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
                  {result.message}
                </div>
              </div>

              {result.devResetUrl && !result.emailSent && (
                <div
                  style={{
                    padding: '1rem',
                    background: '#f8fafc',
                    border: '1px dashed var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '1.25rem',
                    fontSize: '0.8125rem',
                    color: 'var(--text-muted)',
                    lineHeight: 1.6,
                  }}
                >
                  <strong style={{ color: 'var(--text-main)' }}>Local development shortcut:</strong>{' '}
                  email delivery is not configured, so you can open the reset link directly.
                  <div style={{ marginTop: '0.75rem' }}>
                    <a
                      href={result.devResetUrl}
                      className="btn btn-primary btn-sm"
                      style={{ wordBreak: 'break-all' }}
                    >
                      Open reset password link
                    </a>
                  </div>
                  {result.previewUrl && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <a href={result.previewUrl} target="_blank" rel="noreferrer" style={{ color: config.accent, fontWeight: 700 }}>
                        Preview the email
                      </a>
                    </div>
                  )}
                </div>
              )}

              <Link to={config.loginPath} className="btn btn-secondary btn-block">
                Return to sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control"
                    style={{ paddingLeft: '2.5rem' }}
                    placeholder="name@example.com"
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

              <button
                type="submit"
                disabled={loading}
                className="btn btn-block btn-lg"
                style={{ background: config.accent, color: '#ffffff', marginTop: '0.5rem' }}
              >
                <FaPaperPlane /> {loading ? 'Sending reset link...' : 'Send reset link'}
              </button>
            </form>
          )}

          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '1.25rem' }}>
            Remembered your password?{' '}
            <Link to={config.loginPath} style={{ color: config.accent, fontWeight: 700 }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
