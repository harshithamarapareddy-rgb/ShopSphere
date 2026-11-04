import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBoxOpen, FaCalendarAlt, FaCreditCard, FaTruck, FaMapMarkerAlt } from 'react-icons/fa';
import API from '../../services/api';
import Loader from '../../components/Loader';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await API.get('/orders/my-orders');
        if (res.data.success) {
          setOrders(res.data.orders);
        }
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getFullImageUrl = (img) => {
    if (!img) return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600';
    return img.startsWith('http') ? img : `http://localhost:5000${img}`;
  };

  return (
    <div style={{ padding: '2.5rem 0 4rem' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 className="title-lg">Order History & Tracking</h1>
          <p className="subtitle">
            Track all orders placed across verified SHOP SPHERE merchants
          </p>
        </div>

        {loading ? (
          <Loader text="Loading your complete order history..." />
        ) : orders.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {orders.map((order) => (
              <div
                key={order._id}
                className="card"
                style={{
                  background: '#ffffff',
                  border: '1px solid var(--border-color)',
                  overflow: 'hidden',
                }}
              >
                {/* Order Header */}
                <div
                  style={{
                    background: '#f8fafc',
                    padding: '1rem 1.5rem',
                    borderBottom: '1px solid var(--border-color)',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>
                        Order ID
                      </span>
                      <div style={{ fontWeight: 800, color: 'var(--primary)' }}>
                        {order.orderNumber}
                      </div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>
                        Order Date
                      </span>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>
                        Payment
                      </span>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                        {order.paymentMethod} ({order.paymentStatus})
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span
                      className={`badge ${
                        order.orderStatus === 'Delivered'
                          ? 'badge-success'
                          : order.orderStatus === 'Cancelled'
                          ? 'badge-danger'
                          : 'badge-warning'
                      }`}
                      style={{ fontSize: '0.8125rem', padding: '0.375rem 0.875rem' }}
                    >
                      {order.orderStatus}
                    </span>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.25rem' }}>
                      ₹{order.totalPrice?.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                {/* Items List */}
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.25rem' }}>
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1.25rem',
                          paddingBottom: '1rem',
                          borderBottom: idx !== order.items.length - 1 ? '1px dashed var(--border-color)' : 'none',
                        }}
                      >
                        <img
                          src={getFullImageUrl(item.image)}
                          alt={item.name}
                          style={{
                            width: '70px',
                            height: '70px',
                            objectFit: 'cover',
                            borderRadius: 'var(--radius-md)',
                            flexShrink: 0,
                          }}
                        />

                        <div style={{ flex: 1 }}>
                          <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                            {item.name}
                          </h4>
                          <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                            Qty: {item.quantity} × ₹{item.price?.toLocaleString('en-IN')}
                          </div>
                          <span
                            className={`badge ${
                              item.status === 'Delivered'
                                ? 'badge-success'
                                : item.status === 'Cancelled'
                                ? 'badge-danger'
                                : 'badge-warning'
                            }`}
                            style={{ marginTop: '0.375rem', fontSize: '0.7rem' }}
                          >
                            Item Status: {item.status}
                          </span>
                        </div>

                        <div style={{ fontSize: '1rem', fontWeight: 700 }}>
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Address Footer */}
                  <div
                    style={{
                      background: '#f8fafc',
                      padding: '0.875rem 1.25rem',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.8125rem',
                      color: 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <FaMapMarkerAlt style={{ color: 'var(--primary)', flexShrink: 0 }} />
                    <span>
                      <strong>Delivering to:</strong> {order.shippingAddress?.fullName},{' '}
                      {order.shippingAddress?.addressLine}, {order.shippingAddress?.city},{' '}
                      {order.shippingAddress?.state} {order.shippingAddress?.zipCode}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">
              <FaBoxOpen />
            </div>
            <h3>No Orders Placed Yet</h3>
            <p>You haven't purchased any items yet. Start browsing our marketplace catalog!</p>
            <Link to="/products" className="btn btn-primary">
              Discover Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;

