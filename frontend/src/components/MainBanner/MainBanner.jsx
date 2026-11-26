import React from 'react';
import './MainBanner.css';

const MainBanner = () => {
  return (
    <div className="ts-main-banner-area">
      <div className="container-fluid">
        <div className="row align-items-center justify-content-center">
          <div className="col-lg-5 col-md-12">
            <div className="ts-main-banner-content">
              <h1>Pick The Best Tee Shirts From Torado Mart</h1>
              <p>
                Future Tees by Torado Mart is a collaboration born out of the desire to take Futurewear by Torado Mart and company.
              </p>
              <div className="banner-btn">
                <a href="#mens" className="ts-optional-btn">
                  View T-Shirts <i className="bx bx-right-arrow-alt"></i>
                </a>
              </div>
            </div>
          </div>

          <div className="col-lg-7 col-md-12">
            <div className="ts-main-banner-image">
              <img src="/assets/images/main-banner/banner.png" alt="Torado Fashion Model" />

              <div className="off-wrap">
                <div className="content">
                  <span>Avail The</span>
                  <h2>50%</h2>
                  <h3>Off</h3>
                </div>
              </div>
              <div className="ellipse-circle"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="ts-main-banner-shape-1">
        <img src="/assets/images/main-banner/shape1.png" alt="shape 1" />
      </div>
      <div className="ts-main-banner-shape-2">
        <img src="/assets/images/main-banner/shape2.png" alt="shape 2" />
      </div>
      <div className="ts-main-banner-shape-3">
        <img src="/assets/images/main-banner/shape3.png" alt="shape 3" />
      </div>
      <div className="ts-main-banner-shape-4">
        <img src="/assets/images/main-banner/shape4.png" alt="shape 4" />
      </div>
    </div>
  );
};

export default MainBanner;
