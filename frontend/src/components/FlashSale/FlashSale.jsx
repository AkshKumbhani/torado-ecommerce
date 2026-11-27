import React, { useState, useEffect } from 'react';
import './FlashSale.css';
import { useShop } from '../../context/ShopContext.jsx';

const flashSaleProducts = [
  { id: 401, name: "Brown Army Hoodie", category: "Sierra, Hoodie", price: 13244, image: "/assets/images/products/flash-sale-1.png", tag: "New" },
  { id: 402, name: "Grey Blue Cycle Hoodie", category: "Grey, Hoodie", price: 13244, oldPrice: 17114, image: "/assets/images/products/flash-sale-2.png", tag: "Sale" },
  { id: 403, name: "Blue White California Hoodie", category: "California, t-shirts", price: 254.00, image: "/assets/images/products/flash-sale-3.png", tag: "New" }
];

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const FlashSale = () => {
  const { addToCart } = useShop();

  // Countdown timer state (matches live sale end date: ~367 days)
  const [timeLeft, setTimeLeft] = useState({
    days: 367,
    hours: 9,
    minutes: 56,
    seconds: 51
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="ts-products-area pb-100">
      <div className="container-fluid">
        <div className="row justify-content-center">
          {/* Promo Add Column */}
          <div className="col-lg-4 col-md-12 mb-4">
            <div className="ts-flash-sale-add rounded overflow-hidden position-relative">
              <div className="products-btn position-absolute bottom-0 start-0 p-4">
                <a href="#womens" className="ts-default-btn">Shop Now <i className="bx bx-right-arrow-alt"></i></a>
              </div>
            </div>
          </div>

          {/* Flash Sale Grid */}
          <div className="col-lg-8 col-md-12 ts-flash-sale-left">
            <div className="ts-section-title extra-class d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
              <div>
                <h2>Flash Sale On Winter Collections</h2>
              </div>

              {/* Countdown Display */}
              <ul className="countdown d-flex align-items-center gap-2">
                <li>
                  <span className="number">{timeLeft.days.toString().padStart(2, '0')}</span>
                  <span className="unit">d</span>
                </li>
                <li>
                  <span className="number">{timeLeft.hours.toString().padStart(2, '00')}</span>
                  <span className="unit">h</span>
                </li>
                <li>
                  <span className="number">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                  <span className="unit">m</span>
                </li>
                <li>
                  <span className="number">{timeLeft.seconds.toString().padStart(2, '0')}</span>
                  <span className="unit">s</span>
                </li>
              </ul>
            </div>

            <div className="row">
              {flashSaleProducts.map((prod) => (
                <div key={prod.id} className="col-lg-4 col-md-6 col-sm-6 mb-4">
                  <div className="ts-flash-sale-card bg-white p-3 rounded shadow-sm">
                    <div className="flash-sale-image position-relative text-center">
                      <a href="#shop">
                        <img src={prod.image} alt={prod.name} className="img-fluid" style={{ maxHeight: '220px' }} />
                      </a>
                      <div className={`tag-badge ${prod.tag === 'Sale' ? 'sale' : 'new'}`}>
                        {prod.tag}
                      </div>

                      <div className="ts-quick-add-action">
                        <div className="ts-quick-add-btn">+ Quick Add</div>
                        <ul className="quick-add-action-list">
                          {sizes.map((s) => (
                            <li key={s} onClick={() => addToCart({ id: prod.id, name: prod.name, price: prod.price, image: prod.image, size: s })}>{s}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flash-sale-content text-center mt-3">
                      <h3><a href="#shop">{prod.name}</a></h3>
                      <span>{prod.category}</span>
                      <div className="price mt-1">
                        ₹{prod.price.toFixed(2)}
                        {prod.oldPrice && <span className="old-price ms-2 text-decoration-line-through text-muted">₹{prod.oldPrice.toFixed(2)}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashSale;
