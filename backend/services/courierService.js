// Shiprocket / Delhivery Logistics integration module for Torado
import { query } from '../src/db.js';

export const shipOrderWithCourier = async (orderId, courierOption = 'Shiprocket') => {
  try {
    const [order] = await query('SELECT * FROM orders WHERE id = ?', [orderId]);
    if (!order) throw new Error('Order not found');

    const awbCode = `SR${order.id}${Math.floor(10000000 + Math.random() * 90000000)}`;
    const courier = courierOption || 'Shiprocket Express';

    await query(
      "UPDATE orders SET status = 'shipped', courier_name = ?, awb_code = ? WHERE id = ?",
      [courier, awbCode, orderId]
    );

    // Auto add notification for admin
    await query("INSERT INTO notifications(type, title, body) VALUES('order', ?, ?)", [
      `Order #TRD-${orderId} Dispatched via ${courier}`,
      `Shipment created with AWB Code ${awbCode} for ${order.customer_name}.`
    ]).catch(console.error);

    return {
      success: true,
      orderId,
      courierName: courier,
      awbCode
    };
  } catch (err) {
    console.error('[Courier Service Error]', err.message);
    throw err;
  }
};
