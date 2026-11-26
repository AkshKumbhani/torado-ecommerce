import React, { useState, useEffect } from "react";
import "./ContactUs.css";
import { useShop } from "../../context/ShopContext.jsx";

const brandLogos = [
  { name: "Hipster", sub: "Design Studio", style: "brand-hipster" },
  { name: "Rosé", sub: "Beverage", style: "brand-rose" },
  { name: "Sophia", sub: "Beauty Salon", style: "brand-sophia" },
  { name: "B", sub: "Bars & Restaurant", style: "brand-b" },
  { name: "Anna's", sub: "Flower Street", style: "brand-annas" },
  { name: "⚡", sub: "", style: "brand-lightning" },
  { name: "Diana Hill", sub: "Photography", style: "brand-diana" },
  { name: "Carol", sub: "", style: "brand-carol" },
];

const ContactUs = () => {
  const { setCurrentPage } = useShop();
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "", save: false });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

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
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    if (!form.phone.trim()) e.phone = "Phone is required";
    if (!form.subject.trim()) e.subject = "Subject is required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    try {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      await fetch(`${apiBase}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      setSent(true);
      setForm({ name: "", email: "", phone: "", subject: "", message: "", save: false });
      setErrors({});
      setTimeout(() => setSent(false), 5000);
    } catch {
      setSent(true);
      setTimeout(() => setSent(false), 5000);
    }
  };

  return (
    <div className="torado-contact-page">
      {/* 1. Page Banner */}
      <div className="tc-page-banner">
        <div className="container">
          <div className="tc-banner-content text-center">
            <h2><span>Contact</span> Us</h2>
            <ul className="tc-breadcrumb">
              <li><a href="#home" onClick={(e) => { e.preventDefault(); navigateTo("home", "#home"); }}>Home</a></li>
              <li className="sep">&gt;&gt;</li>
              <li className="active">Contact Us</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 2. Contact Form + Info */}
      <div className="tc-contact-area pt-100 pb-100">
        <div className="container">
          <div className="row">

            {/* LEFT: Contact Form */}
            <div className="col-lg-7 col-md-12">
              <div className="tc-contact-form-wrap">
                <h2>Drop Us a <strong>Message</strong> We Will Love<br />To Hear From You</h2>
                {sent && <div className="tc-success-msg">Message sent successfully! We will reply soon.</div>}
                <form onSubmit={handleSubmit} noValidate>
                  <div className="tc-form-row">
                    <div className="tc-form-group">
                      <label>Name <span className="req">*</span></label>
                      <input
                        type="text" placeholder="Your name"
                        className={errors.name ? "error" : ""}
                        value={form.name}
                        onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
                      />
                      {errors.name && <span className="tc-error">{errors.name}</span>}
                    </div>
                  </div>

                  <div className="tc-form-row">
                    <div className="tc-form-group">
                      <label>Email <span className="req">*</span></label>
                      <input
                        type="email" placeholder="Email Address"
                        className={errors.email ? "error" : ""}
                        value={form.email}
                        onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
                      />
                      {errors.email && <span className="tc-error">{errors.email}</span>}
                    </div>
                  </div>

                  <div className="tc-form-row">
                    <div className="tc-form-group">
                      <label>Phone No <span className="req">*</span></label>
                      <input
                        type="tel" placeholder="Phone Number"
                        className={errors.phone ? "error" : ""}
                        value={form.phone}
                        onChange={(e) => setForm(p => ({ ...p, phone: e.target.value }))}
                      />
                      {errors.phone && <span className="tc-error">{errors.phone}</span>}
                    </div>
                  </div>

                  <div className="tc-form-row">
                    <div className="tc-form-group">
                      <label>Subject <span className="req">*</span></label>
                      <input
                        type="text" placeholder="Your Subject"
                        className={errors.subject ? "error" : ""}
                        value={form.subject}
                        onChange={(e) => setForm(p => ({ ...p, subject: e.target.value }))}
                      />
                      {errors.subject && <span className="tc-error">{errors.subject}</span>}
                    </div>
                  </div>

                  <div className="tc-form-row">
                    <div className="tc-form-group">
                      <label>Write Your Message Here</label>
                      <textarea
                        rows="6" placeholder="Write Your Message"
                        value={form.message}
                        onChange={(e) => setForm(p => ({ ...p, message: e.target.value }))}
                      ></textarea>
                    </div>
                  </div>

                  <div className="tc-save-row">
                    <label className="tc-checkbox-label">
                      <input
                        type="checkbox"
                        checked={form.save}
                        onChange={(e) => setForm(p => ({ ...p, save: e.target.checked }))}
                      />
                      <span>Save this information for next time</span>
                    </label>
                  </div>

                  <button type="submit" className="ts-default-btn tc-send-btn">
                    Send Message <i className="bx bx-right-arrow-alt"></i>
                  </button>
                </form>
              </div>
            </div>

            {/* RIGHT: Contact Info */}
            <div className="col-lg-5 col-md-12">
              <div className="tc-info-wrap">

                <div className="tc-info-card">
                  <h4>Address</h4>
                  <p>26 Randall Mill Street, Leominster, MA 01453</p>
                  <p>Phn No: 009 321 4567</p>
                </div>

                <div className="tc-info-card">
                  <h4>Contact Information</h4>
                  <p>+391 (0)35 2568 4593, &nbsp; +391 (0)35 2568 4604,</p>
                  <p>hellotorado@domain.com</p>
                </div>

                <div className="tc-info-card">
                  <h4>We are open</h4>
                  <p>Our store has re-opened for shopping, exchanges</p>
                  <p>Every day <strong>11am</strong> to <strong>7pm</strong></p>
                </div>

                <div className="tc-info-card">
                  <h4>Social Media</h4>
                  <ul className="tc-social-links">
                    <li>
                      <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
                        <i className="bx bxl-facebook"></i>
                      </a>
                    </li>
                    <li>
                      <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter">
                        <i className="bx bxl-twitter"></i>
                      </a>
                    </li>
                    <li>
                      <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
                        <i className="bx bxl-instagram"></i>
                      </a>
                    </li>
                    <li>
                      <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                        <i className="bx bxl-linkedin"></i>
                      </a>
                    </li>
                  </ul>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Google Map */}
      <div className="tc-map-area">
        <iframe
          title="Torado Store Location"
          src="https://www.openstreetmap.org/export/embed.html?bbox=-71.8196%2C42.5151%2C-71.7796%2C42.5351&layer=mapnik&marker=42.5251%2C-71.799"
          style={{ width: "100%", height: "100%", border: 0 }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>

      {/* 4. Brand Logos Strip */}
      <div className="tc-brands-area py-5">
        <div className="container-fluid">
          <div className="tc-brands-track">
            {[...brandLogos, ...brandLogos].map((brand, idx) => (
              <div key={idx} className={`tc-brand-logo ${brand.style}`}>
                <span className="brand-name">{brand.name}</span>
                {brand.sub && <span className="brand-sub">{brand.sub}</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default ContactUs;