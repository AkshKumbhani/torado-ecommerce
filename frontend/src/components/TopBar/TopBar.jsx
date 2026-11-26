import React from 'react';
import './TopBar.css';

const TopBar = () => {
  return (
    <div className="ts-top-bar-area">
      <div className="container">
        <div className="ts-top-bar-content">
          <img src="/assets/images/top-asset.png" alt="discount badge" />
          <span>
            Get <b>25%</b> off in your winter collections <i className="bx bx-right-arrow-alt"></i>
          </span>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
