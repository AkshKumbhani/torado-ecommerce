import React from 'react';
import './Overview.css';

const Overview = () => {
  return (
    <div className="ts-overview-area">
      <div className="container">
        <div className="row justify-content-center align-items-center">
          <div className="col-lg-6 col-md-12">
            <div className="ts-overview-content">
              <h3>We also have <span>Couple Set</span> in pre-order based</h3>
              <p>
                Future Tees by Torado Mart is a collaboration born out of the desire to take. Tell us about yourself and we will tailor your t-shirts to suit you and deliver straight to your door.
              </p>
              <div className="price">STARTS AT ONLY <b>₹10</b></div>
              <div className="overview-btn">
                <a href="#mens" className="ts-default-btn">
                  Order Yours couple t-shirts <i className="bx bx-right-arrow-alt"></i>
                </a>
              </div>
            </div>
          </div>

          <div className="col-lg-6 col-md-12">
            <div className="ts-overview-image">
              <img src="/assets/images/overview/overview.png" alt="Couple Set Overview" />
              <div className="off-wrap">
                <div className="content">
                  <span>Avail The</span>
                  <h2>50%</h2>
                  <h3>Off</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="ts-overview-shape">
        <img src="/assets/images/overview/shape.png" alt="shape" />
      </div>
    </div>
  );
};

export default Overview;
