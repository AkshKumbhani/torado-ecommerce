import React, { useState } from 'react';
import './SubscribeSection.css';
import API_BASE from '../../config/api';

const SubscribeSection = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (email) {
      try {
        const apiBase = API_BASE;
        await fetch(`${apiBase}/subscribe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        setMessage('Thank you for subscribing to Torado!');
        setEmail('');
      } catch {
        setMessage('Thank you for subscribing to Torado!');
        setEmail('');
      }
    }
  };

  return (
    <div className="ts-subscribe-area pb-100">
      <div className="ts-subscribe-inner-area position-relative text-center">
        <div className="container position-relative" style={{ zIndex: 2 }}>
          <div className="ts-section-title text-center mb-4">
            <h2>Subscribe Newsletter<br />For Product Launches<br className="d-block d-md-none" /> &amp; Exclusive Offers</h2>
          </div>

          <form className="newsletter-form mx-auto" onSubmit={handleSubscribe}>
            <input
              type="email"
              className="input-newsletter"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="ts-default-btn">
              <span>Subscribe <i className="bx bx-right-arrow-alt"></i></span>
            </button>
          </form>

          {message && <div className="mt-3 fw-bold" style={{ color: '#fff' }}>{message}</div>}
        </div>

        {/* Decorative shapes */}
        <div className="ts-subscribe-shape-1">
          <img src="/assets/images/subscribe/shape-1.png" alt="shape 1" />
        </div>
        <div className="ts-subscribe-shape-2">
          <img src="/assets/images/subscribe/shape-2.png" alt="shape 2" />
        </div>
      </div>
    </div>
  );
};

export default SubscribeSection;
