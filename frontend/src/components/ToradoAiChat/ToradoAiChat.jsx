import React, { useState, useRef, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import API_BASE from '../../config/api';
import './ToradoAiChat.css';

export default function ToradoAiChat() {
  const { addToCart, setIsCartOpen, setCurrentPage } = useShop();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const [messages, setMessages] = useState([
    {
      id: 'init-1',
      sender: 'ai',
      text: "👋 Hi there! I'm **Torado AI**, your personal shopping assistant.\n\nAsk me anything — finding trending tees, checking size availability, tracking your delivery, or discovering active discount codes! ✨",
      time: 'Just now'
    }
  ]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen, messages]);

  const handleSendMessage = async (textToSend = null) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMsgId = 'u-' + Date.now();
    const userMsg = {
      id: userMsgId,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-4).map((m) => ({ role: m.sender, content: m.text }))
        })
      });

      const data = await res.json();
      const aiMsg = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        text: data.reply || "I'm here to help! Could you please specify your query?",
        recommendations: data.recommendations || [],
        action: data.action,
        order: data.order,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
      if (!isOpen) setHasUnread(true);
    } catch (err) {
      console.error('[ToradoAiChat] Error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: 'ai-err-' + Date.now(),
          sender: 'ai',
          text: "I'm having a brief connection update. Please try asking again in a moment!",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickChip = (chipText) => {
    handleSendMessage(chipText);
  };

  const handleAddToCart = (product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.image_url || '/assets/images/products/women-8.jpg',
      size: 'M',
      quantity: 1
    });
    setToastMsg(`Added "${product.name}" to cart! 🛍️`);
    setTimeout(() => setToastMsg(''), 2500);
  };

  const handleTrackOrderClick = () => {
    setCurrentPage('track-my-order');
    window.location.hash = '#track-my-order';
    setIsOpen(false);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'init-' + Date.now(),
        sender: 'ai',
        text: "Conversation cleared! How else can I assist your shopping today? ✨",
        time: 'Just now'
      }
    ]);
  };

  // Format markdown bold (**text**) and bullet points
  const renderFormattedText = (raw = '') => {
    return raw.split('\n').map((line, idx) => {
      // Bold replacement
      const parts = line.split(/(\*\*.*?\*\*|\`.*?\`)/g);
      const renderedParts = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={pIdx}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return <code key={pIdx} className="tai-code">{part.slice(1, -1)}</code>;
        }
        return part;
      });

      return (
        <span key={idx} className="tai-text-line">
          {renderedParts}
          {idx < raw.split('\n').length - 1 && <br />}
        </span>
      );
    });
  };

  return (
    <aside className="tai-container" aria-label="Torado AI Shopping Assistant">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="tai-toast-banner" role="status">
          <span>{toastMsg}</span>
          <button
            type="button"
            className="tai-toast-view-cart"
            onClick={() => { setIsCartOpen(true); setToastMsg(''); }}
          >
            View Cart →
          </button>
        </div>
      )}

      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          type="button"
          className="tai-launcher-btn"
          onClick={() => setIsOpen(true)}
          aria-label="Open Torado AI Shopping Assistant"
        >
          <div className="tai-launcher-pulse"></div>
          <span className="tai-launcher-icon">✨</span>
          <span className="tai-launcher-text">Ask Torado AI</span>
          {hasUnread && <span className="tai-unread-dot"></span>}
        </button>
      )}

      {/* Main Chat Window */}
      {isOpen && (
        <div className="tai-chat-card" role="dialog" aria-modal="true" aria-label="Torado AI Chat">
          {/* Header */}
          <div className="tai-chat-header">
            <div className="tai-header-avatar">
              <span className="tai-avatar-glow">✨</span>
            </div>
            <div className="tai-header-info">
              <div className="tai-header-title">
                Torado AI Assistant
                <span className="tai-badge-live">Live</span>
              </div>
              <div className="tai-header-status">
                <span className="tai-status-dot"></span>
                Real-Time Shopping & Order Concierge
              </div>
            </div>
            <div className="tai-header-actions">
              <button
                type="button"
                className="tai-btn-icon"
                title="Clear Chat"
                onClick={clearChat}
                aria-label="Clear Chat"
              >
                <i className="bx bx-refresh"></i>
              </button>
              <button
                type="button"
                className="tai-btn-icon"
                title="Close"
                onClick={() => setIsOpen(false)}
                aria-label="Close Chat"
              >
                <i className="bx bx-x"></i>
              </button>
            </div>
          </div>

          {/* Quick Action Chips Bar */}
          <div className="tai-chips-bar">
            <button type="button" className="tai-chip" onClick={() => handleQuickChip('Show popular T-Shirts')}>
              👕 Popular Tees
            </button>
            <button type="button" className="tai-chip" onClick={() => handleQuickChip('Any discount coupon codes?')}>
              🏷️ Discount Codes
            </button>
            <button type="button" className="tai-chip" onClick={() => handleQuickChip('Products under ₹600')}>
              💰 Under ₹600
            </button>
            <button type="button" className="tai-chip" onClick={() => handleQuickChip('How can I track my order?')}>
              📦 Track Order
            </button>
          </div>

          {/* Messages Area */}
          <div className="tai-messages-area">
            {messages.map((m) => (
              <div key={m.id} className={`tai-message-row ${m.sender === 'user' ? 'is-user' : 'is-ai'}`}>
                {m.sender === 'ai' && (
                  <div className="tai-msg-avatar">
                    <span>✨</span>
                  </div>
                )}
                <div className="tai-msg-content">
                  <div className="tai-bubble">
                    {renderFormattedText(m.text)}
                  </div>

                  {/* Rich Product Recommendations Cards */}
                  {m.recommendations && m.recommendations.length > 0 && (
                    <div className="tai-products-grid">
                      {m.recommendations.map((p) => (
                        <div key={p.id} className="tai-prod-card">
                          <div className="tai-prod-img-wrap">
                            <img
                              src={p.image_url || '/assets/images/products/women-8.jpg'}
                              alt={p.name}
                              loading="lazy"
                            />
                            <span className="tai-prod-cat">{p.category}</span>
                          </div>
                          <div className="tai-prod-info">
                            <div className="tai-prod-name" title={p.name}>{p.name}</div>
                            <div className="tai-prod-price-row">
                              <span className="tai-prod-price">₹{Number(p.price).toLocaleString('en-IN')}</span>
                              <button
                                type="button"
                                className="tai-prod-add-btn"
                                onClick={() => handleAddToCart(p)}
                                title="Add to Cart"
                              >
                                + Add
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Order tracking direct link button */}
                  {m.action === 'track_prompt' && (
                    <div className="tai-action-box">
                      <button type="button" className="tai-action-btn" onClick={handleTrackOrderClick}>
                        Open Track Order Page →
                      </button>
                    </div>
                  )}

                  <div className="tai-msg-time">{m.time}</div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {loading && (
              <div className="tai-message-row is-ai">
                <div className="tai-msg-avatar">
                  <span>✨</span>
                </div>
                <div className="tai-bubble tai-typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form
            className="tai-input-bar"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
          >
            <input
              ref={inputRef}
              type="text"
              className="tai-input-field"
              placeholder="Ask anything (e.g. Purple tees, track order...)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              maxLength={200}
            />
            <button
              type="submit"
              className="tai-send-btn"
              disabled={!input.trim() || loading}
              aria-label="Send message"
            >
              <i className="bx bxs-send"></i>
            </button>
          </form>

          {/* Footer branding */}
          <div className="tai-chat-footer">
            Powered by <strong>Torado AI Shopping Engine</strong> • Instant Responses
          </div>
        </div>
      )}
    </aside>
  );
}
