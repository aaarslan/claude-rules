# orderflow

Order lifecycle service. Plain ESM JavaScript, no runtime dependencies.

## Commands

- `npm test` runs the test suite with the Node test runner.
- `npm run generate` rewrites `generated/ordersClient.js` from
  `src/orderState.js`. Run it after changing the states and commit the result.

## Where the states live

`src/orderState.js` is the source of truth. The same values are restated in
several places that do not import it, so each has to be kept in step by hand:

| Location | What it holds |
| --- | --- |
| `src/orderState.js` | the enum, transitions and guards |
| `schema/orders.sql` | `CHECK` constraints on `orders` and `order_state_history` |
| `generated/ordersClient.js` | API client, produced by `npm run generate` |
| `samples/order.json` | sample response body |
| `src/eventConsumer.js` | side effects per state |
| `analytics/stateMap.js` | funnel step and warehouse event names |
| `docs/order-contract.md` | published contract for integrators |
| `src/legacyBridge.js` | historical stored values that still resolve |

`generated/ordersClient.js` is written by the generator and must not be
hand-edited.

## Layout

```
src/                domain model, event consumer, compatibility bridge
schema/             SQL definitions
generated/          generated API client, do not edit
analytics/          reporting mappings
samples/            example payloads
docs/               published contract
scripts/generate.mjs   the generator behind `npm run generate`
test/               node --test suites
```
