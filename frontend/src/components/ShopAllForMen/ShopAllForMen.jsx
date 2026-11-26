import React, { useState, useMemo } from 'react';
import './ShopAllForMen.css';
import { useShop } from '../../context/ShopContext.jsx';

// Page 1 Items arranged strictly matching user's live Torado screenshots
const page1Items = [
  // Row 1: Item 1 is double-width Promo Banner (takes 2 columns out of 4)
  {
    id: 'promo-1',
    isPromo: true,
    promoType: 'promo-1',
    gridCol: 'col-xl-6 col-lg-6 col-md-12', // Spans 2 product cards width
    title: 'FOR ONLINE ORDER',
    discount: '30% OFF',
    image: '/assets/images/navbar/men.jpg'
  },
  // Row 1: Item 2 (Card 1)
  {
    id: 101,
    gridCol: 'col-xl-3 col-lg-3 col-md-6 col-sm-6',
    name: "Men's California t-shirt",
    category: "California, t-shirts",
    price: 645,
    image: "/assets/images/products/men-3.jpg",
    type: "Tees",
    fabric: "PYCA Pro",
    color: "c9",
    size: ["XS", "S", "M", "L"],
    rating: 5,
    tag: null,
    availability: "Available"
  },
  // Row 1: Item 3 (Card 2)
  {
    id: 102,
    gridCol: 'col-xl-3 col-lg-3 col-md-6 col-sm-6',
    name: "New York cotton t-shirt",
    category: "Catalogs, t-shirts",
    price: 645,
    image: "/assets/images/products/men-4.jpg",
    type: "Tops",
    fabric: "Tomboy Cotton",
    color: "c4",
    size: ["M", "L", "XL", "XXL"],
    rating: 4,
    tag: null,
    availability: "Available"
  },

  // Row 2: 4 cards in 1 line (Matching Screenshot 3)
  // Card 1
  {
    id: 103,
    gridCol: 'col-xl-3 col-lg-3 col-md-6 col-sm-6',
    name: "Men's purple cotton t-shirt",
    category: "Purple, t-shirts",
    price: 645,
    image: "/assets/images/products/men-5.jpg",
    type: "Tees",
    fabric: "Cloud-Fleece",
    color: "c6",
    size: ["S", "M", "L"],
    rating: 5,
    tag: null,
    availability: "Available"
  },
  // Card 2 (With New badge & Size Bar as in Screenshot 3)
  {
    id: 104,
    gridCol: 'col-xl-3 col-lg-3 col-md-6 col-sm-6',
    name: "Earthy White t-shirt",
    category: "Catalogs, t-shirts",
    price: 301,
    image: "/assets/images/products/men-6.jpg",
    type: "Tops",
    fabric: "Thermopuff",
    color: "c9",
    size: ["XS", "S", "M", "L", "XL", "XXL"],
    rating: 4,
    newTag: true,
    showSizeBar: true,
    selectedSizeDefault: "XXL",
    availability: "Available"
  },
  // Card 3
  {
    id: 105,
    gridCol: 'col-xl-3 col-lg-3 col-md-6 col-sm-6',
    name: "Cycling Therapy t-shirt",
    category: "Custom, t-shirts",
    price: 301,
    image: "/assets/images/products/men-7.jpg",
    type: "Tees",
    fabric: "Coreflex",
    color: "c3",
    size: ["S", "M", "L"],
    rating: 5,
    tag: null,
    availability: "Available"
  },
  // Card 4
  {
    id: 106,
    gridCol: 'col-xl-3 col-lg-3 col-md-6 col-sm-6',
    name: "Pink Los Angeles t-shirt",
    category: "Los Angeles, t-shirts",
    price: 8557,
    image: "/assets/images/products/men-8.jpg",
    type: "Tops",
    fabric: "PYCA Pro",
    color: "c9",
    size: ["M", "L", "XL"],
    rating: 4,
    tag: null,
    availability: "Pre Order"
  },

  // Row 3: 4 cards in 1 line (Matching Screenshot 2)
  // Card 1
  {
    id: 107,
    gridCol: 'col-xl-3 col-lg-3 col-md-6 col-sm-6',
    name: "Brown cotton t-shirt",
    category: "Catalogs, t-shirts",
    price: 4773,
    image: "/assets/images/products/men-9.jpg",
    type: "Tees",
    fabric: "Tomboy Cotton",
    color: "c4",
    size: ["S", "M", "L"],
    rating: 5,
    tag: null,
    availability: "Available"
  },
  // Card 2 (With Best Seller badge & Quick Add button as in Screenshot 2)
  {
    id: 108,
    gridCol: 'col-xl-3 col-lg-3 col-md-6 col-sm-6',
    name: "Coral Own Cotton t-shirt",
    category: "Best seller, t-shirts",
    price: 559,
    image: "/assets/images/customize/customize-7.png",
    type: "Tees",
    fabric: "Coreflex",
    color: "c7",
    size: ["XS", "S", "M", "L"],
    rating: 4,
    tag: "Best Seller",
    showQuickAddBtn: true,
    availability: "Available"
  },
  // Card 3
  {
    id: 109,
    gridCol: 'col-xl-3 col-lg-3 col-md-6 col-sm-6',
    name: "Coral Own Cotton t-shirt",
    category: "Best seller, t-shirts",
    price: 559,
    image: "/assets/images/customize/customize-9.png",
    type: "Tees",
    fabric: "Thermopuff",
    color: "c9",
    size: ["S", "M", "L", "XL"],
    rating: 5,
    tag: null,
    availability: "Available"
  },
  // Card 4: Men's Promo Banner 2 ("Find Your Style & Your Self" - 1 Card Width)
  {
    id: 'promo-2',
    isPromo: true,
    promoType: 'promo-2',
    gridCol: 'col-xl-3 col-lg-3 col-md-6 col-sm-6',
    image: '/assets/images/products/man-off-2.jpg'
  },

  // Row 4: 4 cards in 1 line
  {
    id: 110,
    gridCol: 'col-xl-3 col-lg-3 col-md-6 col-sm-6',
    name: "Coral Own Cotton t-shirt",
    category: "Best seller, t-shirts",
    price: 559,
    image: "/assets/images/customize/customize-3.png",
    type: "Tops",
    fabric: "PYCA Pro",
    color: "c3",
    size: ["XS", "S", "M", "L"],
    rating: 4,
    tag: null,
    availability: "Available"
  },
  {
    id: 111,
    gridCol: 'col-xl-3 col-lg-3 col-md-6 col-sm-6',
    name: "Coral Own Cotton t-shirt",
    category: "Best seller, t-shirts",
    price: 559,
    image: "/assets/images/customize/customize-1.png",
    type: "Tees",
    fabric: "Cloud-Fleece",
    color: "c1",
    size: ["XS", "S", "M", "L", "XL", "XXL"],
    rating: 5,
    tag: "Best Seller",
    showSizeBar: true,
    selectedSizeDefault: "L",
    availability: "Available"
  },
  {
    id: 112,
    gridCol: 'col-xl-3 col-lg-3 col-md-6 col-sm-6',
    name: "Coral Own Cotton t-shirt",
    category: "Best seller, t-shirts",
    price: 559,
    image: "/assets/images/products/collection-2.png",
    type: "Sweatshirts",
    fabric: "Thermopuff",
    color: "c6",
    size: ["M", "L", "XL"],
    rating: 4,
    tag: null,
    availability: "Available"
  },
  {
    id: 113,
    gridCol: 'col-xl-3 col-lg-3 col-md-6 col-sm-6',
    name: "Coral Own Cotton t-shirt",
    category: "Best seller, t-shirts",
    price: 559,
    image: "/assets/images/customize/customize-8.png",
    type: "Tees",
    fabric: "PYCA Pro",
    color: "c8",
    size: ["S", "M", "L", "XL"],
    rating: 5,
    tag: null,
    availability: "Available"
  },

  // Row 5: 4 cards in 1 line
  {
    id: 114,
    gridCol: 'col-xl-3 col-lg-3 col-md-6 col-sm-6',
    name: "Coral Own Cotton t-shirt",
    category: "Best seller, t-shirts",
    price: 559,
    image: "/assets/images/products/collection-1.png",
    type: "Sweatshirts",
    fabric: "Thermopuff",
    color: "c6",
    size: ["M", "L", "XL"],
    rating: 4,
    tag: null,
    availability: "Available"
  },
  {
    id: 115,
    gridCol: 'col-xl-3 col-lg-3 col-md-6 col-sm-6',
    name: "Coral Own Cotton t-shirt",
    category: "Best seller, t-shirts",
    price: 559,
    image: "/assets/images/customize/customize-5.png",
    type: "Tees",
    fabric: "Cloud-Fleece",
    color: "c8",
    size: ["XS", "S", "M", "L", "XL", "XXL"],
    rating: 5,
    newTag: true,
    showSizeBar: true,
    selectedSizeDefault: "M",
    availability: "Available"
  },
  {
    id: 116,
    gridCol: 'col-xl-3 col-lg-3 col-md-6 col-sm-6',
    name: "Coral Own Cotton t-shirt",
    category: "Best seller, t-shirts",
    price: 559,
    image: "/assets/images/customize/customize-4.png",
    type: "Tops",
    fabric: "Coreflex",
    color: "c14",
    size: ["XS", "S", "M", "L"],
    rating: 4,
    tag: null,
    availability: "Available"
  },
  {
    id: 117,
    gridCol: 'col-xl-3 col-lg-3 col-md-6 col-sm-6',
    name: "Coral Own Cotton t-shirt",
    category: "Best seller, t-shirts",
    price: 559,
    image: "/assets/images/products/collection-4.png",
    type: "Sweatshirts",
    fabric: "Thermopuff",
    color: "c8",
    size: ["M", "L", "XL"],
    rating: 5,
    tag: null,
    availability: "Available"
  },

  // Row 6: 4 cards in 1 line
  {
    id: 118,
    gridCol: 'col-xl-3 col-lg-3 col-md-6 col-sm-6',
    name: "Green Explore t-shirt",
    category: "Catalogs, t-shirts",
    price: 473,
    image: "/assets/images/products/men-1.jpg",
    type: "Tees",
    fabric: "Cloud-Fleece",
    color: "c5",
    size: ["S", "M", "L"],
    rating: 4,
    tag: null,
    availability: "Available"
  },
  {
    id: 119,
    gridCol: 'col-xl-3 col-lg-3 col-md-6 col-sm-6',
    name: "Grey NYC t-shirt",
    category: "Grey, t-shirts",
    price: 559,
    image: "/assets/images/products/men-2.jpg",
    type: "Tops",
    fabric: "Coreflex",
    color: "c1",
    size: ["M", "L", "XL"],
    rating: 5,
    tag: null,
    availability: "Available"
  },
  {
    id: 120,
    gridCol: 'col-xl-3 col-lg-3 col-md-6 col-sm-6',
    name: "White Essential Cotton t-shirt",
    category: "Catalogs, t-shirts",
    price: 559,
    image: "/assets/images/customize/customize-6.png",
    type: "Tees",
    fabric: "Tomboy Cotton",
    color: "c6",
    size: ["XS", "S", "M"],
    rating: 4,
    newTag: true,
    availability: "Available"
  },
  {
    id: 121,
    gridCol: 'col-xl-3 col-lg-3 col-md-6 col-sm-6',
    name: "Coral Own Cotton t-shirt",
    category: "Best seller, t-shirts",
    price: 559,
    image: "/assets/images/customize/customize-2.png",
    type: "Tops",
    fabric: "Thermopuff",
    color: "c2",
    size: ["M", "L", "XL", "XXL"],
    rating: 5,
    tag: null,
    availability: "Available"
  }
];

const page2Items = [
  {
    id: 201,
    gridCol: 'col-xl-3 col-lg-3 col-md-6 col-sm-6',
    name: "Coral Own Cotton t-shirt",
    category: "Best seller, t-shirts",
    price: 559,
    image: "/assets/images/products/flash-sale-3.png",
    type: "Tees",
    fabric: "PYCA Pro",
    color: "c5",
    size: ["S", "M", "L"],
    rating: 5,
    availability: "Available"
  },
  {
    id: 202,
    gridCol: 'col-xl-3 col-lg-3 col-md-6 col-sm-6',
    name: "Mint Surf Classic t-shirt",
    category: "Catalogs, t-shirts",
    price: 559,
    image: "/assets/images/customize/customize-4.png",
    type: "Tops",
    fabric: "Cloud-Fleece",
    color: "c4",
    size: ["S", "M", "L"],
    rating: 4,
    availability: "Available"
  },
  {
    id: 203,
    gridCol: 'col-xl-3 col-lg-3 col-md-6 col-sm-6',
    name: "Lime Neon Vibe t-shirt",
    category: "Catalogs, t-shirts",
    price: 559,
    image: "/assets/images/customize/customize-7.png",
    type: "Tees",
    fabric: "Coreflex",
    color: "c7",
    size: ["XS", "S", "M", "L"],
    rating: 5,
    availability: "Available"
  },
  {
    id: 204,
    gridCol: 'col-xl-3 col-lg-3 col-md-6 col-sm-6',
    name: "Indigo California t-shirt",
    category: "California, t-shirts",
    price: 645,
    image: "/assets/images/customize/customize-8.png",
    type: "Tees",
    fabric: "PYCA Pro",
    color: "c8",
    size: ["S", "M", "L", "XL"],
    rating: 5,
    tag: "Best Seller",
    availability: "Available"
  }
];

const page3Items = [
  {
    id: 301,
    gridCol: 'col-xl-3 col-lg-3 col-md-6 col-sm-6',
    name: "Cycling Therapy t-shirt",
    category: "Custom, t-shirts",
    price: 301,
    image: "/assets/images/products/men-7.jpg",
    type: "Tees",
    fabric: "Coreflex",
    color: "c3",
    size: ["S", "M", "L"],
    rating: 5,
    availability: "Available"
  },
  {
    id: 302,
    gridCol: 'col-xl-3 col-lg-3 col-md-6 col-sm-6',
    name: "Pink Los Angeles t-shirt",
    category: "Los Angeles, t-shirts",
    price: 8557,
    image: "/assets/images/products/men-8.jpg",
    type: "Tops",
    fabric: "PYCA Pro",
    color: "c9",
    size: ["M", "L", "XL"],
    rating: 4,
    availability: "Pre Order"
  },
  {
    id: 303,
    gridCol: 'col-xl-3 col-lg-3 col-md-6 col-sm-6',
    name: "Brown cotton t-shirt",
    category: "Catalogs, t-shirts",
    price: 4773,
    image: "/assets/images/products/men-9.jpg",
    type: "Tees",
    fabric: "Tomboy Cotton",
    color: "c4",
    size: ["S", "M", "L"],
    rating: 5,
    availability: "Available"
  },
  {
    id: 304,
    gridCol: 'col-xl-3 col-lg-3 col-md-6 col-sm-6',
    name: "Coral Own Cotton t-shirt",
    category: "Best seller, t-shirts",
    price: 559,
    image: "/assets/images/customize/customize-7.png",
    type: "Tees",
    fabric: "Coreflex",
    color: "c7",
    size: ["XS", "S", "M", "L"],
    rating: 4,
    availability: "Available"
  }
];

const categoriesList = [
  { name: "Tops", count: 32 },
  { name: "Tees", count: 63 },
  { name: "Tanks", count: 113 },
  { name: "Sweatshirts", count: 223 },
  { name: "New Releases", count: 19 },
  { name: "Sherpas", count: 111 },
  { name: "Outerwear", count: 3 },
  { name: "Winter 2025", count: 41 },
  { name: "Best Sellers", count: 21 }
];

const fabricList = [
  { name: "Cloud-Fleece", count: 32 },
  { name: "Coreflex", count: 63 },
  { name: "PYCA Pro", count: 113 },
  { name: "Tomboy Cotton", count: 2 },
  { name: "Thermopuff", count: 11 }
];

const extraFabricList = [
  { name: "French Terry", count: 18 },
  { name: "Organic Cotton", count: 25 },
  { name: "Pima Cotton", count: 14 },
  { name: "MicroModal", count: 9 }
];

const colorSwatches = [
  { id: 'c1', hex: '#A7C5E1', name: 'Light Blue' },
  { id: 'c2', hex: '#C6C897', name: 'Sage Green' },
  { id: 'c3', hex: '#E65C4F', name: 'Coral Red' },
  { id: 'c4', hex: '#5D19B4', name: 'Deep Purple' },
  { id: 'c5', hex: '#6BBD99', name: 'Mint Teal' },
  { id: 'c6', hex: '#CCCCCC', name: 'Silver Grey' },
  { id: 'c7', hex: '#C5FA54', name: 'Lime' },
  { id: 'c8', hex: '#514EB5', name: 'Indigo' },
  { id: 'c9', hex: '#433535', name: 'Dark Mocha' },
  { id: 'c10', hex: '#EFB5B5', name: 'Blush Pink' },
  { id: 'c11', hex: '#F0C005', name: 'Sunny Yellow' },
  { id: 'c12', hex: '#648361', name: 'Olive Green' },
  { id: 'c13', hex: '#D41A42', name: 'Crimson' },
  { id: 'c14', hex: '#FDAB79', name: 'Peach' }
];

const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const tagsList = [
  "Levi's",
  "Sale",
  "Trendy",
  "Television",
  "Jack & Jones",
  "Louis Philippe",
  "Mufti",
  "Pepe Jeans"
];

const extraTagsList = [
  "Casual",
  "Streetwear",
  "Graphic",
  "Vintage",
  "Cotton"
];

const ShopAllForMen = () => {
  const { addToCart, addToWishlist, wishlistItems, setCurrentPage, isProductActive } = useShop();

  // Active Filters State
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedFabrics, setSelectedFabrics] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [minPrice, setMinPrice] = useState(1);
  const [maxPrice, setMaxPrice] = useState(1000.0);
  const [selectedRating, setSelectedRating] = useState(null);
  const [selectedAvailability, setSelectedAvailability] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortBy, setSortBy] = useState('default');
  const [currentPageNum, setCurrentPageNum] = useState(1);

  // Selected size per product card
  const [productSelectedSizes, setProductSelectedSizes] = useState({
    104: 'XXL',
    111: 'L',
    115: 'M'
  });

  // Accordion open/close state
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

  // Show more states
  const [showMoreFabric, setShowMoreFabric] = useState(false);
  const [showMoreReviews, setShowMoreReviews] = useState(false);
  const [showMoreAvailability, setShowMoreAvailability] = useState(false);
  const [showMoreTags, setShowMoreTags] = useState(false);

  // Mobile Filter Drawer Toggle
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleFabricToggle = (fab) => {
    setSelectedFabrics(prev =>
      prev.includes(fab) ? prev.filter(f => f !== fab) : [...prev, fab]
    );
  };

  const handleAvailabilityToggle = (avail) => {
    setSelectedAvailability(prev =>
      prev.includes(avail) ? prev.filter(a => a !== avail) : [...prev, avail]
    );
  };

  const handleTagToggle = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleCardSizeSelect = (productId, size) => {
    setProductSelectedSizes(prev => ({ ...prev, [productId]: size }));
  };

  const handleQuickAdd = (product, size) => {
    const chosenSize = size || productSelectedSizes[product.id] || 'M';
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: chosenSize
    });
  };

  const isItemInWishlist = (id) => {
    return wishlistItems.some(item => item.id === id);
  };

  const resetFilters = () => {
    setSelectedCategory(null);
    setSelectedFabrics([]);
    setSelectedColor(null);
    setSelectedSize(null);
    setMinPrice(1);
    setMaxPrice(1000.0);
    setSelectedRating(null);
    setSelectedAvailability([]);
    setSelectedTags([]);
  };

  const hasActiveFilters =
    selectedCategory ||
    selectedFabrics.length > 0 ||
    selectedColor ||
    selectedSize ||
    minPrice > 1 ||
    maxPrice < 1000 ||
    selectedRating ||
    selectedAvailability.length > 0 ||
    selectedTags.length > 0;

  // Base list depending on pagination
  const rawItems = useMemo(() => {
    if (currentPageNum === 1) return page1Items;
    if (currentPageNum === 2) return page2Items;
    return page3Items;
  }, [currentPageNum]);

  // Filtered Items Logic
  const filteredItems = useMemo(() => {
    let result = rawItems.filter((item) => isProductActive ? isProductActive(item) : true);

    if (hasActiveFilters) {
      result = result.filter(item => {
        if (item.isPromo) return true; // keep promo banners visible

        if (selectedCategory) {
          if (selectedCategory === "Best Sellers" && !item.tag && !item.category?.toLowerCase().includes("best seller")) return false;
          else if (selectedCategory !== "Best Sellers" && !item.type?.toLowerCase().includes(selectedCategory.toLowerCase()) && !item.category?.toLowerCase().includes(selectedCategory.toLowerCase())) {
            return false;
          }
        }

        if (selectedFabrics.length > 0 && !selectedFabrics.includes(item.fabric)) {
          return false;
        }

        if (selectedColor && item.color !== selectedColor) {
          return false;
        }

        if (selectedSize && (!item.size || !item.size.includes(selectedSize))) {
          return false;
        }

        if (item.price < minPrice || item.price > maxPrice) {
          return false;
        }

        if (selectedRating && item.rating < selectedRating) {
          return false;
        }

        if (selectedAvailability.length > 0 && !selectedAvailability.includes(item.availability)) {
          return false;
        }

        return true;
      });
    }

    // Sort items (excluding promos from reordering)
    if (sortBy === 'best-sellers') {
      result = [...result].sort((a, b) => (b.isPromo ? 0 : (b.tag ? 1 : 0)) - (a.isPromo ? 0 : (a.tag ? 1 : 0)));
    } else if (sortBy === 'new-arrivals') {
      result = [...result].sort((a, b) => (b.isPromo ? 0 : (b.newTag ? 1 : 0)) - (a.isPromo ? 0 : (a.newTag ? 1 : 0)));
    } else if (sortBy === 'price-low') {
      result = [...result].sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === 'price-high') {
      result = [...result].sort((a, b) => (b.price || 0) - (a.price || 0));
    }

    return result;
  }, [rawItems, hasActiveFilters, selectedCategory, selectedFabrics, selectedColor, selectedSize, minPrice, maxPrice, selectedRating, selectedAvailability, sortBy, isProductActive]);

  const handlePageChange = (num) => {
    setCurrentPageNum(num);
    const element = document.getElementById('shop-all-for-men-grid');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Sidebar Filter Component (Reused in desktop and mobile drawer)
  const FilterContent = () => (
    <div className="shop-sidebar-wrap">
      <div className="sidebar-header d-flex align-items-center justify-content-between">
        <h3 className="sidebar-title">Filters</h3>
        {hasActiveFilters && (
          <button type="button" className="clear-filters-btn" onClick={resetFilters}>
            Clear All
          </button>
        )}
      </div>

      {/* 1. Categories */}
      <div className="filter-block">
        <div className="filter-title" onClick={() => toggleSection('categories')}>
          <span>Categories</span>
          <i className={`bx ${openSections.categories ? 'bx-chevron-up' : 'bx-chevron-down'}`}></i>
        </div>
        {openSections.categories && (
          <ul className="categories-list">
            {categoriesList.map((cat, idx) => (
              <li
                key={idx}
                className={selectedCategory === cat.name ? 'active' : ''}
                onClick={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
              >
                <span className="cat-name">{cat.name}</span>
                <span className="cat-count">({cat.count})</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 2. Fabric */}
      <div className="filter-block">
        <div className="filter-title" onClick={() => toggleSection('fabric')}>
          <span>Fabric</span>
          <i className={`bx ${openSections.fabric ? 'bx-chevron-up' : 'bx-chevron-down'}`}></i>
        </div>
        {openSections.fabric && (
          <div className="filter-options-list">
            {fabricList.map((fab, idx) => (
              <label key={idx} className="filter-radio-row">
                <span className={`custom-radio ${selectedFabrics.includes(fab.name) ? 'checked' : ''}`}></span>
                <input
                  type="checkbox"
                  checked={selectedFabrics.includes(fab.name)}
                  onChange={() => handleFabricToggle(fab.name)}
                />
                <span className="option-name">{fab.name}</span>
                <span className="option-count">({fab.count})</span>
              </label>
            ))}

            {showMoreFabric && extraFabricList.map((fab, idx) => (
              <label key={`extra-${idx}`} className="filter-radio-row">
                <span className={`custom-radio ${selectedFabrics.includes(fab.name) ? 'checked' : ''}`}></span>
                <input
                  type="checkbox"
                  checked={selectedFabrics.includes(fab.name)}
                  onChange={() => handleFabricToggle(fab.name)}
                />
                <span className="option-name">{fab.name}</span>
                <span className="option-count">({fab.count})</span>
              </label>
            ))}

            <button
              type="button"
              className="show-more-btn"
              onClick={() => setShowMoreFabric(!showMoreFabric)}
            >
              {showMoreFabric ? '- Show Less' : '+ Show More'}
            </button>
          </div>
        )}
      </div>

      {/* 3. Color */}
      <div className="filter-block">
        <div className="filter-title" onClick={() => toggleSection('color')}>
          <span>Color</span>
          <i className={`bx ${openSections.color ? 'bx-chevron-up' : 'bx-chevron-down'}`}></i>
        </div>
        {openSections.color && (
          <div className="color-swatches-grid">
            {colorSwatches.map((swatch) => (
              <button
                key={swatch.id}
                type="button"
                className={`color-swatch-circle ${selectedColor === swatch.id ? 'active' : ''}`}
                style={{ backgroundColor: swatch.hex }}
                onClick={() => setSelectedColor(selectedColor === swatch.id ? null : swatch.id)}
                title={swatch.name}
              />
            ))}
          </div>
        )}
      </div>

      {/* 4. Size */}
      <div className="filter-block">
        <div className="filter-title" onClick={() => toggleSection('size')}>
          <span>Size</span>
          <i className={`bx ${openSections.size ? 'bx-chevron-up' : 'bx-chevron-down'}`}></i>
        </div>
        {openSections.size && (
          <div className="size-selector-boxes">
            {sizeOptions.map((sz) => (
              <button
                key={sz}
                type="button"
                className={`size-box-btn ${selectedSize === sz ? 'active' : ''}`}
                onClick={() => setSelectedSize(selectedSize === sz ? null : sz)}
              >
                {sz}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 5. Price Range */}
      <div className="filter-block">
        <div className="filter-title" onClick={() => toggleSection('price')}>
          <span>Price Range</span>
          <i className={`bx ${openSections.price ? 'bx-chevron-up' : 'bx-chevron-down'}`}></i>
        </div>
        {openSections.price && (
          <div className="price-range-wrap">
            <div className="price-inputs-row">
              <div className="price-input-box">
                <label>Min</label>
                <div className="input-group-custom">
                  <span>₹</span>
                  <input
                    type="number"
                    value={minPrice}
                    min="1"
                    max="1000"
                    onChange={(e) => setMinPrice(Number(e.target.value))}
                  />
                </div>
              </div>
              <span className="price-dash">-</span>
              <div className="price-input-box">
                <label>Max</label>
                <div className="input-group-custom">
                  <span>₹</span>
                  <input
                    type="number"
                    value={maxPrice}
                    min="1"
                    max="1000"
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
            <input
              type="range"
              min="1"
              max="1000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="price-slider"
            />
          </div>
        )}
      </div>

      {/* 6. Reviews */}
      <div className="filter-block">
        <div className="filter-title" onClick={() => toggleSection('reviews')}>
          <span>Reviews</span>
          <i className={`bx ${openSections.reviews ? 'bx-chevron-up' : 'bx-chevron-down'}`}></i>
        </div>
        {openSections.reviews && (
          <div className="filter-options-list">
            {[5, 4, 3].map((stars) => (
              <label key={stars} className="filter-radio-row rating-row">
                <span className={`custom-radio ${selectedRating === stars ? 'checked' : ''}`}></span>
                <input
                  type="radio"
                  name="rating"
                  checked={selectedRating === stars}
                  onChange={() => setSelectedRating(selectedRating === stars ? null : stars)}
                />
                <div className="stars-icons">
                  {[...Array(5)].map((_, i) => (
                    <i
                      key={i}
                      className={`bx ${i < stars ? 'bxs-star star-filled' : 'bx-star star-empty'}`}
                    ></i>
                  ))}
                </div>
                <span className="rating-label">{stars} Star</span>
              </label>
            ))}

            {showMoreReviews && [2, 1].map((stars) => (
              <label key={stars} className="filter-radio-row rating-row">
                <span className={`custom-radio ${selectedRating === stars ? 'checked' : ''}`}></span>
                <input
                  type="radio"
                  name="rating"
                  checked={selectedRating === stars}
                  onChange={() => setSelectedRating(selectedRating === stars ? null : stars)}
                />
                <div className="stars-icons">
                  {[...Array(5)].map((_, i) => (
                    <i
                      key={i}
                      className={`bx ${i < stars ? 'bxs-star star-filled' : 'bx-star star-empty'}`}
                    ></i>
                  ))}
                </div>
                <span className="rating-label">{stars} Star</span>
              </label>
            ))}

            <button
              type="button"
              className="show-more-btn"
              onClick={() => setShowMoreReviews(!showMoreReviews)}
            >
              {showMoreReviews ? '- Show Less' : '+ Show More'}
            </button>
          </div>
        )}
      </div>

      {/* 7. Availability */}
      <div className="filter-block">
        <div className="filter-title" onClick={() => toggleSection('availability')}>
          <span>Availability</span>
          <i className={`bx ${openSections.availability ? 'bx-chevron-up' : 'bx-chevron-down'}`}></i>
        </div>
        {openSections.availability && (
          <div className="filter-options-list">
            {["Available", "Pre Order", "Up Coming"].map((avail, idx) => (
              <label key={idx} className="filter-radio-row">
                <span className={`custom-radio ${selectedAvailability.includes(avail) ? 'checked' : ''}`}></span>
                <input
                  type="checkbox"
                  checked={selectedAvailability.includes(avail)}
                  onChange={() => handleAvailabilityToggle(avail)}
                />
                <span className="option-name">{avail}</span>
              </label>
            ))}

            {showMoreAvailability && ["In Stock", "Out of Stock"].map((avail, idx) => (
              <label key={`avail-extra-${idx}`} className="filter-radio-row">
                <span className={`custom-radio ${selectedAvailability.includes(avail) ? 'checked' : ''}`}></span>
                <input
                  type="checkbox"
                  checked={selectedAvailability.includes(avail)}
                  onChange={() => handleAvailabilityToggle(avail)}
                />
                <span className="option-name">{avail}</span>
              </label>
            ))}

            <button
              type="button"
              className="show-more-btn"
              onClick={() => setShowMoreAvailability(!showMoreAvailability)}
            >
              {showMoreAvailability ? '- Show Less' : '+ Show More'}
            </button>
          </div>
        )}
      </div>

      {/* 8. Tags */}
      <div className="filter-block">
        <div className="filter-title" onClick={() => toggleSection('tags')}>
          <span>Tags</span>
          <i className={`bx ${openSections.tags ? 'bx-chevron-up' : 'bx-chevron-down'}`}></i>
        </div>
        {openSections.tags && (
          <div className="tags-badges-list">
            {tagsList.map((tg, idx) => (
              <button
                key={idx}
                type="button"
                className={`tag-pill-btn ${selectedTags.includes(tg) ? 'active' : ''}`}
                onClick={() => handleTagToggle(tg)}
              >
                {tg}
              </button>
            ))}

            {showMoreTags && extraTagsList.map((tg, idx) => (
              <button
                key={`extra-tag-${idx}`}
                type="button"
                className={`tag-pill-btn ${selectedTags.includes(tg) ? 'active' : ''}`}
                onClick={() => handleTagToggle(tg)}
              >
                {tg}
              </button>
            ))}

            <button
              type="button"
              className="show-more-btn d-block mt-2"
              onClick={() => setShowMoreTags(!showMoreTags)}
            >
              {showMoreTags ? '- Show Less' : '+ Show More'}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="shop-all-for-men-page" id="shop-all-for-men-grid">
      {/* 1. Page Header Banner matching screenshot 1 */}
      <div className="men-banner-area">
        <div className="container">
          <div className="men-banner-content">
            <h1 className="men-banner-title">Shop All For Men</h1>
            <ul className="men-breadcrumb">
              <li>
                <a
                  href="#home"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage('home');
                    window.location.hash = '#home';
                  }}
                >
                  Home
                </a>
              </li>
              <li className="sep">&gt;&gt;</li>
              <li className="active">Shop All For Men</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 2. Main Shop Area with Sidebar & Product Grid */}
      <div className="men-shop-container pt-70 pb-100">
        <div className="container-fluid custom-pad">
          <div className="row">
            {/* Desktop Left Sidebar (col-xl-2 col-lg-3) */}
            <div className="col-xl-2 col-lg-3 col-md-12 d-none d-lg-block">
              <aside className="sticky-sidebar">
                <FilterContent />
              </aside>
            </div>

            {/* Right Product Grid Area (col-xl-10 col-lg-9) */}
            <div className="col-xl-10 col-lg-9 col-md-12">
              {/* Top Controls Bar matching Screenshot 2 & 3 */}
              <div className="shop-top-controls d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
                <div className="left-controls d-flex align-items-center gap-3">
                  <h2 className="grid-heading m-0">Shop All For Men</h2>
                </div>

                <div className="right-controls d-flex align-items-center flex-wrap gap-3">
                  <span className="results-text">
                    Showing <b>{currentPageNum === 1 ? '1-25' : currentPageNum === 2 ? '26-29' : '30-33'}</b> of <b>53</b> results
                  </span>

                  {/* Dropdown Sorting */}
                  <div className="sorting-dropdown-wrap">
                    <select
                      className="form-select custom-sorting-select"
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

                  {/* Mobile Filter Toggle Button */}
                  <button
                    type="button"
                    className="mobile-filter-trigger d-lg-none"
                    onClick={() => setMobileFilterOpen(true)}
                  >
                    <i className="bx bx-slider-alt"></i>
                    <span>Filters</span>
                  </button>
                </div>
              </div>

              {/* Products & Promo Cards Grid: Exact 4-column layout matching screenshots */}
              <div className="row g-4">
                {filteredItems.map((item, index) => {
                  /* PROMO BANNER 1 (Screenshot 1: 2-Columns Double Width 30% OFF) */
                  if (item.isPromo && item.promoType === 'promo-1') {
                    return (
                      <div key={`promo-1-${index}`} className={item.gridCol || "col-xl-6 col-lg-6 col-md-12"}>
                        <div className="men-promo-card promo-card-light">
                          <div className="promo-left-text">
                            <span className="promo-tag">FOR</span>
                            <h4 className="promo-bold-title">ONLINE<br />ORDER</h4>
                            <div className="promo-discount-num">30%</div>
                            <div className="promo-discount-off">OFF</div>
                          </div>
                          <div className="promo-right-img">
                            <img src={item.image} alt="Men's collection 30% Off" />
                          </div>
                        </div>
                      </div>
                    );
                  }

                  /* PROMO BANNER 2 (Screenshot 2: 1-Column Men's Fashion "Find Your Style & Your Self") */
                  if (item.isPromo && item.promoType === 'promo-2') {
                    return (
                      <div key={`promo-2-${index}`} className={item.gridCol || "col-xl-3 col-lg-3 col-md-6 col-sm-6"}>
                        <div className="men-promo-card promo-card-image-only">
                          <a href="#shop" onClick={(e) => e.preventDefault()}>
                            <img src={item.image} alt="Find Your Style & Your Self" />
                          </a>
                        </div>
                      </div>
                    );
                  }

                  /* REGULAR PRODUCT CARD */
                  const isWishlist = isItemInWishlist(item.id);
                  const selectedSizeForCard = productSelectedSizes[item.id] || item.selectedSizeDefault || 'M';

                  return (
                    <div key={item.id} className={item.gridCol || "col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12"}>
                      <div className="ts-men-card-item">
                        {/* Image & Badges Box */}
                        <div className="men-card-media">
                          <a
                            href="#shop"
                            onClick={(e) => {
                              e.preventDefault();
                              handleQuickAdd(item, selectedSizeForCard);
                            }}
                          >
                            <img src={item.image} alt={item.name} loading="lazy" />
                          </a>

                          {/* Badges */}
                          {item.tag && (
                            <span className="card-badge badge-best-seller">{item.tag}</span>
                          )}
                          {item.newTag && (
                            <span className="card-badge badge-new">New</span>
                          )}

                          {/* Wishlist Heart Icon Button */}
                          <button
                            type="button"
                            className={`card-wishlist-btn ${isWishlist ? 'active' : ''}`}
                            onClick={() => addToWishlist({
                              id: item.id,
                              name: item.name,
                              price: item.price,
                              image: item.image
                            })}
                            title={isWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                          >
                            <i className={`bx ${isWishlist ? 'bxs-heart text-danger' : 'bx-heart'}`}></i>
                          </button>

                          {/* Quick Add Bar Button as in Screenshot 2 */}
                          {item.showQuickAddBtn && (
                            <div className="card-quick-add-bar">
                              <button
                                type="button"
                                className="quick-add-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleQuickAdd(item, 'M');
                                }}
                              >
                                + Quick Add
                              </button>
                            </div>
                          )}

                          {/* Size Selector Bar as in Screenshot 3 */}
                          {item.showSizeBar && (
                            <div className="card-size-action-bar always-visible">
                              {sizeOptions.map((sz) => (
                                <button
                                  key={sz}
                                  type="button"
                                  className={`size-btn ${selectedSizeForCard === sz ? 'selected' : ''}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCardSizeSelect(item.id, sz);
                                    handleQuickAdd(item, sz);
                                  }}
                                >
                                  {sz}
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Hover Size Bar for other cards */}
                          {!item.showQuickAddBtn && !item.showSizeBar && (
                            <div className="card-size-action-bar hover-visible">
                              {sizeOptions.map((sz) => (
                                <button
                                  key={sz}
                                  type="button"
                                  className={`size-btn ${selectedSizeForCard === sz ? 'selected' : ''}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCardSizeSelect(item.id, sz);
                                    handleQuickAdd(item, sz);
                                  }}
                                >
                                  {sz}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="men-card-content">
                          <h3 className="product-name">
                            <a
                              href="#shop"
                              onClick={(e) => {
                                e.preventDefault();
                                handleQuickAdd(item, selectedSizeForCard);
                              }}
                            >
                              {item.name}
                            </a>
                          </h3>
                          <span className="product-category">{item.category}</span>
                          <div className="product-price-row d-flex align-items-center justify-content-between">
                            <span className="product-price">₹{item.price.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination matching Screenshot 7 & 8 */}
              <div className="men-pagination-area text-center mt-5">
                <ul className="pagination-list d-inline-flex align-items-center gap-2">
                  <li>
                    <button
                      type="button"
                      className="page-nav-arrow"
                      disabled={currentPageNum === 1}
                      onClick={() => handlePageChange(Math.max(1, currentPageNum - 1))}
                    >
                      <i className="bx bx-left-arrow-alt"></i>
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className={`page-num-btn ${currentPageNum === 1 ? 'active' : ''}`}
                      onClick={() => handlePageChange(1)}
                    >
                      1
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className={`page-num-btn ${currentPageNum === 2 ? 'active' : ''}`}
                      onClick={() => handlePageChange(2)}
                    >
                      2
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className={`page-num-btn ${currentPageNum === 3 ? 'active' : ''}`}
                      onClick={() => handlePageChange(3)}
                    >
                      3
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="page-nav-arrow"
                      disabled={currentPageNum === 3}
                      onClick={() => handlePageChange(Math.min(3, currentPageNum + 1))}
                    >
                      <i className="bx bx-right-arrow-alt"></i>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Mobile Filter Off-Canvas Drawer */}
      <div className={`mobile-filter-drawer ${mobileFilterOpen ? 'active' : ''}`}>
        <div className="mobile-filter-header d-flex align-items-center justify-content-between">
          <h4>Filter Products</h4>
          <button
            type="button"
            className="close-drawer-btn"
            onClick={() => setMobileFilterOpen(false)}
          >
            <i className="bx bx-x"></i>
          </button>
        </div>
        <div className="mobile-filter-body">
          <FilterContent />
        </div>
        <div className="mobile-filter-footer">
          <button
            type="button"
            className="btn-apply-filters w-100"
            onClick={() => setMobileFilterOpen(false)}
          >
            Apply Filters
          </button>
        </div>
      </div>
      {mobileFilterOpen && (
        <div
          className="mobile-filter-backdrop"
          onClick={() => setMobileFilterOpen(false)}
        />
      )}
    </div>
  );
};

export default ShopAllForMen;
