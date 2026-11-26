import React, { useState, useEffect, useRef } from 'react';
import './Navbar.css';
import { useShop } from '../../context/ShopContext.jsx';

const Navbar = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [responsiveOptionsOpen, setResponsiveOptionsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const navRef = useRef(null);

  const {
    currentPage,
    setCurrentPage,
    setIsSearchOpen,
    setIsLoginOpen,
    setIsWishlistOpen,
    setIsCartOpen,
    cartItems,
    wishlistItems,
    currentUser,
    logout
  } = useShop();

  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navigateTo = (page, hash = '') => {
    setCurrentPage(page);
    if (hash) {
      window.location.hash = hash;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileMenuOpen(false);
    setResponsiveOptionsOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 150) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setResponsiveOptionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const toggleMenu = (menuName) => {
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className={`ts-navbar-area ${isSticky ? 'is-sticky' : ''}`} ref={navRef}>
      {/* Mobile / Tablet Header Bar */}
      <div className="main-responsive-nav">
        <div className="container">
          <div className="main-responsive-menu d-flex align-items-center justify-content-between">
            <div className="logo">
              <a href="#home" onClick={(e) => { e.preventDefault(); navigateTo('home', '#home'); }}>
                <img src="/assets/images/logo.svg" alt="Torado Logo" />
              </a>
            </div>

            <div className="responsive-actions d-flex align-items-center">
              {/* Three Dots Button */}
              <button
                type="button"
                className={`responsive-dot-menu-btn ${responsiveOptionsOpen ? 'active' : ''}`}
                onClick={() => {
                  setResponsiveOptionsOpen(!responsiveOptionsOpen);
                  if (mobileMenuOpen) setMobileMenuOpen(false);
                }}
                aria-label="Toggle options"
              >
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </button>

              {/* Burger / Close Menu Toggle Button */}
              <button
                type="button"
                className={`responsive-burger-menu ${mobileMenuOpen ? 'open' : ''}`}
                onClick={() => {
                  setMobileMenuOpen(!mobileMenuOpen);
                  if (responsiveOptionsOpen) setResponsiveOptionsOpen(false);
                }}
                aria-label="Toggle navigation menu"
              >
                <span className="top-bar"></span>
                <span className="middle-bar"></span>
                <span className="bottom-bar"></span>
              </button>
            </div>
          </div>
        </div>

        {/* 3-Dots Floating Options Popup (Matches Screenshot 2) */}
        {responsiveOptionsOpen && (
          <div className="responsive-options-popup">
            <div className="option-item">
              <button
                type="button"
                className="option-btn"
                onClick={() => { setIsSearchOpen(true); setResponsiveOptionsOpen(false); }}
                title="Search"
              >
                <img src="/assets/images/icon/search-normal.svg" alt="Search" />
              </button>
            </div>
            <div className="option-item">
              {currentUser ? (
                <button
                  type="button"
                  className="option-btn torado-mob-avatar-btn"
                  onClick={() => { setIsLoginOpen(true); setResponsiveOptionsOpen(false); }}
                  title={`Logged in as ${currentUser.name}`}
                >
                  <span className="torado-nav-avatar">
                    {currentUser.name ? currentUser.name[0].toUpperCase() : 'U'}
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  className="option-btn"
                  onClick={() => { setIsLoginOpen(true); setResponsiveOptionsOpen(false); }}
                  title="Account"
                >
                  <img src="/assets/images/icon/user.svg" alt="Account" />
                </button>
              )}
            </div>
            <div className="option-item">
              <button
                type="button"
                className="option-btn"
                onClick={() => { setIsWishlistOpen(true); setResponsiveOptionsOpen(false); }}
                title="Wishlist"
              >
                <img src="/assets/images/icon/heart.svg" alt="Wishlist" />
                {wishlistItems.length > 0 && <span className="number">{wishlistItems.length}</span>}
              </button>
            </div>
            <div className="option-item">
              <button
                type="button"
                className="option-btn"
                onClick={() => { setIsCartOpen(true); setResponsiveOptionsOpen(false); }}
                title="Cart"
              >
                <img src="/assets/images/icon/shopping-bag.svg" alt="Cart" />
                <span className="number">{totalCartCount}</span>
              </button>
            </div>
          </div>
        )}

        {/* Collapsible Mobile Navigation Menu (Matches Screenshot 3) */}
        <div className={`responsive-mobile-nav-collapse ${mobileMenuOpen ? 'open' : ''}`}>
          <ul className="responsive-nav-list">
            <li className="responsive-nav-item">
              <a
                href="#home"
                className={`responsive-nav-link ${currentPage === 'home' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); navigateTo('home', '#home'); }}
              >
                HOME
              </a>
            </li>

            <li className="responsive-nav-item">
              <a
                href="#shop-hidden-sidebar"
                className={`responsive-nav-link ${currentPage === 'shop-hidden-sidebar' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); navigateTo('shop-hidden-sidebar', '#shop-hidden-sidebar'); }}
              >
                SHOP
              </a>
            </li>

            <li className="responsive-nav-item">
              <a
                href="#shop-all-for-men"
                className={`responsive-nav-link ${currentPage === 'shop-all-for-men' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); navigateTo('shop-all-for-men', '#shop-all-for-men'); }}
              >
                MEN
              </a>
            </li>

            <li className="responsive-nav-item">
              <a
                href="#shop-all-for-women"
                className={`responsive-nav-link ${currentPage === 'shop-all-for-women' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); navigateTo('shop-all-for-women', '#shop-all-for-women'); }}
              >
                WOMEN
              </a>
            </li>

            <li className={`responsive-nav-item has-submenu ${activeMenu === 'pages' ? 'expanded' : ''}`}>
              <div className="responsive-nav-link-wrapper" onClick={() => toggleMenu('pages')}>
                <span className="responsive-nav-label">PAGES</span>
                <span className="responsive-toggle-icon">{activeMenu === 'pages' ? '-' : '+'}</span>
              </div>
              {activeMenu === 'pages' && (
                <ul className="responsive-submenu-list">
                  <li><a href="#about" onClick={(e) => { e.preventDefault(); navigateTo('about-us', '#about'); }}>About Us</a></li>
                  <li><a href="#blog-left-sidebar" onClick={(e) => { e.preventDefault(); navigateTo('blog-left-sidebar', '#blog-left-sidebar'); }}>Blog</a></li>
                  <li><a href="#contact-us" onClick={(e) => { e.preventDefault(); navigateTo('contact-us', '#contact-us'); }}>Contact Us</a></li>
                  <li><a href="#faq" onClick={(e) => { e.preventDefault(); navigateTo('faq', '#faq'); }}>FAQ</a></li>
                  <li><a href="#login" onClick={(e) => { e.preventDefault(); navigateTo('login', '#login'); }}>Login</a></li>
                  <li><a href="#register" onClick={(e) => { e.preventDefault(); navigateTo('register', '#register'); }}>Register</a></li>
                  <li><a href="#refund-return-policy" onClick={(e) => { e.preventDefault(); navigateTo('refund-return-policy', '#refund-return-policy'); }}>Refund & Return Policy</a></li>
                  <li><a href="#terms-condition" onClick={(e) => { e.preventDefault(); navigateTo('terms-condition', '#terms-condition'); }}>Terms & Condition</a></li>
                  <li><a href="#privacy-policy" onClick={(e) => { e.preventDefault(); navigateTo('privacy-policy', '#privacy-policy'); }}>Privacy Policy</a></li>
                  <li><a href="#404" onClick={(e) => { e.preventDefault(); navigateTo('404', '#404'); }}>404 Error</a></li>
                  <li><a href="#search-result" onClick={(e) => { e.preventDefault(); navigateTo('search-result', '#search-result'); }}>Search Result Page</a></li>
                </ul>
              )}
            </li>

            <li className={`responsive-nav-item has-submenu ${activeMenu === 'collections' ? 'expanded' : ''}`}>
              <div className="responsive-nav-link-wrapper" onClick={() => toggleMenu('collections')}>
                <span className="responsive-nav-label">COLLECTIONS</span>
                <span className="responsive-toggle-icon">{activeMenu === 'collections' ? '-' : '+'}</span>
              </div>
              {activeMenu === 'collections' && (
                <ul className="responsive-submenu-list">
                  <li><a href="#shop-left-sidebar" onClick={(e) => { e.preventDefault(); navigateTo('shop-left-sidebar', '#shop-left-sidebar'); }}>Winters Collection 2025</a></li>
                </ul>
              )}
            </li>
          </ul>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="ts-main-navbar">
        <div className="container-fluid">
          <nav className="navbar navbar-expand-md navbar-light">
            <a className="navbar-brand" href="#home" onClick={(e) => { e.preventDefault(); navigateTo('home', '#home'); }}>
              <img src="/assets/images/logo.svg" alt="Torado Logo" />
            </a>

            <div className="collapse navbar-collapse mean-menu" id="navbarSupportedContent">
              <ul className="navbar-nav m-auto">
                <li className="nav-item">
                  <a
                    href="#home"
                    className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
                    onClick={(e) => { e.preventDefault(); navigateTo('home', '#home'); }}
                  >
                    HOME
                  </a>
                </li>

                {/* SHOP MEGAMENU */}
                <li className="nav-item megamenu">
                  <a
                    href="#shop-hidden-sidebar"
                    className={`nav-link ${currentPage === 'shop-hidden-sidebar' ? 'active' : ''}`}
                    onClick={(e) => { e.preventDefault(); navigateTo('shop-hidden-sidebar', '#shop-hidden-sidebar'); }}
                  >
                    SHOP <i className="bx bx-chevron-down"></i>
                  </a>
                  <ul className="dropdown-menu">
                    <li className="nav-item">
                      <div className="row justify-content-center">
                        <div className="col-lg-8">
                          <div className="row justify-content-center">
                            <div className="col">
                              <ul className="megamenu-submenu">
                                <li className="nav-item"><a href="#shop-hidden-sidebar" onClick={(e) => { e.preventDefault(); navigateTo('shop-hidden-sidebar', '#shop-hidden-sidebar'); }} className="nav-link">Shop Left Sidebar</a></li>
                                <li className="nav-item"><a href="#shop-hidden-sidebar" onClick={(e) => { e.preventDefault(); navigateTo('shop-hidden-sidebar', '#shop-hidden-sidebar'); }} className="nav-link">Shop Right Sidebar</a></li>
                                <li className="nav-item"><a href="#shop-hidden-sidebar" onClick={(e) => { e.preventDefault(); navigateTo('shop-hidden-sidebar', '#shop-hidden-sidebar'); }} className="nav-link">Shop Canvas Filter</a></li>
                                <li className="nav-item"><a href="#shop-hidden-sidebar" onClick={(e) => { e.preventDefault(); navigateTo('shop-hidden-sidebar', '#shop-hidden-sidebar'); }} className="nav-link">Shop Grid 2 Columns</a></li>
                                <li className="nav-item"><a href="#shop-hidden-sidebar" onClick={(e) => { e.preventDefault(); navigateTo('shop-hidden-sidebar', '#shop-hidden-sidebar'); }} className="nav-link">Shop Grid 3 Columns</a></li>
                                <li className="nav-item"><a href="#shop-hidden-sidebar" onClick={(e) => { e.preventDefault(); navigateTo('shop-hidden-sidebar', '#shop-hidden-sidebar'); }} className="nav-link">Shop Grid 4 Columns</a></li>
                              </ul>
                            </div>
                            <div className="col">
                              <ul className="megamenu-submenu">
                                <li className="nav-item"><a href="#shop-hidden-sidebar" onClick={(e) => { e.preventDefault(); navigateTo('shop-hidden-sidebar', '#shop-hidden-sidebar'); }} className="nav-link">Shop List View</a></li>
                                <li className="nav-item"><a href="#shop-hidden-sidebar" onClick={(e) => { e.preventDefault(); navigateTo('shop-hidden-sidebar', '#shop-hidden-sidebar'); }} className="nav-link">Shop List Categories</a></li>
                                <li className="nav-item"><a href="#shop-hidden-sidebar" onClick={(e) => { e.preventDefault(); navigateTo('shop-hidden-sidebar', '#shop-hidden-sidebar'); }} className="nav-link">Shop Pagination</a></li>
                                <li className="nav-item"><a href="#shop-hidden-sidebar" onClick={(e) => { e.preventDefault(); navigateTo('shop-hidden-sidebar', '#shop-hidden-sidebar'); }} className="nav-link">Shop Infinite Scrolling</a></li>
                                <li className="nav-item"><a href="#shop-hidden-sidebar" onClick={(e) => { e.preventDefault(); navigateTo('shop-hidden-sidebar', '#shop-hidden-sidebar'); }} className="nav-link">Product Compare</a></li>
                                <li className="nav-item"><a href="#shop-hidden-sidebar" onClick={(e) => { e.preventDefault(); navigateTo('shop-hidden-sidebar', '#shop-hidden-sidebar'); }} className="nav-link">Shop Load More Button</a></li>
                              </ul>
                            </div>
                            <div className="col">
                              <ul className="megamenu-submenu">
                                <li className="nav-item"><a href="#cart" onClick={(e) => { e.preventDefault(); navigateTo('cart', '#cart'); }} className="nav-link">Cart</a></li>
                                <li className="nav-item"><a href="#wishlist" onClick={(e) => { e.preventDefault(); navigateTo('wishlist', '#wishlist'); }} className="nav-link">Wishlist</a></li>
                                <li className="nav-item"><a href="#checkout-information" onClick={(e) => { e.preventDefault(); navigateTo('checkout-information', '#checkout-information'); }} className="nav-link">Checkout Information</a></li>
                                <li className="nav-item"><a href="#checkout-shipping" onClick={(e) => { e.preventDefault(); navigateTo('checkout-shipping', '#checkout-shipping'); }} className="nav-link">Checkout Shipping</a></li>
                                <li className="nav-item"><a href="#checkout-payment" onClick={(e) => { e.preventDefault(); navigateTo('checkout-payment', '#checkout-payment'); }} className="nav-link">Checkout Payment</a></li>
                                <li className="nav-item"><a href="#track-my-order" onClick={(e) => { e.preventDefault(); navigateTo('track-my-order', '#track-my-order'); }} className="nav-link">Track My Order</a></li>
                              </ul>
                            </div>
                            <div className="col">
                              <ul className="megamenu-submenu">
                                <li className="nav-item"><a href="#shop-hidden-sidebar" onClick={(e) => { e.preventDefault(); navigateTo('shop-hidden-sidebar', '#shop-hidden-sidebar'); }} className="nav-link">Shop Full Width Layout</a></li>
                                <li className="nav-item"><a href="#shop-hidden-sidebar" onClick={(e) => { e.preventDefault(); navigateTo('shop-hidden-sidebar', '#shop-hidden-sidebar'); }} className="nav-link">Shop Hidden Sidebar</a></li>
                                <li className="nav-item"><a href="#shop" className="nav-link">Product Details</a></li>
                                <li className="nav-item"><a href="#reviews" className="nav-link">Product Details Reviews</a></li>
                                <li className="nav-item"><a href="#add-reviews" className="nav-link">Product Details Add Reviews</a></li>
                                <li className="nav-item"><a href="#reviews-filter" className="nav-link">Product Details Reviews Filter</a></li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        <div className="col-lg-4">
                          <div className="shop-left-image">
                            <img src="/assets/images/navbar/shop.jpg" alt="Black Friday Mega Sale" />
                            <div className="products-btn">
                              <a href="#shop-hidden-sidebar" onClick={(e) => { e.preventDefault(); navigateTo('shop-hidden-sidebar', '#shop-hidden-sidebar'); }} className="ts-default-btn">
                                Shop Now <i className="bx bx-right-arrow-alt"></i>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </li>

                {/* MEN MEGAMENU */}
                <li className="nav-item megamenu">
                  <a
                    href="#shop-all-for-men"
                    className={`nav-link ${currentPage === 'shop-all-for-men' ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo('shop-all-for-men', '#shop-all-for-men');
                    }}
                  >
                    MEN <i className="bx bx-chevron-down"></i>
                  </a>
                  <ul className="dropdown-menu">
                    <li className="nav-item">
                      <div className="row justify-content-center">
                        <div className="col-lg-8">
                          <div className="row justify-content-center">
                            <div className="col">
                              <ul className="megamenu-submenu">
                                <li className="nav-item"><a href="#shop-all-for-men" onClick={(e) => { e.preventDefault(); navigateTo('shop-all-for-men', '#shop-all-for-men'); }} className="nav-link">Shop Left Sidebar</a></li>
                                <li className="nav-item"><a href="#shop-all-for-men" onClick={(e) => { e.preventDefault(); navigateTo('shop-all-for-men', '#shop-all-for-men'); }} className="nav-link">Shop Right Sidebar</a></li>
                                <li className="nav-item"><a href="#shop-all-for-men" onClick={(e) => { e.preventDefault(); navigateTo('shop-all-for-men', '#shop-all-for-men'); }} className="nav-link">Shop Canvas Filter</a></li>
                                <li className="nav-item"><a href="#shop-all-for-men" onClick={(e) => { e.preventDefault(); navigateTo('shop-all-for-men', '#shop-all-for-men'); }} className="nav-link">Shop Grid 2 Columns</a></li>
                                <li className="nav-item"><a href="#shop-all-for-men" onClick={(e) => { e.preventDefault(); navigateTo('shop-all-for-men', '#shop-all-for-men'); }} className="nav-link">Shop Grid 3 Columns</a></li>
                                <li className="nav-item"><a href="#shop-all-for-men" onClick={(e) => { e.preventDefault(); navigateTo('shop-all-for-men', '#shop-all-for-men'); }} className="nav-link">Shop Grid 4 Columns</a></li>
                                <li className="nav-item">
                                  <a
                                    href="#shop-all-for-men"
                                    className="ts-default-btn"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      navigateTo('shop-all-for-men', '#shop-all-for-men');
                                    }}
                                  >
                                    Shop All Mens <i className="bx bx-right-arrow-alt"></i>
                                  </a>
                                </li>
                              </ul>
                            </div>
                            <div className="col">
                              <ul className="megamenu-submenu">
                                <li className="nav-item"><a href="#shop-all-for-men" onClick={(e) => { e.preventDefault(); navigateTo('shop-all-for-men', '#shop-all-for-men'); }} className="nav-link">Shop List View</a></li>
                                <li className="nav-item"><a href="#shop-all-for-men" onClick={(e) => { e.preventDefault(); navigateTo('shop-all-for-men', '#shop-all-for-men'); }} className="nav-link">Shop List Categories</a></li>
                                <li className="nav-item"><a href="#shop-all-for-men" onClick={(e) => { e.preventDefault(); navigateTo('shop-all-for-men', '#shop-all-for-men'); }} className="nav-link">Shop Pagination</a></li>
                                <li className="nav-item"><a href="#shop-all-for-men" onClick={(e) => { e.preventDefault(); navigateTo('shop-all-for-men', '#shop-all-for-men'); }} className="nav-link">Shop Infinite Scrolling</a></li>
                                <li className="nav-item"><a href="#shop-all-for-men" onClick={(e) => { e.preventDefault(); navigateTo('shop-all-for-men', '#shop-all-for-men'); }} className="nav-link">Product Compare</a></li>
                                <li className="nav-item"><a href="#shop-all-for-men" onClick={(e) => { e.preventDefault(); navigateTo('shop-all-for-men', '#shop-all-for-men'); }} className="nav-link">Shop Load More Button</a></li>
                              </ul>
                            </div>
                            <div className="col">
                              <ul className="megamenu-submenu">
                                <li className="nav-item"><a href="#cart" onClick={(e) => { e.preventDefault(); navigateTo('cart', '#cart'); }} className="nav-link">Cart</a></li>
                                <li className="nav-item"><a href="#wishlist" onClick={(e) => { e.preventDefault(); navigateTo('wishlist', '#wishlist'); }} className="nav-link">Wishlist</a></li>
                                <li className="nav-item"><a href="#checkout-information" onClick={(e) => { e.preventDefault(); navigateTo('checkout-information', '#checkout-information'); }} className="nav-link">Checkout Information</a></li>
                                <li className="nav-item"><a href="#checkout-shipping" onClick={(e) => { e.preventDefault(); navigateTo('checkout-shipping', '#checkout-shipping'); }} className="nav-link">Checkout Shipping</a></li>
                                <li className="nav-item"><a href="#checkout-payment" onClick={(e) => { e.preventDefault(); navigateTo('checkout-payment', '#checkout-payment'); }} className="nav-link">Checkout Payment</a></li>
                                <li className="nav-item"><a href="#track-my-order" onClick={(e) => { e.preventDefault(); navigateTo('track-my-order', '#track-my-order'); }} className="nav-link">Track My Order</a></li>
                              </ul>
                            </div>
                            <div className="col">
                              <ul className="megamenu-submenu">
                                <li className="nav-item"><a href="#shop-all-for-men" onClick={(e) => { e.preventDefault(); navigateTo('shop-all-for-men', '#shop-all-for-men'); }} className="nav-link">Shop All For Men</a></li>
                                <li className="nav-item"><a href="#shop-all-for-men" onClick={(e) => { e.preventDefault(); navigateTo('shop-all-for-men', '#shop-all-for-men'); }} className="nav-link">Shop Full Width Layout</a></li>
                                <li className="nav-item"><a href="#shop-all-for-men" onClick={(e) => { e.preventDefault(); navigateTo('shop-all-for-men', '#shop-all-for-men'); }} className="nav-link">Shop Hidden Sidebar</a></li>
                                <li className="nav-item"><a href="#shop" className="nav-link">Product Details</a></li>
                                <li className="nav-item"><a href="#reviews" className="nav-link">Product Details Reviews</a></li>
                                <li className="nav-item"><a href="#add-reviews" className="nav-link">Product Details Add Reviews</a></li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        <div className="col-lg-4">
                          <div className="shop-left-image">
                            <img src="/assets/images/navbar/men.jpg" alt="Men Winters Collection" />
                            <div className="content">
                              <h3>Winters <span>Collections</span> 2025</h3>
                            </div>
                            <div className="products-btn">
                              <a
                                href="#shop-all-for-men"
                                className="ts-default-btn with-black"
                                onClick={(e) => {
                                  e.preventDefault();
                                  navigateTo('shop-all-for-men', '#shop-all-for-men');
                                }}
                              >
                                Shop Now <i className="bx bx-right-arrow-alt"></i>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </li>

                {/* WOMEN MEGAMENU */}
                <li className="nav-item megamenu">
                  <a
                    href="#shop-all-for-women"
                    className={`nav-link ${currentPage === 'shop-all-for-women' ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo('shop-all-for-women', '#shop-all-for-women');
                    }}
                  >
                    WOMEN <i className="bx bx-chevron-down"></i>
                  </a>
                  <ul className="dropdown-menu">
                    <li className="nav-item">
                      <div className="row justify-content-center">
                        <div className="col-lg-8">
                          <div className="row justify-content-center">
                            <div className="col">
                              <ul className="megamenu-submenu">
                                <li className="nav-item"><a href="#shop-all-for-women" onClick={(e) => { e.preventDefault(); navigateTo('shop-all-for-women', '#shop-all-for-women'); }} className="nav-link">Shop Left Sidebar</a></li>
                                <li className="nav-item"><a href="#shop-all-for-women" onClick={(e) => { e.preventDefault(); navigateTo('shop-all-for-women', '#shop-all-for-women'); }} className="nav-link">Shop Right Sidebar</a></li>
                                <li className="nav-item"><a href="#shop-all-for-women" onClick={(e) => { e.preventDefault(); navigateTo('shop-all-for-women', '#shop-all-for-women'); }} className="nav-link">Shop Canvas Filter</a></li>
                                <li className="nav-item"><a href="#shop-all-for-women" onClick={(e) => { e.preventDefault(); navigateTo('shop-all-for-women', '#shop-all-for-women'); }} className="nav-link">Shop Grid 2 Columns</a></li>
                                <li className="nav-item"><a href="#shop-all-for-women" onClick={(e) => { e.preventDefault(); navigateTo('shop-all-for-women', '#shop-all-for-women'); }} className="nav-link">Shop Grid 3 Columns</a></li>
                                <li className="nav-item"><a href="#shop-all-for-women" onClick={(e) => { e.preventDefault(); navigateTo('shop-all-for-women', '#shop-all-for-women'); }} className="nav-link">Shop Grid 4 Columns</a></li>
                                <li className="nav-item">
                                  <a
                                    href="#shop-all-for-women"
                                    className="ts-default-btn"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      navigateTo('shop-all-for-women', '#shop-all-for-women');
                                    }}
                                  >
                                    Shop All For Women <i className="bx bx-right-arrow-alt"></i>
                                  </a>
                                </li>
                              </ul>
                            </div>
                            <div className="col">
                              <ul className="megamenu-submenu">
                                <li className="nav-item"><a href="#shop-all-for-women" onClick={(e) => { e.preventDefault(); navigateTo('shop-all-for-women', '#shop-all-for-women'); }} className="nav-link">Shop List View</a></li>
                                <li className="nav-item"><a href="#shop-all-for-women" onClick={(e) => { e.preventDefault(); navigateTo('shop-all-for-women', '#shop-all-for-women'); }} className="nav-link">Shop List Categories</a></li>
                                <li className="nav-item"><a href="#shop-all-for-women" onClick={(e) => { e.preventDefault(); navigateTo('shop-all-for-women', '#shop-all-for-women'); }} className="nav-link">Shop Pagination</a></li>
                                <li className="nav-item"><a href="#shop-all-for-women" onClick={(e) => { e.preventDefault(); navigateTo('shop-all-for-women', '#shop-all-for-women'); }} className="nav-link">Shop Infinite Scrolling</a></li>
                                <li className="nav-item"><a href="#shop-all-for-women" onClick={(e) => { e.preventDefault(); navigateTo('shop-all-for-women', '#shop-all-for-women'); }} className="nav-link">Product Compare</a></li>
                                <li className="nav-item"><a href="#shop-all-for-women" onClick={(e) => { e.preventDefault(); navigateTo('shop-all-for-women', '#shop-all-for-women'); }} className="nav-link">Shop Load More Button</a></li>
                              </ul>
                            </div>
                            <div className="col">
                              <ul className="megamenu-submenu">
                                <li className="nav-item"><a href="#cart" onClick={(e) => { e.preventDefault(); navigateTo('cart', '#cart'); }} className="nav-link">Cart</a></li>
                                <li className="nav-item"><a href="#wishlist" onClick={(e) => { e.preventDefault(); navigateTo('wishlist', '#wishlist'); }} className="nav-link">Wishlist</a></li>
                                <li className="nav-item"><a href="#checkout-information" onClick={(e) => { e.preventDefault(); navigateTo('checkout-information', '#checkout-information'); }} className="nav-link">Checkout Information</a></li>
                                <li className="nav-item"><a href="#checkout-shipping" onClick={(e) => { e.preventDefault(); navigateTo('checkout-shipping', '#checkout-shipping'); }} className="nav-link">Checkout Shipping</a></li>
                                <li className="nav-item"><a href="#checkout-payment" onClick={(e) => { e.preventDefault(); navigateTo('checkout-payment', '#checkout-payment'); }} className="nav-link">Checkout Payment</a></li>
                                <li className="nav-item"><a href="#track-my-order" onClick={(e) => { e.preventDefault(); navigateTo('track-my-order', '#track-my-order'); }} className="nav-link">Track My Order</a></li>
                              </ul>
                            </div>
                            <div className="col">
                              <ul className="megamenu-submenu">
                                <li className="nav-item"><a href="#shop-all-for-women" onClick={(e) => { e.preventDefault(); navigateTo('shop-all-for-women', '#shop-all-for-women'); }} className="nav-link">Shop All For Women</a></li>
                                <li className="nav-item"><a href="#shop-all-for-women" onClick={(e) => { e.preventDefault(); navigateTo('shop-all-for-women', '#shop-all-for-women'); }} className="nav-link">Shop Full Width Layout</a></li>
                                <li className="nav-item"><a href="#shop-all-for-women" onClick={(e) => { e.preventDefault(); navigateTo('shop-all-for-women', '#shop-all-for-women'); }} className="nav-link">Shop Hidden Sidebar</a></li>
                                <li className="nav-item"><a href="#shop" className="nav-link">Product Details</a></li>
                                <li className="nav-item"><a href="#reviews" className="nav-link">Product Details Reviews</a></li>
                                <li className="nav-item"><a href="#add-reviews" className="nav-link">Product Details Add Reviews</a></li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        <div className="col-lg-4">
                          <div className="shop-left-image">
                            <img src="/assets/images/navbar/women.jpg" alt="Women Winters Collection" />
                            <div className="content">
                              <h3>Winters <span>Collections</span> 2025</h3>
                            </div>
                            <div className="products-btn">
                              <a
                                href="#shop-all-for-women"
                                className="ts-default-btn with-black"
                                onClick={(e) => {
                                  e.preventDefault();
                                  navigateTo('shop-all-for-women', '#shop-all-for-women');
                                }}
                              >
                                Shop Now <i className="bx bx-right-arrow-alt"></i>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </li>
                {/* PAGES DROPDOWN */}
                <li className="nav-item">
                  <a
                    href="#"
                    className={`nav-link ${['about-us', 'blog-left-sidebar', 'single-blog', 'contact-us', 'faq', 'login', 'register', 'refund-return-policy', 'terms-condition', 'privacy-policy', '404', 'error-404', 'search-result', 'search-result-page'].includes(currentPage) ? 'active' : ''}`}
                    onClick={(e) => e.preventDefault()}
                  >
                    PAGES <i className="bx bx-chevron-down"></i>
                  </a>
                  <ul className="dropdown-menu">
                    <li className="nav-item">
                      <a
                        href="#about"
                        className={`nav-link ${currentPage === 'about-us' ? 'active' : ''}`}
                        onClick={(e) => {
                          e.preventDefault();
                          navigateTo('about-us', '#about');
                        }}
                      >
                        About Us
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        href="#blog-left-sidebar"
                        className={`nav-link ${currentPage === 'blog-left-sidebar' ? 'active' : ''}`}
                        onClick={(e) => {
                          e.preventDefault();
                          navigateTo('blog-left-sidebar', '#blog-left-sidebar');
                        }}
                      >
                        Blog <i className="bx bx-chevron-down"></i>
                      </a>
                      <ul className="dropdown-menu">
                        <li className="nav-item">
                          <a
                            href="#blog-grid"
                            className="nav-link"
                            onClick={(e) => {
                              e.preventDefault();
                              navigateTo('blog-left-sidebar', '#blog-left-sidebar');
                            }}
                          >
                            Blog Grid
                          </a>
                        </li>
                        <li className="nav-item">
                          <a
                            href="#blog-right-sidebar"
                            className="nav-link"
                            onClick={(e) => {
                              e.preventDefault();
                              navigateTo('blog-left-sidebar', '#blog-left-sidebar');
                            }}
                          >
                            Blog Right Sidebar
                          </a>
                        </li>
                        <li className="nav-item">
                          <a
                            href="#blog-left-sidebar"
                            className="nav-link"
                            onClick={(e) => {
                              e.preventDefault();
                              navigateTo('blog-left-sidebar', '#blog-left-sidebar');
                            }}
                          >
                            Blog Left Sidebar
                          </a>
                        </li>
                        <li className="nav-item">
                          <a
                            href="#blog-no-sidebar"
                            className="nav-link"
                            onClick={(e) => {
                              e.preventDefault();
                              navigateTo('blog-left-sidebar', '#blog-left-sidebar');
                            }}
                          >
                            Blog No Sidebar
                          </a>
                        </li>
                      </ul>
                    </li>
                    <li className="nav-item">
                      <a
                        href="#contact-us"
                        className={`nav-link ${currentPage === 'contact-us' ? 'active' : ''}`}
                        onClick={(e) => { e.preventDefault(); navigateTo('contact-us', '#contact-us'); }}
                      >
                        Contact Us
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        href="#faq"
                        className={`nav-link ${currentPage === 'faq' ? 'active' : ''}`}
                        onClick={(e) => { e.preventDefault(); navigateTo('faq', '#faq'); }}
                      >
                        Frequently Asked Questions
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        href="#account"
                        className={`nav-link ${currentPage === 'login' || currentPage === 'register' ? 'active' : ''}`}
                        onClick={(e) => e.preventDefault()}
                      >
                        My Account <i className="bx bx-chevron-down"></i>
                      </a>
                      <ul className="dropdown-menu">
                        <li className="nav-item">
                          <a
                            href="#login"
                            className={`nav-link ${currentPage === 'login' ? 'active' : ''}`}
                            onClick={(e) => {
                              e.preventDefault();
                              navigateTo('login', '#login');
                            }}
                          >
                            Login
                          </a>
                        </li>
                        <li className="nav-item">
                          <a
                            href="#register"
                            className={`nav-link ${currentPage === 'register' ? 'active' : ''}`}
                            onClick={(e) => {
                              e.preventDefault();
                              navigateTo('register', '#register');
                            }}
                          >
                            Register
                          </a>
                        </li>
                      </ul>
                    </li>
                    <li className="nav-item">
                      <a
                        href="#refund-return-policy"
                        className={`nav-link ${currentPage === 'refund-return-policy' ? 'active' : ''}`}
                        onClick={(e) => {
                          e.preventDefault();
                          navigateTo('refund-return-policy', '#refund-return-policy');
                        }}
                      >
                        Refund & Return Policy
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        href="#terms-condition"
                        className={`nav-link ${currentPage === 'terms-condition' ? 'active' : ''}`}
                        onClick={(e) => {
                          e.preventDefault();
                          navigateTo('terms-condition', '#terms-condition');
                        }}
                      >
                        Terms & Condition
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        href="#privacy-policy"
                        className={`nav-link ${currentPage === 'privacy-policy' ? 'active' : ''}`}
                        onClick={(e) => {
                          e.preventDefault();
                          navigateTo('privacy-policy', '#privacy-policy');
                        }}
                      >
                        Privacy Policy
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        href="#404"
                        className={`nav-link ${currentPage === '404' || currentPage === 'error-404' ? 'active' : ''}`}
                        onClick={(e) => {
                          e.preventDefault();
                          navigateTo('404', '#404');
                        }}
                      >
                        404 Error
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        href="#search-result"
                        className={`nav-link ${currentPage === 'search-result' || currentPage === 'search-result-page' ? 'active' : ''}`}
                        onClick={(e) => {
                          e.preventDefault();
                          navigateTo('search-result', '#search-result');
                        }}
                      >
                        Search Result Page
                      </a>
                    </li>
                  </ul>
                </li>

                {/* COLLECTIONS MEGAMENU */}
                <li className="nav-item megamenu">
                  <a
                    href="#shop-left-sidebar"
                    className={`nav-link ${currentPage === 'shop-left-sidebar' || currentPage === 'collections' ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo('shop-left-sidebar', '#shop-left-sidebar');
                    }}
                  >
                    COLLECTIONS <i className="bx bx-chevron-down"></i>
                  </a>
                  <ul className="dropdown-menu">
                    <li className="nav-item">
                      <div className="row justify-content-center">
                        <div className="col">
                          <div
                            className="collections-content"
                            style={{ cursor: "pointer" }}
                            onClick={() => navigateTo('shop-left-sidebar', '#shop-left-sidebar')}
                          >
                            <img src="/assets/images/navbar/collections1.jpg" alt="Collection 1" />
                            <div className="content">
                              <h3>Winters <span>Collections</span> 2025</h3>
                            </div>
                            <div className="products-btn">
                              <a
                                href="#shop-left-sidebar"
                                className="ts-default-btn with-black"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  navigateTo('shop-left-sidebar', '#shop-left-sidebar');
                                }}
                              >
                                Shop Now <i className="bx bx-right-arrow-alt"></i>
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="col">
                          <div
                            className="collections-content"
                            style={{ cursor: "pointer" }}
                            onClick={() => navigateTo('shop-left-sidebar', '#shop-left-sidebar')}
                          >
                            <img src="/assets/images/navbar/collections2.jpg" alt="Collection 2" />
                            <div className="content white">
                              <h3>Winters <span>Collections</span> 2025</h3>
                            </div>
                            <div className="products-btn">
                              <a
                                href="#shop-left-sidebar"
                                className="ts-default-btn with-black"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  navigateTo('shop-left-sidebar', '#shop-left-sidebar');
                                }}
                              >
                                Shop Now <i className="bx bx-right-arrow-alt"></i>
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="col">
                          <div
                            className="collections-content"
                            style={{ cursor: "pointer" }}
                            onClick={() => navigateTo('shop-left-sidebar', '#shop-left-sidebar')}
                          >
                            <img src="/assets/images/navbar/collections3.jpg" alt="Collection 3" />
                            <div className="content white">
                              <h3>Winters <span>Collections</span> 2025</h3>
                            </div>
                            <div className="products-btn">
                              <a
                                href="#shop-left-sidebar"
                                className="ts-default-btn with-black"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  navigateTo('shop-left-sidebar', '#shop-left-sidebar');
                                }}
                              >
                                Shop Now <i className="bx bx-right-arrow-alt"></i>
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="col">
                          <div
                            className="collections-content"
                            style={{ cursor: "pointer" }}
                            onClick={() => navigateTo('shop-left-sidebar', '#shop-left-sidebar')}
                          >
                            <img src="/assets/images/navbar/collections4.jpg" alt="Collection 4" />
                            <div className="content">
                              <h3>Winters <span>Collections</span> 2025</h3>
                            </div>
                            <div className="products-btn">
                              <a
                                href="#shop-left-sidebar"
                                className="ts-default-btn with-black"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  navigateTo('shop-left-sidebar', '#shop-left-sidebar');
                                }}
                              >
                                Shop Now <i className="bx bx-right-arrow-alt"></i>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </li>
              </ul>

              {/* Right Side Options (Clean links matching reference) */}
              <div className="others-options d-flex align-items-center">
                <div className="option-item">
                  <a href="#search" onClick={(e) => { e.preventDefault(); setIsSearchOpen(true); }} title="Search">
                    <img src="/assets/images/icon/search-normal.svg" alt="search" />
                  </a>
                </div>
                <div className="option-item torado-user-opt-wrapper">
                  {currentUser ? (
                    <div className="torado-user-pill-btn" onClick={() => setUserMenuOpen(!userMenuOpen)} title={`Logged in as ${currentUser.name}`}>
                      <span className="torado-nav-avatar">
                        {currentUser.name ? currentUser.name[0].toUpperCase() : 'U'}
                      </span>
                      <span className="torado-nav-username">{currentUser.name?.split(' ')[0]}</span>
                      <i className={`bx bx-chevron-${userMenuOpen ? 'up' : 'down'}`}></i>

                      {userMenuOpen && (
                        <div className="torado-nav-user-dropdown" onClick={(e) => e.stopPropagation()}>
                          <div className="torado-dd-user-info">
                            <span className="torado-dd-avatar">
                              {currentUser.name ? currentUser.name[0].toUpperCase() : 'U'}
                            </span>
                            <div>
                              <strong>{currentUser.name}</strong>
                              <small>{currentUser.email}</small>
                            </div>
                          </div>
                          <div className="torado-dd-links">
                            <button type="button" onClick={() => { setIsLoginOpen(true); setUserMenuOpen(false); }}>
                              <i className="bx bx-user"></i> My Account
                            </button>
                            <button type="button" onClick={() => { navigateTo('track-my-order'); setUserMenuOpen(false); }}>
                              <i className="bx bx-package"></i> Track My Order
                            </button>
                            <button type="button" onClick={() => { setIsWishlistOpen(true); setUserMenuOpen(false); }}>
                              <i className="bx bx-heart"></i> My Wishlist
                            </button>
                            <hr className="torado-dd-divider" />
                            <button type="button" className="torado-dd-logout-btn" onClick={() => { logout(); setUserMenuOpen(false); }}>
                              <i className="bx bx-log-out"></i> Log Out
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <a href="#account" onClick={(e) => { e.preventDefault(); setIsLoginOpen(true); }} title="Account">
                      <img src="/assets/images/icon/user.svg" alt="account" />
                    </a>
                  )}
                </div>
                <div className="option-item">
                  <a href="#wishlist" onClick={(e) => { e.preventDefault(); setIsWishlistOpen(true); }} title="Wishlist">
                    <img src="/assets/images/icon/heart.svg" alt="wishlist" />
                    {wishlistItems.length > 0 && <div className="number">{wishlistItems.length}</div>}
                  </a>
                </div>
                <div className="option-item">
                  <a href="#cart" onClick={(e) => { e.preventDefault(); setIsCartOpen(true); }} title="Cart">
                    <img src="/assets/images/icon/shopping-bag.svg" alt="cart" />
                    <div className="number">{totalCartCount}</div>
                  </a>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>

    </div>
  );
};

export default Navbar;
