import React, { useState, useEffect, useRef } from 'react';
import './NewCollection.css';
import { useShop } from '../../context/ShopContext.jsx';

const baseProducts = [
  { id: 101, name: "Men Purple Premium Tee", category: "Catalogs, t-shirts", price: 473, image: "/assets/images/products/collection-1.png" },
  { id: 102, name: "Men Navy Sport Tee", category: "Catalogs, t-shirts", price: 473, image: "/assets/images/products/collection-2.png" },
  { id: 103, name: "Men Olive Casual Tee", category: "Catalogs, t-shirts", price: 473, image: "/assets/images/products/collection-3.png" },
  { id: 104, name: "Men Charcoal Urban Tee", category: "Catalogs, t-shirts", price: 473, image: "/assets/images/products/collection-4.png" }
];

const NewCollection = () => {
  const { addToCart, addToWishlist, isProductActive } = useShop();
  const activeBaseProducts = baseProducts.filter((p) => isProductActive ? isProductActive(p) : true);
  const collectionProducts = [
    ...activeBaseProducts.map(p => ({ ...p, uniqueId: `set1-${p.id}` })),
    ...activeBaseProducts.map(p => ({ ...p, uniqueId: `set2-${p.id}` })),
    ...activeBaseProducts.map(p => ({ ...p, uniqueId: `set3-${p.id}` }))
  ];
  const [activeCard, setActiveCard] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(4); // Start at set 2
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [itemsPerView, setItemsPerView] = useState(4);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 576) {
        setItemsPerView(1);
      } else if (window.innerWidth < 992) {
        setItemsPerView(2);
      } else if (window.innerWidth < 1200) {
        setItemsPerView(3);
      } else {
        setItemsPerView(4);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePrev = () => {
    setIsTransitioning(true);
    setCurrentIndex(prev => prev - 1);
  };

  const handleNext = () => {
    setIsTransitioning(true);
    setCurrentIndex(prev => prev + 1);
  };

  const handleTransitionEnd = () => {
    if (currentIndex >= 8) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex - 4);
    } else if (currentIndex < 4) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex + 4);
    }
  };

  const handleCardClick = (uniqueId) => {
    setActiveCard(prev => (prev === uniqueId ? null : uniqueId));
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  const itemWidthPercentage = 100 / itemsPerView;
  const translateX = -(currentIndex * itemWidthPercentage);

  return (
    <div className="ts-products-area pt-75 pb-75">
      <div className="container-fluid">
        <div className="ts-section-title d-flex align-items-center justify-content-between flex-wrap mb-4">
          <h2>New Collection of 2025</h2>
          <div className="collection-nav-arrows d-flex align-items-center gap-2">
            <button
              type="button"
              className="nav-arrow-btn"
              onClick={handlePrev}
              aria-label="Previous Collection"
              title="Previous"
            >
              <i className="bx bx-left-arrow-alt"></i>
            </button>
            <button
              type="button"
              className="nav-arrow-btn"
              onClick={handleNext}
              aria-label="Next Collection"
              title="Next"
            >
              <i className="bx bx-right-arrow-alt"></i>
            </button>
          </div>
        </div>

        <div
          className="ts-collection-slider-wrapper"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="ts-collection-slider-track"
            onTransitionEnd={handleTransitionEnd}
            style={{
              transform: `translateX(${translateX}%)`,
              transition: isTransitioning ? 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)' : 'none'
            }}
          >
            {collectionProducts.map((prod, idx) => (
              <div
                key={`${prod.uniqueId}-${idx}`}
                className="ts-collection-slider-item"
                style={{ flex: `0 0 ${itemWidthPercentage}%`, maxWidth: `${itemWidthPercentage}%` }}
              >
                <div
                  className={`ts-products-collection-card ${activeCard === prod.uniqueId ? 'is-active' : ''}`}
                  onClick={() => handleCardClick(prod.uniqueId)}
                >
                  <div className="collection-image">
                    <a href="#shop" onClick={(e) => e.preventDefault()}>
                      <img src={prod.image} alt={prod.name} />
                    </a>
                    <ul className="ts-action-list" onClick={(e) => e.stopPropagation()}>
                      <li>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart({ id: prod.id, name: prod.name, price: prod.price, image: prod.image });
                          }}
                          title="Add to Cart"
                        >
                          <img src="/assets/images/icon/shopping-bag-white.svg" alt="cart" />
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            addToWishlist({ id: prod.id, name: prod.name, price: prod.price, image: prod.image });
                          }}
                          title="Add to Wishlist"
                        >
                          <img src="/assets/images/icon/heart-2.svg" alt="wishlist" />
                        </button>
                      </li>
                      <li>
                        <a
                          href="#compare"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          title="Compare"
                        >
                          <img src="/assets/images/icon/up-and-down.svg" alt="compare" />
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="collection-content text-center mt-3">
                    <h3><a href="#shop" onClick={(e) => e.preventDefault()}>{prod.name}</a></h3>
                    <span>{prod.category}</span>
                    <div className="price mt-1">₹{prod.price.toFixed(2)}</div>
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

export default NewCollection;


