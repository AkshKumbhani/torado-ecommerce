import React, { useEffect } from 'react';
import './Wishlist.css';
import { useShop } from '../../context/ShopContext.jsx';

const recommendedProducts = [
  {
    id: 901,
    name: "Green Explore t-shirt",
    category: "Catalogs, t-shirts",
    price: 473,
    image: "/assets/images/customize/customize-1.png"
  },
  {
    id: 902,
    name: "Grey NYC t-shirt",
    category: "Grey, t-shirts",
    price: 559,
    image: "/assets/images/customize/customize-4.png"
  },
  {
    id: 903,
    name: "Men's California t-shirt",
    category: "California, t-shirts",
    price: 645,
    image: "/assets/images/customize/customize-7.png"
  }
];

const Wishlist = () => {
  const {
    wishlistItems,
    removeFromWishlist,
    addToCart,
    setCurrentPage
  } = useShop();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const navigateTo = (page, hash) => {
    setCurrentPage(page);
    if (hash) window.location.hash = hash;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (item) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      color: item.color || 'Purple',
      size: item.size || 'M',
      quantity: 1
    });
  };

  return (
    <div className="torado-wishlist-page">
      {/* 1. Page Banner */}
      <div className="ts-page-banner-area pt-100 pb-100">
        <div className="container">
          <div className="ts-page-banner-content text-center">
            <h2>Wishlist</h2>
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
              <li>Wishlist</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 2. Wishlist Table Area */}
      <div className="ts-wishlist-area pt-100 pb-75">
        <div className="container">
          {wishlistItems.length === 0 ? (
            <div className="ts-empty-wishlist">
              <i className="bx bx-heart"></i>
              <h3>Your Wishlist is Currently Empty!</h3>
              <p>Explore more and shortlist some items you love.</p>
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
                Explore Products <i className="bx bx-right-arrow-alt"></i>
              </a>
            </div>
          ) : (
            <div className="ts-wishlist-table table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">PRODUCT</th>
                    <th scope="col">PRICE</th>
                    <th scope="col">ADD TO CART</th>
                    <th scope="col">AVAILABILITY</th>
                    <th scope="col">REMOVE</th>
                  </tr>
                </thead>
                <tbody>
                  {wishlistItems.map((item) => {
                    const isOutOfStock = item.inStock === false;
                    return (
                      <tr
                        key={item.id}
                        className={isOutOfStock ? 'border-none' : ''}
                      >
                        {/* Product Thumbnail & Details */}
                        <td className="product-thumbnail">
                          <div className="image">
                            <a
                              href="#shop"
                              onClick={(e) => e.preventDefault()}
                            >
                              <img
                                src={item.image || '/assets/images/wishlist/wishlist-1.jpg'}
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
                            ?{item.price.toFixed(2)}
                          </span>
                        </td>

                        {/* Add to Cart */}
                        <td className="product-add-to-cart">
                          <button
                            type="button"
                            disabled={isOutOfStock}
                            onClick={() => !isOutOfStock && handleAddToCart(item)}
                          >
                            Add To Cart
                          </button>
                        </td>

                        {/* Availability */}
                        <td className="availability">
                          <span
                            style={{
                              color: isOutOfStock ? '#9B9B9B' : '#1a1a1a'
                            }}
                          >
                            {isOutOfStock ? 'Out Of Stock' : 'Available'}
                          </span>
                        </td>

                        {/* Remove */}
                        <td className="remove">
                          <a
                            href="#remove"
                            onClick={(e) => {
                              e.preventDefault();
                              removeFromWishlist(item.id);
                            }}
                            title="Remove from wishlist"
                          >
                            <i className="bx bx-x"></i>
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* 3. Recommended For You Section (Screenshot 3 & 4) */}
      <div className="ts-recommended-section">
        <div className="container">
          <div className="section-title">
            <h3>Recommended For You</h3>
          </div>

          <div className="row">
            {recommendedProducts.map((prod) => (
              <div key={prod.id} className="col-lg-4 col-md-6 col-sm-6">
                <div className="ts-recommended-card">
                  <div className="card-image">
                    <a
                      href="#shop"
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddToCart(prod);
                      }}
                    >
                      <img src={prod.image} alt={prod.name} />
                    </a>
                  </div>
                  <div className="card-content">
                    <h4>
                      <a href="#shop" onClick={(e) => e.preventDefault()}>
                        {prod.name}
                      </a>
                    </h4>
                    <span className="category">{prod.category}</span>
                    <div className="price">?{prod.price.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;