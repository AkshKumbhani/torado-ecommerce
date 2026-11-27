import React, { useState, useEffect } from 'react';
import './Cart.css';
import { useShop } from '../../context/ShopContext.jsx';

const Cart = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    subtotal,
    setCurrentPage
  } = useShop();

  const [showNotes, setShowNotes] = useState(false);
  const [showShipping, setShowShipping] = useState(false);
  const [notes, setNotes] = useState('');
  const [country, setCountry] = useState('United States');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [shippingRate, setShippingRate] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const navigateTo = (page, hash) => {
    setCurrentPage(page);
    if (hash) window.location.hash = hash;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCalculateShipping = (e) => {
    e.preventDefault();
    if (zip.trim()) {
      setShippingRate(15.00);
      alert('Shipping calculated: Standard Shipping (₹15.00)');
    } else {
      alert('Please enter a zip/postal code');
    }
  };

  const grandTotal = subtotal + shippingRate;

  return (
    <div className="torado-cart-page">
      {/* 1. Page Banner */}
      <div className="ts-page-banner-area pt-100 pb-100">
        <div className="container">
          <div className="ts-page-banner-content text-center">
            <h2>Cart</h2>
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
              <li>Cart</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 2. Cart Area */}
      <div className="ts-cart-area pt-100 pb-100">
        <div className="container">
          {cartItems.length === 0 ? (
            <div className="ts-empty-cart">
              <i className="bx bx-shopping-bag"></i>
              <h3>Your Cart is Currently Empty!</h3>
              <p>Looks like you haven't added anything to your cart yet.</p>
              <a
                href="#shop"
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo('shop-hidden-sidebar', '#shop');
                }}
                className="ts-default-btn"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'linear-gradient(90deg, #FC8A45 0%, #FE4267 100%)',
                  color: '#fff',
                  borderRadius: '50px',
                  padding: '14px 35px',
                  fontWeight: '600'
                }}
              >
                Continue Shopping <i className="bx bx-right-arrow-alt"></i>
              </a>
            </div>
          ) : (
            <>
              {/* Cart Table */}
              <div className="ts-cart-table table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">PRODUCT</th>
                      <th scope="col">PRICE</th>
                      <th scope="col">QUANTITY</th>
                      <th scope="col">TOTAL</th>
                      <th scope="col">REMOVE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => (
                      <tr key={`${item.id}-${item.size || 'M'}`}>
                        {/* Product Thumbnail & Details */}
                        <td className="product-thumbnail">
                          <div className="image">
                            <a
                              href="#shop"
                              onClick={(e) => e.preventDefault()}
                            >
                              <img
                                src={item.image || '/assets/images/cart/cart-1.jpg'}
                                alt={item.name}
                              />
                            </a>
                          </div>
                          <div className="title">
                            <h3>
                              <a
                                href="#shop"
                                onClick={(e) => e.preventDefault()}
                              >
                                {item.name}
                              </a>
                            </h3>
                            <ul className="list">
                              <li>
                                <span>Color:</span> {item.color || 'Purple'}
                              </li>
                              <li>
                                <span>Size:</span> {item.size || 'M'}
                              </li>
                            </ul>
                          </div>
                        </td>

                        {/* Price */}
                        <td className="product-price">
                          <span className="unit-amount">
                            ₹{item.price.toFixed(2)}
                          </span>
                        </td>

                        {/* Quantity Counter */}
                        <td className="product-quantity">
                          <div className="input-counter">
                            <span
                              className="minus-btn"
                              onClick={() => updateQuantity(item.id, -1)}
                            >
                              <i className="bx bx-minus"></i>
                            </span>
                            <input
                              type="text"
                              value={item.quantity}
                              readOnly
                            />
                            <span
                              className="plus-btn"
                              onClick={() => updateQuantity(item.id, 1)}
                            >
                              <i className="bx bx-plus"></i>
                            </span>
                          </div>
                        </td>

                        {/* Total */}
                        <td className="product-subtotal">
                          <span className="subtotal-amount">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </td>

                        {/* Remove */}
                        <td className="remove">
                          <a
                            href="#remove"
                            onClick={(e) => {
                              e.preventDefault();
                              removeFromCart(item.id);
                            }}
                            title="Remove item"
                          >
                            <i className="bx bx-x"></i>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Bottom Row: Continue Shopping & Totals Box */}
              <div className="ts-cart-totals-inner">
                <div className="row align-items-center">
                  <div className="col-lg-6 col-md-6">
                    <div className="ts-cart-shopping-content">
                      <a
                        href="#home"
                        onClick={(e) => {
                          e.preventDefault();
                          navigateTo('home', '#home');
                        }}
                      >
                        <i className="bx bx-left-arrow-alt"></i> Continue Shopping
                      </a>
                    </div>
                  </div>

                  <div className="col-lg-6 col-md-6">
                    <div className="ts-cart-totals-box">
                      {/* Notes & Shipping 2-box */}
                      <div className="cart-note-shipping">
                        <div
                          className="cart-note"
                          onClick={() => {
                            setShowNotes(!showNotes);
                            setShowShipping(false);
                          }}
                        >
                          <img src="/assets/images/icon/edit.svg" alt="Add Notes" />
                          <span>Add Notes</span>
                        </div>

                        <div
                          className="cart-shipping"
                          onClick={() => {
                            setShowShipping(!showShipping);
                            setShowNotes(false);
                          }}
                        >
                          <img src="/assets/images/icon/car.svg" alt="Calculate Shipping" />
                          <span>Calculate Shipping</span>
                        </div>
                      </div>

                      {/* Expandable Notes Form */}
                      {showNotes && (
                        <div className="cart-expandable-box">
                          <label style={{ fontWeight: 600, marginBottom: '8px', display: 'block', fontSize: '14px' }}>
                            Add Note for Seller:
                          </label>
                          <textarea
                            rows="3"
                            placeholder="Special instructions or gift notes..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                          ></textarea>
                          <div style={{ marginTop: '10px', textAlign: 'right' }}>
                            <button
                              type="button"
                              className="btn btn-sm btn-dark"
                              style={{ borderRadius: '20px', padding: '5px 18px', fontSize: '13px' }}
                              onClick={() => {
                                alert('Note saved!');
                                setShowNotes(false);
                              }}
                            >
                              Save Note
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Expandable Shipping Calculator */}
                      {showShipping && (
                        <form onSubmit={handleCalculateShipping} className="cart-expandable-box">
                          <label style={{ fontWeight: 600, marginBottom: '8px', display: 'block', fontSize: '14px' }}>
                            Calculate Shipping:
                          </label>
                          <select
                            className="form-select mb-2"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            style={{ fontSize: '14px', height: '42px' }}
                          >
                            <option value="United States">United States</option>
                            <option value="India">India</option>
                            <option value="United Kingdom">United Kingdom</option>
                            <option value="Canada">Canada</option>
                            <option value="Australia">Australia</option>
                          </select>
                          <input
                            type="text"
                            placeholder="State / Province"
                            className="mb-2"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                          />
                          <input
                            type="text"
                            placeholder="Postal / Zip Code"
                            className="mb-2"
                            value={zip}
                            onChange={(e) => setZip(e.target.value)}
                            required
                          />
                          <button
                            type="submit"
                            className="btn btn-sm btn-dark w-100 mt-1"
                            style={{ borderRadius: '20px', padding: '8px 18px', fontSize: '13px' }}
                          >
                            Calculate
                          </button>
                        </form>
                      )}

                      {/* Subtotal */}
                      <div className="cart-subtotal">
                        <span className="sub">Subtotal</span>
                        <span className="total">
                          ₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>

                      {/* Proceed to Checkout */}
                      <div className="cart-btn">
                        <a
                          href="#checkout"
                          onClick={(e) => {
                            e.preventDefault();
                            navigateTo('checkout', '#checkout');
                          }}
                          className="ts-default-btn"
                        >
                          Proceed To Checkout <i className="bx bx-right-arrow-alt"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;