import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaSearch, FaCheck, FaTrashAlt, FaArrowLeft, FaReply, FaClock } from 'react-icons/fa';
import API from '../../services/api';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';
import { useToast } from '../../components/Toast';

const AdminEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [enquiryToDelete, setEnquiryToDelete] = useState(null);

  const toast = useToast();

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const url =
        statusFilter === 'all'
          ? '/enquiries/admin?limit=50'
          : `/enquiries/admin?limit=50&status=${statusFilter}`;
      const res = await API.get(url);
      if (res.data.success) {
        setEnquiries(res.data.enquiries);
      }
    } catch (err) {
      toast.error('Failed to load customer inquiries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [statusFilter]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await API.put(`/enquiries/admin/${id}/status`, { status: newStatus });
      if (res.data.success) {
        toast.success(`Inquiry status updated to ${newStatus}`);
        setEnquiries((prev) =>
          prev.map((e) => (e._id === id ? { ...e, status: newStatus } : e))
        );
      }
    } catch (err) {
      toast.error('Failed to update status.');
    }
  };

  const confirmDelete = (e) => {
    setEnquiryToDelete(e);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!enquiryToDelete) return;
    try {
      const res = await API.delete(`/enquiries/admin/${enquiryToDelete._id}`);
      if (res.data.success) {
        toast.success('Inquiry record deleted successfully.');
        setEnquiries((prev) => prev.filter((e) => e._id !== enquiryToDelete._id));
      }
    } catch (err) {
      toast.error('Failed to delete inquiry.');
    } finally {
      setDeleteModalOpen(false);
      setEnquiryToDelete(null);
    }
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
              Customer Support Desk & Inquiries ({enquiries.length})
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Filter Status:
            </span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-control"
              style={{ width: 'auto', padding: '0.5rem 1rem' }}
            >
              <option value="all">All Inquiries</option>
              <option value="Pending">Pending</option>
              <option value="Read">Read</option>
              <option value="Responded">Responded</option>
            </select>
          </div>
        </div>

        {/* Inquiries List */}
        {loading ? (
          <Loader text="Loading support inquiries..." />
        ) : enquiries.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {enquiries.map((enq) => (
              <div
                key={enq._id}
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
                        Sender
                      </span>
                      <div style={{ fontWeight: 800, color: 'var(--text-main)' }}>{enq.name}</div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>
                        Email & Phone
                      </span>
                      <div style={{ fontSize: '0.875rem' }}>
                        <a href={`mailto:${enq.email}`} style={{ color: 'var(--primary)', fontWeight: 600 }}>
                          {enq.email}
                        </a>{' '}
                        {enq.phone && `• ${enq.phone}`}
                      </div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>
                        Received At
                      </span>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        {new Date(enq.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span
                      className={`badge ${
                        enq.status === 'Responded'
                          ? 'badge-success'
                          : enq.status === 'Read'
                          ? 'badge-primary'
                          : 'badge-warning'
                      }`}
                    >
                      {enq.status}
                    </span>

                    <select
                      value={enq.status}
                      onChange={(e) => handleUpdateStatus(enq._id, e.target.value)}
                      className="form-control"
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.8125rem', width: 'auto' }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Read">Read</option>
                      <option value="Responded">Responded</option>
                    </select>

                    <button
                      onClick={() => confirmDelete(enq)}
                      className="btn btn-danger btn-sm"
                      title="Delete Inquiry"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </div>

                {/* Message Body */}
                <div style={{ padding: '1.25rem 1.5rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--secondary)' }}>
                    Subject: {enq.subject}
                  </div>
                  <p style={{ color: 'var(--text-main)', fontSize: '0.9375rem', lineHeight: 1.6, whiteSpace: 'pre-wrap', marginBottom: '1.25rem' }}>
                    {enq.message}
                  </p>

                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <a
                      href={`mailto:${enq.email}?subject=Re: ${encodeURIComponent(enq.subject || 'Your SHOP SPHERE Inquiry')}`}
                      className="btn btn-primary btn-sm"
                    >
                      <FaReply /> Reply via Email to {enq.name}
                    </a>
                    {enq.emailSent && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600 }}>
                        ✓ Notification email dispatched to admin mailbox
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card" style={{ padding: '3rem', textAlign: 'center', background: '#ffffff' }}>
            <p style={{ color: 'var(--text-muted)' }}>No customer inquiries found for this status.</p>
          </div>
        )}

        <Modal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleDelete}
          title="Delete Customer Inquiry"
          message={`Are you sure you want to delete this message from "${enquiryToDelete?.name}"?`}
          confirmText="Delete"
          confirmBtnStyle="btn-danger"
        />
      </div>
    </div>
  );
};

export default AdminEnquiries;

