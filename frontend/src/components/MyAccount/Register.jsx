import React, { useState, useEffect } from "react";
import API_BASE from '../../config/api';
import "./MyAccount.css";
import { useShop } from "../../context/ShopContext.jsx";

const Register = () => {
  const { setCurrentPage } = useShop();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", terms: false });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const navigateTo = (page, hash) => {
    setCurrentPage(page);
    if (hash) window.location.hash = hash;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "First Name is required";
    if (!form.lastName.trim()) e.lastName = "Last Name is required";
    if (!form.email.trim()) e.email = "Email Address is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email address";
    if (!form.password.trim()) e.password = "Password is required";
    else if (form.password.length < 8) e.password = "Password must be at least 8 characters";
    if (!form.terms) e.terms = "You must accept Terms & Conditions";
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
      const response = await fetch(`${API_BASE}/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: `${form.firstName.trim()} ${form.lastName.trim()}`, email: form.email, password: form.password }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.message || 'Unable to create your account.');
      localStorage.setItem('torado_customer_token', data.token); alert('Your account is ready.'); navigateTo('home', '#home');
    } catch (err) { setApiError(err.message); }
    finally { setSubmitted(false); }
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

      {/* 2. Register Area */}
      <div className="tma-auth-area pt-100 pb-100">
        <div className="container">
          <div className="row align-items-center">
            
            {/* Left Image */}
            <div className="col-lg-6 col-md-12 mb-4 mb-lg-0">
              <div className="tma-auth-image">
                <img
                  src="/assets/images/my-account/register.jpg"
                  alt="Torado Store Register"
                />
              </div>
            </div>

            {/* Right Form */}
            <div className="col-lg-6 col-md-12">
              <div className="tma-auth-form-wrap">
                <h2>Register</h2>

                {submitted && (
                  <div className="tma-success-msg">
                    Creating your account...
                  </div>
                )}
                {apiError && <div className="tma-error">{apiError}</div>}

                <form onSubmit={handleSubmit} noValidate>
                  <div className="tma-form-group">
                    <label>First Name<span className="req">*</span></label>
                    <input
                      type="text"
                      placeholder="First name"
                      className={errors.firstName ? "error" : ""}
                      value={form.firstName}
                      onChange={(e) => setForm(p => ({ ...p, firstName: e.target.value }))}
                    />
                    {errors.firstName && <span className="tma-error">{errors.firstName}</span>}
                  </div>

                  <div className="tma-form-group">
                    <label>Last Name<span className="req">*</span></label>
                    <input
                      type="text"
                      placeholder="Last name"
                      className={errors.lastName ? "error" : ""}
                      value={form.lastName}
                      onChange={(e) => setForm(p => ({ ...p, lastName: e.target.value }))}
                    />
                    {errors.lastName && <span className="tma-error">{errors.lastName}</span>}
                  </div>

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

                  <div className="tma-options-row">
                    <label className="tma-checkbox-label">
                      <input
                        type="checkbox"
                        checked={form.terms}
                        onChange={(e) => setForm(p => ({ ...p, terms: e.target.checked }))}
                      />
                      <span>I accept all <strong>Terms & Conditions</strong></span>
                    </label>
                    {errors.terms && <span className="tma-error d-block">{errors.terms}</span>}
                  </div>

                  <button type="submit" className="ts-default-btn tma-submit-btn w-100">
                    Register <i className="bx bx-right-arrow-alt"></i>
                  </button>

                  <div className="tma-switch-prompt text-center">
                    <p>Already have an account?</p>
                    <button
                      type="button"
                      className="tma-outline-btn w-100"
                      onClick={() => navigateTo("login", "#login")}
                    >
                      Login Now <i className="bx bx-right-arrow-alt"></i>
                    </button>
                  </div>

                  <div className="tma-divider">
                    <span>Or</span>
                  </div>

                  <div className="tma-social-login">
                    <a href="https://facebook.com" target="_blank" rel="noreferrer" className="soc-fb" aria-label="Facebook">
                      <i className="bx bxl-facebook"></i>
                    </a>
                    <a href="https://google.com" target="_blank" rel="noreferrer" className="soc-google" aria-label="Google">
                      <i className="bx bxl-google"></i>
                    </a>
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

export default Register;
