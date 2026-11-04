import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaShoppingBag,
  FaSearch,
  FaBan,
  FaCheck,
  FaTrashAlt,
  FaArrowLeft,
} from 'react-icons/fa';
import API from '../../services/api';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';
import { useToast } from '../../components/Toast';

const AdminShops = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedShop, setSelectedShop] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const toast = useToast();

  const fetchShops = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/admin/shops?search=${encodeURIComponent(search)}`);
      if (res.data.success) {
        setShops(res.data.shops);
      }
    } catch (err) {
      toast.error('Failed to load registered shops.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, [search]);

  const handleToggleBlock = async () => {
    if (!selectedShop) return;
    try {
      const res = await API.put(`/admin/users/${selectedShop._id}/toggle-block`);
      if (res.data.success) {
        toast.success(res.data.message);
        setShops((prev) =>
          prev.map((s) => (s._id === selectedShop._id ? { ...s, isBlocked: !s.isBlocked } : s))
        );
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update shop status.');
    } finally {
      setModalOpen(false);
      setSelectedShop(null);
    }
  };

  const handleDeleteShop = async () => {
    if (!selectedShop) return;
    try {
      const res = await API.delete(`/admin/users/${selectedShop._id}`);
      if (res.data.success) {
        toast.success(res.data.message);
        setShops((prev) => prev.filter((s) => s._id !== selectedShop._id));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete shop.');
    } finally {
      setModalOpen(false);
      setSelectedShop(null);
    }
  };

  const openActionModal = (shop, type) => {
    setSelectedShop(shop);
    setActionType(type);
    setModalOpen(true);
  };

  return (
    <div style={{ padding: '2.5rem 0 4rem' }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <Link to="/admin" className="btn btn-secondary btn-sm">
            <FaArrowLeft /> Dashboard
          </Link>
          <h1 className="title-lg" style={{ margin: 0 }}>
            Registered Shops ({shops.length})
          </h1>
        </div>

        <div className="card" style={{ padding: '1rem', marginBottom: '1.5rem', background: '#ffffff' }}>
          <div style={{ position: 'relative', maxWidth: '380px' }}>
            <input
              type="text"
              placeholder="Search by shop name, owner, city or email..."
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
          <Loader text="Loading shops..." />
        ) : shops.length > 0 ? (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Shop & Owner</th>
                  <th>City / Category</th>
                  <th>Contact</th>
                  <th>Listings</th>
                  <th>Status</th>
                  <th>Registered</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {shops.map((s) => (
                  <tr key={s._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            background: '#f5f3ff',
                            color: '#7c3aed',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.125rem',
                          }}
                        >
                          <FaShoppingBag />
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
                      <div>{s.sellerProfile?.city || 'No city'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {s.sellerProfile?.category || 'General'}
                      </div>
                    </td>
                    <td>
                      <div>{s.sellerProfile?.businessPhone || s.phone || 'No phone'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {s.sellerProfile?.businessEmail || s.email}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-primary">{s.productCount || 0} items</span>
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
                          title={s.isBlocked ? 'Unblock Shop' : 'Block Shop'}
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
                          title="Delete Shop & Listings"
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
            <p style={{ color: 'var(--text-muted)' }}>No shop accounts found matching search.</p>
          </div>
        )}

        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={actionType === 'block' ? handleToggleBlock : handleDeleteShop}
          title={actionType === 'block' ? `${selectedShop?.isBlocked ? 'Unblock' : 'Block'} Shop` : 'Delete Shop'}
          message={
            actionType === 'block'
              ? `Are you sure you want to ${selectedShop?.isBlocked ? 'unblock' : 'block'} shop "${selectedShop?.sellerProfile?.shopName || selectedShop?.name}"?`
              : `Are you sure you want to delete shop "${selectedShop?.sellerProfile?.shopName || selectedShop?.name}" and all associated listings?`
          }
          confirmText={actionType === 'block' ? (selectedShop?.isBlocked ? 'Unblock' : 'Block') : 'Delete'}
          confirmBtnStyle={actionType === 'block' ? (selectedShop?.isBlocked ? 'btn-primary' : 'btn-danger') : 'btn-danger'}
        />
      </div>
    </div>
  );
};

export default AdminShops;
