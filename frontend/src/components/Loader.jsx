import React from 'react';

const Loader = ({ fullScreen = false, text = 'Loading content...' }) => {
  const spinner = (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <div
        style={{
          display: 'inline-block',
          width: '40px',
          height: '40px',
          border: '4px solid var(--primary-light)',
          borderTopColor: 'var(--primary)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      {text && (
        <p style={{ marginTop: '0.75rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          {text}
        </p>
      )}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );

  if (fullScreen) {
    return (
      <div
        style={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default Loader;

