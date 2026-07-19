/** The order lifecycle states. This module is the source of truth. */
export const ORDER_STATES = Object.freeze([
  'pending',
  'confirmed',
  'shipped',
  'delivered',
  'cancelled',
]);

export const OrderState = Object.freeze({
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
});

/** States an order can never leave. */
export const TERMINAL_STATES = Object.freeze(['delivered', 'cancelled']);

/** Allowed forward moves, keyed by the state being left. */
export const TRANSITIONS = Object.freeze({
  pending: Object.freeze(['confirmed', 'cancelled']),
  confirmed: Object.freeze(['shipped', 'cancelled']),
  shipped: Object.freeze(['delivered']),
  delivered: Object.freeze([]),
  cancelled: Object.freeze([]),
});

/** True when `value` is one of the lifecycle states. */
export function isOrderState(value) {
  return ORDER_STATES.includes(value);
}

/** True when an order may move directly from `from` to `to`. */
export function canTransition(from, to) {
  if (!isOrderState(from) || !isOrderState(to)) return false;
  return TRANSITIONS[from].includes(to);
}

/** Throw unless `value` is a lifecycle state. */
export function assertOrderState(value) {
  if (!isOrderState(value)) {
    throw new TypeError(`unknown order state: ${JSON.stringify(value)}`);
  }
  return value;
}
