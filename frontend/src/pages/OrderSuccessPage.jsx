import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { FaCheckCircle, FaBox, FaTruck, FaHome, FaClipboardList } from 'react-icons/fa';
import API from '../services/api';
import Loader from '../components/Loader';

const OrderSuccessPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    if (!order) {
      const fetchOrder = async () => {
        try {
          const res = await API.get(`/orders/${id}`);
          if (res.data.success) {
            setOrder(res.data.order);
          }
        } catch (err) {
          console.error('Error fetching order details:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    }
  }, [id, order]);

  if (loading) {
    return <Loader fullScreen text="Confirming your order..." />;
  }

  return (
    <div style={{ padding: '4rem 0 6rem', background: '#ffffff' }}>
      <div className="container" style={{ maxWidth: '680px', textAlign: 'center' }}>
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'var(--success-light)',
            color: 'var(--success)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5rem',
            margin: '0 auto 1.5rem',
          }}
        >
          <FaCheckCircle />
        </div>

        <h1 className="title-lg" style={{ marginBottom: '0.75rem' }}>
          Thank You! Your Order is Confirmed
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
          We've received your order and notified the verified seller(s). A confirmation email has been
          sent to your registered account.
        </p>

        {/* Order Details Card */}
        {order && (
          <div
            className="card"
            style={{
              padding: '1.75rem',
              textAlign: 'left',
              marginBottom: '2rem',
              background: '#f8fafc',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                borderBottom: '1px solid var(--border-color)',
                paddingBottom: '0.75rem',
                marginBottom: '1rem',
              }}
            >
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>
                  Order Number
                </span>
                <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--primary)' }}>
                  {order.orderNumber}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>
                  Total Paid
                </span>
                <div style={{ fontSize: '1.125rem', fontWeight: 800 }}>
                  ₹{order.totalPrice?.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--text-muted)' }}>
              <div>
                <strong>Shipping To:</strong> {order.shippingAddress?.fullName}
              </div>
              <div>
                <strong>Address:</strong> {order.shippingAddress?.addressLine}, {order.shippingAddress?.city},{' '}
                {order.shippingAddress?.state} {order.shippingAddress?.zipCode}
              </div>
              <div>
                <strong>Payment Method:</strong> {order.paymentMethod} ({order.paymentStatus})
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/dashboard/orders" className="btn btn-primary">
            <FaClipboardList /> View in Order History
          </Link>
          <Link to="/products" className="btn btn-secondary">
            <FaHome /> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;

