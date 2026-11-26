import React from 'react';
import './CartModal.css';
import { useShop } from '../../context/ShopContext.jsx';

const CartModal = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cartItems,
    updateQuantity,
    removeFromCart,
    subtotal,
    setCurrentPage
  } = useShop();

  if (!isCartOpen) return null;

  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsCartOpen(false);
    }
  };

  const navigateToCart = () => {
    setIsCartOpen(false);
    setCurrentPage('cart');
    window.location.hash = '#cart';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToCheckout = () => {
    setIsCartOpen(false);
    setCurrentPage('checkout');
    window.location.hash = '#checkout';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="ts-cart-modal-backdrop" onClick={handleBackdropClick}>
      <div className="ts-cart-modal-container">
        {/* Header (Matches Screenshot 2) */}
        <div className="cart-panel-header">
          <h3>Shopping Cart ({totalCount.toString().padStart(2, '0')})</h3>
          <button
            type="button"
            className="close-btn"
            onClick={() => setIsCartOpen(false)}
            aria-label="Close"
          >
            <i className="bx bx-x"></i>
          </button>
        </div>

        {/* Cart Drawer Items */}
        <div className="ts-cart-drawer-items">
          {cartItems.length === 0 ? (
            <div className="ts-cart-drawer-empty">
              <i className="bx bx-shopping-bag"></i>
              <p>Your shopping cart is empty.</p>
              <button
                type="button"
                className="btn btn-dark"
                style={{ borderRadius: '50px', padding: '10px 25px' }}
                onClick={() => setIsCartOpen(false)}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={`${item.id}-${item.size || 'M'}`}
                className="ts-cart-drawer-card"
              >
                {/* Thumbnail */}
                <div className="ts-cart-card-img">
                  <img
                    src={item.image || '/assets/images/cart/cart-1.jpg'}
                    alt={item.name}
                  />
                </div>

                {/* Info & Controls */}
                <div className="ts-cart-card-info">
                  <h4 className="ts-cart-card-title">
                    <a href="#shop" onClick={(e) => e.preventDefault()}>
                      {item.name}
                    </a>
                  </h4>

                  <div className="ts-cart-card-meta">
                    Color: {item.color || 'Purple'}
                  </div>
                  <div className="ts-cart-card-meta">
                    Size: {item.size || 'M'}
                  </div>

                  <div className="ts-cart-card-price">
                    ₹{item.price.toFixed(2)}
                  </div>

                  <div className="ts-cart-card-actions">
                    {/* - 1 + Counter */}
                    <div className="ts-card-counter">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, -1)}
                        aria-label="Decrease quantity"
                      >
                        <i className="bx bx-minus"></i>
                      </button>
                      <span className="qty-num">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, 1)}
                        aria-label="Increase quantity"
                      >
                        <i className="bx bx-plus"></i>
                      </button>
                    </div>

                    {/* Trash Delete Button */}
                    <button
                      type="button"
                      className="ts-cart-card-remove"
                      onClick={() => removeFromCart(item.id)}
                      title="Remove item"
                      aria-label="Remove item"
                    >
                      <i className="bx bx-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Subtotal & Actions */}
        {cartItems.length > 0 && (
          <div className="ts-cart-drawer-footer">
            <div className="ts-cart-drawer-subtotal">
              <span className="sub">Subtotal</span>
              <span className="total">₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="ts-cart-drawer-btns">
              <button
                type="button"
                className="btn-view-cart"
                onClick={navigateToCart}
              >
                View Cart <i className="bx bx-right-arrow-alt"></i>
              </button>

              <button
                type="button"
                className="btn-checkout"
                onClick={navigateToCheckout}
              >
                Checkout <i className="bx bx-right-arrow-alt"></i>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;