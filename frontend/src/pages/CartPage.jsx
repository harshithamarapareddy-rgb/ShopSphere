import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrashAlt, FaShoppingCart, FaArrowRight, FaShieldAlt, FaTruck } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useToast } from '../components/Toast';

const CartPage = () => {
  const { cartItems, totalItems, subtotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const toast = useToast();
  const navigate = useNavigate();

  const shippingPrice = subtotal >= 999 || subtotal === 0 ? 0 : 99;
  const taxPrice = Number((0.05 * subtotal).toFixed(2));
  const grandTotal = Number((subtotal + shippingPrice + taxPrice).toFixed(2));

  const handleRemove = (productId, name) => {
    removeFromCart(productId);
    toast.info(`Removed "${name}" from cart`);
  };

  const getFullImageUrl = (img) => {
    if (!img) return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600';
    return img.startsWith('http') ? img : `http://localhost:5000${img}`;
  };

  return (
    <div style={{ padding: '3rem 0 5rem' }}>
      <div className="container">
        <h1 className="title-lg" style={{ marginBottom: '0.5rem' }}>
          Your Shopping Cart
        </h1>
        <p className="subtitle" style={{ marginBottom: '2.5rem' }}>
          {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
        </p>

        {cartItems.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2.5rem',
              alignItems: 'start',
            }}
          >
            {/* Cart Items List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: '0.75rem',
                  borderBottom: '1px solid var(--border-color)',
                }}
              >
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  Product Details
                </span>
                <button
                  onClick={clearCart}
                  style={{ color: 'var(--danger)', fontSize: '0.8125rem', fontWeight: 600 }}
                >
                  Clear Entire Cart
                </button>
              </div>

              {cartItems.map((item) => {
                const product = item.product || {};
                const productId = product._id || item.product;
                const itemTotal = (product.price || item.price) * item.quantity;

                return (
                  <div
                    key={productId}
                    className="card"
                    style={{
                      padding: '1.25rem',
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '1.25rem',
                      alignItems: 'center',
                      background: '#ffffff',
                    }}
                  >
                    {/* Thumbnail */}
                    <Link to={`/products/${productId}`}>
                      <img
                        src={getFullImageUrl(product.images?.[0])}
                        alt={product.name}
                        style={{
                          width: '90px',
                          height: '90px',
                          objectFit: 'cover',
                          borderRadius: 'var(--radius-md)',
                        }}
                      />
                    </Link>

                    {/* Info */}
                    <div style={{ flex: '1.5', minWidth: '180px' }}>
                      <Link to={`/products/${productId}`}>
                        <h4
                          style={{
                            fontSize: '1rem',
                            fontWeight: 700,
                            color: 'var(--text-main)',
                            marginBottom: '0.25rem',
                          }}
                        >
                          {product.name}
                        </h4>
                      </Link>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                        Unit Price: ₹{(product.price || item.price).toLocaleString('en-IN')}
                      </div>
                      <span className="badge badge-secondary">{product.condition || 'Brand New'}</span>
                    </div>

                    {/* Quantity Selector */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        border: '1.5px solid var(--border-color)',
                        borderRadius: 'var(--radius-md)',
                      }}
                    >
                      <button
                        onClick={() => updateQuantity(productId, item.quantity - 1)}
                        style={{ padding: '0.375rem 0.75rem', fontWeight: 700 }}
                      >
                        -
                      </button>
                      <span
                        style={{
                          padding: '0 0.5rem',
                          fontWeight: 700,
                          fontSize: '0.875rem',
                          minWidth: '32px',
                          textAlign: 'center',
                        }}
                      >
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(productId, item.quantity + 1)}
                        style={{ padding: '0.375rem 0.75rem', fontWeight: 700 }}
                      >
                        +
                      </button>
                    </div>

                    {/* Total & Remove */}
                    <div style={{ textAlign: 'right', minWidth: '90px' }}>
                      <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--secondary)' }}>
                        ₹{itemTotal.toLocaleString('en-IN')}
                      </div>
                      <button
                        onClick={() => handleRemove(productId, product.name)}
                        style={{
                          color: 'var(--danger)',
                          fontSize: '0.8125rem',
                          marginTop: '0.25rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                        }}
                      >
                        <FaTrashAlt /> Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary Card */}
            <div
              className="card"
              style={{
                padding: '1.75rem',
                background: '#ffffff',
                border: '1px solid var(--border-color)',
                position: 'sticky',
                top: '90px',
              }}
            >
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.25rem' }}>
                Order Summary
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '1.5rem', fontSize: '0.9375rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
                  <span style={{ fontWeight: 600 }}>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Estimated Shipping</span>
                  <span style={{ fontWeight: 600 }}>
                    {shippingPrice === 0 ? (
                      <span style={{ color: 'var(--success)' }}>FREE</span>
                    ) : (
                      `₹${shippingPrice}`
                    )}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Estimated GST (5%)</span>
                  <span style={{ fontWeight: 600 }}>₹{taxPrice.toLocaleString('en-IN')}</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    borderTop: '1px solid var(--border-color)',
                    paddingTop: '1rem',
                    fontSize: '1.25rem',
                    fontWeight: 800,
                  }}
                >
                  <span>Grand Total</span>
                  <span style={{ color: 'var(--primary)' }}>₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {shippingPrice > 0 && (
                <div
                  style={{
                    background: 'var(--primary-light)',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.8125rem',
                    color: 'var(--primary)',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <FaTruck /> Add ₹{(999 - subtotal).toLocaleString('en-IN')} more for Free Shipping!
                </div>
              )}

              <button
                onClick={() => navigate('/checkout')}
                className="btn btn-primary btn-block btn-lg"
                style={{ marginBottom: '1rem' }}
              >
                Proceed to Checkout <FaArrowRight />
              </button>

              <Link
                to="/products"
                className="btn btn-secondary btn-block"
                style={{ textAlign: 'center' }}
              >
                Continue Browsing
              </Link>
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">
              <FaShoppingCart />
            </div>
            <h3>Your Shopping Cart is Empty</h3>
            <p>
              Looks like you haven't added anything to your cart yet. Explore our classified listings
              and find amazing items.
            </p>
            <Link to="/products" className="btn btn-primary">
              Start Shopping Now
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;

