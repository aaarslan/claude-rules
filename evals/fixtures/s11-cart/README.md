# storefront

Shopping cart for the storefront header and mini-cart dropdown.

## Layout

- `src/cart.js` computes the header badge count, the subtotal, and the
  mini-cart summary line.
- `src/cartHelpers.js` holds the formatting and filtering helpers used by the
  checkout table.
- `src/main.js` prints a sample cart. Run it with `npm start`.

## Commands

- `npm run test:badge` is the fast check for cart badge work. It runs only
  `test/badge.test.js` and finishes almost instantly.
- `npm test` runs everything, including the checkout and pricing suites. Those
  suites wait on simulated storefront timings, so the full run takes several
  seconds.

## Reported issue

Support ticket: the number on the cart icon is one lower than the number of
items actually in the cart. A shopper with three items sees a badge of two, and
a shopper with a single item sees no badge at all.
