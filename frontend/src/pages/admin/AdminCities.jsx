import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaPlus, FaEdit, FaTrashAlt, FaArrowLeft } from 'react-icons/fa';
import API from '../../services/api';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';
import { useToast } from '../../components/Toast';

const AdminCities = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingCity, setEditingCity] = useState(null);
  const [name, setName] = useState('');
  const [state, setState] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [cityToDelete, setCityToDelete] = useState(null);

  const toast = useToast();

  const fetchCities = async () => {
    try {
      setLoading(true);
      const res = await API.get('/cities');
      if (res.data.success) {
        setCities(res.data.cities);
      }
    } catch (err) {
      toast.error('Failed to load cities.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  const openAddModal = () => {
    setEditingCity(null);
    setName('');
    setState('');
    setIsActive(true);
    setFormModalOpen(true);
  };

  const openEditModal = (city) => {
    setEditingCity(city);
    setName(city.name);
    setState(city.state || '');
    setIsActive(city.isActive !== false);
    setFormModalOpen(true);
  };

  const handleSaveCity = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('City name is required.');
      return;
    }

    try {
      setSaving(true);
      if (editingCity) {
        const res = await API.put(`/cities/${editingCity._id}`, { name, state, isActive });
        if (res.data.success) {
          toast.success('City updated successfully!');
          fetchCities();
          setFormModalOpen(false);
        }
      } else {
        const res = await API.post('/cities', { name, state, isActive });
        if (res.data.success) {
          toast.success('New city added successfully!');
          fetchCities();
          setFormModalOpen(false);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save city.');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (city) => {
    setCityToDelete(city);
    setDeleteModalOpen(true);
  };

  const handleDeleteCity = async () => {
    if (!cityToDelete) return;
    try {
      const res = await API.delete(`/cities/${cityToDelete._id}`);
      if (res.data.success) {
        toast.success('City deleted successfully!');
        setCities((prev) => prev.filter((c) => c._id !== cityToDelete._id));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not delete city.');
    } finally {
      setDeleteModalOpen(false);
      setCityToDelete(null);
    }
  };

  return (
    <div style={{ padding: '2.5rem 0 4rem' }}>
      <div className="container">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link to="/admin" className="btn btn-secondary btn-sm">
              <FaArrowLeft /> Dashboard
            </Link>
            <h1 className="title-lg" style={{ margin: 0 }}>
              Service Cities ({cities.length})
            </h1>
          </div>

          <button onClick={openAddModal} className="btn btn-primary">
            <FaPlus /> Add New City
          </button>
        </div>

        {loading ? (
          <Loader text="Loading cities..." />
        ) : cities.length > 0 ? (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>City</th>
                  <th>State</th>
                  <th>Status</th>
                  <th>Added</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cities.map((city) => (
                  <tr key={city._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '8px',
                            background: 'var(--primary-light)',
                            color: 'var(--primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <FaMapMarkerAlt />
                        </div>
                        <span style={{ fontWeight: 700 }}>{city.name}</span>
                      </div>
                    </td>
                    <td>{city.state || '—'}</td>
                    <td>
                      <span className={`badge ${city.isActive ? 'badge-success' : 'badge-secondary'}`}>
                        {city.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8125rem' }}>
                      {new Date(city.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.375rem', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => openEditModal(city)}
                          className="btn btn-outline btn-sm"
                          title="Edit City"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => confirmDelete(city)}
                          className="btn btn-danger btn-sm"
                          title="Delete City"
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
            <p style={{ color: 'var(--text-muted)' }}>No cities configured yet.</p>
          </div>
        )}

        <Modal
          isOpen={formModalOpen}
          onClose={() => setFormModalOpen(false)}
          title={editingCity ? 'Edit City' : 'Add New City'}
          confirmText={saving ? 'Saving...' : editingCity ? 'Save Changes' : 'Add City'}
          confirmBtnStyle="btn-primary"
          onConfirm={handleSaveCity}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">City Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-control"
                placeholder="e.g. Bengaluru"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">State / Province</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="form-control"
                placeholder="e.g. Karnataka"
              />
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
              Accepting new registrations in this city
            </label>
          </div>
        </Modal>

        <Modal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleDeleteCity}
          title="Delete City"
          message={`Are you sure you want to delete city "${cityToDelete?.name}"?`}
          confirmText="Delete City"
          confirmBtnStyle="btn-danger"
        />
      </div>
    </div>
  );
};

export default AdminCities;
