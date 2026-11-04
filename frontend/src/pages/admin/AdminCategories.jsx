import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTags, FaPlus, FaEdit, FaTrashAlt, FaArrowLeft, FaBox } from 'react-icons/fa';
import API from '../../services/api';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';
import { useToast } from '../../components/Toast';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State for Add / Edit
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('FaLaptop');
  const [image, setImage] = useState('');
  const [saving, setSaving] = useState(false);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const toast = useToast();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await API.get('/categories');
      if (res.data.success) {
        setCategories(res.data.categories);
      }
    } catch (err) {
      toast.error('Failed to load categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setIcon('FaLaptop');
    setImage('');
    setFormModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description || '');
    setIcon(cat.icon || 'FaBox');
    setImage(cat.image || '');
    setFormModalOpen(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Category name is required.');
      return;
    }

    try {
      setSaving(true);
      if (editingCategory) {
        const res = await API.put(`/categories/${editingCategory._id}`, {
          name,
          description,
          icon,
          image,
        });
        if (res.data.success) {
          toast.success('Category updated successfully!');
          fetchCategories();
          setFormModalOpen(false);
        }
      } else {
        const res = await API.post('/categories', {
          name,
          description,
          icon,
          image,
        });
        if (res.data.success) {
          toast.success('New category added successfully!');
          fetchCategories();
          setFormModalOpen(false);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save category.');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (cat) => {
    setCategoryToDelete(cat);
    setDeleteModalOpen(true);
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;
    try {
      const res = await API.delete(`/categories/${categoryToDelete._id}`);
      if (res.data.success) {
        toast.success('Category deleted successfully!');
        setCategories((prev) => prev.filter((c) => c._id !== categoryToDelete._id));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not delete category.');
    } finally {
      setDeleteModalOpen(false);
      setCategoryToDelete(null);
    }
  };

  return (
    <div style={{ padding: '2.5rem 0 4rem' }}>
      <div className="container">
        {/* Header */}
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
              Platform Categories ({categories.length})
            </h1>
          </div>

          <button onClick={openAddModal} className="btn btn-primary">
            <FaPlus /> Add New Category
          </button>
        </div>

        {/* Categories Table */}
        {loading ? (
          <Loader text="Loading categories..." />
        ) : categories.length > 0 ? (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Category Name</th>
                  <th>Slug</th>
                  <th>Description</th>
                  <th>Active Listings</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {cat.image ? (
                          <img
                            src={cat.image}
                            alt={cat.name}
                            style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }}
                          />
                        ) : (
                          <div
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '8px',
                              background: 'var(--primary-light)',
                              color: 'var(--primary)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <FaBox />
                          </div>
                        )}
                        <div>
                          <span style={{ fontWeight: 700 }}>{cat.name}</span>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>{cat.slug}</td>
                    <td style={{ fontSize: '0.875rem', maxWidth: '320px' }}>
                      {cat.description || 'No description provided'}
                    </td>
                    <td>
                      <span className="badge badge-primary">{cat.productCount || 0} items</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.375rem', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => openEditModal(cat)}
                          className="btn btn-outline btn-sm"
                          title="Edit Category"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => confirmDelete(cat)}
                          className="btn btn-danger btn-sm"
                          title="Delete Category"
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
            <p style={{ color: 'var(--text-muted)' }}>No categories configured yet.</p>
          </div>
        )}

        {/* Add/Edit Modal */}
        <Modal
          isOpen={formModalOpen}
          onClose={() => setFormModalOpen(false)}
          title={editingCategory ? 'Edit Category' : 'Create New Category'}
          confirmText={editingCategory ? 'Save Changes' : 'Create Category'}
          confirmBtnStyle="btn-primary"
          onConfirm={handleSaveCategory}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Category Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-control"
                placeholder="e.g. Smart Home & IoT"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Description</label>
              <textarea
                rows="2"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-control"
                placeholder="Brief summary of items in this category"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Banner Image URL</label>
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="form-control"
                placeholder="https://images.unsplash.com/..."
              />
            </div>
          </div>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleDeleteCategory}
          title="Delete Category"
          message={`Are you sure you want to delete category "${categoryToDelete?.name}"? You can only delete categories that have 0 products assigned.`}
          confirmText="Delete Category"
          confirmBtnStyle="btn-danger"
        />
      </div>
    </div>
  );
};

export default AdminCategories;

