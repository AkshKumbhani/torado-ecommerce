import React, { useState } from 'react';
import './FrontBackView.css';

const FrontBackView = () => {
  const [activeTab, setActiveTab] = useState('front');

  return (
    <div className="ts-front-and-back-area ptb-100">
      <div className="container">
        <div className="row justify-content-center align-items-center">
          <div className="col-lg-6 col-md-12 text-center">
            <div className="ts-front-and-back-image">
              {activeTab === 'front' ? (
                <img src="/assets/images/front-and-back/front.gif" alt="Tee Front View GIF" key="front" />
              ) : (
                <img src="/assets/images/front-and-back/back.gif" alt="Tee Back View GIF" key="back" />
              )}
            </div>
          </div>

          <div className="col-lg-6 col-md-12">
            <div className="ts-front-and-back-content">
              <h3>Our upcoming <span>t-shirts</span> view for pre-order in Torado</h3>
              
              <ul className="nav nav-tabs custom-tabs mb-4">
                <li className="nav-item">
                  <button
                    type="button"
                    className={`nav-link ${activeTab === 'front' ? 'active' : ''}`}
                    onClick={() => setActiveTab('front')}
                  >
                    Front View
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    type="button"
                    className={`nav-link ${activeTab === 'back' ? 'active' : ''}`}
                    onClick={() => setActiveTab('back')}
                  >
                    Back View
                  </button>
                </li>
              </ul>

              <p>
                Future Tees by Torado Mart is a collaboration born out of the desire to take. Tell us about yourself and we will tailor your t-shirts to suit you and deliver straight to your door.
              </p>
              <div className="price mb-4">STARTS AT ONLY <b>₹10</b></div>
              <div className="front-and-back-btn">
                <a href="#mens" className="ts-default-btn">
                  Pre-order Now <i className="bx bx-right-arrow-alt"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="ts-front-and-back-shape">
        <img src="/assets/images/front-and-back/shape.png" alt="shape" />
      </div>
    </div>
  );
};

export default FrontBackView;
