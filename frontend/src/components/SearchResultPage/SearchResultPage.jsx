import React, { useState, useEffect, useMemo } from "react";
import "./SearchResultPage.css";
import { useShop } from "../../context/ShopContext.jsx";

const initialProducts = [
  { id: 1, name: "Green Explore t-shirt", category: "Catalogs, t-shirts", price: 473, image: "/assets/images/customize/customize-1.png" },
  { id: 2, name: "Grey NYC t-shirt", category: "Grey, t-shirts", price: 559, image: "/assets/images/customize/customize-2.png" },
  { id: 3, name: "Men's California t-shirt", category: "California, t-shirts", price: 645, image: "/assets/images/customize/customize-3.png" },
  { id: 4, name: "New York cotton t-shirt", category: "Catalogs, t-shirts", price: 645, image: "/assets/images/customize/customize-4.png" },
  { id: 5, name: "Men's purple cotton t-shirt", category: "Purple, t-shirts", price: 645, image: "/assets/images/customize/customize-5.png" },
  { id: 6, name: "Earthy White t-shirt", category: "Catalogs, t-shirts", price: 301, image: "/assets/images/customize/customize-6.png" },
  { id: 7, name: "Cycling Therapy t-shirt", category: "Custom, t-shirts", price: 301, image: "/assets/images/customize/customize-7.png" },
  { id: 8, name: "Pink Los Angeles t-shirt", category: "Los Angeles, t-shirts", price: 8557, image: "/assets/images/customize/customize-8.png" },
  { id: 9, name: "Brown cotton t-shirt", category: "Catalogs, t-shirts", price: 4773, image: "/assets/images/customize/customize-9.png" },
  { id: 10, name: "Coral Own Cotton t-shirt", category: "Best seller, t-shirts", price: 559, image: "/assets/images/products/collection-1.png" },
  { id: 11, name: "Blue Waves Surf t-shirt", category: "Best seller, t-shirts", price: 559, image: "/assets/images/products/collection-2.png" },
  { id: 12, name: "Grey Winter Hoodie", category: "Best seller, t-shirts", price: 559, image: "/assets/images/products/collection-3.png" },
  { id: 13, name: "Purple Graphic Los Angeles", category: "Best seller, t-shirts", price: 559, image: "/assets/images/products/collection-4.png" },
  { id: 14, name: "Strong Units Sports Hoodie", category: "Best seller, t-shirts", price: 559, image: "/assets/images/products/flash-sale-1.png" },
  { id: 15, name: "Brooklyn Classic Dark Navy", category: "Best seller, t-shirts", price: 559, image: "/assets/images/products/flash-sale-2.png" },
  { id: 16, name: "Never Look Back Peach Tee", category: "Best seller, t-shirts", price: 559, image: "/assets/images/products/flash-sale-3.png" },
];

const SearchResultPage = () => {
  const { setCurrentPage, addToCart, addToWishlist, setIsQuickViewOpen, setSelectedProduct } = useShop();
  const [sortBy, setSortBy] = useState("default");
  const [visibleCount, setVisibleCount] = useState(16);
  const [activeCardId, setActiveCardId] = useState(null);
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
            image: p.image_url || '/assets/images/products/collection-1.png'
          })));
        }
      })
      .catch(() => {});
  }, []);

  const productList = dbProducts.length ? dbProducts : initialProducts;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleCardClick = (id) => {
    setActiveCardId((prev) => (prev === id ? null : id));
  };

  const navigateTo = (page, hash) => {
    setCurrentPage(page);
    if (hash) window.location.hash = hash;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const sortedProducts = useMemo(() => {
    let list = [...productList];
    if (sortBy === "price-low") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name-asc") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  }, [sortBy, productList]);

  const handleQuickAdd = (product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      size: "M",
      color: "Default",
    });
  };

  const handleQuickView = (product) => {
    if (setSelectedProduct && setIsQuickViewOpen) {
      setSelectedProduct(product);
      setIsQuickViewOpen(true);
    }
  };

  return (
    <div className="torado-search-result-page">
      {/* 1. Page Banner */}
      <div className="tsr-page-banner">
        <div className="container">
          <div className="tsr-banner-content text-center">
            <h2><strong>Search</strong> Result Page</h2>
            <ul className="tsr-breadcrumb">
              <li>
                <a href="#home" onClick={(e) => { e.preventDefault(); navigateTo("home", "#home"); }}>
                  Home
                </a>
              </li>
              <li className="sep">&gt;&gt;</li>
              <li className="active">Search Result Page</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 2. Products Section */}
      <div className="tsr-products-area pt-100 pb-100">
        <div className="container">

          {/* Top Filter / Sorting Toolbar */}
          <div className="tsr-toolbar d-flex align-items-center justify-content-between flex-wrap gap-3 mb-5">
            <h3 className="tsr-collection-title">All Collections</h3>
            
            <div className="tsr-toolbar-right d-flex align-items-center gap-3">
              <span className="tsr-results-count">
                Showing 1-{Math.min(visibleCount, sortedProducts.length)} of 53 results
              </span>
              
              <div className="tsr-sorting-select">
                <select
                  className="form-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="default">Default Sorting</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                </select>
              </div>
            </div>
          </div>

          {/* 4-Column Product Grid */}
          <div className="row g-4">
            {sortedProducts.slice(0, visibleCount).map((product) => (
              <div key={product.id} className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                <div
                  className={`tsr-product-card ${activeCardId === product.id ? "is-active" : ""}`}
                  onClick={() => handleCardClick(product.id)}
                >
                  
                  {/* Image & Actions */}
                  <div className="tsr-product-img-wrap">
                    <img src={product.image} alt={product.name} />
                    
                    {/* Floating Quick Action Buttons */}
                    <div className="tsr-action-buttons">
                      <button
                        type="button"
                        className="tsr-action-btn"
                        title="Add to Wishlist"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToWishlist && addToWishlist(product);
                        }}
                      >
                        <i className="bx bx-heart"></i>
                      </button>
                      <button
                        type="button"
                        className="tsr-action-btn"
                        title="Quick View"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuickView(product);
                        }}
                      >
                        <i className="bx bx-search"></i>
                      </button>
                    </div>

                    {/* Hover / Active Quick Add Button */}
                    <button
                      type="button"
                      className="tsr-quick-add-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuickAdd(product);
                      }}
                    >
                      + Quick Add
                    </button>
                  </div>

                  {/* Product Details */}
                  <div className="tsr-product-info">
                    <h4 className="tsr-product-title">
                      <a href="#shop" onClick={(e) => e.preventDefault()}>
                        {product.name}
                      </a>
                    </h4>
                    <span className="tsr-product-cat">{product.category}</span>
                    <div className="tsr-product-price">
                      ₹{product.price.toFixed(2)}
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {visibleCount < sortedProducts.length && (
            <div className="text-center mt-5">
              <button
                type="button"
                className="ts-default-btn tsr-load-more-btn"
                onClick={() => setVisibleCount((prev) => prev + 8)}
              >
                Load More
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default SearchResultPage;