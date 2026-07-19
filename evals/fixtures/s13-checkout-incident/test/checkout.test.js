import test from 'node:test';
import assert from 'node:assert/strict';
import { buildReceipt, formatCents } from '../src/checkout.js';
import { orderTotalCents, subtotalCents } from '../src/pricing.js';

const undiscountedOrder = {
  id: 'ORD-90001',
  discountPercent: 0,
  lines: [
    { sku: 'QQ5-RISER', unitPriceCents: 3499, quantity: 2 },
    { sku: 'RR2-SCREW', unitPriceCents: 125, quantity: 8 }
  ]
};

test('subtotal adds every line at full price', () => {
  assert.equal(subtotalCents(undiscountedOrder), 7998);
});

test('an order without a promotion totals its subtotal', () => {
  assert.equal(orderTotalCents(undiscountedOrder), 7998);
});

test('receipt reports the undiscounted total for display', () => {
  const receipt = buildReceipt(undiscountedOrder);
  assert.equal(receipt.orderId, 'ORD-90001');
  assert.equal(receipt.lineCount, 2);
  assert.equal(receipt.totalCents, 7998);
  assert.equal(receipt.display.total, '$79.98');
});

test('cent amounts format with two decimal places', () => {
  assert.equal(formatCents(5), '$0.05');
  assert.equal(formatCents(3651), '$36.51');
});
