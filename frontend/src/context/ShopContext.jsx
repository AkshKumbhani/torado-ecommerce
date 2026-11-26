import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ShopContext = createContext();

export const resolvePageFromUrl = () => {
  if (typeof window === 'undefined') return 'home';
  const hash = window.location.hash.toLowerCase();
  const path = window.location.pathname.toLowerCase();
  const combined = `${path} ${hash}`;

  if (combined.includes('track-my-order') || combined.includes('track')) return 'track-my-order';
  if (combined.includes('checkout-payment') || hash === '#payment') return 'checkout-payment';
  if (combined.includes('checkout-shipping') || hash === '#shipping') return 'checkout-shipping';
  if (combined.includes('checkout-information') || hash === '#checkout' || combined.includes('checkout')) return 'checkout-information';
  if (combined.includes('wishlist')) return 'wishlist';
  if (combined.includes('cart')) return 'cart';
  if (combined.includes('shop-left-sidebar') || combined.includes('collections')) return 'shop-left-sidebar';
  if (combined.includes('search-result')) return 'search-result';
  if (combined.includes('404') || combined.includes('error')) return '404';
  if (combined.includes('privacy')) return 'privacy-policy';
  if (combined.includes('terms')) return 'terms-condition';
  if (combined.includes('refund') || combined.includes('return')) return 'refund-return-policy';
  if (combined.includes('login')) return 'login';
  if (combined.includes('register')) return 'register';
  if (combined.includes('faq')) return 'faq';
  if (combined.includes('contact')) return 'contact-us';
  if (combined.includes('single-blog')) return 'single-blog';
  if (combined.includes('blog')) return 'blog-left-sidebar';
  if (combined.includes('about')) return 'about-us';
  if (combined.includes('shop-all-for-women') || combined.includes('women')) return 'shop-all-for-women';
  if (combined.includes('shop-all-for-men') || combined.includes('men')) return 'shop-all-for-men';
  if (combined.includes('shop-hidden-sidebar') || hash === '#shop') return 'shop-hidden-sidebar';
  return 'home';
};

export const ShopProvider = ({ children }) => {
  // Navigation / Page state
  const [currentPage, setCurrentPage] = useState(() => resolvePageFromUrl());

  // Listen to both hashchange and popstate events
  useEffect(() => {
    const handleUrlChange = () => {
      const target = resolvePageFromUrl();
      setCurrentPage(target);
    };
    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('popstate', handleUrlChange);
    return () => {
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

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
