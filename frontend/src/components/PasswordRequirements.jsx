import React from 'react';
import { getPasswordChecks } from '../utils/passwordPolicy';

const PasswordRequirements = ({ password = '', style }) => {
  const checks = getPasswordChecks(password);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '0.25rem 0.75rem',
        marginTop: '0.5rem',
        fontSize: '0.725rem',
        lineHeight: 1.5,
        ...style,
      }}
    >
      {checks.map((check) => (
        <span
          key={check.label}
          style={{ color: check.met ? 'var(--success)' : 'var(--text-light)', fontWeight: check.met ? 600 : 500 }}
        >
          {check.met ? '✓' : '○'} {check.label}
        </span>
      ))}
    </div>
  );
};

export default PasswordRequirements;
