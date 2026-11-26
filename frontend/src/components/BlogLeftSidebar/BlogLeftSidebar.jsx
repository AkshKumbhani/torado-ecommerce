import React, { useState, useEffect, useMemo } from 'react';
import './BlogLeftSidebar.css';
import { useShop } from '../../context/ShopContext.jsx';

const allBlogArticles = [
  // Page 1 - Row 1
  {
    id: 1,
    image: '/assets/images/blog/blog1.jpg',
    date: 'Dec 04, 2025',
    category: 'Women',
    tag: 'T-shirts',
    trend: 'Trend',
    title: 'How to choose the best t-shirts of women to carry with Western Outfit',
    author: 'Admin'
  },
  {
    id: 2,
    image: '/assets/images/blog/blog2.jpg',
    date: 'Dec 04, 2025',
    category: 'Women',
    tag: 'T-shirts',
    trend: 'Trend',
    title: 'Where to buy the best winter collection for women in 2025 at a reasonable price',
    author: 'Admin'
  },
  {
    id: 3,
    image: '/assets/images/blog/blog3.jpg',
    date: 'Dec 04, 2025',
    category: 'Women',
    tag: 'T-shirts',
    trend: 'Trend',
    title: 'The best fall collection 2025 for women to buy in this year',
    author: 'Admin'
  },

  // Page 1 - Row 2
  {
    id: 4,
    image: '/assets/images/blog/blog4.jpg',
    date: 'Dec 04, 2025',
    category: 'Man',
    tag: 'T-shirts',
    trend: 'Trend',
    title: 'Where to buy the best winter collection for men in 2025 at a reasonable price',
    author: 'Admin'
  },
  {
    id: 5,
    image: '/assets/images/blog/blog5.jpg',
    date: 'Dec 04, 2025',
    category: 'Women',
    tag: 'T-shirts',
    trend: 'Trend',
    title: 'How Torado helps women to find their best fitted t-shirts in few minutes',
    author: 'Admin'
  },
  {
    id: 6,
    image: '/assets/images/blog/blog6.jpg',
    date: 'Dec 04, 2025',
    category: 'Women',
    tag: 'T-shirts',
    trend: 'Trend',
    title: 'The best fall collection 2025 for women to buy in this year',
    author: 'Admin'
  },

  // Page 1 - Row 3
  {
    id: 7,
    image: '/assets/images/blog/blog7.jpg',
    date: 'Dec 04, 2025',
    category: 'Women',
    tag: 'T-shirts',
    trend: 'Trend',
    title: 'How to choose the best t-shirts of women to carry with Western Outfit',
    author: 'Admin'
  },
  {
    id: 8,
    image: '/assets/images/blog/blog8.jpg',
    date: 'Dec 04, 2025',
    category: 'Women',
    tag: 'T-shirts',
    trend: 'Trend',
    title: 'The best fall collection 2025 for women to buy in this year',
    author: 'Admin'
  },
  {
    id: 9,
    image: '/assets/images/blog/blog9.jpg',
    date: 'Dec 04, 2025',
    category: 'Women',
    tag: 'T-shirts',
    trend: 'Trend',
    title: 'Where to buy the best winter collection for women in 2025 at a reasonable price',
    author: 'Admin'
  }
];

const categoriesData = [
  { name: 'Tops', count: 32 },
  { name: 'Tees', count: 63 },
  { name: 'Tanks', count: 113 },
  { name: 'Sweatshirts', count: 223 },
  { name: 'New Releases', count: 19 },
  { name: 'Sherpas', count: 111 },
  { name: 'Outerwear', count: 3 },
  { name: 'Winter 2025', count: 41 },
  { name: 'Best Sellers', count: 21 }
];

const latestArticlesData = [
  {
    id: 'latest-1',
    image: '/assets/images/blog/blog1.jpg',
    date: 'Jul 30, 2025',
    title: 'The next generation of mobile alternatives'
  },
  {
    id: 'latest-2',
    image: '/assets/images/blog/blog2.jpg',
    date: 'Jul 30, 2025',
    title: 'As people move out of big cities, fashion retail follows'
  },
  {
    id: 'latest-3',
    image: '/assets/images/blog/blog4.jpg',
    date: 'Jul 30, 2025',
    title: 'Where to buy the best winter collection 2025 for women'
  }
];

const popularTags = [
  "Levi's",
  'Sale',
  'Trendy',
  'Television',
  'Jack & Jones',
  'Louis Philippe',
  'Mufti',
  'Fila'
];

const BlogLeftSidebar = () => {
  const { setCurrentPage } = useShop();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);
  const [sortBy, setSortBy] = useState('default');
  const [currentPageNum, setCurrentPageNum] = useState(1);

  // Accordions toggle state
  const [categoriesOpen, setCategoriesOpen] = useState(true);
  const [latestOpen, setLatestOpen] = useState(true);
  const [tagsOpen, setTagsOpen] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const navigateTo = (page, hash = '') => {
    setCurrentPage(page);
    if (hash) {
      window.location.hash = hash;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter and sort articles
  const filteredArticles = useMemo(() => {
    let list = [...allBlogArticles];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.tag.toLowerCase().includes(q)
      );
    }

    if (selectedCategory) {
      list = list.filter(a =>
        a.tag.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        a.category.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    if (selectedTag) {
      list = list.filter(a =>
        a.tag.toLowerCase().includes(selectedTag.toLowerCase()) ||
        a.title.toLowerCase().includes(selectedTag.toLowerCase())
      );
    }

    if (sortBy === 'title-asc') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'title-desc') {
      list.sort((a, b) => b.title.localeCompare(a.title));
    }

    return list;
  }, [searchQuery, selectedCategory, selectedTag, sortBy]);

  const handlePageChange = (num) => {
    setCurrentPageNum(num);
    const el = document.getElementById('blog-main-grid');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="torado-blog-page">
      {/* 1. Page Banner Area */}
      <div className="ts-page-banner-area">
        <div className="container">
          <div className="ts-page-banner-content text-center">
            <h2>Blog Left Sidebar</h2>
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
              <li className="active">Blog Left Sidebar</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 2. Main Blog Area with Left Sidebar & Grid */}
      <div className="ts-blog-area pt-100 pb-100" id="blog-main-grid">
        <div className="container-fluid">
          <div className="row">
            {/* Left Sidebar Widgets */}
            <div className="col-xl-3 col-lg-4 col-md-12">
              <aside className="ts-blog-widget-area">
                {/* Search Widget */}
                <div className="widget-search-form">
                  <form onSubmit={(e) => e.preventDefault()}>
                    <input
                      type="text"
                      className="search-field"
                      placeholder="Search articles..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit" aria-label="Search">
                      <i className="bx bx-search"></i>
                    </button>
                  </form>
                </div>

                {/* Categories Widget */}
                <div className="collapse-widget">
                  <div
                    className={`collapse-widget-title ${categoriesOpen ? 'active' : ''}`}
                    onClick={() => setCategoriesOpen(!categoriesOpen)}
                  >
                    <span>Categories</span>
                    <i className={`bx ${categoriesOpen ? 'bx-chevron-up' : 'bx-chevron-down'}`}></i>
                  </div>
                  {categoriesOpen && (
                    <div className="widget_categories">
                      <ul className="list">
                        {categoriesData.map((cat, idx) => (
                          <li key={idx}>
                            <a
                              href="#category"
                              className={selectedCategory === cat.name ? 'active-cat' : ''}
                              onClick={(e) => {
                                e.preventDefault();
                                setSelectedCategory(selectedCategory === cat.name ? null : cat.name);
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

                {/* Latest Articles Widget */}
                <div className="collapse-widget">
                  <div
                    className={`collapse-widget-title ${latestOpen ? 'active' : ''}`}
                    onClick={() => setLatestOpen(!latestOpen)}
                  >
                    <span>Latest Articles</span>
                    <i className={`bx ${latestOpen ? 'bx-chevron-up' : 'bx-chevron-down'}`}></i>
                  </div>
                  {latestOpen && (
                    <div className="widget_post">
                      {latestArticlesData.map((post) => (
                        <div className="item d-flex align-items-center" key={post.id}>
                          <a href="#article" onClick={(e) => e.preventDefault()} className="thumb">
                            <img src={post.image} alt={post.title} className="thumb-img" />
                          </a>
                          <div className="info">
                            <span>{post.date}</span>
                            <h4 className="title">
                              <a href="#article" onClick={(e) => e.preventDefault()}>{post.title}</a>
                            </h4>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Tags Widget */}
                <div className="collapse-widget">
                  <div
                    className={`collapse-widget-title ${tagsOpen ? 'active' : ''}`}
                    onClick={() => setTagsOpen(!tagsOpen)}
                  >
                    <span>Tags</span>
                    <i className={`bx ${tagsOpen ? 'bx-chevron-up' : 'bx-chevron-down'}`}></i>
                  </div>
                  {tagsOpen && (
                    <div className="widget_popular_tags">
                      <ul className="tags-list">
                        {popularTags.map((tg, idx) => (
                          <li key={idx}>
                            <a
                              href="#tag"
                              className={selectedTag === tg ? 'active-tag' : ''}
                              onClick={(e) => {
                                e.preventDefault();
                                setSelectedTag(selectedTag === tg ? null : tg);
                              }}
                            >
                              {tg}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </aside>
            </div>

            {/* Right Blog Content Grid */}
            <div className="col-xl-9 col-lg-8 col-md-12">
              {/* Top Sorting Bar */}
              <div className="ts-blog-sorting-box d-flex align-items-center justify-content-between flex-wrap gap-3">
                <h3>All Articles</h3>
                <div className="ts-sorting-right d-flex align-items-center justify-content-end gap-3 flex-wrap">
                  <span className="results-count">
                    Showing <b>1-{filteredArticles.length}</b> of <b>53</b> results
                  </span>
                  <div className="sorting-select">
                    <select
                      className="form-select"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="default">Default Sorting</option>
                      <option value="title-asc">Title: A to Z</option>
                      <option value="title-desc">Title: Z to A</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 3x3 Articles Grid */}
              <div className="row">
                {filteredArticles.map((art) => (
                  <div key={art.id} className="col-xl-4 col-lg-6 col-md-6 col-sm-6 mb-4">
                    <div className="ts-blog-card">
                      <div className="blog-image">
                        <a
                          href="#single-blog"
                          onClick={(e) => { e.preventDefault(); navigateTo('single-blog', '#single-blog'); }}
                        >
                          <img src={art.image} alt={art.title} className="main-blog-img" />
                        </a>
                        <span className="date">{art.date}</span>
                      </div>
                      <div className="blog-content">
                        <ul className="meta">
                          <li><a href="#category" onClick={(e) => e.preventDefault()}>{art.category}</a></li>
                          <li><a href="#tag" onClick={(e) => e.preventDefault()}>{art.tag}</a></li>
                          <li><a href="#trend" onClick={(e) => e.preventDefault()}>{art.trend}</a></li>
                        </ul>
                        <h3>
                          <a
                            href="#single-blog"
                            onClick={(e) => { e.preventDefault(); navigateTo('single-blog', '#single-blog'); }}
                          >
                            {art.title}
                          </a>
                        </h3>
                        <a
                          href="#single-blog"
                          onClick={(e) => { e.preventDefault(); navigateTo('single-blog', '#single-blog'); }}
                          className="blog-btn"
                        >
                          + Read More
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="pagination-area text-center mt-4">
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
                  disabled={currentPageNum === 3}
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

export default BlogLeftSidebar;