import React, { useEffect } from "react";
import "./Error404.css";
import { useShop } from "../../context/ShopContext.jsx";

const Error404 = () => {
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
    <div className="torado-404-page">
      {/* 1. Page Banner */}
      <div className="te-page-banner">
        <div className="container">
          <div className="te-banner-content text-center">
            <h2><strong>404</strong> Error</h2>
            <ul className="te-breadcrumb">
              <li>
                <a href="#home" onClick={(e) => { e.preventDefault(); navigateTo("home", "#home"); }}>
                  Home
                </a>
              </li>
              <li className="sep">&gt;&gt;</li>
              <li className="active">404 Error</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 2. 404 Error Area */}
      <div className="te-error-area pt-100 pb-100">
        <div className="container">
          <div className="te-error-content text-center">
            <div className="te-error-image">
              <img src="/assets/images/404.png" alt="404 Page Not Found" />
            </div>

            <h2>OOPS!!!</h2>
            <p>
              The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>

            <button
              type="button"
              className="ts-default-btn te-home-btn"
              onClick={() => navigateTo("home", "#home")}
            >
              Back To Home <i className="bx bx-right-arrow-alt"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error404;