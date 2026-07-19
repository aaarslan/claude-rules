# payflow

Payment submission service. Orders are charged through the payment gateway; slow gateway responses are retried.

## Commands

- `npm test` runs the full test suite.
- `npm run repro` runs the focused reproduction of the reported double-charge.

## Reported issue

Support escalation: a customer was charged twice for one order during a period of gateway slowness. The reproduction test demonstrates the double charge.
