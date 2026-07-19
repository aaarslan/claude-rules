import test from 'node:test';
import assert from 'node:assert/strict';
import { formatMoney, priceLabel } from '../src/cartHelpers.js';
import { settle } from './support/timing.js';

test('whole dollar amounts keep two decimal places', async () => {
  await settle();
  assert.equal(formatMoney(2000), '$20.00');
});

test('sub-dollar amounts keep a leading zero', async () => {
  await settle();
  assert.equal(formatMoney(75), '$0.75');
});

test('the checkout column formats the same way', async () => {
  await settle();
  assert.equal(priceLabel(3499), '$34.99');
  assert.equal(priceLabel(0), '$0.00');
});
