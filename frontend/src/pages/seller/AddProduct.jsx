import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUpload, FaArrowLeft, FaPlus, FaTimes, FaImage } from 'react-icons/fa';
import API from '../../services/api';
import { useToast } from '../../components/Toast';

const AddProduct = () => {
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
  const [directImageUrl, setDirectImageUrl] = useState('');

  // Image file uploads
  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFormOptions = async () => {
      try {
        const [catRes, cityRes] = await Promise.all([
          API.get('/categories'),
          API.get('/cities?active=true'),
        ]);

        if (catRes.data.success && catRes.data.categories.length > 0) {
          setCategories(catRes.data.categories);
          setCategory(catRes.data.categories[0]._id);
        }
        if (cityRes.data.success && cityRes.data.cities.length > 0) {
          setCities(cityRes.data.cities);
          setCity(cityRes.data.cities[0].name);
        }
      } catch (err) {
        console.error('Failed to load form options:', err);
      }
    };
    fetchFormOptions();
  }, []);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length + files.length > 5) {
      toast.warning('Maximum 5 images allowed per listing.');
      return;
    }
    const newFiles = [...files, ...selectedFiles];
    setFiles(newFiles);

    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls(newPreviews);
  };

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = previewUrls.filter((_, i) => i !== index);
    setFiles(newFiles);
    setPreviewUrls(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !description || !price || !category || !city) {
      toast.error('Please fill in all mandatory fields.');
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      if (originalPrice) formData.append('originalPrice', originalPrice);
      formData.append('category', category);
      formData.append('condition', condition);
      formData.append('city', city);
      formData.append('location', location || city);
      formData.append('stockQuantity', stockQuantity);
      formData.append('availabilityStatus', availabilityStatus);
      formData.append('isFeatured', isFeatured);

      // Append files for Multer
      files.forEach((file) => {
        formData.append('images', file);
      });

      // Or fallback URL
      if (directImageUrl.trim()) {
        formData.append('imageUrls', directImageUrl.trim());
      }

      const res = await API.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        toast.success('Product listing created successfully!');
        navigate('/seller/products');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create product listing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2.5rem 0 4rem' }}>
      <div className="container" style={{ maxWidth: '820px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <Link to="/seller/products" className="btn btn-secondary btn-sm">
            <FaArrowLeft /> Back to Listings
          </Link>
          <h1 className="title-lg" style={{ margin: 0 }}>
            Post New Product or Classified
          </h1>
        </div>

        <div className="card" style={{ padding: '2.5rem', background: '#ffffff' }}>
          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div className="form-group">
              <label className="form-label">Product Name / Title *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-control"
                placeholder="e.g. Sony WH-1000XM5 Wireless Headphones"
              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">Full Description *</label>
              <textarea
                required
                rows="5"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-control"
                placeholder="Provide comprehensive details about condition, included accessories, specifications, and warranty..."
              />
            </div>

            {/* Category & Condition */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="form-control"
                  required
                >
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Condition *</label>
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

            {/* Pricing */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Selling Price (₹) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="form-control"
                  placeholder="24999"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Original / Retail Price (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  className="form-control"
                  placeholder="Optional original MRP"
                />
              </div>
            </div>

            {/* City, Location & Stock */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">City *</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="form-control"
                  required
                >
                  <option value="">Select City</option>
                  {cities.map((c) => (
                    <option key={c._id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Item Location *</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="form-control"
                  placeholder="e.g. Indiranagar, Bengaluru"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Quantity in Stock</label>
                <input
                  type="number"
                  min="0"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Status</label>
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

            {/* Image Upload Box */}
            <div className="form-group">
              <label className="form-label">Upload Product Images (Multer Pipeline)</label>
              <div
                style={{
                  border: '2px dashed var(--border-color)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.75rem',
                  textAlign: 'center',
                  background: '#f8fafc',
                  marginBottom: '1rem',
                  cursor: 'pointer',
                }}
                onClick={() => document.getElementById('productImageUpload').click()}
              >
                <FaUpload style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '0.5rem' }} />
                <p style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--text-main)' }}>
                  Click to choose image files (PNG, JPG, WEBP)
                </p>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Max 5 images up to 5MB each
                </span>
                <input
                  id="productImageUpload"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </div>

              {/* Previews */}
              {previewUrls.length > 0 && (
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  {previewUrls.map((url, i) => (
                    <div
                      key={i}
                      style={{
                        position: 'relative',
                        width: '80px',
                        height: '80px',
                        borderRadius: 'var(--radius-md)',
                        overflow: 'hidden',
                      }}
                    >
                      <img src={url} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        style={{
                          position: 'absolute',
                          top: '2px',
                          right: '2px',
                          background: 'rgba(0,0,0,0.6)',
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
              )}

              {/* Or Direct Image Web URL */}
              <div>
                <label className="form-label" style={{ fontSize: '0.8125rem' }}>
                  Or Direct Image Web URL (Optional)
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="url"
                    value={directImageUrl}
                    onChange={(e) => setDirectImageUrl(e.target.value)}
                    className="form-control"
                    placeholder="https://images.unsplash.com/..."
                    style={{ paddingLeft: '2.2rem' }}
                  />
                  <FaImage
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
            </div>

            {/* Featured toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <input
                type="checkbox"
                id="isFeatured"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                style={{ width: '18px', height: '18px' }}
              />
              <label htmlFor="isFeatured" style={{ fontWeight: 600, fontSize: '0.9375rem', cursor: 'pointer' }}>
                Mark this listing as Featured on Homepage
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-block btn-lg"
            >
              <FaPlus /> {loading ? 'Publishing Listing...' : 'Publish Listing to Marketplace'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;

