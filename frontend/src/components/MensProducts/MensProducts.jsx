import React, { useState } from 'react';
import './MensProducts.css';
import { useShop } from '../../context/ShopContext.jsx';

const mensItems = [
  { id: 201, name: "Green Explore t-shirt", category: "Catalogs, t-shirts", price: 473, image: "/assets/images/products/men-1.jpg" },
  { id: 202, name: "Grey NYC t-shirt", category: "Grey, t-shirts", price: 559, image: "/assets/images/products/men-2.jpg" },
  { id: 203, name: "Men's California t-shirt", category: "California, t-shirts", price: 645, image: "/assets/images/products/men-3.jpg" },
  { id: 204, name: "New York cotton t-shirt", category: "Catalogs, t-shirts", price: 645, image: "/assets/images/products/men-4.jpg", newTag: true },
  { id: 205, name: "Men's purple cotton t-shirt", category: "Purple, t-shirts", price: 645, image: "/assets/images/products/men-5.jpg" },
  { id: 206, name: "Earthy White t-shirt", category: "Catalogs, t-shirts", price: 301, image: "/assets/images/products/men-6.jpg", newTag: true },
  { id: 207, name: "Cycling Therapy t-shirt", category: "Custom, t-shirts", price: 301, image: "/assets/images/products/men-7.jpg" },
  { id: 208, name: "Pink Los Angeles t-shirt", category: "Los Angeles, t-shirts", price: 8557, image: "/assets/images/products/men-8.jpg" },
  { id: 209, name: "Brown cotton t-shirt", category: "Catalogs, t-shirts", price: 4773, image: "/assets/images/products/men-9.jpg" },
  { id: 210, name: "Coral Own Cotton t-shirt", category: "Best seller, t-shirts", price: 559, image: "/assets/images/products/men-10.jpg", tag: "Best Seller" }
];

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const MensProducts = () => {
  const [tab, setTab] = useState('best-seller');
  const { addToCart, addToWishlist, isProductActive } = useShop();

  const handleQuickAdd = (product, size) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: size
    });
  };

  const displayedProducts = (tab === 'best-seller'
    ? mensItems
    : mensItems.filter((item) => item.newTag || item.id % 2 === 0)
  ).filter((item) => isProductActive ? isProductActive(item) : true);

  return (
    <div className="ts-products-area pt-100 pb-75" id="mens">
      <div className="container-fluid">
        <div className="ts-section-title with-bottom-border d-flex align-items-center justify-content-between flex-wrap gap-3 pb-3 mb-4">
          <div>
            <h2>Men's Trending Now</h2>
          </div>

          <ul className="nav nav-tabs tab-buttons">
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link ${tab === 'best-seller' ? 'active' : ''}`}
                onClick={() => setTab('best-seller')}
              >
                Best Seller
              </button>
            </li>
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link ${tab === 'new-arrivals' ? 'active' : ''}`}
                onClick={() => setTab('new-arrivals')}
              >
                New Arrivals
              </button>
            </li>
          </ul>

          <div className="section-btn">
            <a href="#mens" className="ts-optional-btn">
              Shop All <i className="bx bx-right-arrow-alt"></i>
            </a>
          </div>
        </div>

        <div className="row">
          {displayedProducts.map((prod) => (
            <div key={prod.id} className="col-xl-3 col-lg-3 col-md-6 col-sm-6 mb-4">
              <div className="ts-products-men-card">
                <div className="men-image">
                  <a href="#shop">
                    <img src={prod.image} alt={prod.name} />
                  </a>

                  {prod.tag && (
                    <div className="tag">
                      <a href="#shop">{prod.tag}</a>
                    </div>
                  )}

                  {prod.newTag && (
                    <div className="new">
                      <a href="#shop">New</a>
                    </div>
                  )}

                  <div className="heart-btn">
                    <button
                      type="button"
                      onClick={() => addToWishlist({ id: prod.id, name: prod.name, price: prod.price, image: prod.image })}
                      title="Wishlist"
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

                <div className="men-content mt-3">
                  <h3><a href="#shop">{prod.name}</a></h3>
                  <span>{prod.category}</span>
                  <div className="price mt-1">₹{prod.price.toFixed(2)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MensProducts;
