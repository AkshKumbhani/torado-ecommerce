import express from 'express';
import { query } from '../src/db.js';

const router = express.Router();

// Fallback intelligent e-commerce AI shopping engine
async function generateAiReply(userMessage, history = []) {
  const msg = (userMessage || '').toLowerCase().trim();

  // 1. Check for Order Tracking intent
  const orderNumMatch = msg.match(/(?:order\s*(?:#|no|number)?\s*|#|trd-?)(\d{1,6})/i);
  if (msg.includes('track') || msg.includes('order status') || orderNumMatch) {
    if (orderNumMatch) {
      const orderId = orderNumMatch[1];
      try {
        const [order] = await query('SELECT id, customer_name, status, total, payment_method, created_at FROM orders WHERE id=? LIMIT 1', [orderId]);
        if (order) {
          const formattedTotal = Number(order.total || 0).toLocaleString('en-IN');
          const dateStr = new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
          return {
            reply: `📦 **Order #TRD-${order.id} Status Found!**\n\n• **Customer:** ${order.customer_name}\n• **Status:** \`${order.status.toUpperCase().replace(/_/g, ' ')}\`\n• **Total:** ₹${formattedTotal} (${order.payment_method?.toUpperCase() || 'COD'})\n• **Placed On:** ${dateStr}\n\nNeed to make any modifications or have questions about delivery? Just ask!`,
            action: 'track_found',
            order
          };
        }
      } catch (err) {
        console.error('[AI] Order lookup error:', err.message);
      }
    }
    return {
      reply: `📦 **Track Your Order:**\nTo track your delivery, please provide your **Order ID** (e.g. \`#TRD-1\` or \`60007\`) or visit our dedicated [Track Order](#track-my-order) page!`,
      action: 'track_prompt'
    };
  }

  // 2. Check for Discount / Coupon intent
  if (msg.includes('coupon') || msg.includes('discount') || msg.includes('promo') || msg.includes('offer') || msg.includes('code')) {
    try {
      const coupons = await query("SELECT code, discount_type, discount_value, minimum_order FROM coupons WHERE active=1 AND (expires_at IS NULL OR expires_at >= NOW()) LIMIT 3");
      const list = coupons.length ? coupons.map(c => `• **${c.code}**: ${c.discount_type === 'percentage' ? `${c.discount_value}% OFF` : `₹${c.discount_value} FLAT OFF`}${c.minimum_order > 0 ? ` (Min order ₹${c.minimum_order})` : ''}`).join('\n') : '• **WELCOME20**: 20% OFF on all items';
      return {
        reply: `🎉 **Special Discounts Just For You!**\n\nHere are our active promotional codes:\n${list}\n\n👉 Apply **WELCOME20** at checkout to get an instant discount on your order!`,
        action: 'coupon_list'
      };
    } catch {
      return {
        reply: `🎉 **Special Discount Code!**\nUse code **WELCOME20** at checkout to get **20% OFF** on your entire order today!`,
        action: 'coupon'
      };
    }
  }

  // 3. Check for Shipping / Returns / COD / FAQ intent
  if (msg.includes('shipping') || msg.includes('delivery') || msg.includes('cod') || msg.includes('cash on delivery') || msg.includes('return') || msg.includes('refund') || msg.includes('payment')) {
    if (msg.includes('return') || msg.includes('refund')) {
      return {
        reply: `🔄 **7-Day Easy Returns & Exchanges:**\n• We offer a hassle-free 7-day return policy on all unworn apparel with original tags.\n• Once received, refunds are processed within 24-48 hours directly to your source account or UPI.`,
        action: 'faq_return'
      };
    }
    if (msg.includes('cod') || msg.includes('cash')) {
      return {
        reply: `💵 **Cash on Delivery (COD) Available!**\n• Yes, we support Cash on Delivery across 25,000+ pin codes in India.\n• You can also pay securely online via Razorpay (UPI, Google Pay, PhonePe, Cards, Netbanking).`,
        action: 'faq_cod'
      };
    }
    return {
      reply: `🚚 **Shipping & Delivery Information:**\n• **Delivery Time:** 3-5 business days across India.\n• **Shipping Charges:** Free delivery on prepaid orders!\n• Real-time SMS and email tracking updates sent as soon as your package ships.`,
      action: 'faq_shipping'
    };
  }

  // 4. Product recommendations & search intent
  let categoryFilter = null;
  if (msg.includes('women') || msg.includes('girl') || msg.includes('ladies')) categoryFilter = 'Women';
  else if (msg.includes('men') || msg.includes('boy') || msg.includes('guy')) categoryFilter = 'Men';
  else if (msg.includes('hoodie')) categoryFilter = 'Hoodies';
  else if (msg.includes('jean')) categoryFilter = 'Jeans';
  else if (msg.includes('shirt')) categoryFilter = 'Shirts';

  // Price constraint extraction (e.g. "under 600", "below 1000")
  const priceMatch = msg.match(/(?:under|below|less than|within)\s*(?:₹|rs\.?|inr)?\s*(\d+)/i);
  const maxBudget = priceMatch ? Number(priceMatch[1]) : null;

  try {
    let sql = "SELECT id, name, category, price, original_price, image_url, stock FROM products WHERE status='active'";
    const params = [];

    if (categoryFilter) {
      sql += " AND (category = ? OR name LIKE ?)";
      params.push(categoryFilter, `%${categoryFilter}%`);
    }

    if (maxBudget) {
      sql += " AND price <= ?";
      params.push(maxBudget);
    }

    // Keyword search in product names
    const keywords = msg.replace(/(show|me|find|best|cheap|t-?shirts?|tees?|products?|recommend|want|buy|looking|for)/g, '').trim().split(/\s+/).filter(w => w.length > 2);
    if (keywords.length > 0 && !categoryFilter) {
      const likeClause = keywords.map(() => "(name LIKE ? OR description LIKE ? OR category LIKE ?)").join(" OR ");
      sql += ` AND (${likeClause})`;
      keywords.forEach(k => {
        params.push(`%${k}%`, `%${k}%`, `%${k}%`);
      });
    }

    sql += " ORDER BY featured DESC, id DESC LIMIT 4";
    const recommended = await query(sql, params);

    if (recommended.length > 0) {
      const itemsList = recommended.map(p => `• **${p.name}** — ₹${Number(p.price).toLocaleString('en-IN')}`).join('\n');
      return {
        reply: `✨ **Here are some top picks for you:**\n\n${itemsList}\n\nYou can click on any product card below to add it directly to your cart or view details!`,
        recommendations: recommended,
        action: 'recommendations'
      };
    }
  } catch (err) {
    console.error('[AI] Product query error:', err.message);
  }

  // 5. Default friendly assistant greeting / guidance
  return {
    reply: `👋 **Hi there! I am Torado AI, your personal shopping assistant.**\n\nI can help you with:\n• 👕 **Finding styles & sizes:** e.g., *"Show me purple tees"* or *"Hoodies under ₹1000"*\n• 📦 **Tracking your orders:** e.g., *"Track order #TRD-1"*\n• 🏷️ **Discounts & deals:** e.g., *"Any discount coupon available?"*\n• 🚚 **Shipping & policies:** e.g., *"Do you support COD?"*\n\nWhat are you looking for today?`,
    action: 'greeting'
  };
}

router.post('/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required.' });
    }

    const aiResponse = await generateAiReply(message, history);
    res.json({
      success: true,
      ...aiResponse
    });
  } catch (err) {
    console.error('[AI /chat] Error:', err);
    res.status(500).json({
      success: false,
      reply: 'I apologize, but I am momentarily busy updating our catalog. Please ask your question again in a moment!',
      error: err.message
    });
  }
});

export default router;
