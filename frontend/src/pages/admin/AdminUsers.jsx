import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaSearch, FaBan, FaCheck, FaTrashAlt, FaArrowLeft } from 'react-icons/fa';
import API from '../../services/api';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';
import { useToast } from '../../components/Toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionType, setActionType] = useState(null); // 'block' | 'delete'
  const [modalOpen, setModalOpen] = useState(false);

  const toast = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/admin/users?search=${encodeURIComponent(search)}`);
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (err) {
      toast.error('Failed to load user accounts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const handleToggleBlock = async () => {
    if (!selectedUser) return;
    try {
      const res = await API.put(`/admin/users/${selectedUser._id}/toggle-block`);
      if (res.data.success) {
        toast.success(res.data.message);
        setUsers((prev) =>
          prev.map((u) => (u._id === selectedUser._id ? { ...u, isBlocked: !u.isBlocked } : u))
        );
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update user block status.');
    } finally {
      setModalOpen(false);
      setSelectedUser(null);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      const res = await API.delete(`/admin/users/${selectedUser._id}`);
      if (res.data.success) {
        toast.success(res.data.message);
        setUsers((prev) => prev.filter((u) => u._id !== selectedUser._id));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user.');
    } finally {
      setModalOpen(false);
      setSelectedUser(null);
    }
  };

  const openActionModal = (u, type) => {
    setSelectedUser(u);
    setActionType(type);
    setModalOpen(true);
  };

  return (
    <div style={{ padding: '2.5rem 0 4rem' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <Link to="/admin" className="btn btn-secondary btn-sm">
            <FaArrowLeft /> Dashboard
          </Link>
          <h1 className="title-lg" style={{ margin: 0 }}>
            Customer Accounts ({users.length})
          </h1>
        </div>

        {/* Search */}
        <div className="card" style={{ padding: '1rem', marginBottom: '1.5rem', background: '#ffffff' }}>
          <div style={{ position: 'relative', maxWidth: '380px' }}>
            <input
              type="text"
              placeholder="Search user by name, email or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '2.2rem' }}
            />
            <FaSearch
              style={{
                position: 'absolute',
                left: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-light)',
              }}
            />
          </div>
        </div>

        {loading ? (
          <Loader text="Loading customer accounts..." />
        ) : users.length > 0 ? (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Contact</th>
                  <th>Status</th>
                  <th>Registered date & time</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '50%',
                            background: 'var(--primary-light)',
                            color: 'var(--primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                          }}
                        >
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700 }}>{u.name}</div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>{u.phone || 'No phone'}</td>
                    <td>
                      <span className={`badge ${u.isBlocked ? 'badge-danger' : 'badge-success'}`}>
                        {u.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8125rem' }}>
                      {new Date(u.createdAt).toLocaleString('en-IN', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.375rem', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => openActionModal(u, 'block')}
                          className={`btn ${u.isBlocked ? 'btn-secondary' : 'btn-outline'} btn-sm`}
                          title={u.isBlocked ? 'Unblock Account' : 'Block Account'}
                          style={{
                            color: u.isBlocked ? 'var(--success)' : 'var(--danger)',
                            borderColor: u.isBlocked ? 'var(--success)' : 'var(--danger)',
                          }}
                        >
                          {u.isBlocked ? <FaCheck /> : <FaBan />}
                          {u.isBlocked ? ' Unblock' : ' Block'}
                        </button>
                        <button
                          onClick={() => openActionModal(u, 'delete')}
                          className="btn btn-danger btn-sm"
                          title="Delete Account"
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="card" style={{ padding: '3rem', textAlign: 'center', background: '#ffffff' }}>
            <p style={{ color: 'var(--text-muted)' }}>No customer accounts found matching search.</p>
          </div>
        )}

        {/* Modal */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={actionType === 'block' ? handleToggleBlock : handleDeleteUser}
          title={actionType === 'block' ? `${selectedUser?.isBlocked ? 'Unblock' : 'Block'} Account` : 'Delete Account'}
          message={
            actionType === 'block'
              ? `Are you sure you want to ${selectedUser?.isBlocked ? 'unblock' : 'suspend'} access for ${selectedUser?.name}?`
              : `Are you sure you want to permanently delete account ${selectedUser?.name} (${selectedUser?.email})?`
          }
          confirmText={actionType === 'block' ? (selectedUser?.isBlocked ? 'Unblock' : 'Block') : 'Delete'}
          confirmBtnStyle={actionType === 'block' ? (selectedUser?.isBlocked ? 'btn-primary' : 'btn-danger') : 'btn-danger'}
        />
      </div>
    </div>
  );
};

export default AdminUsers;
