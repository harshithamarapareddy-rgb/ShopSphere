import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaLaptop, FaMobileAlt, FaCouch, FaTshirt, FaCar, FaBook, FaFutbol, FaHome, FaBox } from 'react-icons/fa';
import API from '../services/api';
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

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        setLoading(true);
        const res = await API.get('/categories');
        if (res.data.success) {
          setCategories(res.data.categories);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCats();
  }, []);

  return (
    <div style={{ padding: '3rem 0 5rem' }}>
      <div className="container">
        <div style={{ maxWidth: '640px', marginBottom: '2.5rem' }}>
          <h1 className="title-lg">Explore Categories</h1>
          <p className="subtitle">
            Browse through classified items and products organized by specialized departments.
          </p>
        </div>

        {loading ? (
          <Loader text="Loading product categories..." />
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/products?category=${cat._id}`}
                className="card card-hover"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  background: '#ffffff',
                }}
              >
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    style={{ width: '100%', height: '160px', objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    style={{
                      height: '120px',
                      background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '3rem',
                    }}
                  >
                    {iconMap[cat.icon] || <FaBox />}
                  </div>
                )}

                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {cat.name}
                    </h3>
                    <span className="badge badge-primary">{cat.productCount || 0} listings</span>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                    {cat.description || 'Discover a vast array of high-quality items in this category.'}
                  </p>
                  <span
                    style={{
                      marginTop: 'auto',
                      color: 'var(--primary)',
                      fontSize: '0.875rem',
                      fontWeight: 700,
                    }}
                  >
                    Explore Items →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;

