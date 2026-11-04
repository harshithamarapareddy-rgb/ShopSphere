import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaSearch,
  FaArrowRight,
  FaLaptop,
  FaMobileAlt,
  FaCouch,
  FaTshirt,
  FaCar,
  FaBook,
  FaFutbol,
  FaHome,
  FaShieldAlt,
  FaTag,
  FaStore,
  FaCheckCircle,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import API from '../services/api';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

const iconMap = {
  FaLaptop: <FaLaptop />,
  FaMobileAlt: <FaMobileAlt />,
  FaCouch: <FaCouch />,
  FaTshirt: <FaTshirt />,
  FaCar: <FaCar />,
  FaBook: <FaBook />,
  FaFutbol: <FaFutbol />,
  FaHome: <FaHome />,
};

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [catsRes, citiesRes, featRes, recRes] = await Promise.all([
          API.get('/categories'),
          API.get('/cities?active=true'),
          API.get('/products/featured'),
          API.get('/products/recent'),
        ]);

        if (catsRes.data.success) setCategories(catsRes.data.categories);
        if (citiesRes.data.success) setCities(citiesRes.data.cities);
        if (featRes.data.success) setFeaturedProducts(featRes.data.products);
        if (recRes.data.success) setRecentProducts(recRes.data.products);
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.append('search', searchQuery.trim());
    if (selectedCategory) params.append('category', selectedCategory);
    if (selectedCity) params.append('city', selectedCity);
    navigate(`/products?${params.toString()}`);
  };

  return (
    <div>
      {/* 1. HERO SECTION */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #1d4ed8 100%)',
          color: 'white',
          padding: '4.5rem 0 5rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(37, 99, 235, 0.25)',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                color: '#38bdf8',
                padding: '0.375rem 1rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8125rem',
                fontWeight: 700,
                marginBottom: '1.25rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              <FaTag /> Complete MERN Classifieds & Shopping Platform
            </span>

            <h1
              style={{
                fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                marginBottom: '1.25rem',
              }}
            >
              Discover, Buy & Sell Everything on{' '}
              <span
                style={{
                  background: 'linear-gradient(to right, #60a5fa, #38bdf8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                SHOP SPHERE
              </span>
            </h1>

            <p
              style={{
                fontSize: '1.125rem',
                color: '#cbd5e1',
                lineHeight: 1.6,
                marginBottom: '2.5rem',
                maxWidth: '680px',
                margin: '0 auto 2.5rem',
              }}
            >
              The premier online marketplace for certified electronics, modern home furniture,
              vehicles, designer fashion, and everyday essentials.
            </p>

            {/* Hero Search Box */}
            <form
              onSubmit={handleHeroSearch}
              style={{
                background: '#ffffff',
                padding: '0.5rem',
                borderRadius: 'var(--radius-lg)',
                boxShadow: '0 20px 35px rgba(0,0,0,0.3)',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  flex: '1.5',
                  minWidth: '200px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.5rem 0.75rem',
                }}
              >
                <FaSearch style={{ color: 'var(--text-light)', fontSize: '1.125rem' }} />
                <input
                  type="text"
                  placeholder="What are you looking for today? (e.g. MacBook, Chair, Bike)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    border: 'none',
                    outline: 'none',
                    fontSize: '0.9375rem',
                    color: 'var(--text-main)',
                  }}
                />
              </div>

              <div
                style={{
                  flex: '1',
                  minWidth: '160px',
                  borderLeft: '1px solid var(--border-color)',
                  padding: '0.25rem 0.75rem',
                }}
              >
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={{
                    width: '100%',
                    border: 'none',
                    outline: 'none',
                    fontSize: '0.875rem',
                    color: 'var(--text-main)',
                    background: 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div
                style={{
                  flex: '1',
                  minWidth: '150px',
                  borderLeft: '1px solid var(--border-color)',
                  padding: '0.25rem 0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <FaMapMarkerAlt style={{ color: 'var(--text-light)', flexShrink: 0 }} />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  style={{
                    width: '100%',
                    border: 'none',
                    outline: 'none',
                    fontSize: '0.875rem',
                    color: 'var(--text-main)',
                    background: 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  <option value="">All Cities</option>
                  {cities.map((c) => (
                    <option key={c._id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ padding: '0.75rem 1.75rem', borderRadius: 'var(--radius-md)' }}
              >
                Search Listings
              </button>
            </form>

            {/* Quick Badges / Trust Markers */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '1.75rem',
                marginTop: '2.5rem',
                fontSize: '0.875rem',
                color: '#94a3b8',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <FaCheckCircle style={{ color: '#34d399' }} /> Verified Sellers & Buyers
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <FaShieldAlt style={{ color: '#38bdf8' }} /> Encrypted Checkout
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <FaStore style={{ color: '#fbbf24' }} /> Free Seller Onboarding
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. POPULAR CATEGORIES */}
      <section style={{ padding: '4rem 0 3rem', background: '#ffffff' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: '2rem',
            }}
          >
            <div>
              <span
                style={{
                  color: 'var(--primary)',
                  fontWeight: 700,
                  fontSize: '0.8125rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Browse Catalog
              </span>
              <h2 className="title-lg" style={{ marginTop: '0.25rem' }}>
                Popular Categories
              </h2>
            </div>
            <Link
              to="/categories"
              className="btn btn-outline btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}
            >
              View All <FaArrowRight />
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '1rem',
            }}
          >
            {categories.slice(0, 8).map((cat) => (
              <Link
                key={cat._id}
                to={`/products?category=${cat._id}`}
                className="card card-hover"
                style={{
                  padding: '1.25rem 0.75rem',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.75rem',
                  borderRadius: 'var(--radius-lg)',
                }}
              >
                <div
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '50%',
                    background: 'var(--primary-light)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                  }}
                >
                  {iconMap[cat.icon] || <FaLaptop />}
                </div>
                <div>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {cat.name}
                  </h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                    {cat.productCount || 0} items
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS */}
      <section style={{ padding: '3rem 0 4rem', background: 'var(--bg-main)' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: '2rem',
            }}
          >
            <div>
              <span
                style={{
                  color: 'var(--primary)',
                  fontWeight: 700,
                  fontSize: '0.8125rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Handpicked Deals
              </span>
              <h2 className="title-lg" style={{ marginTop: '0.25rem' }}>
                Featured Listings
              </h2>
            </div>
            <Link
              to="/products?featured=true"
              className="btn btn-outline btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}
            >
              See More <FaArrowRight />
            </Link>
          </div>

          {loading ? (
            <Loader text="Loading featured listings..." />
          ) : featuredProducts.length > 0 ? (
            <div className="product-grid">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>No featured products currently available.</p>
          )}
        </div>
      </section>

      {/* 4. SELLER CALLOUT BANNER */}
      <section
        style={{
          background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)',
          color: 'white',
          padding: '3.5rem 0',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '2rem',
            }}
          >
            <div style={{ maxWidth: '620px' }}>
              <span
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  padding: '0.25rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Grow Your Business With Us
              </span>
              <h2
                style={{
                  fontSize: 'clamp(1.75rem, 3.5vw, 2.35rem)',
                  fontWeight: 800,
                  marginTop: '0.75rem',
                  marginBottom: '0.75rem',
                }}
              >
                Have Items to Sell or Advertise?
              </h2>
              <p style={{ fontSize: '1rem', color: '#e0e7ff', lineHeight: 1.6 }}>
                Join thousands of merchants, local business owners, and verified individual sellers.
                Set up your seller profile, list classifieds with multi-image uploads, and reach customers nationwide.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link
                to="/register"
                className="btn btn-secondary"
                style={{
                  background: '#ffffff',
                  color: 'var(--primary)',
                  fontWeight: 700,
                  padding: '0.875rem 1.75rem',
                }}
              >
                Start Selling Today
              </Link>
              <Link
                to="/about"
                className="btn btn-outline"
                style={{
                  borderColor: '#ffffff',
                  color: '#ffffff',
                  fontWeight: 700,
                  padding: '0.875rem 1.75rem',
                }}
              >
                Learn How It Works
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. RECENTLY ADDED PRODUCTS */}
      <section style={{ padding: '4rem 0 5rem', background: '#ffffff' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: '2rem',
            }}
          >
            <div>
              <span
                style={{
                  color: 'var(--primary)',
                  fontWeight: 700,
                  fontSize: '0.8125rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Just Landed
              </span>
              <h2 className="title-lg" style={{ marginTop: '0.25rem' }}>
                Recently Added Products
              </h2>
            </div>
            <Link
              to="/products?sort=newest"
              className="btn btn-outline btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}
            >
              View Catalog <FaArrowRight />
            </Link>
          </div>

          {loading ? (
            <Loader text="Loading recent listings..." />
          ) : recentProducts.length > 0 ? (
            <div className="product-grid">
              {recentProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>No products listed yet.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;

