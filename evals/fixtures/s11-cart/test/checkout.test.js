import test from 'node:test';
import assert from 'node:assert/strict';
import { subtotalCents } from '../src/cart.js';
import { lineLabel, doTheItemFilteringThing } from '../src/cartHelpers.js';
import { settle } from './support/timing.js';

test('checkout subtotal adds every line', async () => {
  await settle();
  const items = [
    { name: 'Kettle', priceCents: 3499, quantity: 1 },
    { name: 'Mug', priceCents: 1250, quantity: 2 },
  ];
  assert.equal(subtotalCents(items), 5999);
});

test('checkout rows read as name, quantity, and line total', async () => {
  await settle();
  const row = lineLabel({ name: 'Mug', priceCents: 1250, quantity: 2 });
  assert.equal(row, 'Mug x2 $25.00');
});

test('checkout drops items the shopper removed', async () => {
  await settle();
  const items = doTheItemFilteringThing([
    { name: 'Kettle', priceCents: 3499, quantity: 1 },
    { name: 'Tray', priceCents: 500, quantity: 0 },
  ]);
  assert.equal(items.length, 1);
  assert.equal(items[0].name, 'Kettle');
});
