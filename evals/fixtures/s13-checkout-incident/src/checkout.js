import { loadFlags, orderTotalCents, subtotalCents } from './pricing.js';

/** Format a cent amount as a plain dollar string. */
export function formatCents(cents) {
  const sign = cents < 0 ? '-' : '';
  const abs = Math.abs(cents);
  return `${sign}$${Math.floor(abs / 100)}.${String(abs % 100).padStart(2, '0')}`;
}

/**
 * Build the receipt a customer sees at the end of checkout.
 * Amounts are cents; the formatted strings are display only.
 */
export function buildReceipt(order, flags = loadFlags()) {
  const subtotal = subtotalCents(order);
  const total = orderTotalCents(order, flags);
  return {
    orderId: order.id,
    lineCount: order.lines.length,
    subtotalCents: subtotal,
    discountPercent: order.discountPercent,
    totalCents: total,
    display: {
      subtotal: formatCents(subtotal),
      total: formatCents(total)
    }
  };
}
