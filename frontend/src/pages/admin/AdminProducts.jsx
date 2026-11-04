import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBoxOpen, FaSearch, FaStar, FaTrashAlt, FaArrowLeft, FaEye } from 'react-icons/fa';
import API from '../../services/api';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';
import { useToast } from '../../components/Toast';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const toast = useToast();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/products?limit=50&search=${encodeURIComponent(search)}`);
      if (res.data.success) {
        setProducts(res.data.products);
      }
    } catch (err) {
      toast.error('Failed to load platform listings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search]);

  const handleToggleFeatured = async (product) => {
    try {
      const res = await API.put(`/admin/products/${product._id}/toggle-featured`);
      if (res.data.success) {
        toast.success(res.data.message);
        setProducts((prev) =>
          prev.map((p) => (p._id === product._id ? { ...p, isFeatured: !p.isFeatured } : p))
        );
      }
    } catch (err) {
      toast.error('Failed to update featured flag.');
    }
  };

  const confirmDelete = (prod) => {
    setProductToDelete(prod);
    setDeleteModalOpen(true);
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    try {
      const res = await API.delete(`/products/${productToDelete._id}`);
      if (res.data.success) {
        toast.success('Listing permanently removed from SHOP SPHERE.');
        setProducts((prev) => prev.filter((p) => p._id !== productToDelete._id));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove listing.');
    } finally {
      setDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  const getFullImageUrl = (img) => {
    if (!img) return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600';
    return img.startsWith('http') ? img : `http://localhost:5000${img}`;
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
            Marketplace Listings & Moderation ({products.length})
          </h1>
        </div>

        {/* Search */}
        <div className="card" style={{ padding: '1rem', marginBottom: '1.5rem', background: '#ffffff' }}>
          <div style={{ position: 'relative', maxWidth: '380px' }}>
            <input
              type="text"
              placeholder="Search listings by title..."
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

        {/* Table */}
        {loading ? (
          <Loader text="Loading marketplace listings..." />
        ) : products.length > 0 ? (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product Listing</th>
                  <th>Category</th>
                  <th>Seller</th>
                  <th>Price</th>
                  <th>Condition</th>
                  <th>Featured</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img
                          src={getFullImageUrl(p.images?.[0])}
                          alt={p.name}
                          style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '8px' }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, maxWidth: '240px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {p.name}
                          </div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {p.city ? `${p.city} • ${p.location}` : p.location}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>{p.category?.name || 'General'}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{p.seller?.sellerProfile?.shopName || p.seller?.name}</div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.seller?.email}</span>
                    </td>
                    <td style={{ fontWeight: 700 }}>₹{p.price.toLocaleString('en-IN')}</td>
                    <td>
                      <span className="badge badge-secondary">{p.condition}</span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleToggleFeatured(p)}
                        className={`btn btn-sm ${p.isFeatured ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                        title="Toggle Featured"
                      >
                        <FaStar /> {p.isFeatured ? 'Featured' : 'Standard'}
                      </button>
                    </td>
                    <td>
                      <span className={`badge ${p.availabilityStatus === 'In Stock' ? 'badge-success' : 'badge-danger'}`}>
                        {p.availabilityStatus}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.375rem', justifyContent: 'flex-end' }}>
                        <Link to={`/products/${p._id}`} className="btn btn-secondary btn-sm" title="View Listing">
                          <FaEye />
                        </Link>
                        <button
                          onClick={() => confirmDelete(p)}
                          className="btn btn-danger btn-sm"
                          title="Delete Listing"
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
            <p style={{ color: 'var(--text-muted)' }}>No products found matching criteria.</p>
          </div>
        )}

        <Modal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleDeleteProduct}
          title="Administrative Delete Listing"
          message={`Are you sure you want to permanently delete "${productToDelete?.name}"? It will be removed from marketplace catalog immediately.`}
          confirmText="Delete Listing"
          confirmBtnStyle="btn-danger"
        />
      </div>
    </div>
  );
};

export default AdminProducts;

