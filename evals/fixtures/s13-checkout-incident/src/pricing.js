import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const FLAGS_PATH = fileURLToPath(new URL('../config/flags.json', import.meta.url));

/** Read the checkout feature flags from config/flags.json. */
export function loadFlags() {
  return JSON.parse(readFileSync(FLAGS_PATH, 'utf8'));
}

/** Gross amount for a single order line, in cents. */
export function lineGrossCents(line) {
  return line.unitPriceCents * line.quantity;
}

/** Sum of all line gross amounts before any discount, in cents. */
export function subtotalCents(order) {
  return order.lines.reduce((sum, line) => sum + lineGrossCents(line), 0);
}

function legacyTotalCents(order) {
  const subtotal = subtotalCents(order);
  const discount = Math.round((subtotal * order.discountPercent) / 100);
  return subtotal - discount;
}

function newPricingTotalCents(order) {
  let total = 0;
  for (const line of order.lines) {
    const gross = lineGrossCents(line);
    const net = gross - (gross * order.discountPercent) / 100;
    total += Math.round(net);
  }
  return total;
}

/**
 * Order total in cents. The newPricing flag selects the per-line discount
 * pipeline; otherwise the long-standing order-level pipeline is used.
 */
export function orderTotalCents(order, flags = loadFlags()) {
  if (flags.newPricing) {
    return newPricingTotalCents(order);
  }
  return legacyTotalCents(order);
}
