import React, { useState, useEffect } from 'react';
import API_BASE from '../../config/api';
import './CheckoutPayment.css';
import { useShop } from '../../context/ShopContext.jsx';

const CheckoutPayment = () => {
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
  const defaultCardHolder = currentUser?.name || (savedInfo ? `${savedInfo.firstName || ''} ${savedInfo.lastName || ''}`.trim() : 'Aksh Kumbhani');

  const [contactEmail, setContactEmail] = useState(defaultEmail);
  const [shippingAddress, setShippingAddress] = useState(defaultAddress);
  const [shippingMethod, setShippingMethod] = useState('Standard Delivery - ₹ 49.00');
  const [shippingCost, setShippingCost] = useState(49.00);

  const [cardData, setCardData] = useState({
    cardNumber: '4242 •••• •••• 4242',
    cardHolder: defaultCardHolder,
    expiryDate: '12/28',
    securityCode: '888'
  });

  const [billingOption, setBillingOption] = useState('same'); // 'same' or 'different'
  const [billingAddress, setBillingAddress] = useState({
    country: 'United States',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    postalCode: ''
  });

  const [discountCode, setDiscountCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [selectedPaymentMode, setSelectedPaymentMode] = useState('razorpay');
  const [placedOrderId, setPlacedOrderId] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [paymentBusy, setPaymentBusy] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (!document.querySelector('script[data-razorpay]')) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.dataset.razorpay = 'true';
      document.body.appendChild(script);
    }
    try {
      const savedCoupon = localStorage.getItem('torado_applied_coupon');
      if (savedCoupon) {
        const parsed = JSON.parse(savedCoupon);
        if (parsed.code && parsed.discount) {
          setDiscountCode(parsed.code);
          setDiscountAmount(Number(parsed.discount));
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const navigateTo = (page, hash) => {
    setCurrentPage(page);
    if (hash) window.location.hash = hash;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    setBillingAddress((prev) => ({ ...prev, [name]: value }));
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
      const response = await fetch(`${apiBase}/store/coupons/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Coupon could not be applied.');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPaymentError('');

    // Cash on Delivery (COD) order flow
    if (selectedPaymentMode === 'cod') {
      setPaymentBusy(true);
      try {
        const apiBase = API_BASE;
        const token = localStorage.getItem('torado_customer_token') || localStorage.getItem('torado_token') || localStorage.getItem('token') || '';
        const codRes = await fetch(`${apiBase}/payments/cod/order`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({
            items: cartItems.map(({ id, quantity, size, color }) => ({ id, quantity, size, color })),
            customerName: currentUser?.name || 'Aksh Kumbhani',
            customerEmail: currentUser?.email || contactEmail || 'akshkumbhani9@gmail.com',
            shippingAddress: shippingAddress,
            shippingCost: Number(shippingCost),
            couponCode: discountAmount ? discountCode : undefined
          })
        });
        const codData = await codRes.json();
        if (!codRes.ok) throw new Error(codData.message || 'Could not place COD order');
        setPlacedOrderId(codData.orderId);
        setOrderSuccess(true);
      } catch (err) {
        setPaymentError(err.message);
      } finally {
        setPaymentBusy(false);
      }
      return;
    }

    // Razorpay Online Payment flow
    if (!window.Razorpay) {
      setPaymentError('Secure checkout is still loading. Please try again.');
      return;
    }
    setPaymentBusy(true);
    try {
      const apiBase = API_BASE;
      const token = localStorage.getItem('torado_customer_token') || localStorage.getItem('torado_token') || localStorage.getItem('token') || '';

      const orderResponse = await fetch(`${apiBase}/payments/razorpay/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          items: cartItems.map(({ id, quantity, size, color }) => ({ id, quantity, size, color })),
          customerName: currentUser?.name || 'Aksh Kumbhani',
          customerEmail: currentUser?.email || contactEmail || 'akshkumbhani9@gmail.com',
          customerPhone: currentUser?.phone || '+91 98765 43210',
          shippingAddress: shippingAddress,
          couponCode: discountAmount ? discountCode : undefined
        })
      });

      const order = await orderResponse.json();
      if (!orderResponse.ok) throw new Error(order.message || 'Could not start payment.');

      const checkout = new window.Razorpay({
        key: order.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_ToSrGTcWCONzuH',
        amount: order.amount,
        currency: order.currency || 'INR',
        name: 'Torado Store',
        description: 'Clothing & Fashion Order',
        image: '/assets/images/favicon.png',
        order_id: order.orderId,
        prefill: {
          name: currentUser?.name || 'Aksh Kumbhani',
          email: currentUser?.email || contactEmail || 'akshkumbhani9@gmail.com',
          contact: currentUser?.phone || '+91 98765 43210'
        },
        notes: {
          address: shippingAddress
        },
        theme: {
          color: '#ed7968'
        },
        handler: async (result) => {
          try {
            const verifyResponse = await fetch(`${apiBase}/payments/razorpay/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
              },
              body: JSON.stringify({ ...result, amount: finalTotal })
            });
            const verified = await verifyResponse.json();
            if (!verifyResponse.ok) throw new Error(verified.message || 'Verification failed');
            setPlacedOrderId(verified.orderId);
            setOrderSuccess(true);
            try {
              localStorage.removeItem('torado_cart');
              localStorage.removeItem('torado_applied_coupon');
              window.dispatchEvent(new Event('cart-updated'));
            } catch {}
          } catch (err) {
            setPaymentError(err.message || 'Payment verification failed. Contact support with your payment ID.');
          } finally {
            setPaymentBusy(false);
          }
        },
        modal: {
          ondismiss: () => setPaymentBusy(false)
        }
      });

      checkout.on('payment.failed', (event) => {
        setPaymentError(event.error?.description || 'Payment was not completed.');
        setPaymentBusy(false);
      });
      checkout.open();
    } catch (err) {
      setPaymentError(err.message);
      setPaymentBusy(false);
    }
  };

  const finalTotal = Math.max(0, subtotal - discountAmount + Number(shippingCost));
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="torado-checkout-payment-page">
      {/* 1. Page Banner */}
      <div className="ts-page-banner-area pt-100 pb-100">
        <div className="container">
          <div className="ts-page-banner-content text-center">
            <h2>Checkout Payment</h2>
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
              <li>Checkout Payment</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 2. Main Checkout Area */}
      <div className="ts-checkout-payment-area pt-100 pb-100">
        <div className="container">
          <div className="row">
            {/* Left Column: Review Info, Payment Form & Steps */}
            <div className="col-lg-7 col-md-12">
              <div className="ts-checkout-payment-inner">
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
                    <a
                      href="#checkout-shipping"
                      onClick={(e) => {
                        e.preventDefault();
                        navigateTo('checkout-shipping', '#checkout-shipping');
                      }}
                    >
                      SHIPPING
                    </a>
                  </li>
                  <li>
                    <a href="#payment" className="active">
                      PAYMENT
                    </a>
                  </li>
                </ul>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                  {/* Contact, Ship To & Method Details Box (Matches Screenshot 2) */}
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
                    <div className="review-row">
                      <div className="review-label">Method</div>
                      <div className="review-value">{shippingMethod}</div>
                      <div className="review-action">
                        <a
                          href="#checkout-shipping"
                          onClick={(e) => {
                            e.preventDefault();
                            navigateTo('checkout-shipping', '#checkout-shipping');
                          }}
                        >
                          Change
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method Section (Matches Screenshot 2 & 3) */}
                  <div className="payment-method-section">
                    <h3>Payment Method</h3>
                    <p className="subtitle">Pay securely through Razorpay. Torado never handles or stores card details.</p>

                    <div className="credit-card-box">
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <label
                          style={{
                            cursor: 'pointer',
                            padding: '14px 18px',
                            border: selectedPaymentMode === 'razorpay' ? '2px solid #e11d48' : '1px solid #e2e8f0',
                            borderRadius: '10px',
                            background: selectedPaymentMode === 'razorpay' ? '#fff1f2' : '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                          }}
                        >
                          <input
                            type="radio"
                            name="paymentMode"
                            value="razorpay"
                            checked={selectedPaymentMode === 'razorpay'}
                            onChange={() => setSelectedPaymentMode('razorpay')}
                          />
                          <div>
                            <strong style={{ fontSize: '14px', color: '#0f172a' }}>Razorpay Online Gateway</strong>
                            <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>
                              Instant order confirmation & payment receipt via Cards, UPI, Netbanking, & Wallets
                            </p>
                          </div>
                        </label>
                        <label
                          style={{
                            cursor: 'pointer',
                            padding: '14px 18px',
                            border: selectedPaymentMode === 'cod' ? '2px solid #e11d48' : '1px solid #e2e8f0',
                            borderRadius: '10px',
                            background: selectedPaymentMode === 'cod' ? '#fff1f2' : '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                          }}
                        >
                          <input
                            type="radio"
                            name="paymentMode"
                            value="cod"
                            checked={selectedPaymentMode === 'cod'}
                            onChange={() => setSelectedPaymentMode('cod')}
                          />
                          <div>
                            <strong style={{ fontSize: '14px', color: '#0f172a' }}>Cash on Delivery (COD)</strong>
                            <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>
                              Pay in cash upon delivery. Automatic cash receipt & delivery email on package handover.
                            </p>
                          </div>
                        </label>
                      </div>
                      {paymentError && <div role="alert" className="tma-error">{paymentError}</div>}
                    </div>
                  </div>

                  {/* Billing Address Section (Matches Screenshot 4) */}
                  <div className="billing-address-section">
                    <h3>Billing Address</h3>
                    <p className="subtitle">Select the address that matches your card or payment method.</p>

                    <div className="billing-options-box">
                      <div
                        className={`billing-option-row ${billingOption === 'same' ? 'selected' : ''}`}
                        onClick={() => setBillingOption('same')}
                      >
                        <div className="radio-label">
                          <input
                            type="radio"
                            name="billingOption"
                            value="same"
                            checked={billingOption === 'same'}
                            onChange={() => setBillingOption('same')}
                          />
                          <span>Same as shipping address</span>
                        </div>
                      </div>

                      <div
                        className={`billing-option-row ${billingOption === 'different' ? 'selected' : ''}`}
                        onClick={() => setBillingOption('different')}
                      >
                        <div className="radio-label">
                          <input
                            type="radio"
                            name="billingOption"
                            value="different"
                            checked={billingOption === 'different'}
                            onChange={() => setBillingOption('different')}
                          />
                          <span>Use a different billing address</span>
                        </div>
                      </div>

                      {billingOption === 'different' && (
                        <div className="different-billing-form">
                          <div className="form-group">
                            <select
                              name="country"
                              className="form-select"
                              value={billingAddress.country}
                              onChange={handleBillingChange}
                            >
                              <option value="United States">United States</option>
                              <option value="India">India</option>
                              <option value="United Kingdom">United Kingdom</option>
                              <option value="Canada">Canada</option>
                            </select>
                          </div>
                          <div className="row">
                            <div className="col-lg-6 col-md-6">
                              <div className="form-group">
                                <input
                                  type="text"
                                  name="firstName"
                                  className="form-control"
                                  placeholder="First name"
                                  value={billingAddress.firstName}
                                  onChange={handleBillingChange}
                                />
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
                              <div className="form-group">
                                <input
                                  type="text"
                                  name="lastName"
                                  className="form-control"
                                  placeholder="Last Name"
                                  value={billingAddress.lastName}
                                  onChange={handleBillingChange}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="form-group">
                            <input
                              type="text"
                              name="address"
                              className="form-control"
                              placeholder="Address"
                              value={billingAddress.address}
                              onChange={handleBillingChange}
                            />
                          </div>
                          <div className="row">
                            <div className="col-lg-6 col-md-6">
                              <div className="form-group">
                                <input
                                  type="text"
                                  name="city"
                                  className="form-control"
                                  placeholder="City"
                                  value={billingAddress.city}
                                  onChange={handleBillingChange}
                                />
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
                              <div className="form-group">
                                <input
                                  type="text"
                                  name="postalCode"
                                  className="form-control"
                                  placeholder="Postal Code"
                                  value={billingAddress.postalCode}
                                  onChange={handleBillingChange}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom Actions Row (Matches Screenshot 5) */}
                  <div className="checkout-payment-bottom">
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
                    <div className="checkout-payment-btn">
                      <button type="submit" className="ts-default-btn" disabled={paymentBusy}>
                        {paymentBusy ? 'Processing Order…' : selectedPaymentMode === 'cod' ? 'Place Cash On Delivery Order' : 'Pay securely with Razorpay'} <i className="bx bx-right-arrow-alt"></i>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Right Column: Order Summary Widget (Matches Screenshots 2, 3, 4) */}
            <div className="col-lg-5 col-md-12">
              <div className="ts-checkout-payment-widget-area">
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
                            ${(item.price * item.quantity).toFixed(2)}
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
                        <span>INR</span>₹{finalTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Confirmation Modal */}
      {orderSuccess && (
        <div className="order-success-modal-backdrop" onClick={() => setOrderSuccess(false)}>
          <div className="order-success-modal" onClick={(e) => e.stopPropagation()}>
            <div className="success-icon">
              <i className="bx bx-check-circle"></i>
            </div>
            <h3>Thank You For Your Order!</h3>
            <p>Your order has been placed successfully. Order ID: #TRD-{placedOrderId || Math.floor(100000 + Math.random() * 900000)}. An official confirmation email with live tracking details has been sent to {contactEmail}!</p>
            <div className="modal-btns">
              <button
                className="ts-default-btn"
                onClick={() => {
                  setOrderSuccess(false);
                  navigateTo('shop-left-sidebar', '#shop-left-sidebar');
                }}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPayment;
