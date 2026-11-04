import React from 'react';
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa';

const Modal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  confirmBtnStyle = 'btn-danger',
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(3px)',
        zIndex: 9998,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          width: '100%',
          maxWidth: '480px',
          boxShadow: 'var(--shadow-xl)',
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-color)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <FaExclamationTriangle style={{ color: 'var(--accent)', fontSize: '1.25rem' }} />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>{title}</h3>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-light)', fontSize: '1rem' }}>
            <FaTimes />
          </button>
        </div>

        <div style={{ padding: '1.5rem' }}>
          {children ? (
            children
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
              {message}
            </p>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '0.75rem',
            padding: '1rem 1.5rem',
            background: 'var(--bg-main)',
            borderTop: '1px solid var(--border-color)',
          }}
        >
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          {onConfirm && (
            <button className={`btn ${confirmBtnStyle}`} onClick={onConfirm}>
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;

