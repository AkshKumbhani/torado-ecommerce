import React from 'react';
import './WishlistModal.css';
import { useShop } from '../../context/ShopContext.jsx';

const WishlistModal = () => {
  const {
    isWishlistOpen,
    setIsWishlistOpen,
    wishlistItems,
    removeFromWishlist,
    addToCart,
    setCurrentPage
  } = useShop();

  if (!isWishlistOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsWishlistOpen(false);
    }
  };

  const navigateToWishlistPage = () => {
    setIsWishlistOpen(false);
    setCurrentPage('wishlist');
    window.location.hash = '#wishlist';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="ts-wishlist-modal-backdrop" onClick={handleBackdropClick}>
      <div className="ts-wishlist-modal-container">
        {/* Header */}
        <div className="wishlist-panel-header">
          <h3>Wishlist ({wishlistItems.length.toString().padStart(2, '0')})</h3>
          <button
            type="button"
            className="close-btn"
            onClick={() => setIsWishlistOpen(false)}
            aria-label="Close"
          >
            <i className="bx bx-x"></i>
          </button>
        </div>

        {/* Wishlist Items List */}
        <div className="ts-wishlist-drawer-items">
          {wishlistItems.length === 0 ? (
            <div className="ts-wishlist-drawer-empty">
              <i className="bx bx-heart"></i>
              <p>Your wishlist is currently empty.</p>
              <button
                type="button"
                className="btn btn-dark"
                style={{ borderRadius: '50px', padding: '10px 25px' }}
                onClick={() => setIsWishlistOpen(false)}
              >
                Explore Products
              </button>
            </div>
          ) : (
            wishlistItems.map((item) => (
              <div key={item.id} className="ts-wishlist-drawer-card">
                <div className="card-img">
                  <img src={item.image || '/assets/images/wishlist/wishlist-1.jpg'} alt={item.name} />
                </div>
                <div className="card-info">
                  <h4>{item.name}</h4>
                  <div className="price">₹{item.price.toFixed(2)}</div>
                  <div className="card-actions">
                    <button
                      type="button"
                      className="btn-drawer-add"
                      onClick={() => {
                        addToCart({
                          id: item.id,
                          name: item.name,
                          price: item.price,
                          image: item.image,
                          color: item.color || 'Purple',
                          size: item.size || 'M',
                          quantity: 1
                        });
                      }}
                    >
                      Add To Cart
                    </button>
                    <button
                      type="button"
                      className="btn-drawer-remove"
                      onClick={() => removeFromWishlist(item.id)}
                      title="Remove"
                    >
                      <i className="bx bx-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Link to full Wishlist Page */}
        <div className="ts-wishlist-drawer-footer">
          <button
            type="button"
            className="btn-full-wishlist"
            onClick={navigateToWishlistPage}
          >
            View Full Wishlist Page <i className="bx bx-right-arrow-alt"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WishlistModal;