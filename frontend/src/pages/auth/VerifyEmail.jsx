import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaCheckCircle, FaEnvelope } from 'react-icons/fa';
import API from '../../services/api';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [state, setState] = useState({ loading: true, success: false, message: '' });

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setState({ loading: false, success: false, message: 'This verification link is missing its security token.' });
      return;
    }

    API.get(`/auth/verify-email/${encodeURIComponent(token)}`)
      .then((res) => setState({ loading: false, success: true, message: res.data.message }))
      .catch((err) =>
        setState({
          loading: false,
          success: false,
          message: err.response?.data?.message || 'This verification link is invalid or has expired.',
        })
      );
  }, [searchParams]);

  return (
    <div style={{ padding: '5rem 0', background: '#f8fafc' }}>
      <div className="container" style={{ maxWidth: '560px' }}>
        <div className="card" style={{ padding: '2.5rem', textAlign: 'center', background: '#fff' }}>
          {state.loading ? (
            <>
              <FaEnvelope style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '1rem' }} />
              <h1 className="title-lg">Verifying your email...</h1>
            </>
          ) : (
            <>
              <FaCheckCircle
                style={{ fontSize: '2.5rem', color: state.success ? 'var(--success)' : 'var(--danger)', marginBottom: '1rem' }}
              />
              <h1 className="title-lg">{state.success ? 'Email verified' : 'Verification failed'}</h1>
              <p style={{ color: 'var(--text-muted)', margin: '0.75rem 0 1.5rem' }}>{state.message}</p>
              <Link to="/login/user" className="btn btn-primary">Go to sign in</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
