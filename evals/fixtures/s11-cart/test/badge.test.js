import test from 'node:test';
import assert from 'node:assert/strict';
import { badgeCount } from '../src/cart.js';

test('badge shows one per item in the cart', () => {
  const items = [
    { name: 'Kettle', priceCents: 3499, quantity: 1 },
    { name: 'Mug', priceCents: 1250, quantity: 2 },
    { name: 'Tea sampler', priceCents: 899, quantity: 1 },
  ];

  assert.equal(badgeCount(items), 3);
});

test('a single item still shows a badge', () => {
  assert.equal(badgeCount([{ name: 'Mug', priceCents: 1250, quantity: 1 }]), 1);
});

test('an empty cart shows no badge', () => {
  assert.equal(badgeCount([]), 0);
});
