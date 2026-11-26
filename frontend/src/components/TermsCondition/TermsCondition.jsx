import React, { useEffect } from "react";
import "./TermsCondition.css";
import { useShop } from "../../context/ShopContext.jsx";

const TermsCondition = () => {
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
    <div className="torado-terms-page">
      {/* 1. Page Banner */}
      <div className="ttc-page-banner">
        <div className="container">
          <div className="ttc-banner-content text-center">
            <h2><strong>Terms &amp;</strong> Condition</h2>
            <ul className="ttc-breadcrumb">
              <li>
                <a href="#home" onClick={(e) => { e.preventDefault(); navigateTo("home", "#home"); }}>
                  Home
                </a>
              </li>
              <li className="sep">&gt;&gt;</li>
              <li className="active">Terms &amp; Condition</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 2. Terms Main Content */}
      <div className="ttc-content-area pt-100 pb-100">
        <div className="container">
          <div className="ttc-terms-wrap">

            {/* 1. INTRODUCTION */}
            <div className="ttc-section">
              <h3>1. INTRODUCTION</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quam donec amet, lectus ut fusce. Risus, praesent et aliquet vehicula ornare. Interdum non viverra cursus quis id diam phasellus ultrices. At odio nibh vitae quisque elemen tum tincidunt id gravida vel.
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quam donec amet, lectus ut fusce. Risus, praesent et aliquet vehicula ornare. Interdum non viverra cursus quis id diam phasellus ultrices.
              </p>
            </div>

            {/* 2. CONDITIONS OF USE */}
            <div className="ttc-section">
              <h3>2. CONDITIONS OF USE</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quam donec amet, lectus ut fusce. Risus, praesent et aliquet vehicula ornare. Interdum non viverra cursus quis id diam phasellus ultrices. At odio nibh vitae quisque elemen tum tincidunt id gravida vel.
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quam donec amet, lectus ut fusce. Risus, praesent et aliquet vehicula ornare. Interdum non viverra cursus quis id diam phasellus ultrices.
              </p>
            </div>

            {/* 3. CONDITIONS OF SALE (BETWEEN SELLERS AND CUSTOMERS) */}
            <div className="ttc-section">
              <h3>3. CONDITIONS OF SALE (BETWEEN SELLERS AND CUSTOMERS)</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quam donec amet, lectus ut fusce. Risus, praesent et aliquet vehicula ornare. Interdum non viverra cursus quis id diam phasellus ultrices. At odio nibh vitae quisque elemen tum tincidunt id gravida vel.
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quam donec amet, lectus ut fusce. Risus, praesent et aliquet vehicula ornare. Interdum non viverra cursus quis id diam phasellus ultrices.
              </p>

              <ul className="ttc-bullet-list">
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

export default TermsCondition;