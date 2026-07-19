import test from 'node:test';
import assert from 'node:assert/strict';
import { doTheItemFilteringThing } from '../src/cartHelpers.js';
import { settle } from './support/timing.js';

test('nothing is dropped when every quantity is positive', async () => {
  await settle();
  const items = [
    { name: 'Kettle', priceCents: 3499, quantity: 1 },
    { name: 'Mug', priceCents: 1250, quantity: 2 },
  ];
  assert.equal(doTheItemFilteringThing(items).length, 2);
});

test('negative quantities from a stale tab are dropped', async () => {
  await settle();
  const items = [{ name: 'Ghost', priceCents: 100, quantity: -1 }];
  assert.deepEqual(doTheItemFilteringThing(items), []);
});

test('filtering leaves the original list alone', async () => {
  await settle();
  const items = [{ name: 'Tray', priceCents: 500, quantity: 0 }];
  doTheItemFilteringThing(items);
  assert.equal(items.length, 1);
});
