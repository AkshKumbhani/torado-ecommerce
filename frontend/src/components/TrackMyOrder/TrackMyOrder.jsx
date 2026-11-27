import React, { useState, useEffect } from 'react';
import API_BASE from '../../config/api';
import './TrackMyOrder.css';
import { useShop } from '../../context/ShopContext.jsx';

const TrackMyOrder = () => {
  const { setCurrentPage } = useShop();

  const [orderId, setOrderId] = useState('');
  const [billingEmail, setBillingEmail] = useState('');
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const navigateTo = (page, hash) => {
    setCurrentPage(page);
    if (hash) window.location.hash = hash;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTrackOrder = async (e) => {
    e.preventDefault();
    if (!orderId.trim() || !billingEmail.trim()) {
      alert('Please enter both Order ID and Billing Email');
      return;
    }

    setLoading(true);
    try {
      const apiBase = API_BASE;
      const cleanId = orderId.trim().replace(/^[^\d]+/i, '');
      const res = await fetch(`${apiBase}/store/orders/track?id=${encodeURIComponent(cleanId)}&email=${encodeURIComponent(billingEmail.trim())}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Order not found');

      const st = String(data.status || 'pending').toLowerCase();
      const statusLabels = {
        pending: 'Order Placed',
        confirmed: 'Confirmed',
        processing: 'Processing & Packed',
        shipped: 'Shipped (In Transit)',
        out_for_delivery: 'Out for Delivery',
        delivered: 'Delivered',
        cancelled: 'Cancelled',
        returned: 'Returned'
      };

      const orderDate = new Date(data.created_at || Date.now()).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric'
      });

      setTrackingData({
        orderId: `TRD-${data.id}`,
        status: statusLabels[st] || 'In Progress',
        carrier: 'Torado Express Logistics',
        trackingNumber: `TRD-TRK-${data.id}-${Date.now().toString().slice(-6)}`,
        estimatedDelivery: '3 - 5 business days',
        steps: [
          { title: 'Order Placed & Confirmed', date: orderDate, completed: true },
          { title: 'Processing & Quality Check', date: 'Same day', completed: ['processing', 'shipped', 'out_for_delivery', 'delivered'].includes(st), current: st === 'confirmed' || st === 'processing' },
          { title: 'Shipped (In Transit)', date: 'Dispatched from hub', completed: ['shipped', 'out_for_delivery', 'delivered'].includes(st), current: st === 'shipped' },
          { title: 'Out for Delivery', date: 'Local courier partner', completed: ['out_for_delivery', 'delivered'].includes(st), current: st === 'out_for_delivery' },
          { title: 'Delivered', date: st === 'delivered' ? 'Delivered' : 'Pending', completed: st === 'delivered', current: st === 'delivered' }
        ]
      });
    } catch (err) {
      alert(err.message || 'Failed to track order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="torado-track-order-page">
      {/* 1. Page Banner (Matches Screenshot 1) */}
      <div className="ts-page-banner-area pt-100 pb-100">
        <div className="container">
          <div className="ts-page-banner-content text-center">
            <h2>Track My Order</h2>
            <ul className="list">
              <li>
                <a
                  href="#home"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo('home', '#home');
                  }}
                >
                  Home
                </a>
              </li>
              <li>Track My Order</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 2. Main Tracking Section (Matches Screenshot 2) */}
      <div className="ts-track-order-area pt-100 pb-100">
        <div className="container">
          <div className="track-order-content">
            <h2 className="title">All In One Package Tracking</h2>

            <form onSubmit={handleTrackOrder} className="track-order-form">
              <div className="form-group">
                <label>Order ID</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder=""
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Billing Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder=""
                  value={billingEmail}
                  onChange={(e) => setBillingEmail(e.target.value)}
                  required
                />
              </div>

              <div className="track-btn-wrapper">
                <button type="submit" className="ts-default-btn" disabled={loading}>
                  {loading ? 'Tracking...' : 'Track Order'}
                </button>
              </div>
            </form>

            {/* Tracking Result View */}
            {trackingData && (
              <div className="tracking-result-box">
                <div className="result-header">
                  <div className="result-info">
                    <h4>Order ID: <span>{trackingData.orderId}</span></h4>
                    <p>Carrier: <strong>{trackingData.carrier}</strong> | Tracking: <strong>{trackingData.trackingNumber}</strong></p>
                  </div>
                  <div className="result-badge">
                    <span className="status-pill">{trackingData.status}</span>
                    <p className="delivery-est">Est. Delivery: <strong>{trackingData.estimatedDelivery}</strong></p>
                  </div>
                </div>

                <div className="tracking-timeline">
                  {trackingData.steps.map((step, idx) => (
                    <div
                      key={idx}
                      className={`timeline-step ${step.completed ? 'completed' : ''} ${step.current ? 'current' : ''}`}
                    >
                      <div className="step-bullet">
                        {step.completed ? <i className="bx bx-check"></i> : <span className="dot"></span>}
                      </div>
                      <div className="step-content">
                        <h5>{step.title}</h5>
                        <span className="step-date">{step.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackMyOrder;
