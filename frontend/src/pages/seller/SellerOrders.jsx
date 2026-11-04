import React, { useState, useEffect } from 'react';
import { FaClipboardList, FaMapMarkerAlt, FaUser, FaPhoneAlt, FaCheck, FaTruck } from 'react-icons/fa';
import API from '../../services/api';
import Loader from '../../components/Loader';
import { useToast } from '../../components/Toast';

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const toast = useToast();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await API.get('/orders/seller/orders');
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error('Failed to load seller orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, itemId, newStatus) => {
    try {
      setUpdatingId(itemId);
      const res = await API.put(`/orders/${orderId}/items/${itemId}/status`, {
        status: newStatus,
      });

      if (res.data.success) {
        toast.success(`Fulfillment status updated to ${newStatus}`);
        fetchOrders(); // Refresh order status
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update order item status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const getFullImageUrl = (img) => {
    if (!img) return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600';
    return img.startsWith('http') ? img : `http://localhost:5000${img}`;
  };

  return (
    <div style={{ padding: '2.5rem 0 4rem' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 className="title-lg">Customer Orders & Fulfillment</h1>
          <p className="subtitle">
            Manage incoming orders for your shop and update item shipping milestones
          </p>
        </div>

        {loading ? (
          <Loader text="Loading customer orders..." />
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
                {/* Header */}
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
                        Customer
                      </span>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                        {order.buyer?.name || order.shippingAddress?.fullName}
                      </div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>
                        Date Placed
                      </span>
                      <div style={{ fontSize: '0.875rem' }}>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>
                      Your Payout
                    </span>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--success)' }}>
                      ₹{order.sellerSubtotal?.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                {/* Items & Fulfillment Controls */}
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.25rem' }}>
                    {order.items.map((item) => (
                      <div
                        key={item._id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem',
                          flexWrap: 'wrap',
                          paddingBottom: '1rem',
                          borderBottom: '1px dashed var(--border-color)',
                        }}
                      >
                        <img
                          src={getFullImageUrl(item.image)}
                          alt={item.name}
                          style={{
                            width: '60px',
                            height: '60px',
                            objectFit: 'cover',
                            borderRadius: 'var(--radius-md)',
                          }}
                        />

                        <div style={{ flex: '1.5', minWidth: '180px' }}>
                          <h4 style={{ fontSize: '0.9375rem', fontWeight: 700 }}>{item.name}</h4>
                          <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                            Quantity: {item.quantity} × ₹{item.price?.toLocaleString('en-IN')}
                          </span>
                        </div>

                        {/* Current Status Pill */}
                        <div style={{ minWidth: '100px' }}>
                          <span
                            className={`badge ${
                              item.status === 'Delivered'
                                ? 'badge-success'
                                : item.status === 'Cancelled'
                                ? 'badge-danger'
                                : 'badge-warning'
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>

                        {/* Quick Status Update Select */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Update:</span>
                          <select
                            value={item.status}
                            disabled={updatingId === item._id}
                            onChange={(e) => handleStatusChange(order._id, item._id, e.target.value)}
                            className="form-control"
                            style={{ padding: '0.375rem 0.625rem', fontSize: '0.8125rem', width: 'auto' }}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Buyer Delivery & Phone */}
                  <div
                    style={{
                      background: '#f8fafc',
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.8125rem',
                      color: 'var(--text-muted)',
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      gap: '0.75rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FaMapMarkerAlt style={{ color: 'var(--primary)' }} />
                      <span>
                        <strong>Ship to:</strong> {order.shippingAddress?.fullName},{' '}
                        {order.shippingAddress?.addressLine}, {order.shippingAddress?.city},{' '}
                        {order.shippingAddress?.state} {order.shippingAddress?.zipCode}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FaPhoneAlt style={{ color: 'var(--primary)' }} />
                      <span>{order.shippingAddress?.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">
              <FaClipboardList />
            </div>
            <h3>No Customer Orders Yet</h3>
            <p>You haven't received any customer orders for your products yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerOrders;

