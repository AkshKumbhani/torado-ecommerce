import React, { useState, useEffect } from "react";
import "./MyAccount.css";
import { useShop } from "../../context/ShopContext.jsx";

const Login = () => {
  const { setCurrentPage } = useShop();
  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState('');
  const [forgot, setForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (!document.querySelector('script[data-google-identity]')) {
      const script = document.createElement('script'); script.src = 'https://accounts.google.com/gsi/client'; script.async = true; script.defer = true; script.dataset.googleIdentity = 'true'; document.head.appendChild(script);
    }
  }, []);

  const navigateTo = (page, hash) => {
    setCurrentPage(page);
    if (hash) window.location.hash = hash;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = "Email Address is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email address";
    if (!form.password.trim()) e.password = "Password is required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setSubmitted(true); setApiError('');
    setErrors({});
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: form.email, password: form.password }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.message || 'Unable to sign in.');
      localStorage.setItem('torado_customer_token', data.token); alert(`Welcome back, ${data.user.name}.`); navigateTo('home', '#home');
    } catch (err) { setApiError(err.message); }
    finally { setSubmitted(false); }
  };

  const requestOtp = async (e) => { e.preventDefault(); setApiError(''); try { const response=await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/auth/forgot-password`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:forgotEmail})}); const data=await response.json(); if(!response.ok)throw new Error(data.message); setOtpSent(true); setApiError(data.message); } catch(err){setApiError(err.message);} };
  const resetPassword = async (e) => { e.preventDefault(); setApiError(''); try { const response=await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/auth/reset-password`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:forgotEmail,otp,password:newPassword})}); const data=await response.json(); if(!response.ok)throw new Error(data.message); setForgot(false);setOtpSent(false);setApiError('Password updated. Please sign in.'); } catch(err){setApiError(err.message);} };
  const googleLogin = () => {
    if (!window.google?.accounts?.id || !import.meta.env.VITE_GOOGLE_CLIENT_ID) { setApiError('Google sign in needs VITE_GOOGLE_CLIENT_ID and Google Identity Services setup.'); return; }
    window.google.accounts.id.initialize({ client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID, callback: async ({ credential }) => { try { const response=await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/auth/google`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({credential})});const data=await response.json();if(!response.ok)throw new Error(data.message);localStorage.setItem('torado_customer_token',data.token);navigateTo('home','#home');}catch(err){setApiError(err.message);} } });
    window.google.accounts.id.prompt();
  };

  return (
    <div className="torado-my-account-page">
      {/* 1. Page Banner */}
      <div className="tma-page-banner">
        <div className="container">
          <div className="tma-banner-content text-center">
            <h2><strong>My</strong> Account</h2>
            <ul className="tma-breadcrumb">
              <li>
                <a href="#home" onClick={(e) => { e.preventDefault(); navigateTo("home", "#home"); }}>
                  Home
                </a>
              </li>
              <li className="sep">&gt;&gt;</li>
              <li className="active">My Account</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 2. Login Area */}
      <div className="tma-auth-area pt-100 pb-100">
        <div className="container">
          <div className="row align-items-center">
            
            {/* Left Image */}
            <div className="col-lg-6 col-md-12 mb-4 mb-lg-0">
              <div className="tma-auth-image">
                <img
                  src="/assets/images/my-account/login.jpg"
                  alt="Torado Store Login"
                />
              </div>
            </div>

            {/* Right Form */}
            <div className="col-lg-6 col-md-12">
              <div className="tma-auth-form-wrap">
                <h2>Login</h2>
                {apiError && <div className="tma-error">{apiError}</div>}

                {submitted && (
                  <div className="tma-success-msg">
                    Logging you in...
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                  <div className="tma-form-group">
                    <label>Email Address<span className="req">*</span></label>
                    <input
                      type="email"
                      placeholder="Email Address"
                      className={errors.email ? "error" : ""}
                      value={form.email}
                      onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
                    />
                    {errors.email && <span className="tma-error">{errors.email}</span>}
                  </div>

                  <div className="tma-form-group">
                    <label>Password<span className="req">*</span></label>
                    <input
                      type="password"
                      placeholder="**********"
                      className={errors.password ? "error" : ""}
                      value={form.password}
                      onChange={(e) => setForm(p => ({ ...p, password: e.target.value }))}
                    />
                    {errors.password && <span className="tma-error">{errors.password}</span>}
                  </div>

                  <div className="tma-options-row d-flex align-items-center justify-content-between">
                    <label className="tma-checkbox-label">
                      <input
                        type="checkbox"
                        checked={form.remember}
                        onChange={(e) => setForm(p => ({ ...p, remember: e.target.checked }))}
                      />
                      <span>Remember Me</span>
                    </label>
                    <button type="button"
                      className="tma-forgot-link"
                      onClick={(e) => { e.preventDefault(); setForgot(!forgot); setApiError(''); }}>
                      Forgot Password?
                    </button>
                  </div>

                  {forgot && <div className="tma-form-group"><label>Email Address</label><input type="email" value={forgotEmail} onChange={e=>setForgotEmail(e.target.value)} placeholder="Email address" required />{otpSent && <><label>6-digit code</label><input value={otp} onChange={e=>setOtp(e.target.value)} inputMode="numeric" maxLength={6} placeholder="Verification code"/><label>New password</label><input type="password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} placeholder="At least 8 characters"/></>}<button type="button" className="tma-outline-btn w-100" onClick={otpSent ? resetPassword : requestOtp}>{otpSent ? 'Verify code & reset password' : 'Send email code'}</button></div>}

                  <button type="submit" className="ts-default-btn tma-submit-btn w-100">
                    Log In <i className="bx bx-right-arrow-alt"></i>
                  </button>

                  <div className="tma-switch-prompt text-center">
                    <p>Don't have an account?</p>
                    <button
                      type="button"
                      className="tma-outline-btn w-100"
                      onClick={() => navigateTo("register", "#register")}
                    >
                      Create Account <i className="bx bx-right-arrow-alt"></i>
                    </button>
                  </div>

                  <div className="tma-divider">
                    <span>Or</span>
                  </div>

                  <div className="tma-social-login">
                    <a href="https://facebook.com" target="_blank" rel="noreferrer" className="soc-fb" aria-label="Facebook">
                      <i className="bx bxl-facebook"></i>
                    </a>
                    <button type="button" onClick={googleLogin} className="soc-google" aria-label="Google">
                      <i className="bx bxl-google"></i>
                    </button>
                    <a href="https://twitter.com" target="_blank" rel="noreferrer" className="soc-twitter" aria-label="Twitter">
                      <i className="bx bxl-twitter"></i>
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="soc-linkedin" aria-label="LinkedIn">
                      <i className="bx bxl-linkedin"></i>
                    </a>
                  </div>
                </form>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
