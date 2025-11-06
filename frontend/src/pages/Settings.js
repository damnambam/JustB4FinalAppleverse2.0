import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Lock, Eye, Accessibility, Save, Moon, Sun, Type, Contrast } from 'lucide-react';
import './Settings.css';

const Settings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // User details state
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    dob: ''
  });

  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Accessibility settings state
  const [accessibilitySettings, setAccessibilitySettings] = useState({
    darkMode: false,
    largeText: false,
    highContrast: false
  });

  // Load user data and settings on mount
  useEffect(() => {
    loadUserData();
    loadAccessibilitySettings();
  }, []);

  // Load user data from localStorage
  const loadUserData = () => {
    try {
      const adminData = localStorage.getItem('adminData');
      const userData = localStorage.getItem('userData');
      
      const data = adminData ? JSON.parse(adminData) : userData ? JSON.parse(userData) : null;
      
      if (data) {
        setUserDetails({
          name: data.name || '',
          email: data.email || '',
          dob: data.dob || ''
        });
      }
    } catch (err) {
      console.error('Error loading user data:', err);
    }
  };

  // Load accessibility settings
  const loadAccessibilitySettings = () => {
    const settings = {
      darkMode: localStorage.getItem('darkMode') === 'true',
      largeText: localStorage.getItem('largeText') === 'true',
      highContrast: localStorage.getItem('highContrast') === 'true'
    };
    setAccessibilitySettings(settings);
    applyAccessibilitySettings(settings);
  };

  // Apply accessibility settings to the page
  const applyAccessibilitySettings = (settings) => {
    // Dark mode
    if (settings.darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }

    // Large text
    if (settings.largeText) {
      document.body.classList.add('large-text');
    } else {
      document.body.classList.remove('large-text');
    }

    // High contrast
    if (settings.highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  };

  // Handle user details change
  const handleDetailsChange = (e) => {
    setUserDetails({
      ...userDetails,
      [e.target.name]: e.target.value
    });
  };

  // Handle password change
  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  // Handle accessibility toggle
  const handleAccessibilityToggle = (setting) => {
    const newSettings = {
      ...accessibilitySettings,
      [setting]: !accessibilitySettings[setting]
    };
    
    setAccessibilitySettings(newSettings);
    localStorage.setItem(setting, newSettings[setting]);
    applyAccessibilitySettings(newSettings);
    
    setMessage({ type: 'success', text: 'Accessibility setting updated!' });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field]
    });
  };

  // Save user details
  const handleSaveDetails = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Validate fields
      if (!userDetails.name || !userDetails.email) {
        setMessage({ type: 'error', text: 'Name and email are required.' });
        setLoading(false);
        return;
      }

      // TODO: Add API call to update user details
      // For now, update localStorage
      const isAdmin = localStorage.getItem('isAdmin') === 'true';
      const storageKey = isAdmin ? 'adminData' : 'userData';
      const currentData = JSON.parse(localStorage.getItem(storageKey) || '{}');
      
      const updatedData = {
        ...currentData,
        name: userDetails.name,
        email: userDetails.email,
        dob: userDetails.dob
      };
      
      localStorage.setItem(storageKey, JSON.stringify(updatedData));
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      
      // Dispatch event to update navigation
      window.dispatchEvent(new Event('authChange'));
    } catch (err) {
      console.error('Error saving details:', err);
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Change password
  const handleChangePassword = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Validate passwords
      if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
        setMessage({ type: 'error', text: 'All password fields are required.' });
        setLoading(false);
        return;
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setMessage({ type: 'error', text: 'New passwords do not match.' });
        setLoading(false);
        return;
      }

      if (passwordData.newPassword.length < 6) {
        setMessage({ type: 'error', text: 'New password must be at least 6 characters long.' });
        setLoading(false);
        return;
      }

      // TODO: Add API call to change password
      // const response = await fetch('http://localhost:5000/api/auth/change-password', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   },
      //   body: JSON.stringify({
      //     currentPassword: passwordData.currentPassword,
      //     newPassword: passwordData.newPassword
      //   })
      // });

      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      console.error('Error changing password:', err);
      setMessage({ type: 'error', text: 'Failed to change password. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          Back
        </button>
        <h1>Settings</h1>
      </div>

      {/* Message Banner */}
      {message.text && (
        <div className={`message-banner ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="settings-content">
        {/* Tabs */}
        <div className="settings-tabs">
          <button
            className={`settings-tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={20} />
            Profile
          </button>
          <button
            className={`settings-tab ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => setActiveTab('password')}
          >
            <Lock size={20} />
            Password
          </button>
          <button
            className={`settings-tab ${activeTab === 'accessibility' ? 'active' : ''}`}
            onClick={() => setActiveTab('accessibility')}
          >
            <Accessibility size={20} />
            Accessibility
          </button>
        </div>

        {/* Tab Content */}
        <div className="settings-tab-content">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="tab-panel">
              <h2>Profile Information</h2>
              <p className="tab-description">Update your personal information</p>

              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={userDetails.name}
                  onChange={handleDetailsChange}
                  placeholder="Enter your name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={userDetails.email}
                  onChange={handleDetailsChange}
                  placeholder="Enter your email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="dob">Date of Birth</label>
                <input
                  type="date"
                  id="dob"
                  name="dob"
                  value={userDetails.dob}
                  onChange={handleDetailsChange}
                />
              </div>

              <button
                className="save-btn"
                onClick={handleSaveDetails}
                disabled={loading}
              >
                <Save size={18} />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}

          {/* Password Tab */}
          {activeTab === 'password' && (
            <div className="tab-panel">
              <h2>Change Password</h2>
              <p className="tab-description">Update your account password</p>

              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => togglePasswordVisibility('current')}
                  >
                    <Eye size={18} />
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    id="newPassword"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => togglePasswordVisibility('new')}
                  >
                    <Eye size={18} />
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => togglePasswordVisibility('confirm')}
                  >
                    <Eye size={18} />
                  </button>
                </div>
              </div>

              <button
                className="save-btn"
                onClick={handleChangePassword}
                disabled={loading}
              >
                <Lock size={18} />
                {loading ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          )}

          {/* Accessibility Tab */}
          {activeTab === 'accessibility' && (
            <div className="tab-panel">
              <h2>Accessibility Settings</h2>
              <p className="tab-description">Customize your viewing experience</p>

              <div className="accessibility-options">
                {/* Dark Mode */}
                <div className="accessibility-option">
                  <div className="option-info">
                    <div className="option-icon">
                      {accessibilitySettings.darkMode ? <Moon size={24} /> : <Sun size={24} />}
                    </div>
                    <div>
                      <h3>Dark Mode</h3>
                      <p>Switch between light and dark theme</p>
                    </div>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={accessibilitySettings.darkMode}
                      onChange={() => handleAccessibilityToggle('darkMode')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                {/* Large Text */}
                <div className="accessibility-option">
                  <div className="option-info">
                    <div className="option-icon">
                      <Type size={24} />
                    </div>
                    <div>
                      <h3>Larger Text</h3>
                      <p>Increase font size for better readability</p>
                    </div>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={accessibilitySettings.largeText}
                      onChange={() => handleAccessibilityToggle('largeText')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                {/* High Contrast */}
                <div className="accessibility-option">
                  <div className="option-info">
                    <div className="option-icon">
                      <Contrast size={24} />
                    </div>
                    <div>
                      <h3>High Contrast</h3>
                      <p>Enhance color contrast for better visibility</p>
                    </div>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={accessibilitySettings.highContrast}
                      onChange={() => handleAccessibilityToggle('highContrast')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;