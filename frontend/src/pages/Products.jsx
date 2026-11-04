import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaFilter, FaSearch, FaRedo, FaBoxOpen, FaMapMarkerAlt } from 'react-icons/fa';
import API from '../services/api';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Filter States initialized from URL params
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [condition, setCondition] = useState(searchParams.get('condition') || 'all');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  // Fetch filter options
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const [catRes, cityRes] = await Promise.all([
          API.get('/categories'),
          API.get('/cities?active=true'),
        ]);
        if (catRes.data.success) setCategories(catRes.data.categories);
        if (cityRes.data.success) setCities(cityRes.data.cities);
      } catch (err) {
        console.error('Failed to load filter options:', err);
      }
    };
    fetchFilterOptions();
  }, []);

  // Fetch Products whenever searchParams or page change
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams(searchParams);
        queryParams.set('page', page.toString());
        queryParams.set('limit', '12');

        const res = await API.get(`/products?${queryParams.toString()}`);
        if (res.data.success) {
          setProducts(res.data.products);
          setTotalPages(res.data.totalPages);
          setTotalCount(res.data.total);
        }
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams, page]);

  // Handle Search & Filter Application
  const applyFilters = (e) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) params.set('search', search.trim());
    if (category && category !== 'all') params.set('category', category);
    if (city) params.set('city', city);
    if (condition && condition !== 'all') params.set('condition', condition);
    if (sort) params.set('sort', sort);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    params.set('page', '1');
    setPage(1);
    setSearchParams(params);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearch('');
    setCategory('all');
    setCity('');
    setCondition('all');
    setSort('newest');
    setMinPrice('');
    setMaxPrice('');
    setPage(1);
    setSearchParams({});
  };

  return (
    <div style={{ padding: '2.5rem 0 4rem' }}>
      <div className="container">
        {/* Page Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 className="title-lg">Marketplace Catalog & Classifieds</h1>
          <p className="subtitle">
            Showing {totalCount} verified products {city ? `in ${city}` : 'across all cities and categories'}
          </p>
        </div>

        {/* Filter Bar & Controls */}
        <div
          className="card"
          style={{
            padding: '1.25rem',
            marginBottom: '2rem',
            background: '#ffffff',
          }}
        >
          <form
            onSubmit={applyFilters}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1rem',
              alignItems: 'end',
            }}
          >
            {/* Search Input */}
            <div>
              <label className="form-label">Search Keyword</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Title, model, brand..."
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

            {/* Category Filter */}
            <div>
              <label className="form-label">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-control"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* City Filter */}
            <div>
              <label className="form-label">
                <FaMapMarkerAlt style={{ marginRight: '0.35rem' }} />
                City
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="form-control"
              >
                <option value="">All Cities</option>
                {cities.map((c) => (
                  <option key={c._id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Condition Filter */}
            <div>
              <label className="form-label">Condition</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="form-control"
              >
                <option value="all">Any Condition</option>
                <option value="Brand New">Brand New</option>
                <option value="Like New">Like New</option>
                <option value="Used - Excellent">Used - Excellent</option>
                <option value="Used - Good">Used - Good</option>
                <option value="Used - Fair">Used - Fair</option>
              </select>
            </div>

            {/* Sort Filter */}
            <div>
              <label className="form-label">Sort Order</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="form-control"
              >
                <option value="newest">Recently Added</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="popular">Most Viewed</option>
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="form-label">Price Range (₹)</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="form-control"
                  style={{ width: '50%' }}
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="form-control"
                  style={{ width: '50%' }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ flex: 1, padding: '0.625rem 1rem' }}
              >
                <FaFilter /> Filter
              </button>
              <button
                type="button"
                onClick={resetFilters}
                className="btn btn-secondary"
                title="Reset Filters"
                style={{ padding: '0.625rem' }}
              >
                <FaRedo />
              </button>
            </div>
          </form>
        </div>

        {/* Product Grid Content */}
        {loading ? (
          <Loader text="Loading marketplace listings..." />
        ) : products.length > 0 ? (
          <>
            <div className="product-grid">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginTop: '3rem',
                }}
              >
                <button
                  className="btn btn-secondary btn-sm"
                  disabled={page <= 1}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                >
                  Previous
                </button>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, padding: '0 0.5rem' }}>
                  Page {page} of {totalPages}
                </span>
                <button
                  className="btn btn-secondary btn-sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">
              <FaBoxOpen />
            </div>
            <h3>No Products Found</h3>
            <p>
              We couldn't find any listings matching your current search and filter criteria. Try
              adjusting keywords or clearing filters.
            </p>
            <button className="btn btn-primary" onClick={resetFilters}>
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;

