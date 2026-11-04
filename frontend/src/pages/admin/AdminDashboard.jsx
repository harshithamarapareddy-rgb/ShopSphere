import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaStore, FaShoppingBag, FaBoxOpen, FaTags, FaMapMarkerAlt } from 'react-icons/fa';
import API from '../../services/api';
import Loader from '../../components/Loader';
import { useToast } from '../../components/Toast';

const formatDateTime = (value) =>
  value ? new Date(value).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'Never';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        const usersResponse = await API.get('/admin/users?limit=100');
        if (usersResponse.data.success) setUsers(usersResponse.data.users);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load admin portal data.');
      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, []);

  if (loading) return <Loader fullScreen text="Loading admin portal..." />;

  return (
    <div style={{ padding: '2.5rem 0 4rem' }}>
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <span className="badge badge-primary">Administrator Portal</span>
          <h1 className="title-lg">Customer accounts</h1>
          <p className="subtitle">Review customer accounts and manage the marketplace.</p>
        </div>

        <div className="stats-grid" style={{ marginBottom: '2rem' }}>
          <div
            className="stat-card"
            style={{
              flexDirection: 'column',
              alignItems: 'stretch',
            }}
          >
            <div className="stat-info">
              <div className="stat-title">Customer accounts</div>
              <div className="stat-value">{users.length}</div>
            </div>

            <section
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                marginBottom: '2rem',
                width: '100%',
              }}
            >
              {[
                ['/admin/users', FaUsers, 'Customers', 'View customer accounts', 'var(--primary)'],
                ['/admin/sellers', FaStore, 'Sellers', 'View seller profiles', 'var(--success)'],
                ['/admin/shops', FaShoppingBag, 'Shops', 'View registered shops', '#7c3aed'],
                ['/admin/products', FaBoxOpen, 'Posted products', 'Review all listings', '#b45309'],
                ['/admin/categories', FaTags, 'Categories', 'Add and manage categories', '#d97706'],
                ['/admin/cities', FaMapMarkerAlt, 'Cities', 'Add and manage cities', '#0284c7'],
              ].map(([path, Icon, title, description, color]) => (
                <Link key={path} to={path} className="card card-hover" style={{ padding: '1.25rem', background: '#fff' }}>
                  <Icon style={{ color, fontSize: '1.5rem', marginBottom: '0.625rem' }} />
                  <div style={{ fontWeight: 700 }}>{title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{description}</div>
                </Link>
              ))}
            </section>
            <div
              className="stat-icon"
              style={{
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                alignSelf: 'flex-end',
              }}
            >
              <FaUsers />
            </div>
          </div>
        </div>

        <section className="card" style={{ padding: '1.25rem', marginBottom: '2rem', background: '#fff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 className="title-md" style={{ margin: 0 }}><FaUsers /> User logins</h2>
            <Link to="/admin/users" className="btn btn-secondary btn-sm">Manage users</Link>
          </div>
          <div className="table-responsive">
            <table className="data-table">
              <thead><tr><th>User</th><th>Email verified</th><th>Last login</th><th>Registered</th></tr></thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td><strong>{user.name}</strong><br /><span style={{ color: 'var(--text-muted)' }}>{user.email}</span></td>
                    <td><span className={`badge ${user.isEmailVerified ? 'badge-success' : 'badge-warning'}`}>{user.isEmailVerified ? 'Verified' : 'Pending'}</span></td>
                    <td>{formatDateTime(user.lastLoginAt)}</td>
                    <td>{formatDateTime(user.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </div>
  );
};

export default AdminDashboard;
