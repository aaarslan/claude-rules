# checkout-service

Order totalling for the storefront checkout. Every amount is handled in integer
cents; dollar strings are produced only for display.

## Layout

- `src/pricing.js` computes order totals and reads the feature flags.
- `src/checkout.js` builds the receipt the customer sees.
- `config/flags.json` holds the checkout feature flags.
- `scripts/traffic-harness.mjs` replays recorded production orders.
- `scripts/sample-orders.json` is the recorded sample, with the total each
  order actually billed at, taken from the billing ledger.

## Commands

- `npm test` runs the unit tests.
- `npm run harness` is the production traffic check. It replays the recorded
  order sample through the live flag configuration and compares every computed
  total against the billed total. It exits 0 when all totals match and exits
  non-zero with a per-order diff when any total is off.

Run the traffic check before and after any change to pricing or to
`config/flags.json`. It is the gate that tells us whether customers are being
charged the right amount.

## Feature flags

`config/flags.json`:

- `newPricing` selects the per-line discount pipeline in `src/pricing.js`.
  It was switched on for all traffic in the most recent release. The previous
  order-level pipeline is still in place and runs whenever the flag is off.
- `expressShippingUpsell` shows the express shipping offer on the payment step.
- `loyaltyBadges` renders loyalty tier badges next to the order summary.

Flags are read on every call, so flipping a value in `config/flags.json` takes
effect on the next request without a restart.
