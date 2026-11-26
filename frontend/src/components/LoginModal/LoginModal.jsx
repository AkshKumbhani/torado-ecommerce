import React, { useState, useEffect, useCallback } from 'react';
import './LoginModal.css';
import { useShop } from '../../context/ShopContext.jsx';

// =========================================================================
// 🔑 GOOGLE CLIENT ID — frontend/.env ફાઈલ માં VITE_GOOGLE_CLIENT_ID set કરો
// =========================================================================
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '253729320546-eq5b2u1rhft2cbccm4khgneb5q536jib.apps.googleusercontent.com';

// Backend API URL — frontend/.env ફાઈલ માં VITE_API_URL set કરો
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const LoginModal = () => {
  const { isLoginOpen, setIsLoginOpen, currentUser, setCurrentUser, logout, setCurrentPage, setIsWishlistOpen, setIsCartOpen } = useShop();

  // 'login' | 'register' | 'forgot'
  const [viewMode, setViewMode] = useState('login');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Profile Details State
  const [profileTab, setProfileTab] = useState('profile'); // 'profile' | 'shortcuts'
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileAddress, setProfileAddress] = useState('');
  const [profileCity, setProfileCity] = useState('');
  const [profileState, setProfileState] = useState('');
  const [profileCountry, setProfileCountry] = useState('India');
  const [profilePostalCode, setProfilePostalCode] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setProfileName(currentUser.name || 'Aksh Kumbhani');
      setProfilePhone(currentUser.phone || '+91 98765 43210');
      setProfileAddress(currentUser.address || '402, Royal Palace, Varachha Main Road');
      setProfileCity(currentUser.city || 'Surat');
      setProfileState(currentUser.state || 'Gujarat');
      setProfileCountry(currentUser.country || 'India');
      setProfilePostalCode(currentUser.postal_code || '395006');
    }
  }, [currentUser]);

  const handleSaveProfile = async (e) => {
    if (e) e.preventDefault();
    setSavingProfile(true);
    setMessage('');
    try {
      const res = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : '',
        },
        body: JSON.stringify({
          name: profileName,
          email: currentUser.email,
          phone: profilePhone,
          address: profileAddress,
          city: profileCity,
          state: profileState,
          country: profileCountry,
          postal_code: profilePostalCode,
        }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setCurrentUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        setMessage('Profile details updated successfully! Auto-filled in Checkout.');
        setIsError(false);
      } else {
        setIsError(true);
        setMessage(data.message || 'Failed to update profile.');
      }
    } catch (err) {
      setIsError(true);
      setMessage('Failed to connect to backend server.');
    } finally {
      setSavingProfile(false);
    }
  };

  // Close modal safely
  const handleClose = () => {
    setIsLoginOpen(false);
    setMessage('');
    setIsError(false);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // ─────────────────────────────────────────────────
  // ✅ REAL GOOGLE LOGIN — OAuth2 Token Client (Opens Google Popup Direct)
  // ─────────────────────────────────────────────────
  const handleGoogleLogin = () => {
    setIsError(false);
    setMessage('');

    if (!window.google?.accounts?.oauth2) {
      setIsError(true);
      setMessage('Google service is still loading, please retry in 2 seconds.');
      return;
    }

    try {
      setGoogleLoading(true);
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: 'email profile openid',
        callback: async (tokenResponse) => {
          if (tokenResponse.error) {
            setGoogleLoading(false);
            return;
          }

          try {
            let profileName = '';
            try {
              const uRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
              });
              const uData = await uRes.json();
              profileName = uData.name || '';
            } catch (err) {}

            const res = await fetch(`${API_URL}/auth/google`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                accessToken: tokenResponse.access_token,
                name: profileName
              }),
            });

            const data = await res.json();
            if (!res.ok) {
              setIsError(true);
              setMessage(data.message || 'Google login failed.');
              setGoogleLoading(false);
              return;
            }

            // Save permanently to localStorage
            localStorage.setItem('torado_token', data.token);
            localStorage.setItem('torado_user', JSON.stringify(data.user));
            if (setCurrentUser) setCurrentUser(data.user);

            setIsError(false);
            setMessage(`Welcome, ${data.user?.name || 'Customer'}! Signed in with Google ✓`);
            setTimeout(() => {
              handleClose();
            }, 800);
          } catch (err) {
            console.error(err);
            setIsError(true);
            setMessage('Unable to complete Google login. Please try again.');
          } finally {
            setGoogleLoading(false);
          }
        },
      });

      tokenClient.requestAccessToken({ prompt: 'select_account' });
    } catch (e) {
      console.error(e);
      setGoogleLoading(false);
      setIsError(true);
      setMessage('Google sign in could not be initiated.');
    }
  };

  // Normal email/password login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsError(false);
    setMessage('');
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setIsError(true);
        setMessage(data.message || 'Login failed. Please check your credentials.');
        return;
      }
      // Always save to localStorage
      localStorage.setItem('torado_token', data.token);
      localStorage.setItem('torado_user', JSON.stringify(data.user));
      if (setCurrentUser) setCurrentUser(data.user);
      setIsError(false);
      setMessage('Logged in successfully!');
      setTimeout(() => { handleClose(); /* state updated dynamically */ }, 1200);
    } catch (err) {
      setIsError(true);
      setMessage('Unable to connect. Please try again.');
    }
  };

  // Register
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setIsError(false);
    setMessage('');
    if (password !== confirmPassword) {
      setIsError(true);
      setMessage('Passwords do not match!');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setIsError(true);
        setMessage(data.message || 'Registration failed. Please try again.');
        return;
      }
      setIsError(false);
      setMessage('Account created successfully! You can now log in.');
      setTimeout(() => { setViewMode('login'); setMessage(''); setIsError(false); }, 1500);
    } catch (err) {
      setIsError(true);
      setMessage('Unable to connect. Please try again.');
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setIsError(false);
    setMessage('');
    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setIsError(false);
      setMessage(data.message || `Reset link sent to ${email}`);
      setTimeout(() => { setViewMode('login'); setMessage(''); }, 2500);
    } catch (err) {
      setIsError(true);
      setMessage('Unable to send reset email. Please try again.');
    }
  };

  if (!isLoginOpen) return null;

  const isGoogleReady = !!GOOGLE_CLIENT_ID;

  return (
    <div className="ts-login-modal-backdrop" onClick={handleBackdropClick}>
      <div className="ts-login-modal-container">
        {/* Header */}
        <div className="login-panel-header">
          <h3>
            {currentUser ? 'My Account' : viewMode === 'login' ? 'Login' : viewMode === 'register' ? 'Create Account' : 'Forgot Password'}
          </h3>
          <button
            type="button"
            className="close-btn"
            onClick={handleClose}
            aria-label="Close"
          >
            <i className="bx bx-x"></i>
          </button>
        </div>

        {/* Status Message */}
        {message && (
          <div className={`ts-modal-alert ${isError ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        {/* 0. LOGGED IN ACCOUNT VIEW */}
        {currentUser ? (
          <div className="ts-logged-in-profile" style={{ maxHeight: '72vh', overflowY: 'auto', paddingRight: '4px' }}>
            <div className="ts-profile-avatar-circle">
              {currentUser.name ? currentUser.name[0].toUpperCase() : 'U'}
            </div>
            <h4 className="ts-profile-name">{currentUser.name || 'Customer'}</h4>
            <p className="ts-profile-email">{currentUser.email}</p>
            <span className="ts-profile-badge">
              <i className="bx bx-check-shield"></i> Verified Customer
            </span>

            {/* Profile Tab Navigation */}
            <div style={{ display: 'flex', gap: '8px', margin: '14px 0 16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
              <button
                type="button"
                onClick={() => setProfileTab('profile')}
                style={{
                  flex: 1,
                  padding: '7px 12px',
                  borderRadius: '6px',
                  border: profileTab === 'profile' ? '1.5px solid #0f172a' : '1px solid #e2e8f0',
                  background: profileTab === 'profile' ? '#0f172a' : '#ffffff',
                  color: profileTab === 'profile' ? '#ffffff' : '#475569',
                  fontWeight: 600,
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                <i className="bx bx-user-pin"></i> My Profile & Address
              </button>
              <button
                type="button"
                onClick={() => setProfileTab('shortcuts')}
                style={{
                  flex: 1,
                  padding: '7px 12px',
                  borderRadius: '6px',
                  border: profileTab === 'shortcuts' ? '1.5px solid #0f172a' : '1px solid #e2e8f0',
                  background: profileTab === 'shortcuts' ? '#0f172a' : '#ffffff',
                  color: profileTab === 'shortcuts' ? '#ffffff' : '#475569',
                  fontWeight: 600,
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                <i className="bx bx-grid-alt"></i> Shortcuts
              </button>
            </div>

            {profileTab === 'profile' ? (
              <form onSubmit={handleSaveProfile} style={{ textAlign: 'left', marginBottom: '14px' }}>
                <div className="ts-profile-grid">
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '3px' }}>Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      style={{ fontSize: '12px', padding: '7px 10px' }}
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '3px' }}>Phone Number</label>
                    <input
                      type="text"
                      className="form-control"
                      style={{ fontSize: '12px', padding: '7px 10px' }}
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '10px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '3px' }}>Street Address / Flat / Area</label>
                  <input
                    type="text"
                    className="form-control"
                    style={{ fontSize: '12px', padding: '7px 10px' }}
                    value={profileAddress}
                    onChange={(e) => setProfileAddress(e.target.value)}
                    placeholder="402, Royal Palace, Varachha Main Road"
                  />
                </div>

                <div className="ts-profile-grid">
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '3px' }}>City</label>
                    <input
                      type="text"
                      className="form-control"
                      style={{ fontSize: '12px', padding: '7px 10px' }}
                      value={profileCity}
                      onChange={(e) => setProfileCity(e.target.value)}
                      placeholder="Surat"
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '3px' }}>PIN / Postal Code</label>
                    <input
                      type="text"
                      className="form-control"
                      style={{ fontSize: '12px', padding: '7px 10px' }}
                      value={profilePostalCode}
                      onChange={(e) => setProfilePostalCode(e.target.value)}
                      placeholder="395006"
                    />
                  </div>
                </div>

                <div className="ts-profile-grid" style={{ marginBottom: '14px' }}>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '3px' }}>State</label>
                    <input
                      type="text"
                      className="form-control"
                      style={{ fontSize: '12px', padding: '7px 10px' }}
                      value={profileState}
                      onChange={(e) => setProfileState(e.target.value)}
                      placeholder="Gujarat"
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '3px' }}>Country</label>
                    <input
                      type="text"
                      className="form-control"
                      style={{ fontSize: '12px', padding: '7px 10px' }}
                      value={profileCountry}
                      onChange={(e) => setProfileCountry(e.target.value)}
                      placeholder="India"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={savingProfile}
                  style={{
                    width: '100%',
                    padding: '9px',
                    borderRadius: '6px',
                    background: '#e11d48',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '12.5px',
                    cursor: savingProfile ? 'not-allowed' : 'pointer'
                  }}
                >
                  {savingProfile ? 'Saving Details...' : 'Save Profile Details'}
                </button>
              </form>
            ) : (
              <div className="ts-profile-actions">
                <button
                  type="button"
                  className="ts-profile-btn"
                  onClick={() => {
                    handleClose();
                    if (setCurrentPage) setCurrentPage('track-my-order');
                  }}
                >
                  <i className="bx bx-package"></i> Track My Order
                </button>
                <button
                  type="button"
                  className="ts-profile-btn"
                  onClick={() => {
                    handleClose();
                    if (setIsWishlistOpen) setIsWishlistOpen(true);
                  }}
                >
                  <i className="bx bx-heart"></i> My Wishlist
                </button>
                <button
                  type="button"
                  className="ts-profile-btn"
                  onClick={() => {
                    handleClose();
                    if (setIsCartOpen) setIsCartOpen(true);
                  }}
                >
                  <i className="bx bx-shopping-bag"></i> My Cart
                </button>
              </div>
            )}

            <button
              type="button"
              className="ts-logout-btn"
              onClick={() => {
                logout();
                setMessage('');
              }}
            >
              <i className="bx bx-log-out"></i> Log Out
            </button>
          </div>
        ) : (
          <>
        
        {/* 1. LOGIN VIEW */}
        {viewMode === 'login' && (
          <form className="ts-auth-form" onSubmit={handleLoginSubmit}>
            <div className="ts-form-group">
              <label>Email Address<span className="req">*</span></label>
              <input
                type="email"
                className="form-control"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="ts-form-group">
              <label>Password<span className="req">*</span></label>
              <input
                type="password"
                className="form-control"
                placeholder="**********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="ts-form-options">
              <label className="ts-remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember Me</span>
              </label>

              <button
                type="button"
                className="ts-forgot-pass-link"
                onClick={() => { setViewMode('forgot'); setMessage(''); setIsError(false); }}
              >
                Forgot Password?
              </button>
            </div>

            <button type="submit" className="ts-primary-btn">
              Log In <i className="bx bx-right-arrow-alt"></i>
            </button>

            {/* OR Divider */}
            <div className="ts-auth-divider">
              <span>OR</span>
            </div>

            {/* Social Google Login Button */}
            <button
              type="button"
              className="ts-google-btn"
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              id="torado-google-login-btn"
            >
              <img src="/assets/images/icon/google.svg" alt="Google" />
              <span>{googleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
            </button>

            <div className="switch-account-prompt">
              Don't have an account?
            </div>

            <button
              type="button"
              className="ts-secondary-btn"
              onClick={() => { setViewMode('register'); setMessage(''); setIsError(false); }}
            >
              Create Account <i className="bx bx-right-arrow-alt"></i>
            </button>
          </form>
        )}

        {/* 2. REGISTER VIEW */}
        {viewMode === 'register' && (
          <form className="ts-auth-form" onSubmit={handleRegisterSubmit}>
            <div className="ts-form-group">
              <label>Full Name<span className="req">*</span></label>
              <input
                type="text"
                className="form-control"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="ts-form-group">
              <label>Email Address<span className="req">*</span></label>
              <input
                type="email"
                className="form-control"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="ts-form-group">
              <label>Password<span className="req">*</span></label>
              <input
                type="password"
                className="form-control"
                placeholder="**********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="ts-form-group">
              <label>Confirm Password<span className="req">*</span></label>
              <input
                type="password"
                className="form-control"
                placeholder="**********"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="ts-primary-btn" style={{ marginTop: '8px' }}>
              Create Account <i className="bx bx-right-arrow-alt"></i>
            </button>

            {/* OR Divider */}
            <div className="ts-auth-divider">
              <span>OR</span>
            </div>

            {/* Social Google Sign-Up Button */}
            <button
              type="button"
              className="ts-google-btn"
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              id="torado-google-register-btn"
            >
              <img src="/assets/images/icon/google.svg" alt="Google" />
              <span>{googleLoading ? 'Connecting to Google...' : 'Sign up with Google'}</span>
            </button>

            <div className="switch-account-prompt">
              Already have an account?
            </div>

            <button
              type="button"
              className="ts-secondary-btn"
              onClick={() => { setViewMode('login'); setMessage(''); setIsError(false); }}
            >
              Log In <i className="bx bx-right-arrow-alt"></i>
            </button>
          </form>
        )}

        {/* 3. FORGOT PASSWORD VIEW */}
        {viewMode === 'forgot' && (
          <form className="ts-auth-form" onSubmit={handleForgotSubmit}>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px', lineHeight: '1.5' }}>
              Please enter your registered email address to receive password reset instructions.
            </p>

            <div className="ts-form-group">
              <label>Email Address<span className="req">*</span></label>
              <input
                type="email"
                className="form-control"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>

            <button type="submit" className="ts-primary-btn" style={{ marginTop: '10px' }}>
              Reset Password <i className="bx bx-right-arrow-alt"></i>
            </button>

            <div className="switch-account-prompt">
              Remember your password?
            </div>

            <button
              type="button"
              className="ts-secondary-btn"
              onClick={() => { setViewMode('login'); setMessage(''); setIsError(false); }}
            >
              Back to Login <i className="bx bx-right-arrow-alt"></i>
            </button>
          </form>
        )}
          </>
        )}
      </div>
    </div>
  );
};

export default LoginModal;
