import React from 'react';
import './App.css';
import { useShop } from './context/ShopContext.jsx';
import TopBar from './components/TopBar/TopBar.jsx';
import Navbar from './components/Navbar/Navbar.jsx';
import SearchModal from './components/SearchModal/SearchModal.jsx';
import LoginModal from './components/LoginModal/LoginModal.jsx';
import WishlistModal from './components/WishlistModal/WishlistModal.jsx';
import CartModal from './components/CartModal/CartModal.jsx';
import MainBanner from './components/MainBanner/MainBanner.jsx';
import NewCollection from './components/NewCollection/NewCollection.jsx';
import Overview from './components/Overview/Overview.jsx';
import FrontBackView from './components/FrontBackView/FrontBackView.jsx';
import MensProducts from './components/MensProducts/MensProducts.jsx';
import CustomizeSection from './components/CustomizeSection/CustomizeSection.jsx';
import WomensProducts from './components/WomensProducts/WomensProducts.jsx';
import FlashSale from './components/FlashSale/FlashSale.jsx';
import SubscribeSection from './components/SubscribeSection/SubscribeSection.jsx';
import ReviewsSection from './components/ReviewsSection/ReviewsSection.jsx';
import Footer from './components/Footer/Footer.jsx';
import GoTop from './components/GoTop/GoTop.jsx';
import ShopHiddenSidebar from './components/ShopHiddenSidebar/ShopHiddenSidebar.jsx';
import ShopAllForMen from './components/ShopAllForMen/ShopAllForMen.jsx';
import ShopAllForWomen from './components/ShopAllForWomen/ShopAllForWomen.jsx';
import AboutUs from './components/AboutUs/AboutUs.jsx';
import BlogLeftSidebar from './components/BlogLeftSidebar/BlogLeftSidebar.jsx';
import SingleBlog from './components/SingleBlog/SingleBlog.jsx';
import ContactUs from './components/ContactUs/ContactUs.jsx';
import FAQ from './components/FAQ/FAQ.jsx';
import Login from './components/MyAccount/Login.jsx';
import Register from './components/MyAccount/Register.jsx';
import RefundReturnPolicy from './components/RefundReturnPolicy/RefundReturnPolicy.jsx';
import TermsCondition from './components/TermsCondition/TermsCondition.jsx';
import PrivacyPolicy from './components/PrivacyPolicy/PrivacyPolicy.jsx';
import Error404 from './components/Error404/Error404.jsx';
import SearchResultPage from './components/SearchResultPage/SearchResultPage.jsx';
import ShopLeftSidebar from './components/ShopLeftSidebar/ShopLeftSidebar.jsx';
import Cart from './components/Cart/Cart.jsx';
import Wishlist from './components/Wishlist/Wishlist.jsx';
import CheckoutInformation from './components/CheckoutInformation/CheckoutInformation.jsx';
import CheckoutShipping from './components/CheckoutShipping/CheckoutShipping.jsx';
import CheckoutPayment from './components/CheckoutPayment/CheckoutPayment.jsx';
import TrackMyOrder from './components/TrackMyOrder/TrackMyOrder.jsx';
import AdminPanel from './admin/AdminPanel.jsx';
import ToradoAiChat from './components/ToradoAiChat/ToradoAiChat.jsx';

function App() {
  if (window.location.pathname.startsWith('/admin')) return <AdminPanel />;
  const { currentPage } = useShop();

  return (
    <div className="torado-app">
      {/* Top Discount Bar */}
      <TopBar />

      {/* Main Responsive Navigation with Mega Menus */}
      <Navbar />

      {currentPage === 'track-my-order' || currentPage === 'track' ? (
        /* Track My Order Page */
        <TrackMyOrder />
      ) : currentPage === 'checkout-payment' || currentPage === 'payment' ? (
        /* Checkout Payment Page */
        <CheckoutPayment />
      ) : currentPage === 'checkout-shipping' || currentPage === 'shipping' ? (
        /* Checkout Shipping Page */
        <CheckoutShipping />
      ) : currentPage === 'checkout-information' || currentPage === 'checkout' ? (
        /* Checkout Information Page */
        <CheckoutInformation />
      ) : currentPage === 'wishlist' ? (
        /* Wishlist Page */
        <Wishlist />
      ) : currentPage === 'cart' ? (
        /* Cart Page */
        <Cart />
      ) : currentPage === 'shop-left-sidebar' || currentPage === 'collections' ? (
        /* Shop With Left Sidebar Page */
        <ShopLeftSidebar />
      ) : currentPage === 'search-result' || currentPage === 'search-result-page' ? (
        /* Search Result Page */
        <SearchResultPage />
      ) : currentPage === '404' || currentPage === 'error-404' ? (
        /* 404 Error Page */
        <Error404 />
      ) : currentPage === 'privacy-policy' ? (
        /* Privacy Policy Page */
        <PrivacyPolicy />
      ) : currentPage === 'terms-condition' ? (
        /* Terms & Condition Page */
        <TermsCondition />
      ) : currentPage === 'refund-return-policy' ? (
        /* Refund & Return Policy Page */
        <RefundReturnPolicy />
      ) : currentPage === 'login' ? (
        /* Login Page */
        <Login />
      ) : currentPage === 'register' ? (
        /* Register Page */
        <Register />
      ) : currentPage === 'faq' ? (
        /* FAQ Page */
        <FAQ />
      ) : currentPage === 'contact-us' ? (
        /* Contact Us Page */
        <ContactUs />
      ) : currentPage === 'single-blog' ? (
        /* Single Blog Detail Page */
        <SingleBlog />
      ) : currentPage === 'blog-left-sidebar' ? (
        /* Blog Left Sidebar Page */
        <BlogLeftSidebar />
      ) : currentPage === 'about-us' ? (
        /* About Us Page */
        <AboutUs />
      ) : currentPage === 'shop-all-for-women' ? (
        /* Shop All For Women Page */
        <ShopAllForWomen />
      ) : currentPage === 'shop-all-for-men' ? (
        /* Shop All For Men Page */
        <ShopAllForMen />
      ) : currentPage === 'shop-hidden-sidebar' ? (
        /* Shop Hidden Sidebar Page */
        <ShopHiddenSidebar />
      ) : (
        /* Home Page Content */
        <>
          {/* Hero Banner */}
          <MainBanner />

          {/* New Collection 2025 */}
          <NewCollection />

          {/* Couple Set Overview */}
          <Overview />

          {/* Interactive Front & Back View */}
          <FrontBackView />

          {/* Men's Trending Collection */}
          <MensProducts />

          {/* Customizer with Interactive Color Switcher */}
          <CustomizeSection />

          {/* Women's Trending Collection */}
          <WomensProducts />

          {/* Flash Sale with Real-time Countdown */}
          <FlashSale />

          {/* Newsletter Subscription */}
          <SubscribeSection />

          {/* Testimonials */}
          <ReviewsSection />
        </>
      )}

      {/* Footer */}
      <Footer />

      {/* Interactive Modals & Drawers */}
      <SearchModal />
      <LoginModal />
      <WishlistModal />
      <CartModal />

      {/* Torado AI Interactive Shopping Assistant */}
      <ToradoAiChat />

      {/* Back to Top */}
      <GoTop />
    </div>
  );
}

export default App;
