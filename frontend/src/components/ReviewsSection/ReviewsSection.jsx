import React, { useState, useEffect } from 'react';
import './ReviewsSection.css';
import API_BASE from '../../config/api';

const defaultReviews = [
  {
    id: 1,
    name: "Kavya Patel",
    role: "Verified Buyer",
    image: "/assets/images/reviews/reviews-1.png",
    rating: 5,
    text: "Fabric quality is super premium, color doesn't fade after wash. Highly recommended!"
  },
  {
    id: 2,
    name: "Rahul Sharma",
    role: "Verified Buyer",
    image: "/assets/images/reviews/reviews-2.png",
    rating: 5,
    text: "Perfect fit and super soft cloth. Loved the prompt delivery!"
  },
  {
    id: 3,
    name: "Priya Shah",
    role: "Verified Buyer",
    image: "/assets/images/reviews/reviews-3.png",
    rating: 4,
    text: "Really stylish streetwear aesthetic. Exactly like the website preview."
  },
  {
    id: 4,
    name: "Jonathon Ronan",
    role: "Designer",
    image: "/assets/images/reviews/reviews-4.png",
    rating: 5,
    text: "Their ability to deliver technical yet fashionable shirts has heightened standard of everyday attire!"
  }
];

const ReviewsSection = () => {
  const [reviews, setReviews] = useState(defaultReviews);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animDir, setAnimDir] = useState('');
  const [animating, setAnimating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newReview, setNewReview] = useState({ name: '', rating: 5, comment: '' });
  const [submitToast, setSubmitToast] = useState('');

  useEffect(() => {
    fetch(`${API_BASE}/store/reviews`)
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (Array.isArray(data) && data.length) {
          const mapped = data.map((d, idx) => ({
            id: d.id,
            name: d.customer_name,
            role: 'Verified Buyer',
            image: `/assets/images/reviews/reviews-${(idx % 4) + 1}.png`,
            rating: d.rating || 5,
            text: d.description
          }));
          setReviews([...mapped, ...defaultReviews]);
        }
      })
      .catch(() => {});
  }, []);

  const total = reviews.length;
  const visibleCount = Math.min(3, total);

  const slide = (dir) => {
    if (animating) return;
    setAnimDir(dir);
    setAnimating(true);
    setTimeout(() => {
      setCurrentIndex(prev =>
        dir === 'next'
          ? (prev + 1) % total
          : (prev - 1 + total) % total
      );
      setAnimating(false);
    }, 350);
  };

  const visible = Array.from({ length: visibleCount }, (_, i) =>
    reviews[(currentIndex + i) % total]
  );

  const currentReview = reviews[currentIndex] || defaultReviews[0];

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment) return;
    try {
      await fetch(`${API_BASE}/store/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: newReview.name,
          rating: newReview.rating,
          description: newReview.comment
        })
      });
      setReviews(prev => [
        {
          id: Date.now(),
          name: newReview.name,
          role: 'Verified Buyer',
          image: '/assets/images/reviews/reviews-1.png',
          rating: Number(newReview.rating),
          text: newReview.comment
        },
        ...prev
      ]);
      setSubmitToast('Thank you! Your review has been submitted.');
      setNewReview({ name: '', rating: 5, comment: '' });
      setTimeout(() => {
        setIsModalOpen(false);
        setSubmitToast('');
      }, 1500);
    } catch {
      setIsModalOpen(false);
    }
  };

  return (
    <div className="ts-reviews-area pb-100" id="reviews">
      <div className="container-fluid">

        {/* Header */}
        <div className="ts-section-title d-flex align-items-center justify-content-between flex-wrap gap-3 mb-5">
          <div>
            <h2>What People are saying</h2>
            <p style={{ color: '#64748b', margin: '4px 0 0 0', fontSize: '0.9rem' }}>
              Real reviews from verified Torado customers
            </p>
          </div>
          <div className="section-btn d-flex gap-2">
            <button
              type="button"
              className="ts-default-btn"
              style={{ padding: '8px 18px', fontSize: '0.85rem' }}
              onClick={() => setIsModalOpen(true)}
            >
              <i className="bx bx-edit-alt"></i> Write a Review
            </button>
          </div>
        </div>

        {/* Desktop Slider */}
        <div className="reviews-slider-wrapper d-none d-md-flex">
          <button
            className="reviews-arrow reviews-arrow-prev"
            onClick={() => slide('prev')}
            aria-label="Previous"
          >
            <i className="bx bx-chevron-left"></i>
          </button>

          <div className={`reviews-track ${animating ? `slide-${animDir}` : ''}`}>
            {visible.map((rev, idx) => (
              <div key={`${rev.id}-${idx}`} className="reviews-card-item">
                <div className="ts-reviews-card">
                  <div className="info d-flex align-items-center gap-3 mb-3">
                    <div className="image">
                      <img src={rev.image} alt={rev.name} />
                    </div>
                    <div className="title">
                      <h3>
                        {rev.name}
                        <span className="role"> {rev.role}</span>
                      </h3>
                      <ul className="rating d-flex gap-1 list-unstyled mb-0" style={{ color: '#f59e0b' }}>
                        {Array.from({ length: rev.rating || 5 }).map((_, s) => (
                          <li key={s}><i className="bx bxs-star"></i></li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <p>{rev.text}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            className="reviews-arrow reviews-arrow-next"
            onClick={() => slide('next')}
            aria-label="Next"
          >
            <i className="bx bx-chevron-right"></i>
          </button>
        </div>

        {/* Mobile Single Card */}
        <div className="reviews-mobile-wrapper d-md-none">
          <div className={`reviews-mobile-card-container ${animating ? `slide-${animDir}` : ''}`}>
            <div className="ts-reviews-card">
              <div className="info d-flex align-items-center gap-3 mb-3">
                <div className="image">
                  <img src={currentReview.image} alt={currentReview.name} />
                </div>
                <div className="title">
                  <h3>
                    {currentReview.name}
                    <span className="role"> {currentReview.role}</span>
                  </h3>
                  <ul className="rating d-flex gap-1 list-unstyled mb-0" style={{ color: '#f59e0b' }}>
                    {Array.from({ length: currentReview.rating || 5 }).map((_, s) => (
                      <li key={s}><i className="bx bxs-star"></i></li>
                    ))}
                  </ul>
                </div>
              </div>
              <p>{currentReview.text}</p>
            </div>
          </div>

          <div className="reviews-mobile-nav">
            <button className="reviews-arrow" onClick={() => slide('prev')} aria-label="Previous">
              <i className="bx bx-chevron-left"></i>
            </button>
            <button className="reviews-arrow" onClick={() => slide('next')} aria-label="Next">
              <i className="bx bx-chevron-right"></i>
            </button>
          </div>
        </div>

        {/* Write Review Modal */}
        {isModalOpen && (
          <div
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999,
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
            }}
            onClick={() => setIsModalOpen(false)}
          >
            <div
              style={{
                background: '#fff', borderRadius: '12px', padding: '24px', maxWidth: '440px',
                width: '100%', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)'
              }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>Write a Customer Review</h3>
                <button
                  type="button"
                  style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer' }}
                  onClick={() => setIsModalOpen(false)}
                >
                  &times;
                </button>
              </div>

              {submitToast ? (
                <div style={{ padding: '12px', background: '#ecfdf5', color: '#047857', borderRadius: '8px', textAlign: 'center', fontWeight: 600 }}>
                  {submitToast}
                </div>
              ) : (
                <form onSubmit={handleSubmitReview}>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                      value={newReview.name}
                      onChange={e => setNewReview({ ...newReview, name: e.target.value })}
                    />
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Rating *</label>
                    <select
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                      value={newReview.rating}
                      onChange={e => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                    >
                      <option value="5">★★★★★ (5 Stars - Excellent)</option>
                      <option value="4">★★★★☆ (4 Stars - Very Good)</option>
                      <option value="3">★★★☆☆ (3 Stars - Average)</option>
                      <option value="2">★★☆☆☆ (2 Stars - Poor)</option>
                      <option value="1">★☆☆☆☆ (1 Star - Terrible)</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Your Experience / Feedback *</label>
                    <textarea
                      required
                      rows="4"
                      placeholder="Share your thoughts on the quality, fabric, and delivery..."
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', resize: 'vertical' }}
                      value={newReview.comment}
                      onChange={e => setNewReview({ ...newReview, comment: e.target.value })}
                    ></textarea>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button
                      type="button"
                      style={{ padding: '8px 16px', background: '#f1f5f9', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                      onClick={() => setIsModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="ts-default-btn"
                      style={{ padding: '8px 18px', border: 'none', borderRadius: '6px' }}
                    >
                      Submit Review
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ReviewsSection;
