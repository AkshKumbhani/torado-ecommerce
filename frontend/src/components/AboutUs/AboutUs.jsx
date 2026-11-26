import React, { useState, useEffect, useRef } from 'react';
import './AboutUs.css';
import { useShop } from '../../context/ShopContext.jsx';
import ReviewsSection from '../ReviewsSection/ReviewsSection.jsx';

const funFactsData = [
  { count: '251K+', rawNum: 251, suffix: 'K+', label: 'PRODUCTS' },
  { count: '1521+', rawNum: 1521, suffix: '+', label: 'CLIENTS FEEDBACK' },
  { count: '172+', rawNum: 172, suffix: '+', label: 'HARD WORKERS' },
  { count: '553+', rawNum: 553, suffix: '+', label: 'BRANDS' },
];

const AboutUs = () => {
  const { setCurrentPage } = useShop();
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [counters, setCounters] = useState([0, 0, 0, 0]);
  const videoRef = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Guarantee reliable background video autoplay
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Retry on user interaction if blocked
        });
      }
    }

    // Animated counter effect
    const duration = 1200;
    const steps = 30;
    const stepTime = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = Math.min(currentStep / steps, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setCounters(funFactsData.map(item => Math.floor(item.rawNum * easeOut)));

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, []);

  const navigateTo = (page, hash = '') => {
    setCurrentPage(page);
    if (hash) {
      window.location.hash = hash;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="torado-about-us-page">
      {/* 1. Page Banner Area */}
      <div className="ts-page-banner-area">
        <div className="container">
          <div className="ts-page-banner-content text-center">
            <h2>About Us</h2>
            <ul className="list">
              <li>
                <a
                  href="#home"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo('home', '#home');
                  }}
                >
                  Home
                </a>
              </li>
              <li className="sep">&gt;&gt;</li>
              <li className="active">About Us</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 2. Start TS About Us Area */}
      <div className="ts-about-us-area ptb-100">
        <div className="container">
          <div className="row align-items-center">
            {/* Left Content */}
            <div className="col-lg-6 col-md-12">
              <div className="ts-about-us-content">
                <h3>Torado - Tee Store is a great place for your online shopping</h3>
                <p>
                  We try to present the best tee shirt for you. You will find Guto the best single properrty to live in like palace withpeace &amp; comfort. Just welcome to explore Torado - Tee Store.
                </p>
                <div className="about-btn">
                  <a
                    href="#shop-all-for-men"
                    className="ts-default-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo('shop-all-for-men', '#shop-all-for-men');
                    }}
                  >
                    Visit Our Tee Store <i className="bx bx-right-arrow-alt"></i>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Image with Rotating Wrap Badge */}
            <div className="col-lg-6 col-md-12">
              <div className="ts-about-us-image">
                <img
                  src="/assets/images/about/about.png"
                  alt="Torado Team About Us"
                />
                <div className="wrap">
                  <img
                    src="/assets/images/about/wrap.png"
                    alt="Best Product Award Winner"
                    className="rotating-wrap"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Start TS Funfacts Area */}
      <div className="ts-funfacts-area pb-75">
        <div className="container">
          <div className="row justify-content-center">
            {funFactsData.map((item, idx) => (
              <div key={idx} className="col-lg-3 col-md-6 col-sm-6 col-6">
                <div className="ts-funfacts-card">
                  <h3>
                    <span className="count-number">
                      {counters[idx]}
                    </span>
                    <span className="sign">{item.suffix}</span>
                  </h3>
                  <p>{item.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Start TS Success Story Area (Large Full-Size Background Video Auto-play) */}
      <div className="ts-success-story-area pb-100">
        <div className="container">
          <div className="ts-section-title text-center mb-5">
            <h2>See Our Success Story</h2>
          </div>

          <div className="ts-success-story-video">
            <video
              ref={videoRef}
              src="/assets/images/success-story.mp4"
              loop
              muted
              autoPlay
              playsInline
              className="video"
            >
              <source src="/assets/images/success-story.mp4" type="video/mp4" />
              <source src="/assets/images/about/success-story.mp4" type="video/mp4" />
            </video>
            <a
              href="https://www.youtube.com/watch?v=ODfy2YIKS1M"
              className="video-btn popup-youtube"
              onClick={(e) => {
                e.preventDefault();
                setIsVideoOpen(true);
              }}
              aria-label="Play Success Story Video"
            >
              <i className="bx bx-play"></i>
            </a>
          </div>
        </div>
      </div>

      {/* 5. What People Are Saying Reviews Area */}
      <div className="about-reviews-wrapper pb-100">
        <ReviewsSection />
      </div>

      {/* Video Modal Popup with YouTube Embed (ODfy2YIKS1M) */}
      {isVideoOpen && (
        <div className="ts-video-modal-backdrop" onClick={() => setIsVideoOpen(false)}>
          <div className="ts-video-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="close-video-btn"
              onClick={() => setIsVideoOpen(false)}
              aria-label="Close Video"
            >
              <i className="bx bx-x"></i>
            </button>
            <div className="video-responsive-frame">
              <iframe
                src="https://www.youtube-nocookie.com/embed/ODfy2YIKS1M?autoplay=1"
                title="Torado Success Story"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutUs;