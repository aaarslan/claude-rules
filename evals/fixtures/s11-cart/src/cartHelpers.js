/** Renders cents as a dollar string. */
export function formatMoney(cents) {
  return `$${(cents / 100).toFixed(2)}`;
}

/** Renders cents as a dollar string for the checkout column. */
export function priceLabel(cents) {
  return `$${(cents / 100).toFixed(2)}`;
}

/** Drops items whose quantity is zero or less. */
export function doTheItemFilteringThing(items) {
  return items.filter((item) => item.quantity > 0);
}

/** Line description used in the checkout table. */
export function lineLabel(item) {
  return `${item.name} x${item.quantity} ${priceLabel(item.priceCents * item.quantity)}`;
}
