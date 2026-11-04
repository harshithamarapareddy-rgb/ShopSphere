import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserPlus, FaSignInAlt, FaCheckCircle } from 'react-icons/fa';
import { ROLE_CONFIG } from './auth/roleConfig';

const SIGNUP_ROLES = ['user', 'seller', 'shop'];

const Register = () => {
  return (
    <div style={{ padding: '3.5rem 0 6rem', background: '#f8fafc' }}>
      <div className="container" style={{ maxWidth: '1080px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span className="badge badge-success">Create an Account</span>
          <h1 className="title-xl" style={{ marginTop: '0.75rem' }}>
            Sign up for SHOP SPHERE
          </h1>
          <p className="subtitle" style={{ maxWidth: '620px', margin: '0.5rem auto 0' }}>
            Pick the account type that fits you best. Each signup has its own dedicated form.
            Administrator accounts are created by the platform team.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {SIGNUP_ROLES.map((key) => {
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
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 800 }}>
                    Register as {portal.label}
                  </h3>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.25rem', lineHeight: 1.5 }}>
                    {portal.subtitle}
                  </p>
                </div>

                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                  {portal.perks.map((perk) => (
                    <li key={perk} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                      <FaCheckCircle style={{ color: portal.accent }} /> {perk}
                    </li>
                  ))}
                </ul>

                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <Link
                    to={portal.signupPath}
                    className="btn btn-block"
                    style={{ background: portal.accent, color: '#ffffff' }}
                  >
                    <FaUserPlus /> Create {portal.label} account
                  </Link>
                  <Link to={portal.loginPath} className="btn btn-secondary btn-block btn-sm">
                    <FaSignInAlt /> Already registered? Sign in
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Register;
