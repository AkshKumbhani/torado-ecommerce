import React, { useState, useEffect } from 'react';
import './CheckoutInformation.css';
import { useShop } from '../../context/ShopContext.jsx';

const CheckoutInformation = () => {
  const { cartItems, subtotal, setCurrentPage, currentUser } = useShop();

  // Pre-fill profile details from logged-in user or saved session
  const fullNameParts = (currentUser?.name || 'Aksh Kumbhani').trim().split(/\s+/);
  const defaultFirstName = fullNameParts[0] || 'Aksh';
  const defaultLastName = fullNameParts.slice(1).join(' ') || 'Kumbhani';
  const defaultEmail = currentUser?.email || 'akshkumbhani9@gmail.com';
  const defaultPhone = currentUser?.phone || '+91 98765 43210';
  const defaultAddress = currentUser?.address || '402, Royal Palace, Varachha Main Road';
  const defaultCity = currentUser?.city || 'Surat';
  const defaultPostalCode = currentUser?.postal_code || currentUser?.postalCode || '395006';
  const defaultCountry = currentUser?.country || 'India';

  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem('torado_checkout_info');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      contact: defaultEmail || defaultPhone,
      emailOffers: false,
      country: defaultCountry,
      firstName: defaultFirstName,
      lastName: defaultLastName,
      address: defaultAddress,
      apartment: 'Suite 402',
      city: defaultCity,
      postalCode: defaultPostalCode,
      saveInfo: true
    };
  });

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
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
      alert(`Coupon "${data.code}" applied! You saved ?${disc.toFixed(2)}`);
    } catch (err) {
      setDiscountAmount(0);
      localStorage.removeItem('torado_applied_coupon');
      alert(err.message || 'Invalid or expired discount code.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('torado_checkout_info', JSON.stringify(formData));
    // Navigate to next step: Shipping
    navigateTo('checkout-shipping', '#shipping');
  };

  const finalTotal = Math.max(0, subtotal - discountAmount);
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="torado-checkout-information-page">
      {/* 1. Page Banner */}
      <div className="ts-page-banner-area pt-100 pb-100">
        <div className="container">
          <div className="ts-page-banner-content text-center">
            <h2>Checkout Information</h2>
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
              <li>Checkout Information</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 2. Main Checkout Area */}
      <div className="ts-checkout-information-area pt-100 pb-100">
        <div className="container">
          <div className="row">
            {/* Left Column: Form & Steps */}
            <div className="col-lg-7 col-md-12">
              <div className="ts-checkout-information-inner">
                {/* Steps Meta Navigation (Screenshot 1) */}
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
                    <a href="#information" className="active">
                      INFORMATION
                    </a>
                  </li>
                  <li>
                    <a
                      href="#shipping"
                      onClick={(e) => {
                        e.preventDefault();
                        navigateTo('checkout-shipping', '#shipping');
                      }}
                    >
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
                  {/* Contact Information (Screenshot 2) */}
                  <div className="contact-information">
                    <h3>Contact Information</h3>
                    <div className="form-group">
                      <label>
                        Email or Mobile phone no <span>*</span>
                      </label>
                      <input
                        type="text"
                        name="contact"
                        className="form-control"
                        placeholder="Email Address"
                        value={formData.contact}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-cookies-consent">
                      <label>
                        <input
                          type="checkbox"
                          name="emailOffers"
                          checked={formData.emailOffers}
                          onChange={handleChange}
                        />
                        <span>Email me with news and offers</span>
                      </label>
                    </div>
                  </div>

                  {/* Shipping Address (Screenshot 2, 3, 4) */}
                  <div className="shipping-address">
                    <h3>Shipping Address</h3>

                    {/* Country / Region */}
                    <div className="form-group">
                      <label>
                        Country / Region <span>*</span>
                      </label>
                      <select
                        name="country"
                        className="form-select"
                        value={formData.country}
                        onChange={handleChange}
                      >
                        <option value="United States">United States</option>
                        <option value="India">India</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Canada">Canada</option>
                        <option value="Australia">Australia</option>
                      </select>
                    </div>

                    {/* First & Last Name */}
                    <div className="row">
                      <div className="col-lg-6 col-md-6">
                        <div className="form-group">
                          <label>
                            First name <span>*</span>
                          </label>
                          <input
                            type="text"
                            name="firstName"
                            className="form-control"
                            placeholder="First name"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="form-group">
                          <label>
                            Last name <span>*</span>
                          </label>
                          <input
                            type="text"
                            name="lastName"
                            className="form-control"
                            placeholder="Last Name (Optional)"
                            value={formData.lastName}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="form-group">
                      <label>
                        Address <span>*</span>
                      </label>
                      <input
                        type="text"
                        name="address"
                        className="form-control"
                        placeholder="Address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* Apartment */}
                    <div className="form-group">
                      <label>
                        Apartment <span>*</span>
                      </label>
                      <input
                        type="text"
                        name="apartment"
                        className="form-control"
                        placeholder="Apartment, Suite etc (optional)"
                        value={formData.apartment}
                        onChange={handleChange}
                      />
                    </div>

                    {/* City & Postal Code */}
                    <div className="row">
                      <div className="col-lg-6 col-md-6">
                        <div className="form-group">
                          <label>
                            City <span>*</span>
                          </label>
                          <input
                            type="text"
                            name="city"
                            className="form-control"
                            placeholder="City"
                            value={formData.city}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="form-group">
                          <label>
                            Postal Code <span>*</span>
                          </label>
                          <input
                            type="text"
                            name="postalCode"
                            className="form-control"
                            placeholder="Postal Code"
                            value={formData.postalCode}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Save this info checkbox */}
                    <div className="form-cookies-consent">
                      <label>
                        <input
                          type="checkbox"
                          name="saveInfo"
                          checked={formData.saveInfo}
                          onChange={handleChange}
                        />
                        <span>Save this information for next time</span>
                      </label>
                    </div>

                    {/* Bottom Actions Row (Screenshot 4) */}
                    <div className="checkout-information-bottom">
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
                      <div className="checkout-information-btn">
                        <button type="submit" className="ts-default-btn">
                          Continue Shipping <i className="bx bx-right-arrow-alt"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Right Column: Order Summary Widget (Screenshots 2, 3, 4) */}
            <div className="col-lg-5 col-md-12">
              <div className="ts-checkout-information-widget-area">
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
                            ?{(item.price * item.quantity).toFixed(2)}
                          </li>
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Discount Code Form (Screenshot 3) */}
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

                {/* Pricing Summary (Screenshot 3 & 4) */}
                <div className="checkout_info">
                  <ul className="list">
                    <li>
                      <span className="bold">Subtotal</span>
                      <span className="bold">?{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </li>
                    {discountAmount > 0 && (
                      <li style={{ color: '#FE4267' }}>
                        <span>Discount ({discountCode || 'Applied'})</span>
                        <span>-?{discountAmount.toFixed(2)}</span>
                      </li>
                    )}
                    <li>
                      <span className="bold">Shipping</span>
                      <span className="regular">Calculated at next step</span>
                    </li>
                    <li className="total-row">
                      <span className="total-label">Total</span>
                      <span className="total-price">
                        <span>INR</span>?{finalTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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

export default CheckoutInformation;