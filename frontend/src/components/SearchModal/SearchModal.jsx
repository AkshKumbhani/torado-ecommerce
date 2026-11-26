import React, { useState, useMemo, useEffect } from 'react';
import './SearchModal.css';
import { useShop } from '../../context/ShopContext.jsx';

const topSearchTerms = ['Legacy Bomber', 'Sherpa', 'Customize Tee', 'Tomboy Tee'];

const allProducts = [
  { id: 101, name: "Legacy Bomber Jacket", category: "Men, Jackets", price: 13588, image: "/assets/images/products/men-1.jpg" },
  { id: 102, name: "Sherpa Fleece Jacket", category: "Men, Jackets", price: 12212, image: "/assets/images/products/men-2.jpg" },
  { id: 103, name: "Heavyweight Flannel Shirt", category: "Men, Shirts", price: 5848, image: "/assets/images/products/men-3.jpg" },
  { id: 104, name: "Cargo Jogger Pants", category: "Men, Pants", price: 7654, image: "/assets/images/products/men-4.jpg" },
  { id: 105, name: "Mountain Hoodie", category: "Men, Hoodies", price: 9632, image: "/assets/images/products/men-5.jpg" },
  { id: 106, name: "Classic Crew Neck Tee", category: "Men, T-shirts", price: 2924, image: "/assets/images/products/men-6.jpg" },
  { id: 107, name: "Ripstop Utility Shorts", category: "Men, Shorts", price: 4730, image: "/assets/images/products/men-7.jpg" },
  { id: 108, name: "Athletic Performance Tee", category: "Men, T-shirts", price: 2494, image: "/assets/images/products/men-8.jpg" },
  { id: 301, name: "Polar Sherpa Shirt Jacket", category: "Women, Jackets", price: 12728, image: "/assets/images/products/women-1.jpg" },
  { id: 302, name: "Polartec Sherpa 1/2 Zip", category: "Women, Tops", price: 12169, image: "/assets/images/products/women-2.jpg" },
  { id: 303, name: "Almost Friday Tee Cropped", category: "Women, T-shirts", price: 2924, image: "/assets/images/products/women-3.jpg" },
  { id: 304, name: "Brown Tee Croped", category: "Women, T-shirts", price: 2946, image: "/assets/images/products/women-4.jpg" },
  { id: 305, name: "Thermopuff Jacket", category: "Women, Jackets", price: 15824, image: "/assets/images/products/women-5.jpg" },
  { id: 306, name: "Almost Sunday Tee", category: "Women, T-shirts", price: 3634, image: "/assets/images/products/women-6.jpg" },
  { id: 307, name: "Tomboy Tee Cropped", category: "Women, T-shirts", price: 2946, image: "/assets/images/products/women-7.jpg" },
  { id: 308, name: "Tomboy Tee Cropped - Caramel", category: "Women, T-shirts", price: 5784, image: "/assets/images/products/women-8.jpg" },
  { id: 1, name: "Green Explore T-shirt", category: "Customize", price: 473, image: "/assets/images/customize/customize-1.png" },
  { id: 2, name: "Strong Units Hoodie", category: "Customize", price: 473, image: "/assets/images/customize/customize-2.png" },
  { id: 3, name: "Blue Ocean Tee", category: "Customize", price: 473, image: "/assets/images/customize/customize-3.png" },
  { id: 4, name: "New York Cotton T-shirt", category: "Customize", price: 645, image: "/assets/images/customize/customize-4.png" },
  { id: 5, name: "Men Purple Cotton T-shirt", category: "Customize", price: 645, image: "/assets/images/customize/customize-5.png" },
  { id: 6, name: "Earthy White T-shirt", category: "Customize", price: 301, image: "/assets/images/customize/customize-6.png" },
  { id: 7, name: "Cycling Therapy T-shirt", category: "Customize", price: 301, image: "/assets/images/customize/customize-7.png" },
  { id: 8, name: "Pink Los Angeles T-shirt", category: "Customize", price: 8557, image: "/assets/images/customize/customize-8.png" },
  { id: 9, name: "Brown Cotton T-shirt", category: "Customize", price: 4773, image: "/assets/images/customize/customize-9.png" },
  { id: 14, name: "Strong Units Sports Hoodie", category: "Flash Sale", price: 559, image: "/assets/images/products/flash-sale-1.png" },
  { id: 15, name: "Brooklyn Classic Dark Navy", category: "Flash Sale", price: 559, image: "/assets/images/products/flash-sale-2.png" },
  { id: 16, name: "Never Look Back Peach Tee", category: "Flash Sale", price: 559, image: "/assets/images/products/flash-sale-3.png" },
];

const SearchModal = () => {
  const { isSearchOpen, setIsSearchOpen, setCurrentPage } = useShop();
  const [searchTerm, setSearchTerm] = useState('');
  const [dbProducts, setDbProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/store/products')
      .then((res) => res.ok ? res.json() : [])
      .then((data) => {
        if (Array.isArray(data) && data.length) {
          setDbProducts(data.map(p => ({
            id: p.id,
            name: p.name,
            category: p.category || 'Clothing',
            price: Number(p.price),
            image: p.image_url || '/assets/images/products/men-1.jpg'
          })));
        }
      })
      .catch(() => {});
  }, []);

  const productList = dbProducts.length ? dbProducts : allProducts;

  // ALL hooks must be called before any early return
  const searchResults = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return [];
    return productList
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      )
      .slice(0, 6);
  }, [searchTerm, productList]);

  // Early return AFTER all hooks
  if (!isSearchOpen) return null;

  const handleTermClick = (term) => {
    setSearchTerm(term);
  };

  const handleNavigateToResults = (e) => {
    e.preventDefault();
    setIsSearchOpen(false);
    setCurrentPage('search-result');
    window.location.hash = '#search-result';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      handleNavigateToResults(e);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) setIsSearchOpen(false);
  };

  return (
    <div className="ts-search-modal-backdrop" onClick={handleBackdropClick}>
      <div className="ts-search-modal-container">

        {/* Header */}
        <div className="search-panel-header">
          <h3>Search</h3>
          <button type="button" className="close-btn" onClick={() => setIsSearchOpen(false)} aria-label="Close">
            <i className="bx bx-x"></i>
          </button>
        </div>

        {/* Search Input */}
        <form className="ts-search-form" onSubmit={handleSubmit}>
          <i className="bx bx-search search-icon-left"></i>
          <input
            type="text"
            className="form-control"
            placeholder="Search here"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
          {searchTerm && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => setSearchTerm('')}
              aria-label="Clear"
            >
              <i className="bx bx-x"></i>
            </button>
          )}
        </form>

        {/* Live Search Results */}
        {searchTerm.trim() ? (
          <div className="search-results-section">
            {searchResults.length > 0 ? (
              <>
                <h4 className="search-results-label">Results for "{searchTerm}"</h4>
                <ul className="search-results-list">
                  {searchResults.map((product) => (
                    <li key={product.id}>
                      <a
                        href="#search-result"
                        className="search-result-item"
                        onClick={handleNavigateToResults}
                      >
                        <div className="result-img">
                          <img src={product.image} alt={product.name} />
                        </div>
                        <div className="result-info">
                          <span className="result-name">{product.name}</span>
                          <span className="result-cat">{product.category}</span>
                          <span className="result-price">₹{product.price.toFixed(2)}</span>
                        </div>
                        <i className="bx bx-chevron-right result-arrow"></i>
                      </a>
                    </li>
                  ))}
                </ul>
                {searchResults.length >= 6 && (
                  <div className="search-view-all">
                    <a href="#search-result" onClick={handleNavigateToResults}>
                      View all results <i className="bx bx-right-arrow-alt"></i>
                    </a>
                  </div>
                )}
              </>
            ) : (
              <div className="search-no-results">
                <i className="bx bx-search-alt"></i>
                <p>No results for "<strong>{searchTerm}</strong>"</p>
                <span>Try a different search term</span>
              </div>
            )}
          </div>
        ) : (
          /* Top Search Terms shown when input is empty */
          <div className="top-search-terms-content">
            <h4>Top Search Terms</h4>
            <ul className="list">
              {topSearchTerms.map((term) => (
                <li key={term}>
                  <a href="#search" onClick={(e) => { e.preventDefault(); handleTermClick(term); }}>
                    <span>{term}</span>
                    <span><i className="bx bx-chevron-right"></i></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>
    </div>
  );
};

export default SearchModal;