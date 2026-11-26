import PDFDocument from 'pdfkit';

/**
 * Generate a professional Tax Invoice PDF buffer
 * Formatted exactly identical to Hospital Project Pharmacy Invoice (CarePulse HMS)
 * @param {Object} order Complete order object with id, customer_name, customer_email, shipping_address, total, subtotal, payment_method, payment_status, created_at
 * @param {Array} items Array of product items
 * @returns {Promise<Buffer>} Resolves to PDF Buffer
 */
export const generateOrderInvoicePdf = (order, items = []) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        margin: 36,
        size: 'A4',
        info: {
          Title: `Tax Invoice - TRD-${order.id || '101'}`,
          Author: 'Torado Store',
          Subject: 'Official Retail Tax Invoice',
        },
      });

      const buffers = [];
      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', (err) => reject(err));

      const primaryColor = '#0284c7';
      const textColor = '#1e293b';
      const mutedColor = '#64748b';
      const greenColor = '#15803d';
      const amberColor = '#b45309';
      const borderColor = '#cbd5e1';

      const storeName = 'Torado Store';
      const storeAddress = '402, Royal Palace, Varachha Main Road, Surat, Gujarat 395006';
      const storeContact = 'Support: +91 98765 43210 • support@torado.com';

      const customerName = order.customer_name || 'Aksh Kumbhani';
      const customerPhone = order.customer_phone || '+91 98765 43210';
      const customerEmail = order.customer_email || 'akshkumbhani9@gmail.com';

      let rawAddr = order.shipping_address || '402, Royal Palace, Varachha Main Road, Surat, Gujarat 395006, India';
      if (typeof rawAddr === 'object') rawAddr = Object.values(rawAddr).filter(Boolean).join(', ');
      rawAddr = String(rawAddr).replace(/\\"/g, '').replace(/"/g, '').trim();

      const billDate = String(
        order.created_at ? new Date(order.created_at).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)
      );

      const isCod = String(order.payment_method || '').toLowerCase().includes('cod');
      const isPaid = String(order.payment_status || '').toLowerCase() === 'paid';
      const paymentMode = isCod ? 'CASH ON DELIVERY (COD)' : 'ONLINE PREPAID (RAZORPAY)';
      const statusLabel = isPaid ? 'STATUS: PAID' : 'STATUS: PENDING (COD)';
      const statusColor = isPaid ? greenColor : amberColor;

      const orderId = order.id || '101';
      const billNumber = `TRD-INV-${orderId}`;
      const totalAmount = Number(order.total || 0).toFixed(2);
      const subtotalAmount = Number(order.subtotal || totalAmount).toFixed(2);
      const discountAmount = Number(order.discount || 0).toFixed(2);
      const shippingAmount = Number(order.shipping_cost || 49.00).toFixed(2);

      // 1. Hospital / Store Header (Exact Pharmacy PDF Layout)
      doc.fontSize(18).fillColor(primaryColor).font('Helvetica-Bold').text(storeName, { align: 'left' });
      doc.fontSize(8.5).fillColor(mutedColor).font('Helvetica').text('PREMIUM APPAREL & STREETWEAR • OFFICIAL RETAIL TAX INVOICE', { align: 'left' });
      doc.fontSize(8).fillColor(mutedColor).text(`${storeAddress} • ${storeContact}`, { align: 'left' });

      // Right-aligned Invoice Badge (Exact Pharmacy Layout)
      doc.fontSize(14).fillColor(primaryColor).font('Helvetica-Bold').text('TAX INVOICE', 400, 36, { align: 'right' });
      doc.fontSize(9).fillColor(statusColor).font('Helvetica-Bold').text(statusLabel, 400, 54, { align: 'right' });
      doc.fontSize(8.5).fillColor(textColor).font('Helvetica').text(`Bill #: ${billNumber}`, 400, 68, { align: 'right' });
      doc.fontSize(8.5).fillColor(mutedColor).text(`Date: ${billDate}`, 400, 80, { align: 'right' });

      doc.moveDown(1.5);
      const dividerY = 98;
      doc.strokeColor(borderColor).lineWidth(1).moveTo(36, dividerY).lineTo(559, dividerY).stroke();

      // 2. Info Grid: Customer & Order Details (Exact Pharmacy 76px Box)
      const gridY = 108;
      doc.roundedRect(36, gridY, 523, 76, 4).fillAndStroke('#f8fafc', '#e2e8f0');

      // Column 1: Customer Details
      doc.fillColor(primaryColor).font('Helvetica-Bold').fontSize(9).text('CUSTOMER INFORMATION', 48, gridY + 10);
      doc.fillColor(textColor).font('Helvetica-Bold').fontSize(9.5).text(customerName, 48, gridY + 24);
      doc.font('Helvetica').fontSize(8).fillColor(mutedColor)
        .text(`Phone: ${customerPhone}`, 48, gridY + 38)
        .text(`Email: ${customerEmail}`, 48, gridY + 50)
        .text(`Address: ${rawAddr.slice(0, 50)}${rawAddr.length > 50 ? '...' : ''}`, 48, gridY + 62);

      // Column 2: Order & Dispatch Details
      doc.fillColor(primaryColor).font('Helvetica-Bold').fontSize(9).text('ORDER & BILLING DETAILS', 300, gridY + 10);
      doc.fillColor(textColor).font('Helvetica-Bold').fontSize(9.5).text(`Order #TRD-${orderId}`, 300, gridY + 24);
      doc.font('Helvetica').fontSize(8).fillColor(mutedColor)
        .text(`Payment Mode: ${paymentMode}`, 300, gridY + 38)
        .text(`Payment Status: ${isPaid ? 'Settled / Collected' : 'To Pay on Delivery'}`, 300, gridY + 50)
        .text(`Fulfilled By: Torado Store Express Hub`, 300, gridY + 62);

      // 3. Table Header (Exact Pharmacy Blue Table Bar)
      const tableTop = gridY + 92;
      doc.roundedRect(36, tableTop, 523, 22, 2).fillAndStroke('#e0f2fe', '#bae6fd');
      doc.fillColor('#0369a1').font('Helvetica-Bold').fontSize(8);
      doc.text('#', 44, tableTop + 6, { width: 20 });
      doc.text('ITEM DESCRIPTION', 66, tableTop + 6, { width: 220 });
      doc.text('SPECIFICATION / SIZE', 290, tableTop + 6, { width: 95 });
      doc.text('QTY', 387, tableTop + 6, { width: 35, align: 'center' });
      doc.text('PRICE', 424, tableTop + 6, { width: 55, align: 'right' });
      doc.text('TOTAL', 481, tableTop + 6, { width: 68, align: 'right' });

      // Table Rows
      let currentY = tableTop + 24;
      const orderItems = items && items.length > 0 ? items : [{ product_name: 'Torado Cotton Apparel', quantity: 1, unit_price: subtotalAmount, size: 'M' }];

      orderItems.forEach((m, idx) => {
        const isEven = idx % 2 === 0;
        if (isEven) {
          doc.rect(36, currentY, 523, 20).fill('#fcfcfd');
        }
        doc.fillColor(textColor).font('Helvetica').fontSize(8);
        doc.text(String(idx + 1), 44, currentY + 5, { width: 20 });

        const itemName = m.product_name || m.name || 'Torado Premium Tee';
        doc.font('Helvetica-Bold').text(itemName, 66, currentY + 5, { width: 220 });

        doc.font('Helvetica').fillColor(mutedColor);
        const spec = [m.size ? `Size: ${m.size}` : null, m.color ? `Color: ${m.color}` : null].filter(Boolean).join(' • ') || 'Standard';
        doc.text(spec, 290, currentY + 5, { width: 95 });

        const qty = Number(m.quantity || 1);
        const unit = Number(m.unit_price || m.price || 0);
        doc.fillColor(textColor).text(String(qty), 387, currentY + 5, { width: 35, align: 'center' });
        doc.text(`Rs. ${unit.toFixed(2)}`, 424, currentY + 5, { width: 55, align: 'right' });

        const lineTotal = Number(m.subtotal || qty * unit).toFixed(2);
        doc.font('Helvetica-Bold').fillColor(textColor).text(`Rs. ${lineTotal}`, 481, currentY + 5, { width: 68, align: 'right' });

        doc.strokeColor('#f1f5f9').lineWidth(0.5).moveTo(36, currentY + 20).lineTo(559, currentY + 20).stroke();
        currentY += 20;
      });

      // 4. Totals Block (Exact Pharmacy Totals Layout)
      currentY += 8;
      const totalsX = 350;
      const totalsWidth = 209;

      // Subtotal
      doc.font('Helvetica').fontSize(8.5).fillColor(mutedColor).text('Items Subtotal:', totalsX, currentY, { width: 100, align: 'right' });
      doc.font('Helvetica-Bold').fontSize(8.5).fillColor(textColor).text(`Rs. ${subtotalAmount}`, totalsX + 105, currentY, { width: 95, align: 'right' });
      currentY += 14;

      // Shipping / Delivery
      doc.font('Helvetica').fontSize(8.5).fillColor(mutedColor).text('Shipping & Delivery:', totalsX, currentY, { width: 100, align: 'right' });
      doc.font('Helvetica-Bold').fontSize(8.5).fillColor('#2563eb').text(`+Rs. ${shippingAmount}`, totalsX + 105, currentY, { width: 95, align: 'right' });
      currentY += 14;

      // Discount (if any)
      if (Number(discountAmount) > 0) {
        doc.font('Helvetica').fontSize(8.5).fillColor(mutedColor).text('Discount Coupon:', totalsX, currentY, { width: 100, align: 'right' });
        doc.font('Helvetica').fontSize(8.5).fillColor('#dc2626').text(`-Rs. ${Number(discountAmount).toFixed(2)}`, totalsX + 105, currentY, { width: 95, align: 'right' });
        currentY += 14;
      }

      // Grand Total Box (Exact Pharmacy Green Box)
      doc.roundedRect(totalsX, currentY, totalsWidth, 26, 4).fillAndStroke('#ecfdf5', '#a7f3d0');
      doc.font('Helvetica-Bold').fontSize(10).fillColor('#065f46').text('Total Payable:', totalsX + 8, currentY + 8);
      doc.font('Helvetica-Bold').fontSize(11).fillColor('#15803d').text(`Rs. ${totalAmount}`, totalsX + 100, currentY + 7, { width: 100, align: 'right' });

      // 5. Signatures and Disclaimer (Exact Pharmacy Layout)
      currentY = Math.max(currentY + 50, 480);
      doc.strokeColor(borderColor).lineWidth(0.5).moveTo(36, currentY).lineTo(559, currentY).stroke();
      currentY += 12;

      doc.font('Helvetica').fontSize(8).fillColor(mutedColor)
        .text(`Fulfilled By: Torado Dispatch Logistics Hub`, 36, currentY)
        .text(`Payment Mode: ${paymentMode} • Verified & Stock Updated`, 36, currentY + 12);

      doc.font('Helvetica-Bold').fontSize(8).fillColor(textColor)
        .text('Authorized Torado Store Seal / Sign', 400, currentY, { align: 'right' })
        .font('Helvetica').fontSize(7.5).fillColor(mutedColor)
        .text('[Digitally Verified Commercial Store Desk]', 400, currentY + 12, { align: 'right' });

      currentY += 28;
      const policyBoxHeight = 72;
      doc.roundedRect(36, currentY, 523, policyBoxHeight, 4).fillAndStroke('#f8fafc', '#cbd5e1');

      doc.font('Helvetica-Bold').fontSize(8.2).fillColor('#0f172a').text(
        'RETURN & REFUND POLICY (7-DAY HASSLE-FREE ASSURANCE)',
        46,
        currentY + 7
      );

      const policyLines = [
        '1. Return Window: Return or replacement requests must be initiated within 7 days from the delivery date.',
        '2. Condition of Items: Apparel must be unused, unwashed, unaltered, and with all original brand tags attached.',
        '3. Online Refunds: Credited directly to the original payment source (UPI/Card/NetBanking) within 5-7 business days.',
        '4. COD Refunds: Transferred safely to your designated Bank Account or UPI ID once the return package is inspected.',
        '5. Helpdesk & Claims: Reach our 24/7 helpdesk at support@torado.com or via Torado Store App / Website.'
      ];

      let pY = currentY + 21;
      doc.font('Helvetica').fontSize(7.2).fillColor('#475569');
      policyLines.forEach((line) => {
        doc.text(line, 46, pY, { width: 503 });
        pY += 9.5;
      });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};
