import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  // Navigation / Page state
  const [currentPage, setCurrentPage] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      const path = window.location.pathname;
      if (hash.includes('track-my-order') || hash.includes('track') || path.includes('track-my-order')) {
        return 'track-my-order';
      }
      if (hash.includes('checkout-payment') || hash === '#payment' || path.includes('checkout-payment')) {
        return 'checkout-payment';
      }
      if (hash.includes('checkout-shipping') || hash === '#shipping' || path.includes('checkout-shipping')) {
        return 'checkout-shipping';
      }
      if (hash.includes('checkout-information') || hash.includes('checkout') || path.includes('checkout')) {
        return 'checkout-information';
      }
      if (hash.includes('wishlist') || path.includes('wishlist')) {
        return 'wishlist';
      }
      if (hash.includes('cart') || path.includes('cart')) {
        return 'cart';
      }
      if (hash.includes('shop-left-sidebar') || hash.includes('collections') || path.includes('shop-left-sidebar')) {
        return 'shop-left-sidebar';
      }
      if (hash.includes('search-result') || path.includes('search-result')) {
        return 'search-result';
      }
      if (hash.includes('404') || hash.includes('error') || path.includes('404')) {
        return '404';
      }
      if (hash.includes('privacy') || path.includes('privacy-policy')) {
        return 'privacy-policy';
      }
      if (hash.includes('terms') || path.includes('terms-condition')) {
        return 'terms-condition';
      }
      if (hash.includes('refund') || hash.includes('return') || path.includes('refund-return-policy')) {
        return 'refund-return-policy';
      }
      if (hash.includes('login') || path.includes('login')) {
        return 'login';
      }
      if (hash.includes('register') || path.includes('register')) {
        return 'register';
      }
      if (hash.includes('faq') || path.includes('faq')) {
        return 'faq';
      }
      if (hash.includes('contact-us') || path.includes('contact')) {
        return 'contact-us';
      }
      if (hash.includes('single-blog') || path.includes('single-blog')) {
        return 'single-blog';
      }
      if (hash.includes('blog-left-sidebar') || path.includes('blog')) {
        return 'blog-left-sidebar';
      }
      if (hash.includes('about') || path.includes('about')) {
        return 'about-us';
      }
      if (hash.includes('shop-all-for-women') || hash.includes('womens') || hash === '#women' || path.includes('shop-all-for-women')) {
        return 'shop-all-for-women';
      }
      if (hash.includes('shop-all-for-men') || hash.includes('mens') || hash === '#men' || path.includes('shop-all-for-men')) {
        return 'shop-all-for-men';
      }
      if (hash.includes('shop-hidden-sidebar') || path.includes('shop-hidden-sidebar') || hash === '#shop') {
        return 'shop-hidden-sidebar';
      }
      if (hash === '#home') {
        return 'home';
      }
    }
    return 'home'; // Default page
  });

  // Modal states
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // User auth state (from localStorage or sessionStorage)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('torado_user') || sessionStorage.getItem('torado_user');
      const parsed = saved ? JSON.parse(saved) : null;
      if (parsed) {
        return {
          id: parsed.id,
          name: parsed.name,
          email: parsed.email,
          phone: parsed.phone || '',
          address: parsed.address || '',
          city: parsed.city || '',
          state: parsed.state || '',
          country: parsed.country || 'India',
          postalCode: parsed.postalCode || parsed.postal_code || '',
          postal_code: parsed.postal_code || parsed.postalCode || '',
          role: parsed.role || 'customer'
        };
      }
      return null;
    } catch {
      return null;
    }
  });

  const logout = () => {
    localStorage.removeItem('torado_user');
    localStorage.removeItem('torado_token');
    sessionStorage.removeItem('torado_user');
    sessionStorage.removeItem('torado_token');
    setCurrentUser(null);
    setIsLoginOpen(false);
  };

  // Cart state persisted to localStorage
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('torado_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('torado_cart', JSON.stringify(cartItems));
    } catch {}
  }, [cartItems]);

  // Wishlist state persisted to localStorage
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const saved = localStorage.getItem('torado_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('torado_wishlist', JSON.stringify(wishlistItems));
    } catch {}
  }, [wishlistItems]);

  // Cart Operations
  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id && item.size === (product.size || 'M'));
      if (existing) {
        return prev.map(item =>
          item.id === product.id && item.size === (product.size || 'M')
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image || "/assets/images/cart/cart-1.jpg",
        color: product.color || "Purple",
        size: product.size || "M"
      }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id, delta) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  // Wishlist Operations
  const addToWishlist = (product) => {
    setWishlistItems(prev => {
      if (prev.find(item => item.id === product.id)) return prev;
      return [...prev, {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image || "/assets/images/wishlist/wishlist-1.jpg",
        color: product.color || "Purple",
        size: product.size || "M",
        inStock: true
      }];
    });
    setIsWishlistOpen(true);
  };

  const removeFromWishlist = (id) => {
    setWishlistItems(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  React.useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.includes('track-my-order') || hash === '#track-my-order' || hash === '#track') {
        setCurrentPage('track-my-order');
      } else if (hash.includes('checkout-payment') || hash === '#checkout-payment' || hash === '#payment') {
        setCurrentPage('checkout-payment');
      } else if (hash.includes('checkout-shipping') || hash === '#checkout-shipping' || hash === '#shipping') {
        setCurrentPage('checkout-shipping');
      } else if (hash.includes('checkout-information') || hash === '#checkout-information' || hash === '#checkout') {
        setCurrentPage('checkout-information');
      } else if (hash.includes('wishlist') || hash === '#wishlist') {
        setCurrentPage('wishlist');
      } else if (hash.includes('cart') || hash === '#cart') {
        setCurrentPage('cart');
      } else if (hash.includes('about') || hash === '#about' || hash === '#about-us') {
        setCurrentPage('about-us');
      } else if (hash.includes('shop-all-for-women') || hash.includes('womens') || hash === '#women') {
        setCurrentPage('shop-all-for-women');
      } else if (hash.includes('shop-all-for-men') || hash.includes('mens') || hash === '#men') {
        setCurrentPage('shop-all-for-men');
      } else if (hash.includes('shop-hidden-sidebar') || hash === '#shop') {
        setCurrentPage('shop-hidden-sidebar');
      } else if (hash === '#home' || hash === '' || hash === '#') {
        if (hash === '#home') setCurrentPage('home');
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Product Status state from Backend
  const [productStatuses, setProductStatuses] = useState(() => {
    try {
      const cached = localStorage.getItem('torado_product_statuses');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  const refreshProductStatus = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:3000/api/store/product-status');
      if (res.ok) {
        const data = await res.json();
        setProductStatuses(data);
        localStorage.setItem('torado_product_statuses', JSON.stringify(data));
      }
    } catch {
      // offline fallback
    }
  }, []);

  useEffect(() => {
    refreshProductStatus();
    const handleUpdate = () => refreshProductStatus();
    window.addEventListener('torado_products_changed', handleUpdate);
    window.addEventListener('focus', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('torado_products_changed', handleUpdate);
      window.removeEventListener('focus', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [refreshProductStatus]);

  const isProductActive = useCallback((prod) => {
    if (!prod || prod.isPromo) return true;
    if (!productStatuses || !productStatuses.length) return true;

    // Match by image, id, or name
    const prodImg = (prod.image || prod.img1 || '').toLowerCase();
    const prodImgFile = prodImg ? prodImg.split('/').pop() : '';
    const prodName = (prod.name || '').trim().toLowerCase();

    const match = productStatuses.find((p) => {
      const dbImg = (p.image_url || '').toLowerCase();
      const dbImgFile = dbImg ? dbImg.split('/').pop() : '';
      const dbName = (p.name || '').trim().toLowerCase();

      if (prodImg && dbImg && (prodImg === dbImg || (prodImgFile && prodImgFile === dbImgFile))) return true;
      if (prodName && dbName && prodName === dbName) return true;
      if (prod.id && p.id && Number(prod.id) === Number(p.id)) return true;
      return false;
    });

    if (match) {
      return match.status === 'active' || match.status === 'Active';
    }
    return true;
  }, [productStatuses]);

  return (
    <ShopContext.Provider value={{
      currentPage, setCurrentPage,
      isSearchOpen, setIsSearchOpen,
      isLoginOpen, setIsLoginOpen,
      isWishlistOpen, setIsWishlistOpen,
      isCartOpen, setIsCartOpen,
      currentUser, setCurrentUser, logout,
      cartItems, addToCart, updateQuantity, removeFromCart, subtotal,
      wishlistItems, addToWishlist, removeFromWishlist,
      productStatuses, refreshProductStatus, isProductActive
    }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);