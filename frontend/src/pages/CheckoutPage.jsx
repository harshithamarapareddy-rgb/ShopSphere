import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaLock, FaCreditCard, FaMoneyBillWave, FaMobileAlt, FaShieldAlt } from 'react-icons/fa';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../components/Toast';

const CheckoutPage = () => {
  const { user, isAuthenticated } = useAuth();
  const { cartItems, subtotal, clearCart } = useCart();
  const toast = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    addressLine: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || 'India',
  });

  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');

  const shippingPrice = subtotal >= 999 || subtotal === 0 ? 0 : 99;
  const taxPrice = Number((0.05 * subtotal).toFixed(2));
  const totalPrice = Number((subtotal + shippingPrice + taxPrice).toFixed(2));

  const handleInputChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.warning('Please log in or register to complete your order checkout.');
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Your cart is empty.');
      navigate('/products');
      return;
    }

    if (
      !shippingAddress.fullName ||
      !shippingAddress.phone ||
      !shippingAddress.addressLine ||
      !shippingAddress.city ||
      !shippingAddress.zipCode
    ) {
      toast.error('Please fill in all required shipping address fields.');
      return;
    }

    try {
      setLoading(true);
      const itemsPayload = cartItems.map((item) => ({
        product: item.product?._id || item.product,
        quantity: item.quantity,
        name: item.product?.name,
        price: item.product?.price || item.price,
      }));

      const res = await API.post('/orders', {
        items: itemsPayload,
        shippingAddress,
        paymentMethod,
      });

      if (res.data.success) {
        await clearCart();
        toast.success('Order placed successfully!');
        navigate(`/order-success/${res.data.order._id}`, {
          state: { order: res.data.order },
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '3rem 0 5rem' }}>
      <div className="container">
        <h1 className="title-lg" style={{ marginBottom: '0.5rem' }}>
          Checkout & Shipping
        </h1>
        <p className="subtitle" style={{ marginBottom: '2.5rem' }}>
          Provide delivery information and select your preferred payment mode
        </p>

        <form onSubmit={handlePlaceOrder}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2.5rem',
              alignItems: 'start',
            }}
          >
            {/* Left Column: Delivery Address & Payment Method */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Shipping Address Card */}
              <div
                className="card"
                style={{ padding: '1.75rem', background: '#ffffff', border: '1px solid var(--border-color)' }}
              >
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.25rem' }}>
                  1. Shipping Information
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={shippingAddress.fullName}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="Receiver's Full Name"
                    />
                  </div>

                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label className="form-label">Contact Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={shippingAddress.phone}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label className="form-label">Street Address *</label>
                    <input
                      type="text"
                      name="addressLine"
                      required
                      value={shippingAddress.addressLine}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="House / Flat No, Street Name, Landmark"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={shippingAddress.city}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="City"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">State / Province *</label>
                    <input
                      type="text"
                      name="state"
                      required
                      value={shippingAddress.state}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="State (e.g. CA, NY)"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">ZIP / Postal Code *</label>
                    <input
                      type="text"
                      name="zipCode"
                      required
                      value={shippingAddress.zipCode}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="Postal Code"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={shippingAddress.country}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Card */}
              <div
                className="card"
                style={{ padding: '1.75rem', background: '#ffffff', border: '1px solid var(--border-color)' }}
              >
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.25rem' }}>
                  2. Payment Method
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      border:
                        paymentMethod === 'Cash on Delivery'
                          ? '2px solid var(--primary)'
                          : '1px solid var(--border-color)',
                      background:
                        paymentMethod === 'Cash on Delivery' ? 'var(--primary-light)' : '#ffffff',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Cash on Delivery"
                      checked={paymentMethod === 'Cash on Delivery'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <FaMoneyBillWave style={{ color: 'var(--success)', fontSize: '1.25rem' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>Cash on Delivery</div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                        Pay with cash or card upon package arrival at your door
                      </div>
                    </div>
                  </label>

                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      border:
                        paymentMethod === 'Credit/Debit Card'
                          ? '2px solid var(--primary)'
                          : '1px solid var(--border-color)',
                      background:
                        paymentMethod === 'Credit/Debit Card' ? 'var(--primary-light)' : '#ffffff',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Credit/Debit Card"
                      checked={paymentMethod === 'Credit/Debit Card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <FaCreditCard style={{ color: 'var(--primary)', fontSize: '1.25rem' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>Credit or Debit Card (Mock)</div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                        Safe checkout with Visa, MasterCard, or American Express
                      </div>
                    </div>
                  </label>

                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      border:
                        paymentMethod === 'UPI / Online'
                          ? '2px solid var(--primary)'
                          : '1px solid var(--border-color)',
                      background:
                        paymentMethod === 'UPI / Online' ? 'var(--primary-light)' : '#ffffff',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="UPI / Online"
                      checked={paymentMethod === 'UPI / Online'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <FaMobileAlt style={{ color: '#8b5cf6', fontSize: '1.25rem' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>UPI / Digital Wallet</div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                        Instant digital transfer via Google Pay, Apple Pay or UPI
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Order Review */}
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
                Review Items ({cartItems.length})
              </h3>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  maxHeight: '260px',
                  overflowY: 'auto',
                  marginBottom: '1.25rem',
                  paddingRight: '0.25rem',
                }}
              >
                {cartItems.map((item) => {
                  const product = item.product || {};
                  return (
                    <div
                      key={product._id || item.product}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.875rem',
                        paddingBottom: '0.5rem',
                        borderBottom: '1px dashed var(--border-color)',
                      }}
                    >
                      <div style={{ flex: 1, paddingRight: '0.5rem' }}>
                        <div style={{ fontWeight: 600 }}>{product.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Qty: {item.quantity} × ₹{(product.price || item.price).toLocaleString('en-IN')}
                        </div>
                      </div>
                      <div style={{ fontWeight: 700 }}>
                        ₹{((product.price || item.price) * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Price Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '1.5rem', fontSize: '0.9375rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Items Subtotal</span>
                  <span style={{ fontWeight: 600 }}>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Shipping Cost</span>
                  <span style={{ fontWeight: 600 }}>
                    {shippingPrice === 0 ? <span style={{ color: 'var(--success)' }}>FREE</span> : `₹${shippingPrice}`}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>GST (5%)</span>
                  <span style={{ fontWeight: 600 }}>₹{taxPrice.toLocaleString('en-IN')}</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    borderTop: '1px solid var(--border-color)',
                    paddingTop: '0.875rem',
                    fontSize: '1.25rem',
                    fontWeight: 800,
                  }}
                >
                  <span>Total Amount</span>
                  <span style={{ color: 'var(--primary)' }}>₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-block btn-lg"
                style={{ marginBottom: '1rem' }}
              >
                <FaLock /> {loading ? 'Placing Order...' : `Confirm & Place Order (₹${totalPrice.toLocaleString('en-IN')})`}
              </button>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.375rem',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                }}
              >
                <FaShieldAlt style={{ color: 'var(--success)' }} />
                256-bit SSL Encrypted & Verified Checkout
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;

