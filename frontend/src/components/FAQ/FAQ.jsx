import React, { useState, useEffect, useMemo } from "react";
import "./FAQ.css";
import { useShop } from "../../context/ShopContext.jsx";

const faqData = [
  {
    id: "product-promotion",
    category: "Product Promotion",
    count: 32,
    items: [
      { id: 1, q: "What is Save Card and Win offer?", a: "Save Card and Win is a promotional offer that allows customers to save their payment cards and earn reward points on each qualifying purchase. Accumulated points can be redeemed for exclusive prizes and discounts." },
      { id: 2, q: "What is Shipping voucher?", a: "A Shipping Voucher is a discount code that gives you free or discounted shipping on your orders. You can apply the voucher at checkout to save on delivery costs for eligible items." },
      { id: 3, q: "What is Livestream and Free Giveaway?", a: "Torado Livestream events are live shopping sessions where hosts showcase products in real time. During these sessions, free giveaways are conducted for lucky viewers who participate in interactive Q&A and spin-the-wheel games." },
      { id: 4, q: "What are Budget Buys?", a: "Budget Buys are curated collections of quality products available at specially reduced prices. These deals are time-limited and help customers find great value items without compromising on style or quality." },
      { id: 5, q: "What is signup and win offer?", a: "New customers who sign up for a Torado account are eligible for the Signup and Win offer. Upon completing registration, users are entered into a lucky draw with prizes including discount vouchers and free products." },
      { id: 6, q: "What is Torado 11.11 Campaign?", a: "The Torado 11.11 Campaign is our annual mega sale event held on November 11th. Shoppers can enjoy massive discounts of up to 70% off, exclusive flash deals, free shipping, and special bundle offers on top brands." },
      { id: 7, q: "What is Redeem coins and Win Smartphone contest?", a: "Collect Torado Coins through purchases and activities, then redeem them for entries into our Smartphone contest. The more coins you redeem, the higher your chances of winning the latest smartphone models." },
      { id: 8, q: "What is the Stream Fest offer?", a: "Stream Fest is a special promotional event tied to our live shopping streams. Viewers who watch and shop during Stream Fest events receive exclusive discounts, early access to new products, and the chance to win stream-only prizes." },
    ],
  },
  {
    id: "account-management",
    category: "Account Management",
    count: 63,
    items: [
      { id: 9,  q: "How can I sign up as a customer on Torado?", a: "Visit our website or download the Torado app, then tap 'Sign Up'. Enter your name, email address, and a secure password. Verify your email address through the confirmation link sent to your inbox and your account is ready." },
      { id: 10, q: "How can I delete Torado account from iPhone?", a: "Go to Account Settings in the Torado app, scroll to the bottom and tap 'Delete Account'. Confirm your identity with your password, then confirm deletion. Note that this action is permanent and cannot be undone." },
      { id: 11, q: "How can I deactivate push notifications from Torado app?", a: "Open your iPhone's Settings app, scroll to find Torado, tap Notifications, and toggle off 'Allow Notifications'. You can also manage notification preferences directly within the Torado app under Account > Notification Settings." },
      { id: 12, q: "How to subscribe Torado newsletters?", a: "To subscribe to Torado newsletters, go to your Account Settings and enable 'Email Notifications'. You can also subscribe via the newsletter signup section in the footer of our website by entering your email address." },
      { id: 13, q: "How to Unsubscribe Torado Newsletter?", a: "Click the 'Unsubscribe' link at the bottom of any Torado newsletter email, or go to Account Settings > Notifications and toggle off email marketing. Your preference will be updated within 48 hours." },
      { id: 14, q: "How can I connect Torado customer care?", a: "You can reach Torado Customer Care via live chat on our website, email at support@torado.com, or call our hotline +391 (0)35 2568 4593. Our team is available every day from 11am to 7pm." },
      { id: 15, q: "How can I change the password of my account?", a: "Log in to your account, go to Account Settings > Security > Change Password. Enter your current password, then your new password twice to confirm. Use a strong password with at least 8 characters including numbers and symbols." },
      { id: 16, q: "How can I deactivate or delete my account?", a: "Go to Account Settings > Privacy > Deactivate or Delete Account. Deactivation temporarily hides your account while deletion is permanent. Enter your password to confirm the action, and our support team will process your request within 24 hours." },
      { id: 17, q: "How can I add a new delivery address to my account?", a: "Navigate to Account > Saved Addresses > Add New Address. Fill in the delivery details including full name, street address, city, state, and zip code. Mark it as your default address if preferred, then save." },
      { id: 18, q: "How to change Contact number?", a: "Go to Account Settings > Personal Information > Phone Number. Enter your new phone number and click Save. You may be required to verify the new number via a one-time OTP sent to your updated mobile." },
      { id: 19, q: "How can I restore my deactivated or deleted account?", a: "If your account was deactivated, simply log in with your credentials to reactivate it. For deleted accounts, contact our support team within 30 days of deletion at support@torado.com with your account email to request restoration." },
      { id: 20, q: "Torado app not working. What should I do?", a: "First, ensure your app is updated to the latest version. Try force-closing and reopening the app. Clear the app cache in your device settings. If the issue persists, uninstall and reinstall the app, or contact our support team." },
      { id: 21, q: "How to change language in Torado App / Website / MSite?", a: "In the Torado app, go to Account > Settings > Language and select your preferred language from the dropdown list. On the website, look for the language selector in the top navigation bar or footer area." },
      { id: 22, q: "How can I connect chat?", a: "The live chat feature is available on our website and app. Look for the chat bubble icon at the bottom right of the screen. Click it to start a conversation with our customer support team during business hours (11am to 7pm daily)." },
    ],
  },
  {
    id: "orders",
    category: "Orders",
    count: 113,
    items: [
      { id: 23, q: "How do I track my order?", a: "After placing an order, you will receive a confirmation email with a tracking number. Go to Account > My Orders and click on the order to view its real-time tracking status and estimated delivery date." },
      { id: 24, q: "Can I cancel or modify my order after placing it?", a: "Orders can be cancelled or modified within 1 hour of placing them. Go to Account > My Orders, select the order, and click 'Cancel' or 'Edit'. After this window, please contact customer support for assistance." },
      { id: 25, q: "What should I do if I receive the wrong item?", a: "If you received an incorrect item, please contact us within 48 hours of delivery. Take clear photos of the item received and email them to support@torado.com. We will arrange a replacement or full refund promptly." },
      { id: 26, q: "How long does delivery take?", a: "Standard delivery takes 3-7 business days depending on your location. Express delivery options (1-2 business days) are available at checkout for an additional fee. International orders may take 10-15 business days." },
    ],
  },
  {
    id: "payments",
    category: "Payments",
    count: 223,
    items: [
      { id: 27, q: "What payment methods are accepted?", a: "Torado accepts all major credit and debit cards (Visa, Mastercard, Amex), PayPal, Apple Pay, Google Pay, bank transfers, and Cash on Delivery for eligible areas. Buy Now Pay Later options are also available." },
      { id: 28, q: "Is my payment information secure?", a: "Yes, all payments are processed through SSL-encrypted, PCI-DSS compliant payment gateways. We never store your full card details on our servers. Your financial data is completely safe and protected." },
      { id: 29, q: "How do I apply a coupon or promo code?", a: "At checkout, look for the 'Promo Code' or 'Coupon' field and enter your code. Click 'Apply' to see the discount reflected in your order total before completing payment. Only one promo code can be applied per order." },
      { id: 30, q: "When will I receive my refund?", a: "Refunds are processed within 3-5 business days after your return is approved. The time for the refund to appear in your account depends on your bank or payment provider, typically 5-10 business days." },
    ],
  },
  {
    id: "returns",
    category: "Returns",
    count: 19,
    items: [
      { id: 31, q: "What is Torado's return policy?", a: "We accept returns within 30 days of delivery for unused items in original condition with tags attached. Items must be in their original packaging. Certain items like intimates and customized products are non-returnable." },
      { id: 32, q: "How do I initiate a return?", a: "Go to Account > My Orders, select the item you wish to return, and click 'Return Item'. Fill in the reason for return, select your preferred refund method, and our team will arrange a pickup or provide a return shipping label." },
      { id: 33, q: "Can I exchange an item instead of returning it?", a: "Yes, exchanges are available for items of equal or different value. Go to Account > My Orders, select 'Exchange' for the eligible item, choose your new size or color, and we will process the exchange once your return is received." },
    ],
  },
  {
    id: "shipping-delivery",
    category: "Shipping & Delivery",
    count: 111,
    items: [
      { id: 34, q: "Do you offer free shipping?", a: "Yes, free standard shipping is available on orders over ₹500. You can also use shipping vouchers for free delivery on eligible orders. Free shipping thresholds may vary during promotional events." },
      { id: 35, q: "Do you ship internationally?", a: "Yes, Torado ships to over 50 countries worldwide. International shipping rates and delivery times vary by destination. All applicable customs duties and taxes are the responsibility of the recipient." },
      { id: 36, q: "What happens if my delivery is delayed?", a: "If your order hasn't arrived by the estimated delivery date, check the tracking information first. If the status shows no update for more than 3 days, please contact our customer support team and we will investigate and resolve the issue." },
    ],
  },
];

const FAQ = () => {
  const { setCurrentPage } = useShop();
  const [activeCategory, setActiveCategory] = useState("product-promotion");
  const [openItems, setOpenItems] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [categoriesOpen, setCategoriesOpen] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Highlight active category while scrolling
  useEffect(() => {
    const onScroll = () => {
      for (let i = faqData.length - 1; i >= 0; i--) {
        const el = document.getElementById(`faq-section-${faqData[i].id}`);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 160) {
            setActiveCategory(faqData[i].id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navigateTo = (page, hash) => {
    setCurrentPage(page);
    if (hash) window.location.hash = hash;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (id) => {
    setActiveCategory(id);
    const el = document.getElementById(`faq-section-${id}`);
    if (el) {
      const offset = 100;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const toggleItem = (id) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Filter FAQ based on search (show all sections; search filters items)
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return faqData;
    const q = searchQuery.toLowerCase();
    return faqData
      .map((section) => ({
        ...section,
        items: section.items.filter(
          (item) =>
            item.q.toLowerCase().includes(q) ||
            item.a.toLowerCase().includes(q)
        ),
      }))
      .filter((section) => section.items.length > 0);
  }, [searchQuery]);

  // Always show ALL sections (no category filter)
  const displayData = filteredData;

  return (
    <div className="torado-faq-page">
      {/* 1. Page Banner */}
      <div className="tf-page-banner">
        <div className="container">
          <div className="tf-banner-content text-center">
            <h2><strong>Frequently</strong> Asked Questions</h2>
            <ul className="tf-breadcrumb">
              <li>
                <a href="#home" onClick={(e) => { e.preventDefault(); navigateTo("home", "#home"); }}>
                  Home
                </a>
              </li>
              <li className="sep">&gt;&gt;</li>
              <li className="active">Frequently Asked Questions</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 2. FAQ Main Area */}
      <div className="tf-faq-area pt-100 pb-100">
        <div className="container">
          <div className="row">

            {/* LEFT SIDEBAR */}
            <div className="col-lg-3 col-md-12">
              <aside className="tf-faq-sidebar">

                {/* Search */}
                <div className="tf-search-box">
                  <input
                    type="text"
                    placeholder="Search Questions"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button type="button" aria-label="Search">
                    <i className="bx bx-search"></i>
                  </button>
                </div>

                {/* Categories */}
                <div className="tf-categories-widget">
                  <div
                    className="tf-widget-title"
                    onClick={() => setCategoriesOpen(!categoriesOpen)}
                  >
                    <span>Categories</span>
                    <i className={`bx ${categoriesOpen ? "bx-chevron-up" : "bx-chevron-down"}`}></i>
                  </div>
                  {categoriesOpen && (
                    <ul className="tf-category-list">
                      {faqData.map((section) => (
                        <li key={section.id}>
                          <button
                            type="button"
                            className={`tf-cat-btn ${activeCategory === section.id && !searchQuery ? "active" : ""}`}
                            onClick={() => {
                              if (searchQuery) setSearchQuery("");
                              scrollToSection(section.id);
                            }}
                          >
                            {section.category} <span>({section.count})</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

              </aside>
            </div>

            {/* RIGHT FAQ CONTENT */}
            <div className="col-lg-9 col-md-12">
              <div className="tf-faq-content">

                {displayData.length === 0 ? (
                  <div className="tf-no-results">
                    <i className="bx bx-search-alt"></i>
                    <p>No questions found for "<strong>{searchQuery}</strong>"</p>
                  </div>
                ) : (
                  displayData.map((section) => (
                    <div key={section.id} id={`faq-section-${section.id}`} className="tf-faq-section">
                      <h3 className="tf-section-title">{section.category}</h3>
                      <div className="tf-accordion">
                        {section.items.map((item) => (
                          <div
                            key={item.id}
                            className={`tf-accordion-item ${openItems[item.id] ? "open" : ""}`}
                          >
                            <div
                              className="tf-accordion-header"
                              onClick={() => toggleItem(item.id)}
                            >
                              <div className="tf-accordion-icon">
                                <i className={`bx ${openItems[item.id] ? "bx-chevron-up" : "bx-chevron-down"}`}></i>
                              </div>
                              <span className="tf-accordion-question">{item.q}</span>
                            </div>
                            {openItems[item.id] && (
                              <div className="tf-accordion-body">
                                <p>{item.a}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;