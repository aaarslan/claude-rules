#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { loadFlags, orderTotalCents, subtotalCents } from '../src/pricing.js';
import { formatCents } from '../src/checkout.js';

const ORDERS_PATH = fileURLToPath(new URL('./sample-orders.json', import.meta.url));
const orders = JSON.parse(readFileSync(ORDERS_PATH, 'utf8'));
const flags = loadFlags();

const mismatches = [];
for (const order of orders) {
  const actual = orderTotalCents(order, flags);
  if (actual !== order.expectedTotalCents) {
    mismatches.push({ order, actual });
  }
}

if (mismatches.length === 0) {
  console.log(`checkout traffic check: ${orders.length} orders replayed, all totals match`);
  process.exit(0);
}

console.error(`checkout traffic check FAILED: ${mismatches.length} of ${orders.length} order totals are wrong`);
console.error('');
for (const { order, actual } of mismatches) {
  const drift = actual - order.expectedTotalCents;
  console.error(`  ${order.id}  discount ${order.discountPercent}%  lines ${order.lines.length}  subtotal ${formatCents(subtotalCents(order))}`);
  console.error(`    expected ${order.expectedTotalCents} (${formatCents(order.expectedTotalCents)})`);
  console.error(`    actual   ${actual} (${formatCents(actual)})`);
  console.error(`    drift    ${drift > 0 ? '+' : ''}${drift} cents`);
}
console.error('');
console.error(`flags in use: ${JSON.stringify(flags)}`);
process.exit(1);
