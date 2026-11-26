import React, { useState, useMemo } from 'react';
import './ShopAllForWomen.css';
import { useShop } from '../../context/ShopContext.jsx';

// Page 1 Items arranged strictly matching user's live Torado screenshots for Women's shop
const page1Items = [
  // Row 1: Promo Banner 1 (Pink SUPER FASHION SALE - 2 Columns wide)
  {
    id: 'women-promo-1',
    isPromo: true,
    promoType: 'super-sale',
    gridCol: 'col-xl-6 col-lg-6 col-md-12',
    title: 'SUPER FASHION SALE!',
    website: 'www.yourwebsite.com',
    dates: '1 - 7 MAY',
    discount: '50%',
    image: '/assets/images/products/women-add-1.jpg'
  },
  // Row 1: Promo Banner 2 (FOR ONLINE ORDER 30% OFF - 2 Columns wide)
  {
    id: 'women-promo-2',
    isPromo: true,
    promoType: 'online-order-women',
    gridCol: 'col-xl-6 col-lg-6 col-md-12',
    title: 'FOR ONLINE ORDER',
    discount: '30% OFF',
    image: '/assets/images/products/women-add-2.jpg'
  },

  // Row 2: 4 cards in 1 row (Matching Screenshot 3)
  {
    id: 501,
    gridCol: 'col-xl-3 col-lg-3 col-md-6 col-sm-6',
    name: "Polar Sherpa Shirt Jacket",
    category: "Polar, t-shirts",
    price: 12728,
    image: "/assets/images/products/women-1.jpg",
    hoverImage: "/assets/images/products/women-hover-1.jpg",
    type: "Sherpas",
    fabric: "Cloud-Fleece",
    color: "c6",
    size: ["XS", "S", "M", "L"],
    rating: 5,
    tag: null,
    availability: "Available"
  },
  {
    id: 502,
    gridCol: 'col-xl-3 col-lg-3 col-md-6 col-sm-6',
    name: "Polartec® Sherpa 1/2 Zip",
    category: "Grey, Cabernet",
    price: 12169,
    image: "/assets/images/products/women-2.jpg",
    hoverImage: "/assets/images/products/women-hover-2.jpg",
    type: "Sweatshirts",
    fabric: "Thermopuff",
    color: "c13",
    size: ["S", "M", "L", "XL"],
    rating: 5,
    tag: null,
    availability: "Available"
  },
  {
    id: 503,
    gridCol: 'col-xl-3 col-lg-3 col-md-6 col-sm-6',
    name: "Almost Friday Tee Cropped",
    category: "Dune",
    price: 2924,
    image: "/assets/images/products/women-3.jpg",
    hoverImage: "/assets/images/products/women-hover-3.jpg",
    type: "Tees",
    fabric: "Coreflex",
    color: "c6",
    size: ["XS", "S", "M", "L"],
    rating: 4,
    tag: null,
    availability: "Available"
  },
  {
    id: 504,
    gridCol: 'col-xl-3 col-lg-3 col-md-6 col-sm-6',
    name: "Brown Tee Croped",
    category: "Sierra, t-shirts",
    price: 2946,
    image: "/assets/images/products/women-4.jpg",
    hoverImage: "/assets/images/products/women-hover-4.jpg",
    type: "Tops",
    fabric: "Tomboy Cotton",
    color: "c9",
    size: ["XS", "S", "M", "L"],
    rating: 5,
    tag: null,
    availability: "Available"
  },

  // Row 3: 4 cards in 1 row (Matching Screenshot 4)
  {
    id: 505,
    gridCol: 'col-xl-3 col-lg-3 col-md-6 col-sm-6',
    name: "Thermopuff Jacket",
    category: "Black, t-shirts",
    price: 15824,
    image: "/assets/images/products/women-5.jpg",
    hoverImage: "/assets/images/products/women-hover-5.jpg",
    type: "Outerwear",
    fabric: "Thermopuff",
    color: "c9",
    size: ["S", "M", "L", "XL"],
    rating: 5,
    tag: null,
    availability: "Available"
  },
  {
    id: 506,
    gridCol: 'col-xl-3 col-lg-3 col-md-6 col-sm-6',
    name: "Almost Sunday Tee",
    category: "Catalogs, Haze",
    price: 3634,
    image: "/assets/images/products/women-6.jpg",
    hoverImage: "/assets/images/products/women-hover-6.jpg",
    type: "Tees",
    fabric: "PYCA Pro",
    color: "c6",
    size: ["XS", "S", "M", "L"],
    rating: 4,
    tag: null,
    availability: "Available"
  },
  {
    id: 507,
    gridCol: 'col-xl-3 col-lg-3 col-md-6 col-sm-6',
    name: "Tomboy Tee Cropped",
    category: "Catalogs, Haze",
    price: 2946,
    image: "/assets/images/products/women-7.jpg",
    hoverImage: "/assets/images/products/women-hover-7.jpg",
    type: "Tees",
    fabric: "Tomboy Cotton",
    color: "c9",
    size: ["XS", "S", "M", "L"],
    rating: 4,
    tag: null,
    availability: "Available"
  },
  {
    id: 508,
    gridCol: 'col-xl-3 col-lg-3 col-md-6 col-sm-6',
    name: "Tomboy Tee Cropped - Caramel",
    category: "t-shirts",
    price: 5784,
    image: "/assets/images/products/women-8.jpg",
    hoverImage: "/assets/images/products/women-hover-8.jpg",
    type: "Tees",
    fabric: "Coreflex",
    color: "c14",
    size: ["XS", "S", "M", "L", "XL"],
    rating: 5,
    tag: null,
    availability: "Available"
  },

  // Row 4: 4 cards in 1 row (Matching Screenshot 5)
  {
    id: 509,
    gridCol: 'col-xl-3 col-lg-3 col-md-6 col-sm-6',
    name: "Polar Sherpa Shirt Jacket",
    category: "Polar, t-shirts",
    price: 12728,
    image: "/assets/images/products/women-1.jpg",
    hoverImage: "/assets/images/products/women-hover-1.jpg",
    type: "Tees",
    fabric: "Cloud-Fleece",
    color: "c6",
    size: ["XS", "S", "M", "L"],
    rating: 5,
    tag: null,
    availability: "Available"
  },
  {
    id: 510,
    gridCol: 'col-xl-3 col-lg-3 col-md-6 col-sm-6',
    name: "Polartec® Sherpa 1/2 Zip",
    category: "Grey, Cabernet",
    price: 12169,
    image: "/assets/images/products/women-2.jpg",
    hoverImage: "/assets/images/products/women-hover-2.jpg",
    type: "Sweatshirts",
    fabric: "Thermopuff",
    color: "c9",
    size: ["S", "M", "L", "XL"],
    rating: 4,
    tag: null,
    availability: "Available"
  },
  {
    id: 511,
    gridCol: 'col-xl-3 col-lg-3 col-md-6 col-sm-6',
    name: "Almost Friday Tee Cropped",
    category: "Dune",
    price: 2924,
    image: "/assets/images/products/women-3.jpg",
    hoverImage: "/assets/images/products/women-hover-3.jpg",
    type: "Sweatshirts",
    fabric: "Cloud-Fleece",
    color: "c10",
    size: ["XS", "S", "M", "L"],
    rating: 5,
    tag: null,
    availability: "Available"
  },
  {
    id: 512,
    gridCol: 'col-xl-3 col-lg-3 col-md-6 col-sm-6',
    name: "Brown Tee Croped",
    category: "Sierra, t-shirts",
    price: 2946,
    image: "/assets/images/products/women-4.jpg",
    hoverImage: "/assets/images/products/women-hover-4.jpg",
    type: "Sweatshirts",
    fabric: "PYCA Pro",
    color: "c8",
    size: ["S", "M", "L", "XL"],
    rating: 5,
    tag: null,
    availability: "Available"
  },

  // Row 5: 4 cards in 1 row
  {
    id: 513,
    gridCol: 'col-xl-3 col-lg-3 col-md-6 col-sm-6',
    name: "Thermopuff Jacket",
    category: "Black, t-shirts",
    price: 15824,
    image: "/assets/images/products/women-5.jpg",
    hoverImage: "/assets/images/products/women-hover-5.jpg",
    type: "Tops",
    fabric: "Tomboy Cotton",
    color: "c2",
    size: ["XS", "S", "M", "L"],
    rating: 4,
    tag: null,
    availability: "Available"
  },
  {
    id: 514,
    gridCol: 'col-xl-3 col-lg-3 col-md-6 col-sm-6',
    name: "Almost Sunday Tee",
    category: "Catalogs, Haze",
    price: 3634,
    image: "/assets/images/products/women-6.jpg",
    hoverImage: "/assets/images/products/women-hover-6.jpg",
    type: "Tees",
    fabric: "Coreflex",
    color: "c10",
    size: ["XS", "S", "M", "L"],
    rating: 5,
    tag: null,
    availability: "Available"
  },
  {
    id: 515,
    gridCol: 'col-xl-3 col-lg-3 col-md-6 col-sm-6',
    name: "Tomboy Tee Cropped",
    category: "Catalogs, Haze",
    price: 2946,
    image: "/assets/images/products/women-7.jpg",
    hoverImage: "/assets/images/products/women-hover-7.jpg",
    type: "Sweatshirts",
    fabric: "Thermopuff",
    color: "c2",
    size: ["M", "L", "XL"],
    rating: 4,
    tag: null,
    availability: "Available"
  },
  {
    id: 516,
    gridCol: 'col-xl-3 col-lg-3 col-md-6 col-sm-6',
    name: "Tomboy Tee Cropped - Caramel",
    category: "t-shirts",
    price: 5784,
    image: "/assets/images/products/women-8.jpg",
    hoverImage: "/assets/images/products/women-hover-8.jpg",
    type: "Sweatshirts",
    fabric: "PYCA Pro",
    color: "c9",
    size: ["S", "M", "L", "XL"],
    rating: 5,
    tag: null,
    availability: "Available"
  },

  // Row 6: 4 cards in 1 row
  {
    id: 517,
    gridCol: 'col-xl-3 col-lg-3 col-md-6 col-sm-6',
    name: "Polar Sherpa Shirt Jacket",
    category: "Polar, t-shirts",
    price: 12728,
    image: "/assets/images/products/women-1.jpg",
    hoverImage: "/assets/images/products/women-hover-1.jpg",
    type: "Sherpas",
    fabric: "Cloud-Fleece",
    color: "c6",
    size: ["XS", "S", "M", "L"],
    rating: 5,
    tag: null,
    availability: "Available"
  },
  {
    id: 518,
    gridCol: 'col-xl-3 col-lg-3 col-md-6 col-sm-6',
    name: "Polartec® Sherpa 1/2 Zip",
    category: "Grey, Cabernet",
    price: 12169,
    image: "/assets/images/products/women-2.jpg",
    hoverImage: "/assets/images/products/women-hover-2.jpg",
    type: "Sweatshirts",
    fabric: "Thermopuff",
    color: "c13",
    size: ["S", "M", "L", "XL"],
    rating: 5,
    tag: null,
    availability: "Available"
  },
  {
    id: 519,
    gridCol: 'col-xl-3 col-lg-3 col-md-6 col-sm-6',
    name: "Almost Friday Tee Cropped",
    category: "Dune",
    price: 2924,
    image: "/assets/images/products/women-3.jpg",
    hoverImage: "/assets/images/products/women-hover-3.jpg",
    type: "Tees",
    fabric: "Coreflex",
    color: "c6",
    size: ["XS", "S", "M", "L"],
    rating: 4,
    tag: null,
    availability: "Available"
  },
  {
    id: 520,
    gridCol: 'col-xl-3 col-lg-3 col-md-6 col-sm-6',
    name: "Brown Tee Croped",
    category: "Sierra, t-shirts",
    price: 2946,
    image: "/assets/images/products/women-4.jpg",
    hoverImage: "/assets/images/products/women-hover-4.jpg",
    type: "Tops",
    fabric: "Tomboy Cotton",
    color: "c9",
    size: ["XS", "S", "M", "L"],
    rating: 5,
    tag: null,
    availability: "Available"
  }
];

const page2Items = [
  {
    id: 601,
    gridCol: 'col-xl-3 col-lg-3 col-md-6 col-sm-6',
    name: "Thermopuff Jacket",
    category: "Black, t-shirts",
    price: 15824,
    image: "/assets/images/products/women-5.jpg",
    hoverImage: "/assets/images/products/women-hover-5.jpg",
    type: "Outerwear",
    fabric: "Thermopuff",
    color: "c9",
    size: ["S", "M", "L", "XL"],
    rating: 5,
    availability: "Available"
  },
  {
    id: 602,
    gridCol: 'col-xl-3 col-lg-3 col-md-6 col-sm-6',
    name: "Almost Sunday Tee",
    category: "Catalogs, Haze",
    price: 3634,
    image: "/assets/images/products/women-6.jpg",
    hoverImage: "/assets/images/products/women-hover-6.jpg",
    type: "Tees",
    fabric: "PYCA Pro",
    color: "c6",
    size: ["XS", "S", "M", "L"],
    rating: 4,
    availability: "Available"
  },
  {
    id: 603,
    gridCol: 'col-xl-3 col-lg-3 col-md-6 col-sm-6',
    name: "Tomboy Tee Cropped",
    category: "Catalogs, Haze",
    price: 2946,
    image: "/assets/images/products/women-7.jpg",
    hoverImage: "/assets/images/products/women-hover-7.jpg",
    type: "Tees",
    fabric: "Tomboy Cotton",
    color: "c9",
    size: ["XS", "S", "M", "L"],
    rating: 4,
    availability: "Available"
  },
  {
    id: 604,
    gridCol: 'col-xl-3 col-lg-3 col-md-6 col-sm-6',
    name: "Tomboy Tee Cropped - Caramel",
    category: "t-shirts",
    price: 5784,
    image: "/assets/images/products/women-8.jpg",
    hoverImage: "/assets/images/products/women-hover-8.jpg",
    type: "Tees",
    fabric: "Coreflex",
    color: "c14",
    size: ["XS", "S", "M", "L", "XL"],
    rating: 5,
    availability: "Available"
  }
];

const page3Items = [
  {
    id: 701,
    gridCol: 'col-xl-3 col-lg-3 col-md-6 col-sm-6',
    name: "Polar Sherpa Shirt Jacket",
    category: "Polar, t-shirts",
    price: 12728,
    image: "/assets/images/products/women-1.jpg",
    hoverImage: "/assets/images/products/women-hover-1.jpg",
    type: "Sherpas",
    fabric: "Cloud-Fleece",
    color: "c6",
    size: ["XS", "S", "M", "L"],
    rating: 5,
    availability: "Available"
  },
  {
    id: 702,
    gridCol: 'col-xl-3 col-lg-3 col-md-6 col-sm-6',
    name: "Polartec® Sherpa 1/2 Zip",
    category: "Grey, Cabernet",
    price: 12169,
    image: "/assets/images/products/women-2.jpg",
    hoverImage: "/assets/images/products/women-hover-2.jpg",
    type: "Sweatshirts",
    fabric: "Thermopuff",
    color: "c13",
    size: ["S", "M", "L", "XL"],
    rating: 5,
    availability: "Available"
  },
  {
    id: 703,
    gridCol: 'col-xl-3 col-lg-3 col-md-6 col-sm-6',
    name: "Almost Friday Tee Cropped",
    category: "Dune",
    price: 2924,
    image: "/assets/images/products/women-3.jpg",
    hoverImage: "/assets/images/products/women-hover-3.jpg",
    type: "Tees",
    fabric: "Coreflex",
    color: "c6",
    size: ["XS", "S", "M", "L"],
    rating: 4,
    availability: "Available"
  },
  {
    id: 704,
    gridCol: 'col-xl-3 col-lg-3 col-md-6 col-sm-6',
    name: "Brown Tee Croped",
    category: "Sierra, t-shirts",
    price: 2946,
    image: "/assets/images/products/women-4.jpg",
    hoverImage: "/assets/images/products/women-hover-4.jpg",
    type: "Tops",
    fabric: "Tomboy Cotton",
    color: "c9",
    size: ["XS", "S", "M", "L"],
    rating: 5,
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

const ShopAllForWomen = () => {
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
  const [productSelectedSizes, setProductSelectedSizes] = useState({});

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
  const [hoveredCardId, setHoveredCardId] = useState(null);

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

    // Sort items
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
    const element = document.getElementById('shop-all-for-women-grid');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Sidebar Filter Component
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
    <div className="shop-all-for-women-page" id="shop-all-for-women-grid">
      {/* 1. Page Header Banner matching Screenshot 1 */}
      <div className="women-banner-area">
        <div className="container">
          <div className="women-banner-content">
            <h1 className="women-banner-title">Shop All For Women</h1>
            <ul className="women-breadcrumb">
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
              <li className="active">Shop All For Women</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 2. Main Shop Area with Sidebar & Product Grid */}
      <div className="women-shop-container pt-70 pb-100">
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
              {/* Top Controls Bar matching Screenshot 2 */}
              <div className="shop-top-controls d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
                <div className="left-controls d-flex align-items-center gap-3">
                  <h2 className="grid-heading m-0">Shop All For Women</h2>
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

              {/* Products & Promo Cards Grid (Matching Screenshots 2, 3, 4, 5) */}
              <div className="row g-4">
                {filteredItems.map((item, index) => {
                  /* PROMO BANNER 1 (Screenshot 2: Pink SUPER FASHION SALE UP TO 50% OFF) */
                  if (item.isPromo && item.promoType === 'super-sale') {
                    return (
                      <div key={`promo-super-sale-${index}`} className={item.gridCol || "col-xl-6 col-lg-6 col-md-12"}>
                        <div className="women-promo-card promo-super-fashion">
                          <div className="promo-pink-content">
                            <span className="promo-small-tag">SUPER</span>
                            <h3 className="promo-pink-title">FASHION<br />SALE!</h3>
                            <span className="promo-website">www.yourwebsite.com</span>
                            <span className="promo-dates">1 - 7 MAY</span>
                            <a
                              href="#shop-all-for-women"
                              className="btn-super-shop-now"
                              onClick={(e) => e.preventDefault()}
                            >
                              Shop Now <i className="bx bx-right-arrow-alt"></i>
                            </a>
                          </div>

                          <div className="promo-pink-center-badge">
                            <span className="up-to">UP TO</span>
                            <div className="discount-val">50<span className="pct">%</span></div>
                            <span className="off-label">OFF</span>
                          </div>

                          <div className="promo-pink-img">
                            <img src={item.image} alt="Super Fashion Sale" />
                          </div>
                        </div>
                      </div>
                    );
                  }

                  /* PROMO BANNER 2 (Screenshot 2: FOR ONLINE ORDER 30% OFF) */
                  if (item.isPromo && item.promoType === 'online-order-women') {
                    return (
                      <div key={`promo-online-order-${index}`} className={item.gridCol || "col-xl-6 col-lg-6 col-md-12"}>
                        <div className="women-promo-card promo-online-order-card">
                          <div className="promo-order-text">
                            <span className="promo-tag">FOR</span>
                            <h4 className="promo-bold-title">ONLINE<br />ORDER</h4>
                            <div className="promo-discount-num">30%</div>
                            <div className="promo-discount-off">OFF</div>
                          </div>
                          <div className="promo-order-img">
                            <img src={item.image} alt="Women Collection 30% Off" />
                          </div>
                        </div>
                      </div>
                    );
                  }

                  /* REGULAR WOMEN PRODUCT CARD */
                  const isWishlist = isItemInWishlist(item.id);
                  const isHovered = hoveredCardId === item.id;
                  const displayImage = isHovered && item.hoverImage ? item.hoverImage : item.image;

                  return (
                    <div key={item.id} className={item.gridCol || "col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12"}>
                      <div
                        className="ts-women-card-item"
                        onMouseEnter={() => setHoveredCardId(item.id)}
                        onMouseLeave={() => setHoveredCardId(null)}
                      >
                        {/* Image & Badges Box */}
                        <div className="women-card-media">
                          <a
                            href="#shop"
                            onClick={(e) => {
                              e.preventDefault();
                              handleQuickAdd(item, 'M');
                            }}
                          >
                            <img
                              src={displayImage}
                              alt={item.name}
                              loading="lazy"
                              className={isHovered && item.hoverImage ? 'is-hover-img' : ''}
                            />
                          </a>

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

                          {/* Quick Add Button - shown on hover (matching Screenshot 5) */}
                          <div className={`card-quick-add-overlay ${isHovered ? 'visible' : ''}`}>
                            <button
                              type="button"
                              className="card-quick-add-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleQuickAdd(item, 'M');
                              }}
                            >
                              + Quick Add
                            </button>
                          </div>
                        </div>

                        {/* Product Info */}
                        <div className="women-card-content">
                          <h3 className="product-name">
                            <a
                              href="#shop"
                              onClick={(e) => {
                                e.preventDefault();
                                handleQuickAdd(item, 'M');
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

              {/* Pagination matching Screenshot 7 */}
              <div className="women-pagination-area text-center mt-5">
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

export default ShopAllForWomen;
