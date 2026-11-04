import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FaMapMarkerAlt,
  FaStore,
  FaCalendarAlt,
  FaHeart,
  FaEye,
  FaCheckCircle,
  FaPhoneAlt,
  FaEnvelope,
  FaStar,
  FaArrowRight,
} from 'react-icons/fa';
import API from '../services/api';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [interest, setInterest] = useState(null);
  const [interestMessage, setInterestMessage] = useState('');
  const [interestPhone, setInterestPhone] = useState('');
  const [submittingInterest, setSubmittingInterest] = useState(false);
  const [loading, setLoading] = useState(true);

  const { user, isAuthenticated } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/products/${id}`);
        if (res.data.success) {
          setProduct(res.data.product);
          setRelatedProducts(res.data.relatedProducts || []);
          if (res.data.product.images && res.data.product.images.length > 0) {
            setSelectedImage(res.data.product.images[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  useEffect(() => {
    const checkInterest = async () => {
      if (!isAuthenticated || !id) {
        setInterest(null);
        return;
      }

      try {
        const res = await API.get(`/interests/check/${id}`);
        if (res.data.success) {
          setInterest(res.data.interest);
        }
      } catch (err) {
        setInterest(null);
      }
    };

    checkInterest();
  }, [id, isAuthenticated]);

  useEffect(() => {
    if (user?.phone) setInterestPhone((current) => current || user.phone);
  }, [user]);

  const handleInterestSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.info('Please sign in to mark interest.');
      navigate('/login/user', { state: { from: { pathname: `/products/${id}` } } });
      return;
    }

    try {
      setSubmittingInterest(true);
      const res = await API.post('/interests', {
        productId: product._id,
        message: interestMessage,
        phone: interestPhone,
      });

      if (res.data.success) {
        setInterest(res.data.interest);
        if (res.data.alreadyInterested) {
          toast.info(res.data.message);
        } else {
          toast.success(res.data.message);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not send interest.');
    } finally {
      setSubmittingInterest(false);
    }
  };

  const isOwner =
    product &&
    user &&
    (product.seller?._id === user._id || product.seller === user._id);

  if (loading) {
    return <Loader fullScreen text="Loading listing information..." />;
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
        <h2>Listing Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
          This product might have been removed by the seller or administrator.
        </p>
        <Link to="/products" className="btn btn-primary">
          Back to Marketplace
        </Link>
      </div>
    );
  }

  const getFullImageUrl = (img) => {
    if (!img) return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600';
    return img.startsWith('http') ? img : `http://localhost:5000${img}`;
  };

  const discountPercent =
    product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  return (
    <div style={{ padding: '2.5rem 0 5rem' }}>
      <div className="container">
        {/* Breadcrumb Navigation */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem',
            color: 'var(--text-muted)',
            marginBottom: '1.75rem',
          }}
        >
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/products">Products</Link>
          <span>/</span>
          <Link to={`/products?category=${product.category?._id}`}>{product.category?.name}</Link>
          <span>/</span>
          <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{product.name}</span>
        </nav>

        {/* Product Details Section */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
            marginBottom: '4rem',
          }}
        >
          {/* Left Column: Images */}
          <div>
            <div
              className="card"
              style={{
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                background: '#ffffff',
                marginBottom: '1rem',
              }}
            >
              <img
                src={getFullImageUrl(selectedImage || product.images?.[0])}
                alt={product.name}
                style={{
                  width: '100%',
                  height: '420px',
                  objectFit: 'contain',
                  background: '#f8fafc',
                  display: 'block',
                }}
              />
            </div>

            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', padding: '0.25rem 0' }}>
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    style={{
                      width: '74px',
                      height: '74px',
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      border:
                        selectedImage === img
                          ? '2px solid var(--primary)'
                          : '1px solid var(--border-color)',
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={getFullImageUrl(img)}
                      alt={`Thumbnail ${idx + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Information & Actions */}
          <div>
            {/* Category, Condition, and Views */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '0.75rem',
                flexWrap: 'wrap',
              }}
            >
              <span className="badge badge-primary">{product.category?.name || 'Classified'}</span>
              <span className="badge badge-success">{product.condition}</span>
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontSize: '0.8125rem',
                  color: 'var(--text-light)',
                  marginLeft: 'auto',
                }}
              >
                <FaEye /> {product.views} views
              </span>
            </div>

            {/* Title */}
            <h1
              style={{
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                fontWeight: 800,
                color: 'var(--secondary)',
                lineHeight: 1.25,
                marginBottom: '1rem',
              }}
            >
              {product.name}
            </h1>

            {/* Price Box */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                marginBottom: '1.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
                <span style={{ fontSize: '2.25rem', fontWeight: 900, color: 'var(--primary)' }}>
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice > product.price && (
                  <>
                    <span
                      style={{
                        fontSize: '1.125rem',
                        color: 'var(--text-light)',
                        textDecoration: 'line-through',
                      }}
                    >
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="badge badge-danger">Save {discountPercent}%</span>
                  </>
                )}
              </div>

              {/* Status and Location */}
              <div
                style={{
                  display: 'flex',
                  gap: '1.5rem',
                  fontSize: '0.875rem',
                  marginTop: '0.75rem',
                  color: 'var(--text-muted)',
                  flexWrap: 'wrap',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <FaMapMarkerAlt style={{ color: 'var(--primary)' }} />{' '}
                  {product.city ? `${product.city} • ${product.location}` : product.location}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <FaCalendarAlt style={{ color: 'var(--primary)' }} /> Listed{' '}
                  {new Date(product.createdAt).toLocaleDateString()}
                </span>
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    fontWeight: 700,
                    color: product.availabilityStatus === 'In Stock' ? 'var(--success)' : 'var(--danger)',
                  }}
                >
                  <FaCheckCircle /> {product.availabilityStatus} ({product.stockQuantity} available)
                </span>
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: '1.75rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                Listing Description
              </h3>
              <p
                style={{
                  color: 'var(--text-muted)',
                  lineHeight: 1.7,
                  fontSize: '0.9375rem',
                  whiteSpace: 'pre-line',
                }}
              >
                {product.description}
              </p>
            </div>

            {/* Interest Control */}
            {isOwner ? (
              <div
                className="card"
                style={{
                  padding: '1.25rem',
                  marginBottom: '2rem',
                  background: '#f8fafc',
                  border: '1px solid var(--border-color)',
                }}
              >
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.375rem' }}>
                  You own this listing
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  Buyers who mark interest will appear in your seller leads page.
                </p>
                <Link to="/seller/interests" className="btn btn-primary">
                  View Interested Buyers <FaArrowRight />
                </Link>
              </div>
            ) : interest ? (
              <div
                className="card"
                style={{
                  padding: '1.25rem',
                  marginBottom: '2rem',
                  background: 'var(--success-light)',
                  border: '1px solid var(--success)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <FaHeart style={{ color: 'var(--success)' }} />
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--success)' }}>
                    Interest {interest.status}
                  </h3>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  Sent {new Date(interest.createdAt).toLocaleDateString()}. The seller can see your
                  contact details and will reach out if this listing matches.
                </p>
                <Link to="/dashboard/interests" className="btn btn-secondary btn-sm">
                  View My Interests
                </Link>
              </div>
            ) : (
              <form
                onSubmit={handleInterestSubmit}
                className="card"
                style={{
                  padding: '1.25rem',
                  marginBottom: '2rem',
                  background: '#f8fafc',
                  border: '1px solid var(--border-color)',
                }}
              >
                <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.375rem' }}>
                  Interested in this listing?
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  Mark your interest and the seller will contact you directly. No online payment or
                  order is placed.
                </p>

                {isAuthenticated ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '1rem' }}>
                    <div>
                      <label className="form-label">Message to Seller (Optional)</label>
                      <textarea
                        rows="3"
                        maxLength="600"
                        value={interestMessage}
                        onChange={(e) => setInterestMessage(e.target.value)}
                        className="form-control"
                        placeholder="Ask about availability, price, condition, or pickup..."
                      />
                    </div>
                    <div>
                      <label className="form-label">Contact Phone</label>
                      <input
                        type="tel"
                        value={interestPhone}
                        onChange={(e) => setInterestPhone(e.target.value)}
                        className="form-control"
                        placeholder="Number the seller can call or message"
                      />
                    </div>
                  </div>
                ) : (
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    Sign in to share your contact details with the seller.
                  </p>
                )}

                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={submittingInterest}
                  style={{ width: '100%' }}
                >
                  <FaHeart />{' '}
                  {submittingInterest
                    ? 'Sending Interest...'
                    : isAuthenticated
                    ? "I'm Interested"
                    : 'Sign In to Mark Interest'}
                </button>
              </form>
            )}

            {/* Verified Seller Profile Card */}
            <div
              className="card"
              style={{
                padding: '1.25rem',
                background: '#ffffff',
                border: '1px solid var(--border-color)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '0.875rem' }}>
                <div
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: 'var(--primary-light)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                  }}
                >
                  <FaStore />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>
                    {product.seller?.sellerProfile?.shopName || product.seller?.name || 'Verified Merchant'}
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', color: '#f59e0b' }}>
                    <FaStar /> <FaStar /> <FaStar /> <FaStar /> <FaStar />
                    <span style={{ color: 'var(--text-muted)', marginLeft: '0.25rem' }}>
                      (5.0 Rating • Verified Partner)
                    </span>
                  </div>
                </div>
              </div>

              {product.seller?.sellerProfile?.shopDescription && (
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '0.875rem' }}>
                  {product.seller?.sellerProfile?.shopDescription}
                </p>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                {product.seller?.sellerProfile?.businessPhone && (
                  <a
                    href={`tel:${product.seller.sellerProfile.businessPhone}`}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'inherit' }}
                  >
                    <FaPhoneAlt style={{ color: 'var(--primary)' }} /> {product.seller.sellerProfile.businessPhone}
                  </a>
                )}
                {product.seller?.email && (
                  <a
                    href={`mailto:${product.seller.email}`}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'inherit' }}
                  >
                    <FaEnvelope style={{ color: 'var(--primary)' }} /> {product.seller.email}
                  </a>
                )}
                {product.seller?.sellerProfile?.address && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <FaMapMarkerAlt style={{ color: 'var(--primary)' }} /> {product.seller.sellerProfile.address}
                  </span>
                )}
                {(product.seller?.sellerProfile?.city || product.seller?.phone) && (
                  <span style={{ color: 'var(--text-muted)' }}>
                    {product.seller.sellerProfile.city || ''}
                    {product.seller.sellerProfile.city && product.seller.phone ? ' • ' : ''}
                    {product.seller.phone ? `Seller phone: ${product.seller.phone}` : ''}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {product.seller?.sellerProfile?.businessPhone && (
                  <a href={`tel:${product.seller.sellerProfile.businessPhone}`} className="btn btn-primary btn-sm">
                    <FaPhoneAlt /> Call seller
                  </a>
                )}
                {product.seller?.email && (
                  <a href={`mailto:${product.seller.email}`} className="btn btn-secondary btn-sm">
                    <FaEnvelope /> Email seller
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="title-md" style={{ marginBottom: '1.5rem' }}>
              More from this Category
            </h2>
            <div className="product-grid">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
