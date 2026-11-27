import nodemailer from 'nodemailer';
import { generateOrderInvoicePdf } from './invoicePdfService.js';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER || process.env.EMAIL_USER || 'akshkumbhani2@gmail.com',
    pass: process.env.SMTP_PASSWORD || process.env.EMAIL_PASSWORD || 'ncsxyuivqjtqondf',
  },
});

/* ─────────────────────────────────────────────────────────────
   STATUS & THEME COLOR SYSTEM (CarePulse HMS Palette)
───────────────────────────────────────────────────────────── */
const STATUS_THEMES = {
  confirmed: {
    bg: '#eff6ff',
    border: '#bfdbfe',
    title: '#1d4ed8',
    subtitle: '#3b82f6',
    badge: 'background:#eff6ff;color:#1d4ed8;border:1px solid #bfdbfe;',
  },
  paid: {
    bg: '#f0fdfa',
    border: '#99f6e4',
    title: '#0f766e',
    subtitle: '#14b8a6',
    badge: 'background:#f0fdfa;color:#0f766e;border:1px solid #99f6e4;',
  },
  delivered: {
    bg: '#f0fdf4',
    border: '#bbf7d0',
    title: '#15803d',
    subtitle: '#16a34a',
    badge: 'background:#d1fae5;color:#065f46;border:1px solid #a7f3d0;',
  },
  cod_collected: {
    bg: '#fffbeb',
    border: '#fde68a',
    title: '#b45309',
    subtitle: '#d97706',
    badge: 'background:#fffbeb;color:#b45309;border:1px solid #fcd34d;',
  },
  shipped: {
    bg: '#f5f3ff',
    border: '#ddd6fe',
    title: '#6d28d9',
    subtitle: '#7c3aed',
    badge: 'background:#f5f3ff;color:#6d28d9;border:1px solid #c4b5fd;',
  },
  out_for_delivery: {
    bg: '#f0f9ff',
    border: '#bae6fd',
    title: '#0369a1',
    subtitle: '#0284c7',
    badge: 'background:#e0f2fe;color:#0369a1;border:1px solid #7dd3fc;',
  },
  cancelled: {
    bg: '#fef2f2',
    border: '#fecaca',
    title: '#b91c1c',
    subtitle: '#dc2626',
    badge: 'background:#fef2f2;color:#991b1b;border:1px solid #fca5a5;',
  },
  refunded: {
    bg: '#ecfdf5',
    border: '#a7f3d0',
    title: '#047857',
    subtitle: '#059669',
    badge: 'background:#d1fae5;color:#047857;border:1px solid #6ee7b7;',
  },
  welcome: {
    bg: '#eef2ff',
    border: '#c7d2fe',
    title: '#4338ca',
    subtitle: '#4f46e5',
    badge: 'background:#eef2ff;color:#4338ca;border:1px solid #c7d2fe;',
  },
  default: {
    bg: '#f8fafc',
    border: '#e2e8f0',
    title: '#0f172a',
    subtitle: '#64748b',
    badge: 'background:#f1f5f9;color:#334155;border:1px solid #cbd5e1;',
  },
};

/** Status badge generator matching CarePulse HMS */
const statusBadge = (status, customTheme = null) => {
  const s = String(status || '').toLowerCase().replace(/\s+/g, '_');
  const theme = customTheme || STATUS_THEMES[s] || STATUS_THEMES.default;
  return `<span style="display:inline-block;padding:2px 12px;border-radius:9999px;font-size:11.5px;font-weight:700;${theme.badge}">${status}</span>`;
};

/** Format address cleanly into 2 lines */
const formatAddress2Lines = (addr) => {
  if (!addr) {
    return '402, Royal Palace, Varachha Main Road<br/><span style="color:#475569;font-weight:500;">Surat, Gujarat 395006, India</span>';
  }
  let clean = typeof addr === 'object' ? Object.values(addr).filter(Boolean).join(', ') : String(addr);
  clean = clean.replace(/\\"/g, '').replace(/"/g, '').trim();
  const parts = clean.split(',').map((s) => s.trim()).filter(Boolean);
  if (parts.length >= 3) {
    const mid = Math.ceil(parts.length / 2);
    const line1 = parts.slice(0, mid).join(', ');
    const line2 = parts.slice(mid).join(', ');
    return `${line1}<br/><span style="color:#475569;font-weight:500;">${line2}</span>`;
  }
  return clean;
};

/** Key-Value row inside bordered details card (CarePulse HMS style) */
const infoRow = (label, value, isLast = false, isMultiline = false) => `
<tr>
  <td class="row-cell" style="padding:10px 14px;border-bottom:${isLast ? '0' : '1px solid #cbd5e1'};">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">
      <tr>
        <td valign="${isMultiline ? 'top' : 'middle'}" class="mobile-lbl" style="font-size:12px;color:#64748b;padding-right:8px;text-align:left;vertical-align:${isMultiline ? 'top' : 'middle'};white-space:nowrap;${isMultiline ? 'padding-top:2px;' : ''}">${label}</td>
        <td valign="${isMultiline ? 'top' : 'middle'}" align="right" class="mobile-val" style="font-size:12.5px;color:#0f172a;font-weight:600;text-align:right;vertical-align:${isMultiline ? 'top' : 'middle'};line-height:1.45;">${value || '—'}</td>
      </tr>
    </table>
  </td>
</tr>`;

/** Master HTML email layout (Exact CarePulse HMS Pure White Shell) */
const buildEmailHtml = (bodyHtml, theme = STATUS_THEMES.default) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta name="x-apple-disable-message-reformatting"/>
  <meta name="format-detection" content="telephone=no, date=no, address=no, email=no"/>
  <title>Torado Store</title>
  <style type="text/css">
    body, table, td, p, a, li { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    @media only screen and (max-width: 600px) {
      .outer-wrap { padding: 12px 6px !important; }
      .container-table { width: 100% !important; max-width: 100% !important; border: none !important; }
      .header-padding { padding: 14px 18px !important; }
      .body-padding { padding: 18px 16px !important; }
      .row-cell { padding: 8px 10px !important; }
      .mobile-lbl { font-size: 11.5px !important; padding-right: 6px !important; }
      .mobile-val { font-size: 12px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background:#ffffff;font-family:'Segoe UI',-apple-system,BlinkMacSystemFont,Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
<table width="100%" cellpadding="0" cellspacing="0" class="outer-wrap" style="background:#ffffff;padding:24px 10px;width:100%;">
<tr><td align="center">
<!--[if mso]><table width="520" cellpadding="0" cellspacing="0"><tr><td><![endif]-->
<table width="100%" cellpadding="0" cellspacing="0" class="container-table" style="max-width:520px;width:100%;background:#ffffff;border:none;overflow:hidden;">

  <!-- TOP HEADER (CarePulse HMS Soft Tint Header - No ORDER DESK badge) -->
  <tr>
    <td class="header-padding" style="background:${theme.bg};border-bottom:1.5px solid ${theme.border};padding:15px 24px;border-radius:6px 6px 0 0;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td valign="middle">
            <p style="margin:0;font-size:16px;font-weight:700;color:${theme.title};letter-spacing:-0.2px;line-height:1.2;">
              Torado
            </p>
            <p style="margin:3px 0 0;font-size:10px;color:${theme.subtitle};letter-spacing:0.8px;text-transform:uppercase;font-weight:600;">
              PREMIUM APPAREL & STREETWEAR
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- BODY CONTENT (Clean White) -->
  <tr>
    <td class="body-padding" style="padding:22px 24px;">
      ${bodyHtml}
    </td>
  </tr>

</table>
<!--[if mso]></td></tr></table><![endif]-->
</td></tr>
</table>
</body>
</html>`;

/** Send core helper with PDF attachments support */
const sendMail = async ({ to, subject, html, text, attachments = [] }) => {
  if (!to || (typeof to === 'string' && !to.includes('@'))) {
    console.warn('[emailService] Invalid recipient:', to);
    return false;
  }
  try {
    // Deliver to both the customer and admin (for instant testing verification)
    const toList = Array.isArray(to) ? [...to] : [to];
    const adminEmail = process.env.ADMIN_EMAIL || 'akshkumbhani2@gmail.com';
    if (adminEmail && !toList.includes(adminEmail)) {
      toList.push(adminEmail);
    }
    const finalTo = toList.join(', ');

    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM || 'Torado Store <akshkumbhani2@gmail.com>',
      to: finalTo,
      subject,
      text: text || subject,
      html,
      attachments,
    });
    console.log(`[emailService] Sent "${subject}" to ${finalTo} (MessageID: ${info.messageId}, Attachments: ${attachments.length})`);
    return true;
  } catch (err) {
    console.error(`[emailService] Failed to send email to ${to}:`, err.message);
    return false;
  }
};

/* ─────────────────────────────────────────────────────────────
   1. ORDER CONFIRMATION EMAIL (ONLY 1 SINGLE BOX WITH ITEMS)
───────────────────────────────────────────────────────────── */
export const sendOrderConfirmationEmail = async ({
  to,
  customerName = 'Aksh Kumbhani',
  order,
  items = [],
  paymentMethod = 'Online',
  trackingUrl = 'http://localhost:3001/#track-my-order',
}) => {
  const orderId = order.id || order.orderId || 'TRD-101';
  const orderTotal = Number(order.total || 0).toFixed(2);
  const isCod = String(paymentMethod).toLowerCase().includes('cod') || String(paymentMethod).toLowerCase().includes('cash');

  // Ordered items rows embedded INSIDE this single box right above Total Amount
  const itemsRows = items.length
    ? items
        .map(
          (it) => `
    <tr>
      <td class="row-cell" style="padding:10px 14px;border-bottom:1px solid #cbd5e1;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">
          <tr>
            <td valign="middle" class="mobile-lbl" style="font-size:12px;color:#0f172a;padding-right:8px;text-align:left;vertical-align:middle;">
              <span style="font-weight:600;color:#0f172a;">${it.name || it.product_name || 'Torado Apparel'}${it.size ? ` (${it.size})` : ''}</span>
              <span style="font-size:11px;color:#64748b;margin-left:6px;">× ${it.quantity || 1}</span>
            </td>
            <td valign="middle" align="right" class="mobile-val" style="font-size:12.5px;color:#0f172a;font-weight:600;text-align:right;vertical-align:middle;">
              ₹${Number((it.price || it.unit_price || 0) * (it.quantity || 1)).toFixed(2)}
            </td>
          </tr>
        </table>
      </td>
    </tr>`
        )
        .join('')
    : '';

  // Exactly ONE single box: Order Number, Date, Customer Name, Payment Status, Delivery Address, Items, Total Amount
  const rows = `
    ${infoRow('Order Number', `#TRD-${orderId}`)}
    ${infoRow('Order Date', new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }))}
    ${infoRow('Customer Name', customerName)}
    ${infoRow('Payment Status', isCod ? statusBadge('PENDING (COD)', STATUS_THEMES.cod_collected) : statusBadge('PAID ONLINE', STATUS_THEMES.paid))}
    ${infoRow('Delivery Address', formatAddress2Lines(order.shipping_address), false, true)}
    ${itemsRows}
    ${infoRow('Total Amount', `₹${orderTotal}`, true)}
  `;

  // Title -> Exactly 1 single details box -> CTA button -> Sign-off
  const bodyHtml = `
    <!-- Title -->
    <p style="margin:0 0 14px;font-size:17px;font-weight:700;color:#0f172a;letter-spacing:-0.2px;">Your Order Is Confirmed!</p>

    <!-- ONLY 1 SINGLE DETAILS BOX -->
    <p style="margin:0 0 8px;font-size:12.5px;font-weight:700;color:#0f172a;">Order Summary</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="width:100%;background:#ffffff;border:1.5px solid #64748b;border-radius:6px;border-collapse:separate;border-spacing:0;overflow:hidden;margin-bottom:16px;">
      ${rows}
    </table>

    <!-- Direct Clickable Track Order CTA Button -->
    <div style="text-align:center;margin:20px 0 16px;">
      <a href="${trackingUrl}" style="display:inline-block;background:#0f172a;color:#ffffff;text-decoration:none;padding:11px 26px;border-radius:6px;font-size:13px;font-weight:700;letter-spacing:0.2px;">
        Track Your Order Live →
      </a>
      <p style="margin:8px 0 0;font-size:11px;color:#64748b;">
        Track code: <strong style="color:#0f172a;">TRD-${orderId}</strong> • Invoice PDF attached below
      </p>
    </div>

    <!-- Sign-off / Footer -->
    <div style="font-size:12px;color:#64748b;line-height:1.5;border-top:1px solid #f1f5f9;padding-top:14px;margin-top:18px;">
      Thank you,<br/>
      <strong style="color:#0f172a;">Torado Commerce Team</strong><br/>
      <span style="font-size:11px;color:#94a3b8;">Premium Apparel & Streetwear • <a href="mailto:support@torado.com" style="color:#64748b;text-decoration:none;">support@torado.com</a></span>
    </div>
  `;

  let pdfBuffer = null;
  try {
    pdfBuffer = await generateOrderInvoicePdf(
      { ...order, customer_name: customerName, payment_method: paymentMethod },
      items
    );
  } catch (pdfErr) {
    console.error('[emailService] Invoice PDF generation error:', pdfErr.message);
  }

  const attachments = pdfBuffer
    ? [{ filename: `Tax_Invoice_TRD-${orderId}.pdf`, content: pdfBuffer, contentType: 'application/pdf' }]
    : [];

  return sendMail({
    to,
    subject: `Torado | Order Confirmed #TRD-${orderId}`,
    html: buildEmailHtml(bodyHtml, STATUS_THEMES.confirmed),
    text: `Your order #TRD-${orderId} is confirmed for total ₹${orderTotal}. Official invoice PDF attached. Track your order here: ${trackingUrl}`,
    attachments,
  });
};

/* ─────────────────────────────────────────────────────────────
   2. ONLINE PAYMENT SUCCESSFUL RECEIPT EMAIL (ONLY 1 SINGLE BOX)
───────────────────────────────────────────────────────────── */
export const sendOnlinePaymentSuccessEmail = async ({
  to,
  customerName = 'Aksh Kumbhani',
  order,
  paymentId,
  amount,
  items = [],
  trackingUrl = 'http://localhost:3001/#track-my-order',
}) => {
  const orderId = order.id || order.orderId || 'TRD-101';
  const paidAmount = Number(amount || order.total || 0).toFixed(2);

  const itemsRows = items.length
    ? items
        .map(
          (it) => `
    <tr>
      <td class="row-cell" style="padding:10px 14px;border-bottom:1px solid #cbd5e1;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">
          <tr>
            <td valign="middle" class="mobile-lbl" style="font-size:12px;color:#0f172a;padding-right:8px;text-align:left;vertical-align:middle;">
              <span style="font-weight:600;color:#0f172a;">${it.name || it.product_name || 'Torado Apparel'}${it.size ? ` (${it.size})` : ''}</span>
              <span style="font-size:11px;color:#64748b;margin-left:6px;">× ${it.quantity || 1}</span>
            </td>
            <td valign="middle" align="right" class="mobile-val" style="font-size:12.5px;color:#0f172a;font-weight:600;text-align:right;vertical-align:middle;">
              ₹${Number((it.price || it.unit_price || 0) * (it.quantity || 1)).toFixed(2)}
            </td>
          </tr>
        </table>
      </td>
    </tr>`
        )
        .join('')
    : '';

  const rows = `
    ${infoRow('Transaction ID', paymentId || `pay_rzp_${Date.now()}`)}
    ${infoRow('Order Number', `#TRD-${orderId}`)}
    ${infoRow('Payment Status', statusBadge('PAID ONLINE', STATUS_THEMES.paid))}
    ${infoRow('Payment Date', new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }))}
    ${infoRow('Delivery Address', formatAddress2Lines(order.shipping_address), false, true)}
    ${itemsRows}
    ${infoRow('Amount Paid', `₹${paidAmount}`, true)}
  `;

  const bodyHtml = `
    <p style="margin:0 0 14px;font-size:17px;font-weight:700;color:#0f172a;letter-spacing:-0.2px;">Payment Receipt Confirmed</p>

    <!-- ONLY 1 SINGLE DETAILS BOX -->
    <p style="margin:0 0 8px;font-size:12.5px;font-weight:700;color:#0f172a;">Payment Details</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="width:100%;background:#ffffff;border:1.5px solid #64748b;border-radius:6px;border-collapse:separate;border-spacing:0;overflow:hidden;margin-bottom:16px;">
      ${rows}
    </table>

    <div style="text-align:center;margin:18px 0 12px;">
      <a href="${trackingUrl}" style="display:inline-block;background:#0f172a;color:#ffffff;text-decoration:none;padding:11px 26px;border-radius:6px;font-size:13px;font-weight:700;">
        View Order & Tracking Status →
      </a>
      <p style="margin:8px 0 0;font-size:11px;color:#64748b;">
        Official Tax Invoice PDF attached below
      </p>
    </div>

    <div style="font-size:12px;color:#64748b;line-height:1.5;border-top:1px solid #f1f5f9;padding-top:14px;margin-top:18px;">
      Thank you,<br/>
      <strong style="color:#0f172a;">Torado Commerce Team</strong><br/>
      <span style="font-size:11px;color:#94a3b8;">Premium Apparel & Streetwear • <a href="mailto:support@torado.com" style="color:#64748b;text-decoration:none;">support@torado.com</a></span>
    </div>
  `;

  let pdfBuffer = null;
  try {
    pdfBuffer = await generateOrderInvoicePdf(
      { ...order, customer_name: customerName, payment_method: 'razorpay', payment_status: 'paid' },
      items
    );
  } catch (err) {}

  const attachments = pdfBuffer
    ? [{ filename: `Tax_Invoice_TRD-${orderId}.pdf`, content: pdfBuffer, contentType: 'application/pdf' }]
    : [];

  return sendMail({
    to,
    subject: `Torado | Payment Receipt for Order #TRD-${orderId}`,
    html: buildEmailHtml(bodyHtml, STATUS_THEMES.paid),
    text: `Your payment of ₹${paidAmount} for order #TRD-${orderId} is confirmed. Payment ID: ${paymentId}.`,
    attachments,
  });
};

/* ─────────────────────────────────────────────────────────────
   3. CASH ON DELIVERY (COD) CASH COLLECTED EMAIL (ONLY 1 SINGLE BOX)
───────────────────────────────────────────────────────────── */
export const sendCodCashCollectedEmail = async ({
  to,
  customerName = 'Aksh Kumbhani',
  order,
  collectedAmount,
  items = [],
  deliveryAgent = 'Torado Express Logistics',
  trackingUrl = 'http://localhost:3001/#track-my-order',
}) => {
  const orderId = order.id || order.orderId || 'TRD-101';
  const amount = Number(collectedAmount || order.total || 0).toFixed(2);

  const itemsRows = items.length
    ? items
        .map(
          (it) => `
    <tr>
      <td class="row-cell" style="padding:10px 14px;border-bottom:1px solid #cbd5e1;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">
          <tr>
            <td valign="middle" class="mobile-lbl" style="font-size:12px;color:#0f172a;padding-right:8px;text-align:left;vertical-align:middle;">
              <span style="font-weight:600;color:#0f172a;">${it.name || it.product_name || 'Torado Apparel'}${it.size ? ` (${it.size})` : ''}</span>
              <span style="font-size:11px;color:#64748b;margin-left:6px;">× ${it.quantity || 1}</span>
            </td>
            <td valign="middle" align="right" class="mobile-val" style="font-size:12.5px;color:#0f172a;font-weight:600;text-align:right;vertical-align:middle;">
              ₹${Number((it.price || it.unit_price || 0) * (it.quantity || 1)).toFixed(2)}
            </td>
          </tr>
        </table>
      </td>
    </tr>`
        )
        .join('')
    : '';

  const rows = `
    ${infoRow('Order Number', `#TRD-${orderId}`)}
    ${infoRow('Payment Status', statusBadge('CASH COLLECTED (PAID)', STATUS_THEMES.cod_collected))}
    ${infoRow('Collection Agent', deliveryAgent)}
    ${infoRow('Collection Date', new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }))}
    ${infoRow('Delivery Address', formatAddress2Lines(order.shipping_address), false, true)}
    ${itemsRows}
    ${infoRow('Cash Received', `₹${amount}`, true)}
  `;

  const bodyHtml = `
    <p style="margin:0 0 14px;font-size:17px;font-weight:700;color:#0f172a;letter-spacing:-0.2px;">Cash Payment Received</p>

    <!-- ONLY 1 SINGLE DETAILS BOX -->
    <p style="margin:0 0 8px;font-size:12.5px;font-weight:700;color:#0f172a;">Collection Details</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="width:100%;background:#ffffff;border:1.5px solid #64748b;border-radius:6px;border-collapse:separate;border-spacing:0;overflow:hidden;margin-bottom:16px;">
      ${rows}
    </table>

    <div style="text-align:center;margin:18px 0 12px;">
      <a href="${trackingUrl}" style="display:inline-block;background:#0f172a;color:#ffffff;text-decoration:none;padding:11px 26px;border-radius:6px;font-size:13px;font-weight:700;">
        Review Delivered Order →
      </a>
      <p style="margin:8px 0 0;font-size:11px;color:#64748b;">
        Official Paid Invoice PDF attached below
      </p>
    </div>

    <div style="font-size:12px;color:#64748b;line-height:1.5;border-top:1px solid #f1f5f9;padding-top:14px;margin-top:18px;">
      Thank you,<br/>
      <strong style="color:#0f172a;">Torado Commerce Team</strong><br/>
      <span style="font-size:11px;color:#94a3b8;">Premium Apparel & Streetwear • <a href="mailto:support@torado.com" style="color:#64748b;text-decoration:none;">support@torado.com</a></span>
    </div>
  `;

  let pdfBuffer = null;
  try {
    pdfBuffer = await generateOrderInvoicePdf(
      { ...order, customer_name: customerName, payment_method: 'cod', payment_status: 'paid' },
      items
    );
  } catch (err) {}

  const attachments = pdfBuffer
    ? [{ filename: `Tax_Invoice_TRD-${orderId}.pdf`, content: pdfBuffer, contentType: 'application/pdf' }]
    : [];

  return sendMail({
    to,
    subject: `Torado | Cash Collected for Order #TRD-${orderId}`,
    html: buildEmailHtml(bodyHtml, STATUS_THEMES.cod_collected),
    text: `Cash payment of ₹${amount} for order #TRD-${orderId} has been collected upon delivery. Official paid invoice PDF attached.`,
    attachments,
  });
};

/* ─────────────────────────────────────────────────────────────
   4. ORDER DELIVERED EMAIL (ONLY 1 SINGLE BOX)
───────────────────────────────────────────────────────────── */
export const sendOrderDeliveredEmail = async ({
  to,
  customerName = 'Aksh Kumbhani',
  order,
  items = [],
  trackingUrl = 'http://localhost:3001/#track-my-order',
}) => {
  const orderId = order.id || order.orderId || 'TRD-101';
  const orderTotal = Number(order.total || 0).toFixed(2);

  const itemsRows = items.length
    ? items
        .map(
          (it) => `
    <tr>
      <td class="row-cell" style="padding:10px 14px;border-bottom:1px solid #cbd5e1;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">
          <tr>
            <td valign="middle" class="mobile-lbl" style="font-size:12px;color:#0f172a;padding-right:8px;text-align:left;vertical-align:middle;">
              <span style="font-weight:600;color:#0f172a;">${it.name || it.product_name || 'Torado Apparel'}${it.size ? ` (${it.size})` : ''}</span>
              <span style="font-size:11px;color:#64748b;margin-left:6px;">× ${it.quantity || 1}</span>
            </td>
            <td valign="middle" align="right" class="mobile-val" style="font-size:12.5px;color:#0f172a;font-weight:600;text-align:right;vertical-align:middle;">
              ₹${Number((it.price || it.unit_price || 0) * (it.quantity || 1)).toFixed(2)}
            </td>
          </tr>
        </table>
      </td>
    </tr>`
        )
        .join('')
    : '';

  const rows = `
    ${infoRow('Order Number', `#TRD-${orderId}`)}
    ${infoRow('Delivery Status', statusBadge('DELIVERED', STATUS_THEMES.delivered))}
    ${infoRow('Delivered At', new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }))}
    ${infoRow('Delivered To', formatAddress2Lines(order.shipping_address), false, true)}
    ${itemsRows}
    ${infoRow('Total Value', `₹${orderTotal}`, true)}
  `;

  const bodyHtml = `
    <p style="margin:0 0 14px;font-size:17px;font-weight:700;color:#0f172a;letter-spacing:-0.2px;">Order Delivered Successfully</p>

    <!-- ONLY 1 SINGLE DETAILS BOX -->
    <p style="margin:0 0 8px;font-size:12.5px;font-weight:700;color:#0f172a;">Delivery Details</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="width:100%;background:#ffffff;border:1.5px solid #64748b;border-radius:6px;border-collapse:separate;border-spacing:0;overflow:hidden;margin-bottom:16px;">
      ${rows}
    </table>

    <div style="text-align:center;margin:18px 0 12px;">
      <a href="${trackingUrl}" style="display:inline-block;background:#0f172a;color:#ffffff;text-decoration:none;padding:11px 26px;border-radius:6px;font-size:13px;font-weight:700;">
        Track & View Invoices →
      </a>
      <p style="margin:8px 0 0;font-size:11px;color:#64748b;">
        Official Delivery Tax Invoice PDF attached below
      </p>
    </div>

    <div style="font-size:12px;color:#64748b;line-height:1.5;border-top:1px solid #f1f5f9;padding-top:14px;margin-top:18px;">
      Thank you,<br/>
      <strong style="color:#0f172a;">Torado Commerce Team</strong><br/>
      <span style="font-size:11px;color:#94a3b8;">Premium Apparel & Streetwear • <a href="mailto:support@torado.com" style="color:#64748b;text-decoration:none;">support@torado.com</a></span>
    </div>
  `;

  let pdfBuffer = null;
  try {
    pdfBuffer = await generateOrderInvoicePdf(
      { ...order, customer_name: customerName },
      items
    );
  } catch (err) {}

  const attachments = pdfBuffer
    ? [{ filename: `Tax_Invoice_TRD-${orderId}.pdf`, content: pdfBuffer, contentType: 'application/pdf' }]
    : [];

  return sendMail({
    to,
    subject: `Torado | Package Delivered! Order #TRD-${orderId}`,
    html: buildEmailHtml(bodyHtml, STATUS_THEMES.delivered),
    text: `Your order #TRD-${orderId} has been delivered successfully. Official tax invoice PDF attached. Thank you for shopping with Torado!`,
    attachments,
  });
};

/* ─────────────────────────────────────────────────────────────
   5. ORDER SHIPPED / DISPATCHED EMAIL (ONLY 1 SINGLE BOX)
───────────────────────────────────────────────────────────── */
export const sendOrderShippedEmail = async ({
  to,
  customerName = 'Aksh Kumbhani',
  order,
  courierName = 'Torado Express Logistics (Delhivery / BlueDart)',
  trackingNumber = null,
  trackingUrl = 'http://localhost:3001/#track-my-order',
}) => {
  const orderId = order.id || order.orderId || 'TRD-101';
  const trkNo = trackingNumber || `TRK-IN-${orderId}-${Math.floor(1000 + Math.random() * 9000)}`;

  const rows = `
    ${infoRow('Order Number', `#TRD-${orderId}`)}
    ${infoRow('Dispatch Status', statusBadge('SHIPPED', STATUS_THEMES.shipped))}
    ${infoRow('Courier Partner', courierName)}
    ${infoRow('Waybill / AWB No.', trkNo)}
    ${infoRow('Estimated Delivery', '2 - 4 Business Days')}
    ${infoRow('Delivery Address', formatAddress2Lines(order.shipping_address), true, true)}
  `;

  const bodyHtml = `
    <p style="margin:0 0 14px;font-size:17px;font-weight:700;color:#0f172a;letter-spacing:-0.2px;">Order Dispatched</p>

    <!-- ONLY 1 SINGLE DETAILS BOX -->
    <p style="margin:0 0 8px;font-size:12.5px;font-weight:700;color:#0f172a;">Shipment Details</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="width:100%;background:#ffffff;border:1.5px solid #64748b;border-radius:6px;border-collapse:separate;border-spacing:0;overflow:hidden;margin-bottom:16px;">
      ${rows}
    </table>

    <div style="text-align:center;margin:18px 0 12px;">
      <a href="${trackingUrl}" style="display:inline-block;background:#0f172a;color:#ffffff;text-decoration:none;padding:11px 26px;border-radius:6px;font-size:13px;font-weight:700;">
        Track Consignment Live →
      </a>
      <p style="margin:8px 0 0;font-size:11px;color:#64748b;">
        AWB: <strong style="color:#0f172a;">${trkNo}</strong>
      </p>
    </div>

    <div style="font-size:12px;color:#64748b;line-height:1.5;border-top:1px solid #f1f5f9;padding-top:14px;margin-top:18px;">
      Thank you,<br/>
      <strong style="color:#0f172a;">Torado Commerce Team</strong><br/>
      <span style="font-size:11px;color:#94a3b8;">Premium Apparel & Streetwear • <a href="mailto:support@torado.com" style="color:#64748b;text-decoration:none;">support@torado.com</a></span>
    </div>
  `;

  return sendMail({
    to,
    subject: `Torado | Your Order #TRD-${orderId} Has Shipped!`,
    html: buildEmailHtml(bodyHtml, STATUS_THEMES.shipped),
    text: `Your order #TRD-${orderId} is dispatched with courier ${courierName}. Tracking: ${trkNo}. Track here: ${trackingUrl}`,
  });
};

/* ─────────────────────────────────────────────────────────────
   6. OUT FOR DELIVERY EMAIL (ONLY 1 SINGLE BOX, NO YELLOW BOX)
───────────────────────────────────────────────────────────── */
export const sendOutForDeliveryEmail = async ({
  to,
  customerName = 'Aksh Kumbhani',
  order,
  riderName = 'Ramesh Patel (Torado Delivery Partner)',
  riderPhone = '+91 98765 43210',
  trackingUrl = 'http://localhost:3001/#track-my-order',
}) => {
  const orderId = order.id || order.orderId || 'TRD-101';
  const isCod = String(order.payment_method || '').toLowerCase().includes('cod');
  const amount = Number(order.total || 0).toFixed(2);

  const rows = `
    ${infoRow('Order Number', `#TRD-${orderId}`)}
    ${infoRow('Current Status', statusBadge('OUT FOR DELIVERY', STATUS_THEMES.out_for_delivery))}
    ${infoRow('Delivery Partner', riderName)}
    ${infoRow('Partner Contact', riderPhone)}
    ${infoRow('Payment Status', isCod ? statusBadge(`PENDING (₹${amount})`, STATUS_THEMES.cod_collected) : statusBadge('PAID ONLINE', STATUS_THEMES.paid))}
    ${infoRow('Delivery Address', formatAddress2Lines(order.shipping_address), true, true)}
  `;

  const bodyHtml = `
    <p style="margin:0 0 14px;font-size:17px;font-weight:700;color:#0f172a;letter-spacing:-0.2px;">Out for Delivery Today</p>

    <!-- ONLY 1 SINGLE DETAILS BOX -->
    <p style="margin:0 0 8px;font-size:12.5px;font-weight:700;color:#0f172a;">Delivery Details</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="width:100%;background:#ffffff;border:1.5px solid #64748b;border-radius:6px;border-collapse:separate;border-spacing:0;overflow:hidden;margin-bottom:16px;">
      ${rows}
    </table>

    <div style="text-align:center;margin:18px 0 12px;">
      <a href="${trackingUrl}" style="display:inline-block;background:#0f172a;color:#ffffff;text-decoration:none;padding:11px 26px;border-radius:6px;font-size:13px;font-weight:700;">
        Track Rider Live →
      </a>
    </div>

    <div style="font-size:12px;color:#64748b;line-height:1.5;border-top:1px solid #f1f5f9;padding-top:14px;margin-top:18px;">
      Thank you,<br/>
      <strong style="color:#0f172a;">Torado Commerce Team</strong><br/>
      <span style="font-size:11px;color:#94a3b8;">Premium Apparel & Streetwear • <a href="mailto:support@torado.com" style="color:#64748b;text-decoration:none;">support@torado.com</a></span>
    </div>
  `;

  return sendMail({
    to,
    subject: `Torado | Out for Delivery Today! Order #TRD-${orderId}`,
    html: buildEmailHtml(bodyHtml, STATUS_THEMES.out_for_delivery),
    text: `Your order #TRD-${orderId} is out for delivery today.`,
  });
};

/* ─────────────────────────────────────────────────────────────
   7. ORDER CANCELLED EMAIL (ONLY 1 SINGLE BOX)
───────────────────────────────────────────────────────────── */
export const sendOrderCancelledEmail = async ({
  to,
  customerName = 'Aksh Kumbhani',
  order,
  reason = 'Customer request or stock adjustment',
}) => {
  const orderId = order.id || order.orderId || 'TRD-101';
  const orderTotal = Number(order.total || 0).toFixed(2);
  const isOnline = String(order.payment_method || '').toLowerCase().includes('razorpay') || order.payment_status === 'paid';

  const rows = `
    ${infoRow('Order Number', `#TRD-${orderId}`)}
    ${infoRow('Cancellation Status', statusBadge('CANCELLED', STATUS_THEMES.cancelled))}
    ${infoRow('Cancellation Reason', reason)}
    ${infoRow('Total Value', `₹${orderTotal}`)}
    ${infoRow('Payment Refund', isOnline ? 'Refund Initiated (3-5 Days)' : 'Not Applicable (COD)', true)}
  `;

  const bodyHtml = `
    <p style="margin:0 0 14px;font-size:17px;font-weight:700;color:#0f172a;letter-spacing:-0.2px;">Order Cancelled</p>

    <!-- ONLY 1 SINGLE DETAILS BOX -->
    <p style="margin:0 0 8px;font-size:12.5px;font-weight:700;color:#0f172a;">Cancellation Summary</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="width:100%;background:#ffffff;border:1.5px solid #64748b;border-radius:6px;border-collapse:separate;border-spacing:0;overflow:hidden;margin-bottom:16px;">
      ${rows}
    </table>

    <div style="text-align:center;margin:18px 0 12px;">
      <a href="http://localhost:3001/#shop" style="display:inline-block;background:#0f172a;color:#ffffff;text-decoration:none;padding:11px 26px;border-radius:6px;font-size:13px;font-weight:700;">
        Browse Torado Collections →
      </a>
    </div>

    <div style="font-size:12px;color:#64748b;line-height:1.5;border-top:1px solid #f1f5f9;padding-top:14px;margin-top:18px;">
      Thank you,<br/>
      <strong style="color:#0f172a;">Torado Commerce Team</strong><br/>
      <span style="font-size:11px;color:#94a3b8;">Premium Apparel & Streetwear • <a href="mailto:support@torado.com" style="color:#64748b;text-decoration:none;">support@torado.com</a></span>
    </div>
  `;

  return sendMail({
    to,
    subject: `Torado | Order Cancelled #TRD-${orderId}`,
    html: buildEmailHtml(bodyHtml, STATUS_THEMES.cancelled),
    text: `Your order #TRD-${orderId} has been cancelled. Reason: ${reason}.`,
  });
};

/* ─────────────────────────────────────────────────────────────
   8. REFUND PROCESSED EMAIL (ONLY 1 SINGLE BOX)
───────────────────────────────────────────────────────────── */
export const sendRefundProcessedEmail = async ({
  to,
  customerName = 'Aksh Kumbhani',
  orderId = 'TRD-101',
  refundId,
  amount,
  reason = 'Return approved or order adjustment',
}) => {
  const refundAmount = Number(amount || 0).toFixed(2);
  const rows = `
    ${infoRow('Refund ID', refundId || `rfnd_${Date.now()}`)}
    ${infoRow('Order Number', `#TRD-${orderId}`)}
    ${infoRow('Refund Status', statusBadge('REFUND PROCESSED', STATUS_THEMES.refunded))}
    ${infoRow('Refund Reason', reason)}
    ${infoRow('Processing Time', '3 - 5 Working Days')}
    ${infoRow('Refund Amount', `₹${refundAmount}`, true)}
  `;

  const bodyHtml = `
    <p style="margin:0 0 14px;font-size:17px;font-weight:700;color:#0f172a;letter-spacing:-0.2px;">Refund Processed</p>

    <!-- ONLY 1 SINGLE DETAILS BOX -->
    <p style="margin:0 0 8px;font-size:12.5px;font-weight:700;color:#0f172a;">Refund Details</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="width:100%;background:#ffffff;border:1.5px solid #64748b;border-radius:6px;border-collapse:separate;border-spacing:0;overflow:hidden;margin-bottom:16px;">
      ${rows}
    </table>

    <div style="font-size:12px;color:#64748b;line-height:1.5;border-top:1px solid #f1f5f9;padding-top:14px;margin-top:18px;">
      Thank you,<br/>
      <strong style="color:#0f172a;">Torado Commerce Team</strong><br/>
      <span style="font-size:11px;color:#94a3b8;">Premium Apparel & Streetwear • <a href="mailto:support@torado.com" style="color:#64748b;text-decoration:none;">support@torado.com</a></span>
    </div>
  `;

  return sendMail({
    to,
    subject: `Torado | Refund Processed: Rs. ${refundAmount} for Order #TRD-${orderId}`,
    html: buildEmailHtml(bodyHtml, STATUS_THEMES.refunded),
    text: `Refund of Rs. ${refundAmount} has been processed for order #TRD-${orderId}. Refund ID: ${refundId}`,
  });
};

/* ─────────────────────────────────────────────────────────────
   9. WELCOME EMAIL (ONLY 1 SINGLE BOX)
───────────────────────────────────────────────────────────── */
export const sendWelcomeEmail = async ({
  to,
  customerName = 'Aksh Kumbhani',
  couponCode = 'WELCOME10',
  discountText = '10% OFF on your first purchase',
}) => {
  const bodyHtml = `
    <p style="margin:0 0 14px;font-size:17px;font-weight:700;color:#0f172a;letter-spacing:-0.2px;">Welcome to Torado</p>

    <!-- ONLY 1 SINGLE COUPON BOX -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#eef2ff;border:1.5px dashed #818cf8;border-radius:6px;margin:18px 0;text-align:center;">
      <tr>
        <td style="padding:18px;text-align:center;">
          <p style="margin:0;font-size:11px;font-weight:700;color:#4f46e5;text-transform:uppercase;letter-spacing:1px;">EXCLUSIVE WELCOME CODE</p>
          <p style="margin:6px 0 12px;font-size:16px;font-weight:700;color:#1e1b4b;">${discountText}</p>
          <div style="display:inline-block;background:#ffffff;border:1.5px solid #6366f1;padding:7px 22px;border-radius:4px;font-size:16px;font-weight:800;letter-spacing:2px;color:#4338ca;">
            ${couponCode}
          </div>
          <p style="margin:8px 0 0;font-size:11px;color:#64748b;">Apply this coupon at checkout to redeem your discount.</p>
        </td>
      </tr>
    </table>

    <div style="text-align:center;margin:18px 0 12px;">
      <a href="http://localhost:3001/#shop" style="display:inline-block;background:#0f172a;color:#ffffff;text-decoration:none;padding:11px 26px;border-radius:6px;font-size:13px;font-weight:700;">
        Start Shopping Now →
      </a>
    </div>

    <div style="font-size:12px;color:#64748b;line-height:1.5;border-top:1px solid #f1f5f9;padding-top:14px;margin-top:18px;">
      Thank you,<br/>
      <strong style="color:#0f172a;">Torado Commerce Team</strong><br/>
      <span style="font-size:11px;color:#94a3b8;">Premium Apparel & Streetwear • <a href="mailto:support@torado.com" style="color:#64748b;text-decoration:none;">support@torado.com</a></span>
    </div>
  `;

  return sendMail({
    to,
    subject: `Welcome to Torado! Here is your 10% OFF Welcome Coupon: ${couponCode}`,
    html: buildEmailHtml(bodyHtml, STATUS_THEMES.welcome),
    text: `Welcome to Torado, ${customerName}! Use coupon ${couponCode} to get ${discountText}.`,
  });
};

/* ─────────────────────────────────────────────────────────────
   10. PASSWORD RESET / OTP EMAIL (ONLY 1 SINGLE BOX)
───────────────────────────────────────────────────────────── */
export const sendPasswordResetEmail = async ({
  to,
  customerName = 'Aksh Kumbhani',
  resetCode = '123456',
  resetUrl = 'http://localhost:3001/#login',
}) => {
  const bodyHtml = `
    <p style="margin:0 0 14px;font-size:17px;font-weight:700;color:#0f172a;letter-spacing:-0.2px;">Password Reset Code</p>

    <!-- ONLY 1 SINGLE OTP BOX -->
    <div style="text-align:center;margin:20px 0;">
      <div style="display:inline-block;background:#f8fafc;border:1.5px solid #64748b;padding:10px 28px;border-radius:6px;font-size:22px;font-weight:800;letter-spacing:6px;color:#0f172a;">
        ${resetCode}
      </div>
      <p style="margin:8px 0 0;font-size:11.5px;color:#64748b;">This OTP code expires in 15 minutes.</p>
    </div>

    <div style="text-align:center;margin:18px 0 12px;">
      <a href="${resetUrl}" style="display:inline-block;background:#0f172a;color:#ffffff;text-decoration:none;padding:11px 26px;border-radius:6px;font-size:13px;font-weight:700;">
        Reset Your Password →
      </a>
    </div>

    <div style="font-size:12px;color:#64748b;line-height:1.5;border-top:1px solid #f1f5f9;padding-top:14px;margin-top:18px;">
      Thank you,<br/>
      <strong style="color:#0f172a;">Torado Commerce Team</strong><br/>
      <span style="font-size:11px;color:#94a3b8;">Premium Apparel & Streetwear • <a href="mailto:support@torado.com" style="color:#64748b;text-decoration:none;">support@torado.com</a></span>
    </div>
  `;

  return sendMail({
    to,
    subject: `Torado | Your Password Reset Code is ${resetCode}`,
    html: buildEmailHtml(bodyHtml, STATUS_THEMES.default),
    text: `Your Torado password reset code is ${resetCode}. It expires in 15 minutes.`,
  });
};
