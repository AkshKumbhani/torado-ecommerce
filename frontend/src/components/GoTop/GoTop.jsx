import React, { useState, useEffect } from 'react';
import './GoTop.css';

const GoTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisible = () => {
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };
    window.addEventListener('scroll', toggleVisible);
    return () => window.removeEventListener('scroll', toggleVisible);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!visible) return null;

  return (
    <div className="go-top active" onClick={scrollToTop} title="Go to top">
      <i className="bx bx-chevron-up"></i>
    </div>
  );
};

export default GoTop;
