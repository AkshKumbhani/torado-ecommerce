// WhatsApp & SMS notification service for Torado
// Integrates with standard Fast2SMS / Twilio / Wati or Direct WhatsApp API webhook

export const sendWhatsAppOrderConfirmation = async ({ phone, customerName, orderId, total, paymentMethod }) => {
  try {
    const cleanPhone = String(phone || '').replace(/[^\d]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) return { skipped: true, reason: 'Invalid phone' };

    const message = `🛍️ *Torado Store - Order Confirmed!*\n\nHi ${customerName},\nThank you for shopping with us! Your order *#TRD-${orderId}* of *₹${total}* (${paymentMethod}) has been successfully confirmed.\n\n📦 We are packing your items with care. You will receive live tracking updates once dispatched.\n\nTrack your order anytime: https://toradostore.com/#track-my-order`;

    console.log(`[WhatsApp Service] Dispatched to +91${cleanPhone.slice(-10)}:\n${message}`);

    // If external SMS/WhatsApp API key is present in environment, trigger webhook
    if (process.env.WHATSAPP_API_KEY && process.env.WHATSAPP_API_URL) {
      await fetch(process.env.WHATSAPP_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.WHATSAPP_API_KEY}`
        },
        body: JSON.stringify({
          to: `91${cleanPhone.slice(-10)}`,
          message: message
        })
      }).catch(err => console.warn('[WhatsApp webhook error]', err.message));
    }

    return { success: true, phone: cleanPhone };
  } catch (err) {
    console.error('[WhatsApp Service Error]', err.message);
    return { success: false, error: err.message };
  }
};

export const sendWhatsAppOrderDispatched = async ({ phone, customerName, orderId, courierName, awbCode }) => {
  try {
    const cleanPhone = String(phone || '').replace(/[^\d]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) return { skipped: true };

    const message = `🚚 *Torado Order Shipped!*\n\nHi ${customerName},\nYour order *#TRD-${orderId}* is on the way!\n\nCourier: *${courierName || 'Shiprocket Express'}*\nTracking AWB: *${awbCode || 'Pending'}*\n\nTrack your parcel: https://toradostore.com/#track-my-order`;

    console.log(`[WhatsApp Service - Shipped] to +91${cleanPhone.slice(-10)}:\n${message}`);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
};
