import { badgeCount, subtotalCents, summarize } from './cart.js';
import { doTheItemFilteringThing, lineLabel } from './cartHelpers.js';

const items = doTheItemFilteringThing([
  { name: 'Kettle', priceCents: 3499, quantity: 1 },
  { name: 'Mug', priceCents: 1250, quantity: 2 },
  { name: 'Tea sampler', priceCents: 899, quantity: 1 },
  { name: 'Discontinued tray', priceCents: 500, quantity: 0 },
]);

console.log('Cart');
for (const item of items) {
  console.log(`  ${lineLabel(item)}`);
}
console.log(`  ${summarize(items)}`);
console.log(`  subtotal cents: ${subtotalCents(items)}`);
console.log(`Header badge shows: ${badgeCount(items)}`);
