import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaUpload, FaTimes } from 'react-icons/fa';
import API from '../../services/api';
import Loader from '../../components/Loader';
import { useToast } from '../../components/Toast';

const EditProduct = () => {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('Brand New');
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('');
  const [stockQuantity, setStockQuantity] = useState(1);
  const [availabilityStatus, setAvailabilityStatus] = useState('In Stock');
  const [isFeatured, setIsFeatured] = useState(false);

  const [existingImages, setExistingImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catRes, cityRes, prodRes] = await Promise.all([
          API.get('/categories'),
          API.get('/cities?active=true'),
          API.get(`/products/${id}`),
        ]);

        if (catRes.data.success) {
          setCategories(catRes.data.categories);
        }
        if (cityRes.data.success) {
          setCities(cityRes.data.cities);
        }

        if (prodRes.data.success) {
          const p = prodRes.data.product;
          setName(p.name);
          setDescription(p.description);
          setPrice(p.price);
          setOriginalPrice(p.originalPrice || '');
          setCategory(p.category?._id || p.category);
          setCondition(p.condition);
          setLocation(p.location);
          setCity(p.city || (p.location || '').split(',')[0].trim());
          setStockQuantity(p.stockQuantity);
          setAvailabilityStatus(p.availabilityStatus);
          setIsFeatured(p.isFeatured);
          setExistingImages(p.images || []);
        }
      } catch (err) {
        toast.error('Failed to load listing data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    const updated = [...newFiles, ...selected];
    setNewFiles(updated);
    setPreviewUrls(updated.map((f) => URL.createObjectURL(f)));
  };

  const removeExistingImage = (idx) => {
    setExistingImages(existingImages.filter((_, i) => i !== idx));
  };

  const removeNewFile = (idx) => {
    const updated = newFiles.filter((_, i) => i !== idx);
    setNewFiles(updated);
    setPreviewUrls(updated.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('originalPrice', originalPrice || 0);
      formData.append('category', category);
      formData.append('condition', condition);
      formData.append('city', city);
      formData.append('location', location);
      formData.append('stockQuantity', stockQuantity);
      formData.append('availabilityStatus', availabilityStatus);
      formData.append('isFeatured', isFeatured);
      formData.append('existingImages', JSON.stringify(existingImages));

      newFiles.forEach((file) => {
        formData.append('images', file);
      });

      const res = await API.put(`/products/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        toast.success('Listing updated successfully!');
        navigate('/seller/products');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update listing.');
    } finally {
      setSubmitting(false);
    }
  };

  const getFullImageUrl = (img) => {
    if (!img) return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600';
    return img.startsWith('http') ? img : `http://localhost:5000${img}`;
  };

  if (loading) {
    return <Loader fullScreen text="Loading product details..." />;
  }

  return (
    <div style={{ padding: '2.5rem 0 4rem' }}>
      <div className="container" style={{ maxWidth: '820px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <Link to="/seller/products" className="btn btn-secondary btn-sm">
            <FaArrowLeft /> Back
          </Link>
          <h1 className="title-lg" style={{ margin: 0 }}>
            Edit Product Listing
          </h1>
        </div>

        <div className="card" style={{ padding: '2.5rem', background: '#ffffff' }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Product Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea
                required
                rows="5"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-control"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="form-control"
                >
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Condition</label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="form-control"
                >
                  <option value="Brand New">Brand New</option>
                  <option value="Like New">Like New</option>
                  <option value="Used - Excellent">Used - Excellent</option>
                  <option value="Used - Good">Used - Good</option>
                  <option value="Used - Fair">Used - Fair</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Price (₹) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Original Price (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  className="form-control"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">City</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="form-control"
                  required
                >
                  <option value="">Select City</option>
                  {city && !cities.some((c) => c.name === city) && (
                    <option value={city}>{city}</option>
                  )}
                  {cities.map((c) => (
                    <option key={c._id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Stock Quantity</label>
                <input
                  type="number"
                  min="0"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Availability Status</label>
                <select
                  value={availabilityStatus}
                  onChange={(e) => setAvailabilityStatus(e.target.value)}
                  className="form-control"
                >
                  <option value="In Stock">In Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                  <option value="Sold">Sold</option>
                </select>
              </div>
            </div>

            {/* Current Images */}
            <div className="form-group">
              <label className="form-label">Current Images</label>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                {existingImages.map((img, i) => (
                  <div
                    key={i}
                    style={{ position: 'relative', width: '80px', height: '80px', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}
                  >
                    <img src={getFullImageUrl(img)} alt="Current" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(i)}
                      style={{
                        position: 'absolute',
                        top: '2px',
                        right: '2px',
                        background: 'rgba(239, 68, 68, 0.8)',
                        color: 'white',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.625rem',
                      }}
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>

              <label className="form-label" style={{ fontSize: '0.875rem' }}>
                Upload Additional Images
              </label>
              <input type="file" multiple accept="image/*" onChange={handleFileChange} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <input
                type="checkbox"
                id="editIsFeatured"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                style={{ width: '18px', height: '18px' }}
              />
              <label htmlFor="editIsFeatured" style={{ fontWeight: 600, fontSize: '0.9375rem', cursor: 'pointer' }}>
                Mark as Featured Listing
              </label>
            </div>

            <button type="submit" disabled={submitting} className="btn btn-primary btn-block btn-lg">
              <FaSave /> {submitting ? 'Saving Changes...' : 'Save Product Updates'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;

