import React, { useState, useEffect } from 'react';
import API_BASE from '../../config/api';
import './CheckoutShipping.css';
import { useShop } from '../../context/ShopContext.jsx';

const CheckoutShipping = () => {
  const { cartItems, subtotal, setCurrentPage, currentUser } = useShop();

  const savedInfo = (() => {
    try {
      const s = localStorage.getItem('torado_checkout_info');
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  })();

  const defaultEmail = savedInfo?.contact || currentUser?.email || 'akshkumbhani9@gmail.com';
  const defaultAddress = savedInfo
    ? `${savedInfo.address || ''}${savedInfo.apartment ? ', ' + savedInfo.apartment : ''}, ${savedInfo.city || ''}, ${savedInfo.country || ''}`
    : (currentUser?.address ? `${currentUser.address}, ${currentUser.city || 'Surat'}, ${currentUser.country || 'India'}` : '402, Royal Palace, Varachha Main Road, Surat, India');

  const [contactEmail, setContactEmail] = useState(defaultEmail);
  const [shippingAddress, setShippingAddress] = useState(defaultAddress);
  const [shippingCost, setShippingCost] = useState(18.50);
  const [discountCode, setDiscountCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      const saved = localStorage.getItem('torado_applied_coupon');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.code && parsed.discount) {
          setDiscountCode(parsed.code);
          setDiscountAmount(Number(parsed.discount));
        }
      }
    } catch {}
  }, []);

  const navigateTo = (page, hash) => {
    setCurrentPage(page);
    if (hash) window.location.hash = hash;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplyDiscount = async (e) => {
    e.preventDefault();
    const code = discountCode.trim().toUpperCase();
    if (!code) {
      alert('Please enter a discount code');
      return;
    }
    try {
      const apiBase = API_BASE;
      const res = await fetch(`${apiBase}/store/coupons/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Invalid or expired discount code.');
      }
      const disc = Number(data.discount);
      setDiscountAmount(disc);
      setDiscountCode(data.code);
      localStorage.setItem('torado_applied_coupon', JSON.stringify({
        code: data.code,
        discount: disc,
        discountType: data.discountType
      }));
      alert(`Coupon "${data.code}" applied! You saved ₹${disc.toFixed(2)}`);
    } catch (err) {
      setDiscountAmount(0);
      localStorage.removeItem('torado_applied_coupon');
      alert(err.message || 'Invalid or expired discount code.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Navigate to next step: Payment
    navigateTo('checkout-payment', '#payment');
  };

  const finalTotal = Math.max(0, subtotal - discountAmount + Number(shippingCost));
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="torado-checkout-shipping-page">
      {/* 1. Page Banner */}
      <div className="ts-page-banner-area pt-100 pb-100">
        <div className="container">
          <div className="ts-page-banner-content text-center">
            <h2>Checkout Shipping</h2>
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
              <li>Checkout Shipping</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 2. Main Checkout Area */}
      <div className="ts-checkout-shipping-area pt-100 pb-100">
        <div className="container">
          <div className="row">
            {/* Left Column: Summary Info, Shipping Method & Steps */}
            <div className="col-lg-7 col-md-12">
              <div className="ts-checkout-shipping-inner">
                {/* Steps Meta Navigation (Matches Screenshot 1 & 2) */}
                <ul className="meta-list">
                  <li>
                    <a
                      href="#cart"
                      onClick={(e) => {
                        e.preventDefault();
                        navigateTo('cart', '#cart');
                      }}
                    >
                      CHECKOUT
                    </a>
                  </li>
                  <li>
                    <a
                      href="#checkout-information"
                      onClick={(e) => {
                        e.preventDefault();
                        navigateTo('checkout-information', '#checkout-information');
                      }}
                    >
                      INFORMATION
                    </a>
                  </li>
                  <li>
                    <a href="#shipping" className="active">
                      SHIPPING
                    </a>
                  </li>
                  <li>
                    <a
                      href="#payment"
                      onClick={(e) => {
                        e.preventDefault();
                        navigateTo('checkout-payment', '#payment');
                      }}
                    >
                      PAYMENT
                    </a>
                  </li>
                </ul>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                  {/* Contact & Ship To Details Box (Matches Screenshot 2) */}
                  <div className="checkout-review-box">
                    <div className="review-row">
                      <div className="review-label">Contact</div>
                      <div className="review-value">{contactEmail}</div>
                      <div className="review-action">
                        <a
                          href="#checkout-information"
                          onClick={(e) => {
                            e.preventDefault();
                            navigateTo('checkout-information', '#checkout-information');
                          }}
                        >
                          Change
                        </a>
                      </div>
                    </div>
                    <div className="review-row">
                      <div className="review-label">Ship to</div>
                      <div className="review-value">{shippingAddress}</div>
                      <div className="review-action">
                        <a
                          href="#checkout-information"
                          onClick={(e) => {
                            e.preventDefault();
                            navigateTo('checkout-information', '#checkout-information');
                          }}
                        >
                          Change
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Method (Matches Screenshot 2 & 3) */}
                  <div className="shipping-method-section">
                    <h3>Shipping Method</h3>
                    <div className="form-group">
                      <label>
                        Select Shipping Method <span>*</span>
                      </label>
                      <div className="select-wrapper">
                        <select
                          className="form-select"
                          value={shippingCost}
                          onChange={(e) => setShippingCost(parseFloat(e.target.value))}
                        >
                          <option value="49.00">Standard Delivery - ₹ 49.00</option>
                          <option value="99.00">Express Priority Courier - ₹ 99.00</option>
                          <option value="0.00">Free Store Delivery - ₹ 0.00</option>
                        </select>
                      </div>
                    </div>

                    {/* Bottom Actions Row (Matches Screenshot 4) */}
                    <div className="checkout-shipping-bottom">
                      <div className="return-to-cart-btn">
                        <a
                          href="#cart"
                          onClick={(e) => {
                            e.preventDefault();
                            navigateTo('cart', '#cart');
                          }}
                        >
                          <i className="bx bx-left-arrow-alt"></i> Return to cart
                        </a>
                      </div>
                      <div className="checkout-shipping-btn">
                        <button type="submit" className="ts-default-btn">
                          Continue Shipping <i className="bx bx-right-arrow-alt"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Right Column: Order Summary Widget (Matches Screenshots 2, 3, 4) */}
            <div className="col-lg-5 col-md-12">
              <div className="ts-checkout-shipping-widget-area">
                <h3 className="widget-title">
                  Product In Cart ({totalItemsCount.toString().padStart(2, '0')})
                </h3>

                {/* Cart Products List */}
                <div className="checkout_products">
                  {cartItems.map((item) => (
                    <div key={`${item.id}-${item.size || 'M'}`} className="item">
                      <div className="thumb">
                        <img
                          src={item.image || '/assets/images/cart/cart-1.jpg'}
                          alt={item.name}
                        />
                      </div>
                      <div className="info">
                        <h4 className="title">
                          <a href="#shop" onClick={(e) => e.preventDefault()}>
                            {item.name}
                          </a>
                        </h4>
                        <ul className="list">
                          <li>
                            <span>Color:</span> {item.color || 'Purple'}
                          </li>
                          <li>
                            <span>Size:</span> {item.size || 'M'}
                          </li>
                          <li>
                            <span>Quantity:</span> {item.quantity.toString().padStart(2, '0')}
                          </li>
                          <li className="price">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </li>
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Discount Code Form */}
                <div className="checkout_search">
                  <form onSubmit={handleApplyDiscount} className="search-form">
                    <input
                      type="text"
                      className="search-field"
                      placeholder="Discount code"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                    />
                    <button type="submit">Apply</button>
                  </form>
                </div>

                {/* Pricing Summary (Screenshot 4) */}
                <div className="checkout_info">
                  <ul className="list">
                    <li>
                      <span className="bold">Subtotal</span>
                      <span className="bold">₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </li>
                    {discountAmount > 0 && (
                      <li style={{ color: '#FE4267' }}>
                        <span>Discount ({discountCode || 'Applied'})</span>
                        <span>-₹{discountAmount.toFixed(2)}</span>
                      </li>
                    )}
                    <li>
                      <span className="bold">Shipping</span>
                      <span className="shipping-rate">₹{Number(shippingCost).toFixed(2)}</span>
                    </li>
                    <li className="total-row">
                      <span className="total-label">Total</span>
                      <span className="total-price">
                        <span>INR</span> ₹{finalTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutShipping;
