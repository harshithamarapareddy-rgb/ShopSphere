import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaHeart, FaStore, FaEye } from 'react-icons/fa';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';

const ProductCard = ({ product }) => {
  const { user, isAuthenticated } = useAuth();
  const [interestLoading, setInterestLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleInterest = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.info('Please sign in to mark interest.');
      navigate('/login/user');
      return;
    }

    const sellerId = product.seller?._id || product.seller;
    if (sellerId && sellerId === user?._id) {
      toast.warning('This is your own listing.');
      return;
    }

    try {
      setInterestLoading(true);
      const res = await API.post('/interests', { productId: product._id });
      if (res.data.alreadyInterested) {
        toast.info(res.data.message);
      } else {
        toast.success('Interest sent! The seller can now contact you.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not send interest.');
    } finally {
      setInterestLoading(false);
    }
  };

  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0].startsWith('http')
        ? product.images[0]
        : `http://localhost:5000${product.images[0]}`
      : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';

  const conditionColor = {
    'Brand New': 'badge-success',
    'Like New': 'badge-primary',
    'Used - Excellent': 'badge-warning',
    'Used - Good': 'badge-secondary',
    'Used - Fair': 'badge-secondary',
  }[product.condition] || 'badge-primary';

  return (
    <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Product Image & Badges */}
      <Link to={`/products/${product._id}`} style={{ position: 'relative', display: 'block', overflow: 'hidden' }}>
        <img
          src={imageUrl}
          alt={product.name}
          style={{
            width: '100%',
            height: '210px',
            objectFit: 'cover',
            display: 'block',
            transition: 'transform 0.4s ease',
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
          onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
        />
        <div
          style={{
            position: 'absolute',
            top: '0.75rem',
            left: '0.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.375rem',
          }}
        >
          <span className={`badge ${conditionColor}`}>{product.condition}</span>
          {product.isFeatured && (
            <span className="badge badge-warning" style={{ background: '#f59e0b', color: 'white' }}>
              Featured
            </span>
          )}
        </div>

        {product.availabilityStatus !== 'In Stock' && (
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'rgba(15, 23, 42, 0.75)',
              color: 'white',
              fontSize: '0.75rem',
              fontWeight: 700,
              textAlign: 'center',
              padding: '0.25rem',
              textTransform: 'uppercase',
            }}
          >
            {product.availabilityStatus}
          </div>
        )}
      </Link>

      {/* Product Body */}
      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Category & Location */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            marginBottom: '0.375rem',
          }}
        >
          <span style={{ fontWeight: 600, color: 'var(--primary)' }}>
            {product.category?.name || 'General'}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <FaMapMarkerAlt /> {product.city || product.location || 'Online'}
          </span>
        </div>

        {/* Title */}
        <Link to={`/products/${product._id}`}>
          <h3
            style={{
              fontSize: '1rem',
              fontWeight: 700,
              color: 'var(--text-main)',
              lineHeight: 1.35,
              marginBottom: '0.375rem',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: '2.7rem',
            }}
            title={product.name}
          >
            {product.name}
          </h3>
        </Link>

        {/* Description snippet */}
        <p
          style={{
            fontSize: '0.8125rem',
            color: 'var(--text-muted)',
            lineHeight: 1.4,
            marginBottom: '0.75rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {product.description}
        </p>

        {/* Seller Info */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            marginBottom: '0.875rem',
            borderTop: '1px solid var(--border-color)',
            paddingTop: '0.5rem',
          }}
        >
          <FaStore style={{ color: 'var(--text-light)' }} />
          <span>
            {product.seller?.sellerProfile?.shopName || product.seller?.name || 'Classified Seller'}
          </span>
        </div>

        {/* Price & Action */}
        <div
          style={{
            marginTop: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
          }}
        >
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--secondary)' }}>
              ₹{product.price.toLocaleString('en-IN')}
            </div>
            {product.originalPrice > product.price && (
              <div
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-light)',
                  textDecoration: 'line-through',
                }}
              >
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.375rem' }}>
            <Link
              to={`/products/${product._id}`}
              className="btn btn-secondary btn-sm"
              title="View Listing Details"
              style={{ padding: '0.5rem 0.625rem' }}
            >
              <FaEye />
            </Link>
            <button
              onClick={handleInterest}
              className="btn btn-primary btn-sm"
              disabled={interestLoading}
              title="I'm Interested"
              style={{
                opacity: interestLoading ? 0.6 : 1,
                cursor: interestLoading ? 'wait' : 'pointer',
              }}
            >
              <FaHeart />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

