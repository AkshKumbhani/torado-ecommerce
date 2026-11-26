import React, { useState, useEffect } from "react";
import "./SingleBlog.css";
import { useShop } from "../../context/ShopContext.jsx";

const initialComments = [
  {
    id: 1,
    name: "Adam Smith",
    date: "Jul 15, 2025",
    text: "It's really a pleasure to shop with Torado mart. The product is 100% okay. They also provide 1 year warranty. I am really satisfied with their service.",
    reply: {
      name: "Torado Mart",
      text: "Congratulations on your recent purchase! It has been our pleasure to serve you, and we hope we see you again soon.",
    },
  },
  {
    id: 2,
    name: "Jane Ronan",
    date: "Dec 11, 2025",
    text: "I think it's hard to find other shop that has this kind of quality. It's really a pleasure to shop with Torado mart. The product is 100% okay. They also provide 1 year warranty. I am really satisfied with their service.",
    reply: null,
  },
  {
    id: 3,
    name: "Bratt Pinkman",
    date: "Mar 21, 2025",
    text: "My purchase wasn't that good. I am not satisfied with the packaging also they forgot to give me the warranty card with the product. otherwise the product was quite good.",
    reply: null,
  },
];

const SingleBlog = ({ article }) => {
  const { setCurrentPage } = useShop();
  const [comments, setComments] = useState(initialComments);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const post = article || {
    id: 2,
    image: "/assets/images/blog/blog3.jpg",
    date: "Dec 04, 2025",
    category: "Women",
    tag: "T-shirts",
    trend: "Trend",
    title: "Where to buy the best winter collection for women in 2025 at a reasonable price",
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const navigateTo = (page, hash) => {
    setCurrentPage(page);
    if (hash) window.location.hash = hash;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    if (!form.message.trim()) e.message = "Comment is required";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setComments((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: form.name,
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
        text: form.message,
        reply: null,
      },
    ]);
    setForm({ name: "", email: "", message: "" });
    setErrors({});
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="torado-single-blog-page">
      {/* 1. Page Banner */}
      <div className="tsb-page-banner">
        <div className="container">
          <div className="tsb-page-banner-content text-center">
            <h2><span>Single</span> Blog</h2>
            <ul className="breadcrumb-list">
              <li>
                <a href="#home" onClick={(e) => { e.preventDefault(); navigateTo("home", "#home"); }}>
                  Home
                </a>
              </li>
              <li className="sep">&gt;&gt;</li>
              <li className="active">Single Blog</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 2. Single Blog Area */}
      <div className="tsb-detail-area pt-100 pb-100">
        <div className="container">

          {/* Hero Image */}
          <div className="tsb-hero-image">
            <img src={post.image} alt={post.title} />
            <span className="tsb-date-badge">{post.date}</span>
          </div>

          {/* Meta + Title */}
          <div className="tsb-header">
            <ul className="tsb-meta">
              <li><a href="#cat" onClick={(e) => e.preventDefault()}>{post.category}</a></li>
              <li><a href="#tag" onClick={(e) => e.preventDefault()}>{post.tag}</a></li>
              <li><a href="#trend" onClick={(e) => e.preventDefault()}>{post.trend}</a></li>
            </ul>
            <h2>{post.title}</h2>
          </div>

          {/* Article Body */}
          <div className="tsb-body">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quam donec amet, lectus ut fusce. Risus, praesent et aliquet vehicula ornare. Interdum non viverra cursus quis id diam phasellus ultrices. At odio nibh vitae quisque elementum tincidunt id gravida vel.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quam donec amet, lectus ut fusce. Risus, praesent et aliquet vehicula ornare. Interdum non viverra cursus quis id diam phasellus ultrices.</p>

            {/* Blockquote */}
            <div className="tsb-blockquote">
              <div className="tsb-quote-icon">
                <i className="bx bxs-quote-alt-right"></i>
              </div>
              <p>Smart people learn from everything and everyone, average people from their experiences, stupid people already have all the answers.</p>
              <footer>— Socrates</footer>
            </div>

            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Diam posuere auctor non pellentesque por volutpat varius pellentesque. Id consequat, aliquam, lorem ac aliquam sed nibh. Lacus ndum tristique tore urna etiam in nunc nunc. Morbi egestas elit sed vitae ullamcorper nisi odio.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Diam posuere auctor non pellentesque por volutpat varius pellentesque. Id consequat, aliquam, lorem ac aliquam sed nibh.</p>

            {/* Dual Gallery Images */}
            <div className="tsb-dual-images">
              <div className="row g-3">
                <div className="col-md-6">
                  <img src="/assets/images/blog/blog2.jpg" alt="Fashion winter collection" />
                </div>
                <div className="col-md-6">
                  <img src="/assets/images/blog/blog6.jpg" alt="Fashion fall collection" />
                </div>
              </div>
            </div>

            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quam donec amet, lectus ut fusce. Risus, praesent et aliquet vehicula ornare. Interdum non viverra cursus quis id diam phasellus ultrices. At odio nibh vitae quisque elementum tincidunt id gravida vel diam phasellus ultrices.</p>
          </div>

          {/* Share Bar */}
          <div className="tsb-share-bar">
            <hr />
            <div className="tsb-share-inner">
              <h4>Share The Article</h4>
              <ul className="tsb-share-icons">
                <li><a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><i className="bx bxl-facebook"></i></a></li>
                <li><a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter"><i className="bx bxl-twitter"></i></a></li>
                <li><a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube"><i className="bx bxl-youtube"></i></a></li>
                <li><a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><i className="bx bxl-instagram"></i></a></li>
              </ul>
            </div>
          </div>

          {/* Prev / Next Nav */}
          <div className="tsb-prev-next">
            <div className="row align-items-center">
              <div className="col-6">
                <div className="tsb-nav-article tsb-prev" onClick={() => navigateTo("blog-left-sidebar", "#blog-left-sidebar")}>
                  <span className="tsb-nav-label"><i className="bx bx-arrow-back"></i> Previous Article</span>
                  <div className="tsb-nav-inner">
                    <img src="/assets/images/blog/blog1.jpg" alt="prev article" />
                    <div>
                      <span className="tsb-nav-date">Jul 30, 2025</span>
                      <p>The next generation of mobile alternatives</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="tsb-nav-article tsb-next text-end" onClick={() => navigateTo("blog-left-sidebar", "#blog-left-sidebar")}>
                  <span className="tsb-nav-label">Next Article <i className="bx bx-right-arrow-alt"></i></span>
                  <div className="tsb-nav-inner justify-content-end">
                    <div className="text-end">
                      <span className="tsb-nav-date">Jul 30, 2025</span>
                      <p>The post-pandemic consumer is embracing</p>
                    </div>
                    <img src="/assets/images/blog/blog2.jpg" alt="next article" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Comments */}
          <div className="tsb-comments">
            <h3>{String(comments.length).padStart(2, "0")} Comments</h3>
            <div className="tsb-comments-list">
              {comments.map((c) => (
                <div key={c.id} className="tsb-comment-item">
                  <div className="tsb-comment-head">
                    <div>
                      <span className="tsb-commenter-name">{c.name}</span>
                      <span className="tsb-comment-date">{c.date}</span>
                    </div>
                    <button type="button" className="tsb-reply-btn">Reply</button>
                  </div>
                  <p className="tsb-comment-text">{c.text}</p>
                  {c.reply && (
                    <div className="tsb-comment-reply">
                      <strong>- {c.reply.name}</strong>
                      <p>{c.reply.text}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Post a Comment */}
          <div className="tsb-post-comment">
            <h3>Post a comment</h3>
            {submitted && <div className="tsb-success-msg">Your comment has been submitted!</div>}
            <form onSubmit={handleSubmit} noValidate>
              <div className="tsb-form-group">
                <label htmlFor="cmt-name">Name <span className="req">*</span></label>
                <input
                  type="text" id="cmt-name" placeholder="Your name"
                  className={errors.name ? "error" : ""}
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                />
                {errors.name && <span className="tsb-error">{errors.name}</span>}
              </div>
              <div className="tsb-form-group">
                <label htmlFor="cmt-email">Email <span className="req">*</span></label>
                <input
                  type="email" id="cmt-email" placeholder="Email address"
                  className={errors.email ? "error" : ""}
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                />
                {errors.email && <span className="tsb-error">{errors.email}</span>}
              </div>
              <div className="tsb-form-group">
                <label htmlFor="cmt-msg">Write Your Comment Here <span className="req">*</span></label>
                <textarea
                  id="cmt-msg" rows="6" placeholder="Write your comment"
                  className={errors.message ? "error" : ""}
                  value={form.message}
                  onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                ></textarea>
                {errors.message && <span className="tsb-error">{errors.message}</span>}
              </div>
              <button type="submit" className="ts-default-btn tsb-submit-btn">
                Post A Comment <i className="bx bx-right-arrow-alt"></i>
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SingleBlog;