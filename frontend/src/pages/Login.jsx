import React from 'react';
import { Link } from 'react-router-dom';
import { FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import { ROLE_CONFIG, LOGIN_PORTALS } from './auth/roleConfig';

const Login = () => {
  return (
    <div style={{ padding: '3.5rem 0 6rem', background: '#f8fafc' }}>
      <div className="container" style={{ maxWidth: '1100px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span className="badge badge-primary">SHOP SPHERE Access</span>
          <h1 className="title-xl" style={{ marginTop: '0.75rem' }}>
            Choose your login portal
          </h1>
          <p className="subtitle" style={{ maxWidth: '620px', margin: '0.5rem auto 0' }}>
            Customers, sellers and shops can create a new account in seconds.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {LOGIN_PORTALS.map((key) => {
            const portal = ROLE_CONFIG[key];
            const Icon = portal.icon;
            return (
              <div
                key={key}
                className="card"
                style={{
                  padding: '1.75rem',
                  background: '#ffffff',
                  borderTop: `4px solid ${portal.accent}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.875rem',
                }}
              >
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '14px',
                    background: portal.accentLight,
                    color: portal.accent,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.375rem',
                  }}
                >
                  <Icon />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 800 }}>{portal.label} Login</h3>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.25rem', lineHeight: 1.5 }}>
                    {portal.subtitle}
                  </p>
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <Link
                    to={portal.loginPath}
                    className="btn btn-block"
                    style={{ background: portal.accent, color: '#ffffff' }}
                  >
                    <FaSignInAlt /> Sign in
                  </Link>
                  {portal.signupPath ? (
                    <Link to={portal.signupPath} className="btn btn-secondary btn-block btn-sm">
                      <FaUserPlus /> Create account
                    </Link>
                  ) : (
                    <span
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-light)',
                        textAlign: 'center',
                        padding: '0.375rem',
                      }}
                    >
                      Admin accounts are provisioned by the platform.
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div
          className="card"
          style={{
            marginTop: '2.5rem',
            padding: '1.5rem',
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <h4 style={{ fontWeight: 800 }}>New to SHOP SPHERE?</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Sign up as a customer, seller or shop owner.
            </p>
          </div>
          <Link to="/register" className="btn btn-primary">
            <FaUserPlus /> View signup options
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
