import React, { useState } from 'react';
import { FaUser, FaLock, FaSave, FaShieldAlt } from 'react-icons/fa';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Toast';
import PasswordRequirements from '../../components/PasswordRequirements';
import { isStrongPassword, PASSWORD_MESSAGE } from '../../utils/passwordPolicy';

const UserProfile = () => {
  const { user, updateUser } = useAuth();
  const toast = useToast();

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || 'USA',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setLoadingProfile(true);
      const res = await API.put('/auth/profile', {
        name: profileData.name,
        phone: profileData.phone,
        address: {
          street: profileData.street,
          city: profileData.city,
          state: profileData.state,
          zipCode: profileData.zipCode,
          country: profileData.country,
        },
      });

      if (res.data.success) {
        updateUser(res.data.user);
        toast.success('Profile details updated successfully!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }
    if (!isStrongPassword(passwordData.newPassword)) {
      toast.error(PASSWORD_MESSAGE);
      return;
    }

    try {
      setLoadingPassword(true);
      const res = await API.put('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (res.data.success) {
        toast.success('Password changed successfully!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <div style={{ padding: '2.5rem 0 4rem' }}>
      <div className="container" style={{ maxWidth: '840px' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 className="title-lg">Account & Security Settings</h1>
          <p className="subtitle">
            Update personal contact information, default shipping addresses, and security credentials
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
          {/* Left: Profile Form */}
          <div className="card" style={{ padding: '2rem', background: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.25rem' }}>
              <FaUser style={{ color: 'var(--primary)', fontSize: '1.25rem' }} />
              <h2 className="title-md">Personal Information</h2>
            </div>

            <form onSubmit={handleUpdateProfile}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={profileData.name}
                  onChange={handleProfileChange}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address (Read-only)</label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="form-control"
                  style={{ background: '#f1f5f9', cursor: 'not-allowed' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contact Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleProfileChange}
                  className="form-control"
                />
              </div>

              <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, margin: '1.25rem 0 0.75rem', color: 'var(--text-muted)' }}>
                Default Shipping Address
              </h4>

              <div className="form-group">
                <label className="form-label">Street Address</label>
                <input
                  type="text"
                  name="street"
                  value={profileData.street}
                  onChange={handleProfileChange}
                  className="form-control"
                  placeholder="Street / Flat"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    name="city"
                    value={profileData.city}
                    onChange={handleProfileChange}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">State</label>
                  <input
                    type="text"
                    name="state"
                    value={profileData.state}
                    onChange={handleProfileChange}
                    className="form-control"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Zip Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={profileData.zipCode}
                    onChange={handleProfileChange}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={profileData.country}
                    onChange={handleProfileChange}
                    className="form-control"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loadingProfile}
                className="btn btn-primary btn-block"
                style={{ marginTop: '0.5rem' }}
              >
                <FaSave /> {loadingProfile ? 'Saving Changes...' : 'Save Profile Details'}
              </button>
            </form>
          </div>

          {/* Right: Password Change Form */}
          <div className="card" style={{ padding: '2rem', background: '#ffffff', height: 'fit-content' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.25rem' }}>
              <FaLock style={{ color: 'var(--primary)', fontSize: '1.25rem' }} />
              <h2 className="title-md">Change Password</h2>
            </div>

            <form onSubmit={handleChangePassword}>
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  required
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="form-control"
                  placeholder="Enter current password"
                />
              </div>

              <div className="form-group">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  required
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="form-control"
                  placeholder="Create a strong password"
                />
                <PasswordRequirements password={passwordData.newPassword} />
              </div>

              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="form-control"
                  placeholder="Confirm new password"
                />
              </div>

              <button
                type="submit"
                disabled={loadingPassword}
                className="btn btn-secondary btn-block"
                style={{ marginTop: '1rem' }}
              >
                <FaShieldAlt /> {loadingPassword ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

