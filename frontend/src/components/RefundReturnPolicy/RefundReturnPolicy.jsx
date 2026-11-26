import React, { useState, useEffect } from "react";
import "./RefundReturnPolicy.css";
import { useShop } from "../../context/ShopContext.jsx";

const RefundReturnPolicy = () => {
  const { setCurrentPage } = useShop();
  const [activeTab, setActiveTab] = useState("return"); // 'return', 'refund', 'process'

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const navigateTo = (page, hash) => {
    setCurrentPage(page);
    if (hash) window.location.hash = hash;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    const el = document.getElementById(`policy-${tab}`);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <div className="torado-policy-page">
      {/* 1. Page Banner */}
      <div className="tpp-page-banner">
        <div className="container">
          <div className="tpp-banner-content text-center">
            <h2><strong>Refund & Return</strong> Policy</h2>
            <ul className="tpp-breadcrumb">
              <li>
                <a href="#home" onClick={(e) => { e.preventDefault(); navigateTo("home", "#home"); }}>
                  Home
                </a>
              </li>
              <li className="sep">&gt;&gt;</li>
              <li className="active">Refund & Return Policy</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 2. Main Policy Area */}
      <div className="tpp-policy-area pt-100 pb-100">
        <div className="container">

          {/* Quick Assurance Highlights Grid */}
          <div className="tpp-highlights-grid mb-5">
            <div className="tpp-highlight-card">
              <div className="tpp-highlight-icon">🔄</div>
              <h4>7 Days Easy Return</h4>
              <p>Hassle-free doorstep reverse pickup across 19,000+ pin codes in India.</p>
            </div>
            <div className="tpp-highlight-card">
              <div className="tpp-highlight-icon">💳</div>
              <h4>100% Refund Assurance</h4>
              <p>Instant refunds to original payment source or Bank Account / UPI for COD.</p>
            </div>
            <div className="tpp-highlight-card">
              <div className="tpp-highlight-icon">👕</div>
              <h4>Free Size Exchanges</h4>
              <p>Ordered the wrong size? Exchange it for the right fit completely free of charge.</p>
            </div>
            <div className="tpp-highlight-card">
              <div className="tpp-highlight-icon">🛡️</div>
              <h4>Quality Guaranteed</h4>
              <p>100% genuine premium combed cotton fabric with durable high-density prints.</p>
            </div>
          </div>

          {/* Navigation Buttons / Tabs */}
          <div className="tpp-tabs-nav d-flex align-items-center gap-3 mb-5">
            <button
              type="button"
              className={`tpp-tab-btn ${activeTab === "return" ? "active" : ""}`}
              onClick={() => handleTabClick("return")}
            >
              Return & Exchange Policy
            </button>
            <button
              type="button"
              className={`tpp-tab-btn ${activeTab === "refund" ? "active" : ""}`}
              onClick={() => handleTabClick("refund")}
            >
              Refund Policy & Timeline
            </button>
            <button
              type="button"
              className={`tpp-tab-btn ${activeTab === "process" ? "active" : ""}`}
              onClick={() => handleTabClick("process")}
            >
              How to Raise a Claim
            </button>
          </div>

          {/* Policy Document Content */}
          <div className="tpp-policy-content">

            {/* Return Policy Section */}
            <div id="policy-return" className="tpp-section">
              <h3>Return & Exchange Policy</h3>
              <p className="tpp-text">
                At <strong>Torado</strong>, we strive to deliver the highest quality streetwear, oversized t-shirts, and apparel. If you are not completely satisfied with your purchase, our 7-day hassle-free return and exchange policy is designed to give you complete peace of mind.
              </p>

              <ol className="tpp-ordered-list">
                <li>
                  <strong>7-Day Return & Exchange Window:</strong> You may initiate a return or exchange request within <strong>7 days</strong> from the date of order delivery. Requests initiated after 7 days will not be eligible for return.
                </li>
                <li>
                  <strong>Product Condition Guidelines:</strong>
                  To qualify for a full refund or exchange:
                  <ul className="tpp-bullet-list mt-2">
                    <li>The t-shirt/apparel must be <strong>unworn, unwashed, and undamaged</strong> without any stains, perfume scent, or body odor.</li>
                    <li>All original brand tags, labels, barcode stickers, and inner brand packaging must be intact.</li>
                    <li>The item must be packed in its original polybag / box for courier pickup.</li>
                  </ul>
                </li>
                <li>
                  <strong>Free Size & Fit Exchange:</strong>
                  If the t-shirt doesn't fit your desired style (oversized vs. regular fit), we offer <strong>one free size exchange</strong>. Our courier partner will pick up the existing item and deliver your requested size at no extra shipping cost.
                </li>
                <li>
                  <strong>Defective, Damaged, or Incorrect Items:</strong>
                  In the rare event that you receive a torn, stained, misprinted, or incorrect t-shirt, please report it within <strong>48 hours</strong> of delivery with clear unboxing photos/video to <a href="mailto:support@torado.com" style={{ color: 'var(--main-color)' }}>support@torado.com</a>. We will dispatch a brand-new replacement immediately with priority reverse pickup at zero cost to you.
                </li>
                <li>
                  <strong>Non-Returnable Items:</strong>
                  Items purchased during clearance blowout sales marked as <em>"Final Sale"</em>, customized custom-printed merchandise, and free promotional mystery gifts are strictly non-returnable unless received damaged.
                </li>
              </ol>
            </div>

            {/* Refund Policy Section */}
            <div id="policy-refund" className="tpp-section mt-5 pt-3">
              <h3>Refund Policy & Processing Timelines</h3>
              <p className="tpp-text">
                We believe in total transparency. Once your returned package is collected by our courier partner and passes our warehouse Quality Check (QC), your refund is triggered automatically according to your chosen payment method:
              </p>

              <div className="tpp-refund-table-wrap mb-4">
                <table className="tpp-refund-table">
                  <thead>
                    <tr>
                      <th>Payment Method</th>
                      <th>Refund Destination</th>
                      <th>Processing Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Prepaid (UPI / GPay / PhonePe / Paytm)</strong></td>
                      <td>Original UPI linked Bank Account</td>
                      <td><strong>24 - 48 Hours</strong> post QC approval</td>
                    </tr>
                    <tr>
                      <td><strong>Debit / Credit Card / NetBanking</strong></td>
                      <td>Source Bank Account / Card</td>
                      <td><strong>5 - 7 Business Days</strong> (as per bank cycle)</td>
                    </tr>
                    <tr>
                      <td><strong>Cash on Delivery (COD)</strong></td>
                      <td>Direct Bank Transfer (NEFT/IMPS) or UPI ID</td>
                      <td><strong>48 - 72 Hours</strong> after bank details submitted</td>
                    </tr>
                    <tr>
                      <td><strong>Order Cancelled Before Dispatch</strong></td>
                      <td>Source Payment Account</td>
                      <td><strong>Instant / 24 Hours</strong> full refund</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <ol className="tpp-ordered-list">
                <li>
                  <strong>Quality Check (QC) Process:</strong>
                  Upon receiving the returned parcel at our central fulfilment hub in Surat, our team inspects the fabric, tags, and print condition within <strong>24 to 48 hours</strong>. Upon approval, you will receive an official <em>"Refund Processed"</em> email confirmation with your unique Refund ID.
                </li>
                <li>
                  <strong>Cash on Delivery (COD) Refund Protocol:</strong>
                  For orders paid via Cash on Delivery, our support desk will share a secure verification form or contact you via registered email/WhatsApp to collect your preferred Bank Account number (IFSC code) or UPI ID. Your money is credited directly into your account safely.
                </li>
                <li>
                  <strong>Shipping Fee & Coupon Adjustments:</strong>
                  If the entire order is returned due to a product defect or incorrect dispatch from Torado, 100% of the invoice amount (including any delivery charges) will be refunded. If a discount coupon (e.g. WELCOME20) was applied to the order, the net payable amount after discount is the exact amount refunded.
                </li>
              </ol>
            </div>

            {/* How to Raise a Claim Section */}
            <div id="policy-process" className="tpp-section mt-5 pt-3">
              <h3>How to Raise a Return or Refund Request</h3>
              <p className="tpp-text">
                Returning an order on Torado takes less than 2 minutes. Follow these simple steps:
              </p>

              <div className="tpp-steps-container">
                <div className="tpp-step-item">
                  <div className="tpp-step-num">1</div>
                  <div className="tpp-step-info">
                    <h5>Initiate Request</h5>
                    <p>
                      Log in to your <strong>My Account</strong> section or email our 24/7 care desk at <a href="mailto:support@torado.com" style={{ color: 'var(--main-color)' }}>support@torado.com</a> with your Order ID (e.g. <code>#TRD-101</code>), registered phone number, and reason for return.
                    </p>
                  </div>
                </div>

                <div className="tpp-step-item">
                  <div className="tpp-step-num">2</div>
                  <div className="tpp-step-info">
                    <h5>Doorstep Reverse Pickup</h5>
                    <p>
                      Our logistics executive (BlueDart / Delhivery / XpressBees) will arrive at your shipping address within <strong>24 to 48 hours</strong> to collect the package. Keep the t-shirt folded in its original polybag with tags attached.
                    </p>
                  </div>
                </div>

                <div className="tpp-step-item">
                  <div className="tpp-step-num">3</div>
                  <div className="tpp-step-info">
                    <h5>Instant Refund Credit</h5>
                    <p>
                      As soon as the product passes verification, your refund is credited directly to your bank account or UPI with an instant email &amp; SMS confirmation.
                    </p>
                  </div>
                </div>
              </div>

              {/* Support Contact Box */}
              <div className="tpp-contact-box mt-5">
                <h4>Need assistance with an ongoing return?</h4>
                <p>Our dedicated customer support team is available Monday to Saturday, 9:00 AM – 7:00 PM IST.</p>
                <div className="tpp-contact-links d-flex gap-4 flex-wrap mt-3">
                  <a href="mailto:support@torado.com" className="tpp-contact-pill">
                    ✉️ Email: support@torado.com
                  </a>
                  <a href="tel:+919876543210" className="tpp-contact-pill">
                    📞 Phone: +91 98765 43210
                  </a>
                  <a href="#track-my-order" onClick={(e) => { e.preventDefault(); navigateTo("track-my-order", "#track-my-order"); }} className="tpp-contact-pill">
                    📦 Track Ongoing Order
                  </a>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default RefundReturnPolicy;
