import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStore, FaSearch, FaBan, FaCheck, FaTrashAlt, FaArrowLeft, FaBoxOpen } from 'react-icons/fa';
import API from '../../services/api';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';
import { useToast } from '../../components/Toast';

const AdminSellers = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const toast = useToast();

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/admin/sellers?search=${encodeURIComponent(search)}`);
      if (res.data.success) {
        setSellers(res.data.sellers);
      }
    } catch (err) {
      toast.error('Failed to load registered merchants.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, [search]);

  const handleToggleBlock = async () => {
    if (!selectedSeller) return;
    try {
      const res = await API.put(`/admin/users/${selectedSeller._id}/toggle-block`);
      if (res.data.success) {
        toast.success(res.data.message);
        setSellers((prev) =>
          prev.map((s) => (s._id === selectedSeller._id ? { ...s, isBlocked: !s.isBlocked } : s))
        );
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update seller status.');
    } finally {
      setModalOpen(false);
      setSelectedSeller(null);
    }
  };

  const handleDeleteSeller = async () => {
    if (!selectedSeller) return;
    try {
      const res = await API.delete(`/admin/users/${selectedSeller._id}`);
      if (res.data.success) {
        toast.success(res.data.message);
        setSellers((prev) => prev.filter((s) => s._id !== selectedSeller._id));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete merchant.');
    } finally {
      setModalOpen(false);
      setSelectedSeller(null);
    }
  };

  const openActionModal = (seller, type) => {
    setSelectedSeller(seller);
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
            Registered Merchants & Sellers ({sellers.length})
          </h1>
        </div>

        {/* Search */}
        <div className="card" style={{ padding: '1rem', marginBottom: '1.5rem', background: '#ffffff' }}>
          <div style={{ position: 'relative', maxWidth: '380px' }}>
            <input
              type="text"
              placeholder="Search by store name, owner or email..."
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
          <Loader text="Loading merchants..." />
        ) : sellers.length > 0 ? (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Shop & Owner</th>
                  <th>Contact</th>
                  <th>Listings</th>
                  <th>Orders Fulfilled</th>
                  <th>Status</th>
                  <th>Registered</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sellers.map((s) => (
                  <tr key={s._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            background: 'var(--success-light)',
                            color: 'var(--success)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '1.125rem',
                          }}
                        >
                          <FaStore />
                        </div>
                        <div>
                          <div style={{ fontWeight: 800 }}>
                            {s.sellerProfile?.shopName || 'Unnamed Shop'}
                          </div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Owner: {s.name} ({s.email})
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>{s.sellerProfile?.businessPhone || s.phone || 'No phone'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {s.sellerProfile?.address || 'Online'}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-primary">{s.productCount || 0} items</span>
                    </td>
                    <td>
                      <span className="badge badge-secondary">{s.ordersCount || 0} orders</span>
                    </td>
                    <td>
                      <span className={`badge ${s.isBlocked ? 'badge-danger' : 'badge-success'}`}>
                        {s.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8125rem' }}>
                      {new Date(s.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.375rem', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => openActionModal(s, 'block')}
                          className={`btn ${s.isBlocked ? 'btn-secondary' : 'btn-outline'} btn-sm`}
                          title={s.isBlocked ? 'Unblock Seller' : 'Block Seller'}
                          style={{
                            color: s.isBlocked ? 'var(--success)' : 'var(--danger)',
                            borderColor: s.isBlocked ? 'var(--success)' : 'var(--danger)',
                          }}
                        >
                          {s.isBlocked ? <FaCheck /> : <FaBan />}
                          {s.isBlocked ? ' Unblock' : ' Block'}
                        </button>
                        <button
                          onClick={() => openActionModal(s, 'delete')}
                          className="btn btn-danger btn-sm"
                          title="Delete Merchant & Listings"
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
            <p style={{ color: 'var(--text-muted)' }}>No seller accounts found matching search.</p>
          </div>
        )}

        {/* Modal */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={actionType === 'block' ? handleToggleBlock : handleDeleteSeller}
          title={actionType === 'block' ? `${selectedSeller?.isBlocked ? 'Unblock' : 'Block'} Seller` : 'Delete Merchant'}
          message={
            actionType === 'block'
              ? `Are you sure you want to ${selectedSeller?.isBlocked ? 'unblock' : 'block'} seller "${selectedSeller?.sellerProfile?.shopName || selectedSeller?.name}"?`
              : `Are you sure you want to delete seller "${selectedSeller?.sellerProfile?.shopName || selectedSeller?.name}" and all their associated product listings?`
          }
          confirmText={actionType === 'block' ? (selectedSeller?.isBlocked ? 'Unblock' : 'Block') : 'Delete'}
          confirmBtnStyle={actionType === 'block' ? (selectedSeller?.isBlocked ? 'btn-primary' : 'btn-danger') : 'btn-danger'}
        />
      </div>
    </div>
  );
};

export default AdminSellers;

