import React, { useState, useEffect } from 'react';
import './CustomizeSection.css';
import { useShop } from '../../context/ShopContext.jsx';

const customizeImages = [
  { id: 1, img: '/assets/images/customize/customize-1.png', title: 'Blue Great Vibes', color: '#A7C5E1' },
  { id: 2, img: '/assets/images/customize/customize-2.png', title: 'Olive Nature Tee', color: '#C6C897' },
  { id: 3, img: '/assets/images/customize/customize-3.png', title: 'Coral Adventure Tee', color: '#E65C4F' },
  { id: 4, img: '/assets/images/customize/customize-4.png', title: 'Purple Paradise Tee', color: '#5D19B4' },
  { id: 5, img: '/assets/images/customize/customize-5.png', title: 'Mint Surf Classic', color: '#6BBD99' },
  { id: 6, img: '/assets/images/customize/customize-6.png', title: 'White Essential Tee', color: '#FFFFFF' },
  { id: 7, img: '/assets/images/customize/customize-7.png', title: 'Lime Neon Vibe', color: '#C5FA54' },
  { id: 8, img: '/assets/images/customize/customize-8.png', title: 'Indigo California', color: '#514EB5' },
  { id: 9, img: '/assets/images/customize/customize-9.png', title: 'Brown Good Vibes', color: '#433535' }
];

const CustomizeSection = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const { addToCart } = useShop();

  const changeSlide = (newIndex) => {
    if (newIndex === selectedIndex) return;
    setIsFading(true);
    setTimeout(() => {
      setSelectedIndex(newIndex);
      setIsFading(false);
    }, 200);
  };

  const handleNext = () => {
    const nextIdx = (selectedIndex + 1) % customizeImages.length;
    changeSlide(nextIdx);
  };

  const handlePrev = () => {
    const prevIdx = (selectedIndex - 1 + customizeImages.length) % customizeImages.length;
    changeSlide(prevIdx);
  };

  // Auto color change interval
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setSelectedIndex((prevIndex) => (prevIndex + 1) % customizeImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const handleOrderNow = (e) => {
    e.preventDefault();
    const currentItem = customizeImages[selectedIndex];
    addToCart({
      id: 900 + currentItem.id,
      name: currentItem.title,
      price: 430,
      image: currentItem.img,
      size: 'L'
    });
  };

  const currentItem = customizeImages[selectedIndex];

  return (
    <div className="ts-customize-area" id="customize">
      <div className="container-fluid">
        <div className="ts-section-title text-center mb-5">
          <h2>Customize Your t-shirts Yourself</h2>
          <p className="mx-auto">
            Future Tees by Torado Mart is a collaboration born out of the desire to take. Tell us about yourself and we will tailor your t-shirts to suit you and deliver straight to your door.
          </p>
        </div>

        {/* Mobile Badges Top matching Screenshot 1 & 2 */}
        <div className="d-block d-lg-none ts-customize-badges-mobile mb-1">
          <ul className="ts-customize-list d-flex justify-content-center align-items-center gap-3">
            <li>
              <div className="design-card">
                <img src="/assets/images/customize/design-1.png" alt="Good Vibes" />
              </div>
            </li>
            <li>
              <div className="design-card">
                <img src="/assets/images/customize/design-2.png" alt="Los Angeles Surfing" />
              </div>
            </li>
          </ul>
        </div>

        {/* Main Center Row: Left Badges | Center T-Shirt Preview | Right Badges */}
        <div className="row align-items-center justify-content-between ts-customize-main-row">
          {/* Left Decorative Badges (Desktop) */}
          <div className="col-xl-3 col-lg-3 d-none d-lg-block">
            <ul className="ts-customize-list">
              <li>
                <div className="design-card">
                  <img src="/assets/images/customize/design-1.png" alt="Good Vibes" />
                </div>
              </li>
              <li>
                <div className="design-card">
                  <img src="/assets/images/customize/design-2.png" alt="Los Angeles Surfing" />
                </div>
              </li>
            </ul>
          </div>

          {/* Central Interactive T-Shirt Preview */}
          <div
            className="col-xl-6 col-lg-6 col-md-12 ts-customize-center"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="ts-customize-center-wrapper">
              <button
                type="button"
                className="customize-nav-btn prev-btn"
                onClick={handlePrev}
                aria-label="Previous color"
              >
                <i className="bx bx-left-arrow-alt"></i>
              </button>

              <div className="ts-customize-main-image">
                <img
                  src={currentItem.img}
                  alt={currentItem.title}
                  className={`img-fluid custom-preview-img ${isFading ? 'fade-out' : ''}`}
                />
              </div>

              <button
                type="button"
                className="customize-nav-btn next-btn"
                onClick={handleNext}
                aria-label="Next color"
              >
                <i className="bx bx-right-arrow-alt"></i>
              </button>
            </div>
          </div>

          {/* Right Decorative Badges (Desktop) */}
          <div className="col-xl-3 col-lg-3 d-none d-lg-block">
            <ul className="ts-customize-list">
              <li>
                <div className="design-card">
                  <img src="/assets/images/customize/design-3.png" alt="Summer Adventure" />
                </div>
              </li>
              <li>
                <div className="design-card">
                  <img src="/assets/images/customize/design-4.png" alt="Outdoor Explore" />
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Full-width Bottom Info & Swatch Row */}
        <div className="ts-customize-content d-flex align-items-center justify-content-between flex-wrap gap-3">
          <div className="content">
            <h3><a href="#customize">{currentItem.title}</a></h3>
            <span className="price">₹5.00</span>
          </div>

          {/* Color Swatch Dots */}
          <div className="thumbs-wrap">
            <ul className="d-flex align-items-center">
              {customizeImages.map((item, idx) => (
                <li
                  key={item.id}
                  className={selectedIndex === idx ? 'active' : ''}
                  onClick={() => changeSlide(idx)}
                  title={item.title}
                >
                  <span
                    className="color-dot"
                    style={{ backgroundColor: item.color }}
                  ></span>
                </li>
              ))}
            </ul>
          </div>

          {/* Order Now Button */}
          <div className="customize-btn">
            <button
              type="button"
              onClick={handleOrderNow}
              className="ts-optional-btn"
            >
              Order Now <i className="bx bx-right-arrow-alt"></i>
            </button>
          </div>
        </div>

        {/* Mobile Badges Bottom matching Screenshot 4 */}
        <div className="d-block d-lg-none ts-customize-badges-mobile mt-4">
          <ul className="ts-customize-list d-flex justify-content-center align-items-center gap-3">
            <li>
              <div className="design-card">
                <img src="/assets/images/customize/design-3.png" alt="Summer Adventure" />
              </div>
            </li>
            <li>
              <div className="design-card">
                <img src="/assets/images/customize/design-4.png" alt="Outdoor Explore" />
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="ts-customize-shape">
        <img src="/assets/images/customize/shape.png" alt="shape" />
      </div>
    </div>
  );
};

export default CustomizeSection;
