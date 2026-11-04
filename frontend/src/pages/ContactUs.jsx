import React, { useState } from 'react';
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaPaperPlane, FaCheckCircle, FaExternalLinkAlt } from 'react-icons/fa';
import API from '../services/api';
import { useToast } from '../components/Toast';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const toast = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in your name, email, and message.');
      return;
    }

    try {
      setLoading(true);
      const res = await API.post('/enquiries', formData);

      if (res.data.success) {
        setSubmitted(true);
        if (res.data.previewUrl) {
          setPreviewUrl(res.data.previewUrl);
        }
        toast.success('Inquiry submitted! Email notification dispatched to administration.');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '3.5rem 0 5rem' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span
            style={{
              color: 'var(--primary)',
              fontWeight: 800,
              fontSize: '0.8125rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            Help & Customer Support
          </span>
          <h1 className="title-xl" style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>
            We'd Love to Hear From You
          </h1>
          <p className="subtitle" style={{ maxWidth: '640px', margin: '0 auto' }}>
            Have questions regarding classified listings, buyer protection, or merchant verification?
            Send us an inquiry and our team will get in touch with you.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
          }}
        >
          {/* Left: Contact Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="card" style={{ padding: '1.75rem', background: '#ffffff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    background: 'var(--primary-light)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.25rem',
                  }}
                >
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Registered Office</h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    Level 4, Prestige Tech Park, Outer Ring Road, Bengaluru, Karnataka 560103
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    background: 'var(--success-light)',
                    color: 'var(--success)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.25rem',
                  }}
                >
                  <FaPhoneAlt />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Direct Line</h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    +91 98765 43210 / 1800-SPHERE-IN
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    background: 'var(--accent-light)',
                    color: '#b45309',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.25rem',
                  }}
                >
                  <FaEnvelope />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Email Support Desk</h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    support@shopsphere.in | merchants@shopsphere.in
                  </p>
                </div>
              </div>
            </div>

            <div
              className="card"
              style={{
                padding: '1.75rem',
                background: 'linear-gradient(135deg, #1e40af, #2563eb)',
                color: 'white',
              }}
            >
              <h4 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                24/7 Seller Onboarding Support
              </h4>
              <p style={{ fontSize: '0.875rem', color: '#e0e7ff', lineHeight: 1.6 }}>
                Looking to list products across multiple Indian cities? Contact our merchant relations team for bulk catalog assistance and certified store badges.
              </p>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="card" style={{ padding: '2rem', background: '#ffffff' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem' }}>
              Send an Official Inquiry
            </h3>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'var(--success-light)',
                    color: 'var(--success)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    margin: '0 auto 1rem',
                  }}
                >
                  <FaCheckCircle />
                </div>
                <h4 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                  Inquiry Dispatched & Saved!
                </h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  Your message has been safely recorded in the database and an email notification has been dispatched to our administrative team.
                </p>

                {previewUrl && (
                  <div
                    style={{
                      background: '#f8fafc',
                      border: '1px solid var(--border-color)',
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      marginBottom: '1.5rem',
                      fontSize: '0.8125rem',
                      textAlign: 'left',
                    }}
                  >
                    <strong>📧 Development Email Preview:</strong>
                    <p style={{ margin: '0.375rem 0', color: 'var(--text-muted)' }}>
                      You can view the exact email sent by the server online:
                    </p>
                    <a
                      href={previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-sm"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}
                    >
                      Open Email in Browser <FaExternalLinkAlt />
                    </a>
                  </div>
                )}

                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setSubmitted(false);
                    setPreviewUrl(null);
                  }}
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="e.g. Ramesh Kumar"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="ramesh@example.com"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Contact Phone (Optional)</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="+91 98000 00000"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Inquiry about product listing / merchant registration"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Your Message *</label>
                  <textarea
                    name="message"
                    required
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Please explain your question or inquiry in detail..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary btn-block btn-lg"
                >
                  <FaPaperPlane /> {loading ? 'Sending & Dispatching Email...' : 'Send Inquiry'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
