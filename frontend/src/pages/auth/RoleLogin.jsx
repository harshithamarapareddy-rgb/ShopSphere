import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaArrowLeft, FaCheckCircle, FaSignInAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Toast';
import { ROLE_CONFIG, LOGIN_PORTALS } from './roleConfig';

const RoleLogin = ({ role = 'user' }) => {
  const config = ROLE_CONFIG[role] || ROLE_CONFIG.user;
  const RoleIcon = config.icon;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    if (location.state?.email) setEmail(location.state.email);
  }, [location.state]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      const loggedInUser = await login(email, password, config.key);
      toast.success(`Welcome back, ${loggedInUser.name}!`);
      navigate(config.dashboard, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || `${config.label} login failed. Please check your credentials.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '3.5rem 0 6rem', background: '#f8fafc' }}>
      <div className="container" style={{ maxWidth: '980px' }}>
        <Link
          to="/login"
          className="btn btn-secondary btn-sm"
          style={{ marginBottom: '1.25rem' }}
        >
          <FaArrowLeft /> All login portals
        </Link>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            background: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-xl)',
            overflow: 'hidden',
            border: '1px solid var(--border-color)',
          }}
        >
          {/* Role Info Panel */}
          <div
            style={{
              padding: '2.5rem',
              background: `linear-gradient(160deg, ${config.accent} 0%, ${config.accent}dd 100%)`,
              color: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '2rem',
            }}
          >
            <div>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '14px',
                  background: 'rgba(255,255,255,0.18)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  marginBottom: '1.25rem',
                }}
              >
                <RoleIcon />
              </div>
              <span
                style={{
                  display: 'inline-block',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  background: 'rgba(255,255,255,0.2)',
                  padding: '0.25rem 0.625rem',
                  borderRadius: '9999px',
                  marginBottom: '0.875rem',
                }}
              >
                {config.label} Portal
              </span>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 900, lineHeight: 1.2, marginBottom: '0.75rem' }}>
                {config.title}
              </h2>
              <p style={{ fontSize: '0.9375rem', opacity: 0.9, lineHeight: 1.6 }}>{config.subtitle}</p>
            </div>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {config.perks.map((perk) => (
                <li key={perk} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                  <FaCheckCircle style={{ opacity: 0.9 }} /> {perk}
                </li>
              ))}
            </ul>
          </div>

          {/* Login Form Panel */}
          <div style={{ padding: '2.5rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.375rem', fontWeight: 800, marginBottom: '0.25rem' }}>
                Sign in
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Use your registered {config.label.toLowerCase()} account.
              </p>
            </div>

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label className="form-label">
                  {config.key === 'admin' ? 'Admin Username or Email' : 'Email Address'}
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={config.key === 'admin' ? 'text' : 'email'}
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control"
                    style={{ paddingLeft: '2.5rem' }}
                    placeholder={config.key === 'admin' ? 'admin123 or admin@shopsphere.com' : 'name@example.com'}
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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
                  <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
                  <Link
                    to={`/forgot-password?role=${config.key}`}
                    style={{ fontSize: '0.8125rem', color: config.accent, fontWeight: 700 }}
                  >
                    Forgot password?
                  </Link>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-control"
                    style={{ paddingLeft: '2.5rem' }}
                    placeholder="••••••••"
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

              <button
                type="submit"
                disabled={loading}
                className="btn btn-block btn-lg"
                style={{ background: config.accent, color: '#ffffff', marginTop: '0.5rem' }}
              >
                <FaSignInAlt /> {loading ? 'Authenticating...' : `Sign in as ${config.label}`}
              </button>
            </form>

            {config.signupPath && (
              <div style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '1.25rem' }}>
                New {config.label.toLowerCase()}?{' '}
                <Link to={config.signupPath} style={{ color: config.accent, fontWeight: 700 }}>
                  Create an account
                </Link>
              </div>
            )}

            <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '1.5rem', paddingTop: '1rem' }}>
              <p
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--text-light)',
                  marginBottom: '0.5rem',
                }}
              >
                Other portals
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                {LOGIN_PORTALS.filter((key) => key !== config.key).map((key) => {
                  const portal = ROLE_CONFIG[key];
                  const PortalIcon = portal.icon;
                  return (
                    <Link
                      key={key}
                      to={portal.loginPath}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.75rem' }}
                    >
                      <PortalIcon style={{ color: portal.accent }} /> {portal.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleLogin;
