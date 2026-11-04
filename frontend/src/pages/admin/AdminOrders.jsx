import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaClipboardList, FaFilter, FaArrowLeft, FaMapMarkerAlt, FaTruck } from 'react-icons/fa';
import API from '../../services/api';
import Loader from '../../components/Loader';
import { useToast } from '../../components/Toast';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  const toast = useToast();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const url =
        statusFilter === 'all'
          ? '/admin/orders?limit=50'
          : `/admin/orders?limit=50&status=${statusFilter}`;
      const res = await API.get(url);
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      toast.error('Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await API.put(`/admin/orders/${orderId}/status`, {
        orderStatus: newStatus,
      });

      if (res.data.success) {
        toast.success(`Order status updated to ${newStatus}`);
        fetchOrders();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update order status.');
    }
  };

  const getFullImageUrl = (img) => {
    if (!img) return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600';
    return img.startsWith('http') ? img : `http://localhost:5000${img}`;
  };

  return (
    <div style={{ padding: '2.5rem 0 4rem' }}>
      <div className="container">
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link to="/admin" className="btn btn-secondary btn-sm">
              <FaArrowLeft /> Dashboard
            </Link>
            <h1 className="title-lg" style={{ margin: 0 }}>
              All Platform Orders ({orders.length})
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Status Filter:
            </span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-control"
              style={{ width: 'auto', padding: '0.5rem 1rem' }}
            >
              <option value="all">All Orders</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        {loading ? (
          <Loader text="Loading orders..." />
        ) : orders.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {orders.map((ord) => (
              <div
                key={ord._id}
                className="card"
                style={{ background: '#ffffff', border: '1px solid var(--border-color)', overflow: 'hidden' }}
              >
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
                        {ord.orderNumber}
                      </div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>
                        Customer
                      </span>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                        {ord.user?.name || ord.shippingAddress?.fullName} ({ord.user?.email})
                      </div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>
                        Method & Payment
                      </span>
                      <div style={{ fontSize: '0.875rem' }}>
                        {ord.paymentMethod} •{' '}
                        <strong style={{ color: ord.paymentStatus === 'Paid' ? 'var(--success)' : 'var(--warning)' }}>
                          {ord.paymentStatus}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>
                        Total Value
                      </span>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                        ₹{ord.totalPrice?.toLocaleString('en-IN')}
                      </div>
                    </div>

                    <div>
                      <select
                        value={ord.orderStatus}
                        onChange={(e) => handleUpdateStatus(ord._id, e.target.value)}
                        className="form-control"
                        style={{ padding: '0.375rem 0.75rem', fontSize: '0.875rem', fontWeight: 700 }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div style={{ padding: '1.25rem 1.5rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                    {ord.items?.map((it, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: '0.875rem',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img
                            src={getFullImageUrl(it.image)}
                            alt={it.name}
                            style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }}
                          />
                          <div>
                            <span style={{ fontWeight: 600 }}>{it.name}</span>
                            <span style={{ color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                              (×{it.quantity}) • Seller: {it.seller?.name || 'Partner'}
                            </span>
                          </div>
                        </div>
                        <div style={{ fontWeight: 700 }}>₹{(it.price * it.quantity).toLocaleString('en-IN')}</div>
                      </div>
                    ))}
                  </div>

                  <div
                    style={{
                      background: '#f8fafc',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.8125rem',
                      color: 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <FaMapMarkerAlt style={{ color: 'var(--primary)' }} />
                    <span>
                      Shipping Address: {ord.shippingAddress?.fullName}, {ord.shippingAddress?.addressLine},{' '}
                      {ord.shippingAddress?.city}, {ord.shippingAddress?.state} {ord.shippingAddress?.zipCode}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card" style={{ padding: '3rem', textAlign: 'center', background: '#ffffff' }}>
            <p style={{ color: 'var(--text-muted)' }}>No orders found for this status.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;

