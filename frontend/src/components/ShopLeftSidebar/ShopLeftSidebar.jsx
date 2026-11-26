import React, { useState, useMemo } from 'react';
import '../ShopHiddenSidebar/ShopHiddenSidebar.css';
import './ShopLeftSidebar.css';
import { useShop } from '../../context/ShopContext.jsx';

// 25 products on Page 1 strictly matching the Torado Tee Store live screenshots
const productsPage1 = [
  // Row 1 (Screenshot 1)
  { id: 1, name: "Green Explore t-shirt", category: "Catalogs, t-shirts", price: 473, image: "/assets/images/products/men-1.jpg", type: "t-shirts", fabric: "Cloud-Fleece", color: "c5", size: ["S", "M", "L"] },
  { id: 2, name: "Grey NYC t-shirt", category: "Grey, t-shirts", price: 559, image: "/assets/images/products/men-2.jpg", type: "t-shirts", fabric: "Coreflex", color: "c1", size: ["M", "L", "XL"] },
  { id: 3, name: "Men's California t-shirt", category: "California, t-shirts", price: 645, image: "/assets/images/products/men-3.jpg", type: "t-shirts", fabric: "PYCA Pro", color: "c9", size: ["XS", "S", "M", "L"] },
  { id: 4, name: "New York cotton t-shirt", category: "Catalogs, t-shirts", price: 645, image: "/assets/images/products/men-4.jpg", type: "t-shirts", fabric: "Tomboy Cotton", color: "c4", size: ["M", "L", "XL", "XXL"] },

  // Row 2 (Screenshot 2)
  { id: 5, name: "Men's purple cotton t-shirt", category: "Purple, t-shirts", price: 645, image: "/assets/images/products/men-5.jpg", type: "t-shirts", fabric: "Cloud-Fleece", color: "c6", size: ["S", "M", "L"] },
  { id: 6, name: "Earthy White t-shirt", category: "Catalogs, t-shirts", price: 301, image: "/assets/images/products/men-6.jpg", type: "t-shirts", fabric: "Thermopuff", color: "c9", size: ["XS", "S", "M", "L", "XL"], newTag: true },
  { id: 7, name: "Cycling Therapy t-shirt", category: "Custom, t-shirts", price: 301, image: "/assets/images/products/men-7.jpg", type: "t-shirts", fabric: "Coreflex", color: "c3", size: ["S", "M", "L"] },
  { id: 8, name: "Pink Los Angeles t-shirt", category: "Los Angeles, t-shirts", price: 8557, image: "/assets/images/products/men-8.jpg", type: "t-shirts", fabric: "PYCA Pro", color: "c9", size: ["M", "L", "XL"] },

  // Row 3 (Screenshot 3)
  { id: 9, name: "Brown cotton t-shirt", category: "Catalogs, t-shirts", price: 4773, image: "/assets/images/products/men-9.jpg", type: "t-shirts", fabric: "Tomboy Cotton", color: "c4", size: ["S", "M", "L"] },
  { id: 10, name: "Coral Own Cotton t-shirt", category: "Best seller, t-shirts", price: 559, image: "/assets/images/products/men-10.jpg", type: "t-shirts", fabric: "Cloud-Fleece", color: "c7", size: ["XS", "S", "M", "L"] },
  { id: 11, name: "Coral Own Cotton t-shirt", category: "Best seller, t-shirts", price: 559, image: "/assets/images/customize/customize-9.png", type: "t-shirts", fabric: "Coreflex", color: "c9", size: ["S", "M", "L", "XL"] },
  { id: 12, name: "Coral Own Cotton t-shirt", category: "Best seller, t-shirts", price: 559, image: "/assets/images/customize/customize-2.png", type: "t-shirts", fabric: "Thermopuff", color: "c2", size: ["M", "L", "XL", "XXL"] },

  // Row 4 (Screenshot 4)
  { id: 13, name: "Coral Own Cotton t-shirt", category: "Best seller, t-shirts", price: 559, image: "/assets/images/customize/customize-3.png", type: "t-shirts", fabric: "PYCA Pro", color: "c3", size: ["XS", "S", "M", "L"] },
  { id: 14, name: "Coral Own Cotton t-shirt", category: "Best seller, t-shirts", price: 559, image: "/assets/images/customize/customize-1.png", type: "t-shirts", fabric: "Cloud-Fleece", color: "c1", size: ["S", "M", "L"], tag: "Best Seller" },
  { id: 15, name: "Coral Own Cotton t-shirt", category: "Best seller, t-shirts", price: 559, image: "/assets/images/products/collection-2.png", type: "sweatshirts", fabric: "Thermopuff", color: "c6", size: ["M", "L", "XL"] },
  { id: 16, name: "Coral Own Cotton t-shirt", category: "Best seller, t-shirts", price: 559, image: "/assets/images/products/collection-3.png", type: "t-shirts", fabric: "Coreflex", color: "c4", size: ["S", "M", "L"] },

  // Row 5 (Screenshot 5)
  { id: 17, name: "Coral Own Cotton t-shirt", category: "Best seller, t-shirts", price: 559, image: "/assets/images/products/collection-1.png", type: "sweatshirts", fabric: "Thermopuff", color: "c6", size: ["M", "L", "XL"] },
  { id: 18, name: "Coral Own Cotton t-shirt", category: "Best seller, t-shirts", price: 559, image: "/assets/images/customize/customize-8.png", type: "t-shirts", fabric: "PYCA Pro", color: "c8", size: ["S", "M", "L", "XL"], newTag: true },
  { id: 19, name: "Coral Own Cotton t-shirt", category: "Best seller, t-shirts", price: 559, image: "/assets/images/customize/customize-5.png", type: "t-shirts", fabric: "Cloud-Fleece", color: "c14", size: ["XS", "S", "M", "L"] },
  { id: 20, name: "Coral Own Cotton t-shirt", category: "Best seller, t-shirts", price: 559, image: "/assets/images/products/collection-4.png", type: "sweatshirts", fabric: "Thermopuff", color: "c8", size: ["M", "L", "XL"] },

  // Row 6 (T-shirts only)
  { id: 21, name: "Coral Own Cotton t-shirt", category: "Best seller, t-shirts", price: 559, image: "/assets/images/products/flash-sale-1.png", type: "t-shirts", fabric: "Coreflex", color: "c14", size: ["S", "M", "L"] },
  { id: 22, name: "Coral Own Cotton t-shirt", category: "Best seller, t-shirts", price: 559, image: "/assets/images/products/flash-sale-2.png", type: "sweatshirts", fabric: "Thermopuff", color: "c8", size: ["M", "L", "XL"] },
  { id: 23, name: "Coral Own Cotton t-shirt", category: "Best seller, t-shirts", price: 559, image: "/assets/images/products/flash-sale-3.png", type: "t-shirts", fabric: "PYCA Pro", color: "c5", size: ["S", "M", "L"] },
  { id: 24, name: "White Essential Cotton t-shirt", category: "Catalogs, t-shirts", price: 559, image: "/assets/images/customize/customize-6.png", type: "t-shirts", fabric: "Tomboy Cotton", color: "c6", size: ["XS", "S", "M"], newTag: true },
  { id: 25, name: "Mint Surf Classic t-shirt", category: "Catalogs, t-shirts", price: 559, image: "/assets/images/customize/customize-4.png", type: "t-shirts", fabric: "Cloud-Fleece", color: "c4", size: ["S", "M", "L"] }
];

const productsPage2 = [
  { id: 26, name: "Lime Neon Vibe t-shirt", category: "Catalogs, t-shirts", price: 559, image: "/assets/images/customize/customize-7.png", type: "t-shirts", fabric: "Coreflex", color: "c7", size: ["XS", "S", "M", "L"] },
  { id: 27, name: "Indigo California t-shirt", category: "California, t-shirts", price: 645, image: "/assets/images/customize/customize-8.png", type: "t-shirts", fabric: "PYCA Pro", color: "c8", size: ["S", "M", "L", "XL"], tag: "Best Seller" },
  { id: 28, name: "Green Explore t-shirt", category: "Catalogs, t-shirts", price: 473, image: "/assets/images/products/men-1.jpg", type: "t-shirts", fabric: "Cloud-Fleece", color: "c5", size: ["S", "M", "L"] },
  { id: 29, name: "Grey NYC t-shirt", category: "Grey, t-shirts", price: 559, image: "/assets/images/products/men-2.jpg", type: "t-shirts", fabric: "Coreflex", color: "c1", size: ["M", "L", "XL"] },
  { id: 30, name: "Men's California t-shirt", category: "California, t-shirts", price: 645, image: "/assets/images/products/men-3.jpg", type: "t-shirts", fabric: "PYCA Pro", color: "c9", size: ["XS", "S", "M", "L"] },
  { id: 31, name: "New York cotton t-shirt", category: "Catalogs, t-shirts", price: 645, image: "/assets/images/products/men-4.jpg", type: "t-shirts", fabric: "Tomboy Cotton", color: "c4", size: ["M", "L", "XL", "XXL"] },
  { id: 32, name: "Men's purple cotton t-shirt", category: "Purple, t-shirts", price: 645, image: "/assets/images/products/men-5.jpg", type: "t-shirts", fabric: "Cloud-Fleece", color: "c6", size: ["S", "M", "L"] },
  { id: 33, name: "Earthy White t-shirt", category: "Catalogs, t-shirts", price: 301, image: "/assets/images/products/men-6.jpg", type: "t-shirts", fabric: "Thermopuff", color: "c9", size: ["XS", "S", "M", "L", "XL"], newTag: true }
];

const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const colorSwatches = [
  { id: 'c1', color: '#A7C5E1', name: 'Light Blue' },
  { id: 'c2', color: '#C6C897', name: 'Sage Green' },
  { id: 'c3', color: '#E65C4F', name: 'Coral Red' },
  { id: 'c4', color: '#5D19B4', name: 'Deep Purple' },
  { id: 'c5', color: '#6BBD99', name: 'Mint Teal' },
  { id: 'c6', color: '#CCCCCC', name: 'Silver Grey' },
  { id: 'c7', color: '#C5FA54', name: 'Lime' },
  { id: 'c8', color: '#514EB5', name: 'Indigo' },
  { id: 'c9', color: '#433535', name: 'Dark Mocha' },
  { id: 'c10', color: '#EFB5B5', name: 'Blush Pink' },
  { id: 'c11', color: '#F0C005', name: 'Sunny Yellow' },
  { id: 'c12', color: '#648361', name: 'Olive Green' },
  { id: 'c13', color: '#D41A42', name: 'Crimson' },
  { id: 'c14', color: '#FDAB79', name: 'Peach' }
];

const categoriesList = [
  { id: 'tops', name: 'Tops', count: 32 },
  { id: 'tees', name: 'Tees', count: 63 },
  { id: 'tanks', name: 'Tanks', count: 113 },
  { id: 'sweatshirts', name: 'Sweatshirts', count: 223 },
  { id: 'new-releases', name: 'New Releases', count: 19 },
  { id: 'sherpas', name: 'Sherpas', count: 111 },
  { id: 'outerwear', name: 'Outerwear', count: 3 },
  { id: 'winter-2025', name: 'Winter 2025', count: 41 },
  { id: 'best-sellers', name: 'Best Sellers', count: 21 }
];

const fabricList = [
  { name: 'Cloud-Fleece', count: 32 },
  { name: 'Coreflex', count: 63 },
  { name: 'PYCA Pro', count: 113 },
  { name: 'Tomboy Cotton', count: 2 },
  { name: 'Thermopuff', count: 11 }
];

const ShopLeftSidebar = () => {
  const { addToCart, addToWishlist, wishlistItems, setCurrentPage } = useShop();

  // Filter drawer state
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Sorting state
  const [sortBy, setSortBy] = useState('default');

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedFabric, setSelectedFabric] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [minPrice, setMinPrice] = useState('0.00');
  const [maxPrice, setMaxPrice] = useState('1000.00');
  const [selectedRating, setSelectedRating] = useState(null);
  const [selectedAvailability, setSelectedAvailability] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [currentPageNum, setCurrentPageNum] = useState(1);

  // Accordion open/close state for filter sections
  const [openSections, setOpenSections] = useState({
    categories: true,
    fabric: true,
    color: true,
    size: true,
    price: true,
    reviews: true,
    availability: true,
    tags: true
  });

  // "Show More" toggles
  const [showMoreFabric, setShowMoreFabric] = useState(false);
  const [showMoreReviews, setShowMoreReviews] = useState(false);
  const [showMoreAvailability, setShowMoreAvailability] = useState(false);
  const [showMoreTags, setShowMoreTags] = useState(false);

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleFabricToggle = (fab) => {
    setSelectedFabric(prev =>
      prev.includes(fab) ? prev.filter(f => f !== fab) : [...prev, fab]
    );
  };

  const handleAvailabilityToggle = (avail) => {
    setSelectedAvailability(prev =>
      prev.includes(avail) ? prev.filter(a => a !== avail) : [...prev, avail]
    );
  };

  const handleQuickAdd = (product, size) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: size
    });
  };

  const isItemInWishlist = (id) => {
    return wishlistItems.some(item => item.id === id);
  };

  // Base list for current page
  const currentRawProducts = currentPageNum === 1 ? productsPage1 : productsPage2;

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...currentRawProducts];

    // Category filter
    if (selectedCategory) {
      result = result.filter(p => p.category.toLowerCase().includes(selectedCategory.toLowerCase()) || p.type === selectedCategory.toLowerCase());
    }

    // Fabric filter
    if (selectedFabric.length > 0) {
      result = result.filter(p => selectedFabric.includes(p.fabric));
    }

    // Color filter
    if (selectedColor) {
      result = result.filter(p => p.color === selectedColor);
    }

    // Size filter
    if (selectedSize) {
      result = result.filter(p => p.size && p.size.includes(selectedSize));
    }

    // Price filter
    const minP = parseFloat(minPrice) || 0;
    const maxP = parseFloat(maxPrice) || 10000;
    result = result.filter(p => p.price >= minP && p.price <= maxP);

    // Sorting
    if (sortBy === 'best-sellers') {
      result.sort((a, b) => (b.tag ? 1 : 0) - (a.tag ? 1 : 0));
    } else if (sortBy === 'new-arrivals') {
      result.sort((a, b) => (b.newTag ? 1 : 0) - (a.newTag ? 1 : 0));
    } else if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [currentRawProducts, selectedCategory, selectedFabric, selectedColor, selectedSize, minPrice, maxPrice, sortBy]);

  const resetFilters = () => {
    setSelectedCategory(null);
    setSelectedFabric([]);
    setSelectedColor(null);
    setSelectedSize(null);
    setMinPrice('0.00');
    setMaxPrice('1000.00');
    setSelectedRating(null);
    setSelectedAvailability([]);
    setSelectedTag(null);
  };

  const handlePageChange = (pageNum) => {
    setCurrentPageNum(pageNum);
    const element = document.getElementById('shop-product-grid');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="shop-hidden-sidebar-page shop-left-sidebar-page">
      {/* 1. Page Banner Area matching screenshot */}
      <div className="ts-page-banner-area pt-100 pb-100">
        <div className="container">
          <div className="ts-page-banner-content">
            <h2>Shop <span>With Left Sidebar</span></h2>
            <ul className="list">
              <li>
                <a href="#home" onClick={(e) => { e.preventDefault(); setCurrentPage('home'); window.location.hash = '#home'; }}>
                  Home
                </a>
              </li>
              <li>Shop With Left Sidebar</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 2. Main Shop Area */}
      <div className="ts-products-area pt-100 pb-100" id="shop-product-grid">
        <div className="container-fluid">
          <div className="row">

            {/* Left Sidebar Column */}
            <div className="col-xl-3 col-lg-3 col-md-12">
              <aside className="shop-left-sidebar-widget-area">
                <h3 className="filters-main-heading mb-4">Filters</h3>

                {/* A. CATEGORIES WIDGET */}
                <div className="collapse-widget mb-4">
                  <div
                    className={`collapse-widget-title ${openSections.categories ? 'active' : ''}`}
                    onClick={() => toggleSection('categories')}
                  >
                    Categories
                  </div>
                  {openSections.categories && (
                    <div className="widget_categories">
                      <ul className="list">
                        <li>
                          <a
                            href="#all"
                            className={!selectedCategory ? 'active' : ''}
                            onClick={(e) => { e.preventDefault(); setSelectedCategory(null); }}
                          >
                            All Categories
                          </a>
                        </li>
                        {categoriesList.map((cat) => (
                          <li key={cat.id}>
                            <a
                              href={`#${cat.id}`}
                              className={selectedCategory === cat.id ? 'active' : ''}
                              onClick={(e) => {
                                e.preventDefault();
                                setSelectedCategory(selectedCategory === cat.id ? null : cat.id);
                              }}
                            >
                              {cat.name} <span>({cat.count})</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* B. FABRIC WIDGET */}
                <div className="collapse-widget mb-4">
                  <div
                    className={`collapse-widget-title ${openSections.fabric ? 'active' : ''}`}
                    onClick={() => toggleSection('fabric')}
                  >
                    Fabric
                  </div>
                  {openSections.fabric && (
                    <div className="widget_fabric">
                      <ul className="list">
                        {fabricList.map((fab) => (
                          <li key={fab.name}>
                            <input
                              type="checkbox"
                              id={`fab-left-${fab.name}`}
                              checked={selectedFabric.includes(fab.name)}
                              onChange={() => handleFabricToggle(fab.name)}
                            />
                            <label htmlFor={`fab-left-${fab.name}`}>
                              <span className="color-dot"></span>
                              {fab.name} <span>({fab.count})</span>
                            </label>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* C. COLOR WIDGET */}
                <div className="collapse-widget mb-4">
                  <div
                    className={`collapse-widget-title ${openSections.color ? 'active' : ''}`}
                    onClick={() => toggleSection('color')}
                  >
                    Color
                  </div>
                  {openSections.color && (
                    <div className="widget_color">
                      <ul className="color-list">
                        {colorSwatches.map((item) => (
                          <li key={item.id}>
                            <button
                              type="button"
                              className={`color-btn ${item.id} ${selectedColor === item.id ? 'active' : ''}`}
                              style={{ backgroundColor: item.color }}
                              onClick={() => setSelectedColor(selectedColor === item.id ? null : item.id)}
                              title={item.name}
                            />
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* D. SIZE WIDGET */}
                <div className="collapse-widget mb-4">
                  <div
                    className={`collapse-widget-title ${openSections.size ? 'active' : ''}`}
                    onClick={() => toggleSection('size')}
                  >
                    Size
                  </div>
                  {openSections.size && (
                    <div className="widget_size">
                      <ul className="size-list">
                        {availableSizes.map((sz) => (
                          <li key={sz}>
                            <button
                              type="button"
                              className={`size-btn ${selectedSize === sz ? 'active' : sz === 'M' ? 'default-active' : ''}`}
                              onClick={() => setSelectedSize(selectedSize === sz ? null : sz)}
                            >
                              {sz}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* E. PRICE RANGE WIDGET */}
                <div className="collapse-widget mb-4">
                  <div
                    className={`collapse-widget-title ${openSections.price ? 'active' : ''}`}
                    onClick={() => toggleSection('price')}
                  >
                    Price Range
                  </div>
                  {openSections.price && (
                    <div className="widget_price_filter">
                      <div className="price-inputs-row d-flex align-items-center gap-2">
                        <div className="price-field">
                          <label>Min</label>
                          <div className="input-wrap">
                            <span>₹</span>
                            <input
                              type="number"
                              value={minPrice}
                              onChange={(e) => setMinPrice(e.target.value)}
                            />
                          </div>
                        </div>
                        <span className="price-sep">-</span>
                        <div className="price-field">
                          <label>Max</label>
                          <div className="input-wrap">
                            <span>₹</span>
                            <input
                              type="number"
                              value={maxPrice}
                              onChange={(e) => setMaxPrice(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* F. REVIEWS WIDGET */}
                <div className="collapse-widget mb-4">
                  <div
                    className={`collapse-widget-title ${openSections.reviews ? 'active' : ''}`}
                    onClick={() => toggleSection('reviews')}
                  >
                    Reviews
                  </div>
                  {openSections.reviews && (
                    <div className="widget_reviews">
                      <ul className="list">
                        {[5, 4, 3].map((star) => (
                          <li key={star}>
                            <input
                              type="checkbox"
                              id={`star-left-${star}`}
                              checked={selectedRating === star}
                              onChange={() => setSelectedRating(selectedRating === star ? null : star)}
                            />
                            <label htmlFor={`star-left-${star}`}>
                              <ul className="rating">
                                {[...Array(star)].map((_, i) => (
                                  <li key={i}><i className="bx bxs-star"></i></li>
                                ))}
                                {[...Array(5 - star)].map((_, i) => (
                                  <li key={i}><i className="bx bx-star text-muted"></i></li>
                                ))}
                                <li><span><b>{star} Star</b></span></li>
                              </ul>
                            </label>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* G. AVAILABILITY WIDGET */}
                <div className="collapse-widget mb-4">
                  <div
                    className={`collapse-widget-title ${openSections.availability ? 'active' : ''}`}
                    onClick={() => toggleSection('availability')}
                  >
                    Availability
                  </div>
                  {openSections.availability && (
                    <div className="widget_availability">
                      <ul className="list">
                        {['Available', 'Pre Order', 'Up Coming'].map((avail) => (
                          <li key={avail}>
                            <input
                              type="checkbox"
                              id={`avail-left-${avail}`}
                              checked={selectedAvailability.includes(avail)}
                              onChange={() => handleAvailabilityToggle(avail)}
                            />
                            <label htmlFor={`avail-left-${avail}`}>{avail}</label>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* H. TAGS WIDGET */}
                <div className="collapse-widget mb-4">
                  <div
                    className={`collapse-widget-title ${openSections.tags ? 'active' : ''}`}
                    onClick={() => toggleSection('tags')}
                  >
                    Tags
                  </div>
                  {openSections.tags && (
                    <div className="widget_tags">
                      <ul className="tags-list">
                        {["Levi's", "Sale", "Trendy", "Television", "Jack & Jones"].map((tag) => (
                          <li key={tag}>
                            <a
                              href="#tag"
                              className={selectedTag === tag ? 'active' : ''}
                              onClick={(e) => {
                                e.preventDefault();
                                setSelectedTag(selectedTag === tag ? null : tag);
                              }}
                            >
                              {tag}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </aside>
            </div>

            {/* Right Main Products Area */}
            <div className="col-xl-9 col-lg-9 col-md-12">
              {/* Top Sorting Box matching screenshot 2 & 3 */}
              <div className="ts-sorting-box without-color d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
                <div className="left d-flex align-items-center flex-wrap gap-4">
                  <h3 className="collections-heading mb-0">All Collections</h3>
                </div>

                <div className="ts-sorting-right d-flex align-items-center justify-content-end gap-3">
                  <span className="results-count">
                    Showing <b>{currentPageNum === 1 ? '1-25' : '26-33'}</b> of <b>53</b> results
                  </span>
                  <div className="sorting-select-wrap">
                    <select
                      className="form-select"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="default">Default Sorting</option>
                      <option value="all">All Products</option>
                      <option value="best-sellers">Best Sellers</option>
                      <option value="new-arrivals">New Arrivals</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 3. Product 4-Columns Grid matching screenshot 1, 2, 3, 4, 5 */}
              <div className="row">
                {filteredProducts.map((prod) => (
                  <div key={prod.id} className="col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-4">
                <div className="ts-products-men-card">
                  <div className="men-image">
                    <a href="#shop" onClick={(e) => e.preventDefault()}>
                      <img src={prod.image} alt={prod.name} loading="lazy" />
                    </a>

                    {/* Tag / Badge */}
                    {prod.tag && (
                      <div className="tag">
                        <a href="#shop" onClick={(e) => e.preventDefault()}>{prod.tag}</a>
                      </div>
                    )}

                    {prod.newTag && (
                      <div className="new">
                        <a href="#shop" onClick={(e) => e.preventDefault()}>New</a>
                      </div>
                    )}

                    {/* Heart Wishlist Button */}
                    <div className="heart-btn">
                      <button
                        type="button"
                        className={isItemInWishlist(prod.id) ? 'active' : ''}
                        onClick={() => addToWishlist({ id: prod.id, name: prod.name, price: prod.price, image: prod.image })}
                        title="Wishlist"
                      >
                        <i className={`bx ${isItemInWishlist(prod.id) ? 'bxs-heart text-danger' : 'bx-heart'}`}></i>
                      </button>
                    </div>

                    {/* Hover Quick Add Action Bar */}
                    <div className="ts-quick-add-action">
                      <div className="ts-quick-add-btn">+ Quick Add</div>
                      <ul className="quick-add-action-list">
                        {availableSizes.map((s) => (
                          <li
                            key={s}
                            onClick={() => handleQuickAdd(prod, s)}
                            title={`Add size ${s} to cart`}
                          >
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="men-content mt-3">
                    <h3>
                      <a href="#shop" onClick={(e) => e.preventDefault()}>{prod.name}</a>
                    </h3>
                    <span>{prod.category}</span>
                    <div className="price mt-1">₹{prod.price.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 4. Pagination matching screenshot 5 */}
          <div className="pagination-area">
            <button
              type="button"
              className="page-numbers prev"
              onClick={() => handlePageChange(Math.max(1, currentPageNum - 1))}
              disabled={currentPageNum === 1}
            >
              <i className="bx bx-chevron-left"></i>
            </button>
            <button
              type="button"
              className={`page-numbers ${currentPageNum === 1 ? 'current' : ''}`}
              onClick={() => handlePageChange(1)}
            >
              1
            </button>
            <button
              type="button"
              className={`page-numbers ${currentPageNum === 2 ? 'current' : ''}`}
              onClick={() => handlePageChange(2)}
            >
              2
            </button>
            <button
              type="button"
              className={`page-numbers ${currentPageNum === 3 ? 'current' : ''}`}
              onClick={() => handlePageChange(3)}
            >
              3
            </button>
            <button
              type="button"
              className="page-numbers next"
              onClick={() => handlePageChange(Math.min(3, currentPageNum + 1))}
            >
              <i className="bx bx-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
);
};

export default ShopLeftSidebar;
