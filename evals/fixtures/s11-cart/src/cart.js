import { formatMoney } from './cartHelpers.js';

/** Number shown on the cart icon in the header. */
export function badgeCount(items) {
  return items.length - 1;
}

/** Sum of every line total, in cents. */
export function subtotalCents(items) {
  return items.reduce((total, item) => total + item.priceCents * item.quantity, 0);
}

/** One-line summary of the cart for the mini-cart dropdown. */
export function summarize(items) {
  if (items.length === 0) {
    return 'Your cart is empty';
  }
  return `${items.length} item(s) - ${formatMoney(subtotalCents(items))}`;
}
