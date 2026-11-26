import React, { useState } from 'react';
import './WomensProducts.css';
import { useShop } from '../../context/ShopContext.jsx';

const womensItems = [
  { id: 301, name: "Polar Sherpa Shirt Jacket", category: "Polar, t-shirts", price: 12728, img1: "/assets/images/products/women-1.jpg", img2: "/assets/images/products/women-hover-1.jpg", tag: "Best Seller" },
  { id: 302, name: "Polartec Sherpa 1/2 Zip", category: "Grey, Cabernet", price: 12169, img1: "/assets/images/products/women-2.jpg", img2: "/assets/images/products/women-hover-2.jpg", tag: "Best Seller" },
  { id: 303, name: "Almost Friday Tee Cropped", category: "Dune", price: 2924, img1: "/assets/images/products/women-3.jpg", img2: "/assets/images/products/women-hover-3.jpg", tag: "Best Seller" },
  { id: 304, name: "Brown Tee Croped", category: "Sierra, t-shirts", price: 2946, img1: "/assets/images/products/women-4.jpg", img2: "/assets/images/products/women-hover-4.jpg", newTag: true },
  { id: 305, name: "Thermopuff Jacket", category: "Black, t-shirts", price: 15824, img1: "/assets/images/products/women-5.jpg", img2: "/assets/images/products/women-hover-5.jpg", newTag: true },
  { id: 306, name: "Almost Sunday Tee", category: "Catalogs, Haze", price: 3634, img1: "/assets/images/products/women-6.jpg", img2: "/assets/images/products/women-hover-6.jpg", newTag: true },
  { id: 307, name: "Tomboy Tee Cropped", category: "Catalogs, Haze", price: 2946, img1: "/assets/images/products/women-7.jpg", img2: "/assets/images/products/women-hover-7.jpg", tag: "Best Seller" },
  { id: 308, name: "Tomboy Tee Cropped - Caramel", category: "t-shirts", price: 5784, img1: "/assets/images/products/women-8.jpg", img2: "/assets/images/products/women-hover-8.jpg", newTag: true }
];

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const WomensProducts = () => {
  const [tab, setTab] = useState('best-seller-two');
  const { addToCart, addToWishlist, isProductActive } = useShop();

  const handleQuickAdd = (product, size) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.img1,
      size: size
    });
  };

  const activeWomensItems = womensItems.filter((item) => isProductActive ? isProductActive(item) : true);
  const topItems = activeWomensItems.slice(0, 3);
  const bottomItems = activeWomensItems.slice(3, 7);
  const lastItem = activeWomensItems.slice(7);

  const renderCard = (prod) => (
    <div className="ts-products-women-card">
      <div className="women-image">
        <a href="#shop" className="image-wrap">
          <img src={prod.img1} alt={prod.name} className="default-img" />
          <img src={prod.img2} alt={prod.name} className="hover-img" />
        </a>

        {prod.tag && <div className="tag"><a href="#shop">{prod.tag}</a></div>}
        {prod.newTag && <div className="new"><a href="#shop">New</a></div>}

        <div className="heart-btn">
          <button
            type="button"
            onClick={() => addToWishlist({ id: prod.id, name: prod.name, price: prod.price, image: prod.img1 })}
          >
            <i className="bx bx-heart"></i>
          </button>
        </div>

        <div className="ts-quick-add-action">
          <div className="ts-quick-add-btn">+ Quick Add</div>
          <ul className="quick-add-action-list">
            {sizes.map((s) => (
              <li key={s} onClick={() => handleQuickAdd(prod, s)}>{s}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="women-content mt-3">
        <h3><a href="#shop">{prod.name}</a></h3>
        <span>{prod.category}</span>
        <div className="price mt-1">?{prod.price.toFixed(2)}</div>
      </div>
    </div>
  );

  return (
    <div className="ts-products-area pt-100 pb-75" id="womens">
      <div className="container-fluid">
        {/* Section Header */}
        <div className="ts-section-title with-bottom-border d-flex align-items-center justify-content-between flex-wrap gap-3 pb-3 mb-4">
          <div>
            <h2>Women's Trending Now</h2>
          </div>

          <ul className="nav nav-tabs tab-buttons">
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link ${tab === 'best-seller-two' ? 'active' : ''}`}
                onClick={() => setTab('best-seller-two')}
              >
                Best Seller
              </button>
            </li>
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link ${tab === 'new-arrivals-two' ? 'active' : ''}`}
                onClick={() => setTab('new-arrivals-two')}
              >
                New Arrivals
              </button>
            </li>
          </ul>

          <div className="section-btn">
            <a href="#womens" className="ts-optional-btn">
              Shop All <i className="bx bx-right-arrow-alt"></i>
            </a>
          </div>
        </div>

        {/* Top Row: 3 product cards + Promo Banner */}
        <div className="row mb-4">
          <div className="col-xl-7 col-md-12">
            <div className="row">
              {topItems.map((prod) => (
                <div key={prod.id} className="col-xl-4 col-md-4 col-sm-6 mb-4">
                  {renderCard(prod)}
                </div>
              ))}
            </div>
          </div>

          {/* Featured Promo Banner */}
          <div className="col-xl-5 col-md-12 mb-4">
            <div className="ts-products-women-card promo-card position-relative overflow-hidden rounded">
              <img src="/assets/images/products/shop.jpg" alt="Women Promo" className="w-100 h-100 object-fit-cover" />
              <div className="women-products-btn position-absolute bottom-0 start-0 p-4">
                <a href="#womens" className="ts-default-btn">Shop Now <i className="bx bx-right-arrow-alt"></i></a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row: 4 cards */}
        <div className="row">
          {bottomItems.map((prod) => (
            <div key={prod.id} className="col-xl-3 col-lg-3 col-md-6 col-sm-6 mb-4">
              {renderCard(prod)}
            </div>
          ))}
        </div>

        {/* Last row: remaining item(s) */}
        {lastItem.length > 0 && (
          <div className="row">
            {lastItem.map((prod) => (
              <div key={prod.id} className="col-xl-3 col-lg-3 col-md-6 col-sm-6 mb-4">
                {renderCard(prod)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WomensProducts;