import React, { useState } from 'react';
import './Footer.css';
import { useShop } from '../../context/ShopContext.jsx';

const Footer = () => {
  const { setCurrentPage } = useShop();
  const [selectedOffer, setSelectedOffer] = useState('men');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <>
      <footer className="ts-footer-area pt-100 pb-75">
        <div className="container-fluid">
          <div className="row">
            {/* Logo & Description & Socials */}
            <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
              <div className="ts-single-footer-widget">
                <div className="widget-logo mb-3">
                  <a href="/">
                    <img src="/assets/images/white-logo.svg" alt="Torado Logo" style={{ maxHeight: '38px' }} />
                  </a>
                </div>
                <p>
                  Future Tees by Torado Mart is a collaboration born out of the desire to take the best service.
                </p>
                <div className="ts-footer-social">
                  <span className="d-none d-md-block">Follow Us On :</span>
                  <ul className="d-flex align-items-center list-unstyled">
                    <li>
                      <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook">
                        <i className="bx bxl-facebook"></i>
                      </a>
                    </li>
                    <li>
                      <a href="https://twitter.com/" target="_blank" rel="noreferrer" aria-label="Twitter">
                        <i className="bx bxl-twitter"></i>
                      </a>
                    </li>
                    <li>
                      <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram">
                        <i className="bx bxl-instagram"></i>
                      </a>
                    </li>
                    <li>
                      <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                        <i className="bx bxl-linkedin"></i>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Shop Column */}
            <div className="col-xl-2 col-lg-2 col-md-3 col-sm-6 col-12 mb-4">
              <div className="ts-single-footer-widget">
                <h3>Shop</h3>
                <ul className="quick-links">
                  <li>
                    <a
                      href="#shop-all-for-men"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage('shop-all-for-men');
                        window.location.hash = '#shop-all-for-men';
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      Shop All Men's
                    </a>
                  </li>
                  <li>
                    <a
                      href="#shop-all-for-women"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage('shop-all-for-women');
                        window.location.hash = '#shop-all-for-women';
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      Shop All Women's
                    </a>
                  </li>
                  <li><a href="#customize">Customize t-shirts</a></li>
                  <li><a href="#collection">Winter Collections</a></li>
                  <li><a href="#wishlist">Wishlist</a></li>
                </ul>
              </div>
            </div>

            {/* Pages Column */}
            <div className="col-xl-2 col-lg-2 col-md-3 col-sm-6 col-12 mb-4">
              <div className="ts-single-footer-widget">
                <h3>Pages</h3>
                <ul className="quick-links">
                  <li>
                    <a
                      href="#about"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage('about-us');
                        window.location.hash = '#about';
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      About Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="#blog-left-sidebar"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage('blog-left-sidebar');
                        window.location.hash = '#blog-left-sidebar';
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      Blog
                    </a>
                  </li>
                  <li>
                    <a
                      href="#login"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage('login');
                        window.location.hash = '#login';
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      My Account
                    </a>
                  </li>
                  <li><a href="#cart">Cart</a></li>
                </ul>
              </div>
            </div>

            {/* Contact Column */}
            <div className="col-xl-2 col-lg-2 col-md-3 col-sm-6 col-12 mb-4">
              <div className="ts-single-footer-widget">
                <h3>Contact</h3>
                <ul className="quick-links">
                  <li>
                    <a
                      href="#contact-us"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage('contact-us');
                        window.location.hash = '#contact-us';
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      Contact Us
                    </a>
                  </li>
                  <li>
                    <a href="#faq" onClick={(e) => { e.preventDefault(); setCurrentPage('faq'); window.location.hash = '#faq'; window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                      FAQ
                    </a>
                  </li>
                  <li>
                    <a
                      href="#refund-return-policy"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage('refund-return-policy');
                        window.location.hash = '#refund-return-policy';
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      Returns &amp; Exchange
                    </a>
                  </li>
                  <li><a href="#size">Size + Fit</a></li>
                </ul>
              </div>
            </div>

            {/* Sign up newsletter Column */}
            <div className="col-xl-3 col-lg-4 col-md-6 col-12 mb-4">
              <div className="ts-single-footer-widget">
                <h3>Sign up for product launches and exclusive offers</h3>
                <ul className="ts-offers-list list-unstyled my-3">
                  <li>
                    <div className="list">
                      <input
                        type="radio"
                        id="offer-men"
                        name="offer-group"
                        checked={selectedOffer === 'men'}
                        onChange={() => setSelectedOffer('men')}
                      />
                      <label htmlFor="offer-men">Men</label>
                    </div>
                  </li>
                  <li>
                    <div className="list">
                      <input
                        type="radio"
                        id="offer-women"
                        name="offer-group"
                        checked={selectedOffer === 'women'}
                        onChange={() => setSelectedOffer('women')}
                      />
                      <label htmlFor="offer-women">Women</label>
                    </div>
                  </li>
                  <li>
                    <div className="list">
                      <input
                        type="radio"
                        id="offer-both"
                        name="offer-group"
                        checked={selectedOffer === 'both'}
                        onChange={() => setSelectedOffer('both')}
                      />
                      <label htmlFor="offer-both">Both</label>
                    </div>
                  </li>
                </ul>

                <form className="ts-newsletter-form" onSubmit={handleSubmit}>
                  <input
                    type="email"
                    className="input-newsletter"
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button type="submit" aria-label="Subscribe">
                    <i className="bx bx-right-arrow-alt"></i>
                  </button>
                </form>

                {subscribed && (
                  <div className="mt-2 text-success small">
                    Thank you for subscribing!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Copyright */}
      <div className="ts-copyright-area">
        <div className="container-fluid">
          <div className="copyright-area-content text-center">
            <p>
              © Copyright <span>Torado</span> All Rights Reserved by <a href="https://envytheme.com/" target="_blank" rel="noreferrer">EnvyTheme</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
