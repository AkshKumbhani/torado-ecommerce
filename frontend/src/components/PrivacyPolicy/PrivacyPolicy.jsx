import React, { useEffect } from "react";
import "./PrivacyPolicy.css";
import { useShop } from "../../context/ShopContext.jsx";

const PrivacyPolicy = () => {
  const { setCurrentPage } = useShop();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const navigateTo = (page, hash) => {
    setCurrentPage(page);
    if (hash) window.location.hash = hash;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="torado-privacy-page">
      {/* 1. Page Banner */}
      <div className="tpp-page-banner">
        <div className="container">
          <div className="tpp-banner-content text-center">
            <h2><strong>Privacy</strong> Policy</h2>
            <ul className="tpp-breadcrumb">
              <li>
                <a href="#home" onClick={(e) => { e.preventDefault(); navigateTo("home", "#home"); }}>
                  Home
                </a>
              </li>
              <li className="sep">&gt;&gt;</li>
              <li className="active">Privacy Policy</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 2. Privacy Policy Content */}
      <div className="tpp-content-area pt-100 pb-100">
        <div className="container">
          <div className="tpp-privacy-wrap">

            {/* 1. INTRODUCTION */}
            <div className="tpp-section">
              <h3>1. INTRODUCTION</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quam donec amet, lectus ut fusce. Risus, praesent et aliquet vehicula ornare. Interdum non viverra cursus quis id diam phasellus ultrices. At odio nibh vitae quisque elemen tum tincidunt id gravida vel.
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quam donec amet, lectus ut fusce. Risus, praesent et aliquet vehicula ornare. Interdum non viverra cursus quis id diam phasellus ultrices.
              </p>
            </div>

            {/* 2. CONDITIONS OF USE */}
            <div className="tpp-section">
              <h3>2. CONDITIONS OF USE</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quam donec amet, lectus ut fusce. Risus, praesent et aliquet vehicula ornare. Interdum non viverra cursus quis id diam phasellus ultrices. At odio nibh vitae quisque elemen tum tincidunt id gravida vel.
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quam donec amet, lectus ut fusce. Risus, praesent et aliquet vehicula ornare. Interdum non viverra cursus quis id diam phasellus ultrices.
              </p>
            </div>

            {/* 3. CONDITIONS OF SALE (BETWEEN SELLERS AND CUSTOMERS) */}
            <div className="tpp-section">
              <h3>3. CONDITIONS OF SALE (BETWEEN SELLERS AND CUSTOMERS)</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quam donec amet, lectus ut fusce. Risus, praesent et aliquet vehicula ornare. Interdum non viverra cursus quis id diam phasellus ultrices. At odio nibh vitae quisque elemen tum tincidunt id gravida vel.
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quam donec amet, lectus ut fusce. Risus, praesent et aliquet vehicula ornare. Interdum non viverra cursus quis id diam phasellus ultrices.
              </p>

              <ul className="tpp-bullet-list">
                <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quam donec amet, lectus ut fusce.</li>
                <li>Risus, praesent et aliquet vehicula ornare. Interdum non viverra cursus quis id diam ultrices.</li>
                <li>Viverra consectetur adipiscing elit. Cursus quis id diam phasellus ultrices.</li>
              </ul>

              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quam donec amet, lectus ut fusce. Risus, praesent et aliquet vehicula ornare. Interdum non viverra cursus quis id diam phasellus ultrices. At odio nibh vitae quisque elemen tum tincidunt id gravida vel.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;