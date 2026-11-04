import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrashAlt, FaEye, FaBoxOpen, FaSearch } from 'react-icons/fa';
import API from '../../services/api';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';
import { useToast } from '../../components/Toast';

const SellerProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const toast = useToast();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await API.get('/products/seller/me');
      if (res.data.success) {
        setProducts(res.data.products);
      }
    } catch (err) {
      console.error('Failed to load seller listings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const confirmDelete = (prod) => {
    setProductToDelete(prod);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    try {
      const res = await API.delete(`/products/${productToDelete._id}`);
      if (res.data.success) {
        toast.success(`"${productToDelete.name}" was successfully deleted.`);
        setProducts((prev) => prev.filter((p) => p._id !== productToDelete._id));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete listing.');
    } finally {
      setDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  const getFullImageUrl = (img) => {
    if (!img) return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600';
    return img.startsWith('http') ? img : `http://localhost:5000${img}`;
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.name?.toLowerCase().includes(search.toLowerCase())
  );

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
          <div>
            <h1 className="title-lg">My Listed Products & Ads</h1>
            <p className="subtitle">
              Manage your inventory, pricing, availability, and active classified ads
            </p>
          </div>
          <Link to="/seller/add-product" className="btn btn-primary">
            <FaPlus /> Add New Listing
          </Link>
        </div>

        {/* Search Bar */}
        <div className="card" style={{ padding: '1rem', marginBottom: '1.5rem', background: '#ffffff' }}>
          <div style={{ position: 'relative', maxWidth: '380px' }}>
            <input
              type="text"
              placeholder="Search your listed products..."
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

        {/* Products Table */}
        {loading ? (
          <Loader text="Loading your inventory..." />
        ) : filteredProducts.length > 0 ? (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Condition</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Date Added</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((prod) => (
                  <tr key={prod._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img
                          src={getFullImageUrl(prod.images?.[0])}
                          alt={prod.name}
                          style={{
                            width: '46px',
                            height: '46px',
                            objectFit: 'cover',
                            borderRadius: 'var(--radius-sm)',
                          }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, maxWidth: '220px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {prod.name}
                          </div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {prod.city ? `${prod.city} • ${prod.location}` : prod.location}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>{prod.category?.name || 'General'}</td>
                    <td style={{ fontWeight: 700 }}>₹{prod.price.toLocaleString('en-IN')}</td>
                    <td>
                      <span className="badge badge-secondary">{prod.condition}</span>
                    </td>
                    <td>{prod.stockQuantity} units</td>
                    <td>
                      <span
                        className={`badge ${
                          prod.availabilityStatus === 'In Stock'
                            ? 'badge-success'
                            : 'badge-danger'
                        }`}
                      >
                        {prod.availabilityStatus}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8125rem' }}>
                      {new Date(prod.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.375rem', justifyContent: 'flex-end' }}>
                        <Link
                          to={`/products/${prod._id}`}
                          className="btn btn-secondary btn-sm"
                          title="View Live Listing"
                          style={{ padding: '0.375rem 0.5rem' }}
                        >
                          <FaEye />
                        </Link>
                        <Link
                          to={`/seller/edit-product/${prod._id}`}
                          className="btn btn-outline btn-sm"
                          title="Edit Listing"
                          style={{ padding: '0.375rem 0.5rem' }}
                        >
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() => confirmDelete(prod)}
                          className="btn btn-danger btn-sm"
                          title="Delete Listing"
                          style={{ padding: '0.375rem 0.5rem' }}
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
          <div className="empty-state">
            <div className="empty-state-icon">
              <FaBoxOpen />
            </div>
            <h3>No Products Listed Yet</h3>
            <p>You haven't posted any products or classified listings under your seller account.</p>
            <Link to="/seller/add-product" className="btn btn-primary">
              <FaPlus /> Post Your First Listing
            </Link>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleDelete}
          title="Delete Product Listing"
          message={`Are you sure you want to permanently remove "${productToDelete?.name}"? This action cannot be undone.`}
          confirmText="Delete Listing"
          confirmBtnStyle="btn-danger"
        />
      </div>
    </div>
  );
};

export default SellerProducts;

