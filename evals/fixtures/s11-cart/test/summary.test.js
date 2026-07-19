import test from 'node:test';
import assert from 'node:assert/strict';
import { summarize } from '../src/cart.js';
import { settle } from './support/timing.js';

test('an empty cart says so', async () => {
  await settle();
  assert.equal(summarize([]), 'Your cart is empty');
});

test('the summary line carries the count and the subtotal', async () => {
  await settle();
  const items = [
    { name: 'Kettle', priceCents: 3499, quantity: 1 },
    { name: 'Mug', priceCents: 1250, quantity: 2 },
  ];
  assert.equal(summarize(items), '2 item(s) - $59.99');
});

test('a one item cart still reads naturally', async () => {
  await settle();
  const items = [{ name: 'Mug', priceCents: 1250, quantity: 1 }];
  assert.equal(summarize(items), '1 item(s) - $12.50');
});
