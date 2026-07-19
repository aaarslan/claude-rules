# Order contract

Public contract for the orders resource. Integrators depend on this document;
treat every value in it as published surface.

## States

An order is always in exactly one state.

| State | Meaning | Terminal |
| --- | --- | --- |
| `pending` | Placed, not yet paid or accepted. Inventory is reserved. | no |
| `confirmed` | Payment captured and accepted for fulfilment. | no |
| `shipped` | Handed to the carrier; tracking is available. | no |
| `delivered` | Carrier confirmed delivery. | yes |
| `cancelled` | Ended before delivery; payment refunded if captured. | yes |

## Transitions

```
pending   -> confirmed | cancelled
confirmed -> shipped   | cancelled
shipped   -> delivered
```

Terminal states have no outgoing transitions. Any other move is rejected with
`409 invalid_transition`.

## Representation

Orders are returned with the state as a lowercase string:

```json
{ "id": "ord_8fc2a1", "state": "pending", "totalCents": 4980 }
```

A full response body is in `samples/order.json`.

## Filtering

`GET /orders?state=pending` filters by state. An unknown value is rejected
with `400 unknown_state`.

## Stored values

Orders placed before the 2024 storage migration kept a per-service spelling of
the state, for example `AWAITING_PAYMENT` or `PENDING_PAYMENT` for `pending`.
Those rows were never rewritten. Reads resolve them through the compatibility
bridge, so the API never exposes a historical value, but any consumer reading
the database directly must keep accepting them.

## Compatibility

The state values are part of the public contract. Removing or renaming one is
a breaking change requiring a new API version. Adding a state is additive, but
clients must tolerate unknown values by treating them as non-terminal.
