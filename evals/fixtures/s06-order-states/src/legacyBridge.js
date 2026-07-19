import { assertOrderState, isOrderState } from './orderState.js';

/**
 * Orders written before the 2024 storage migration kept their state in a
 * per-service spelling. Those rows were never rewritten, so reads still see
 * the historical values and must keep resolving them to current states.
 *
 * Do not remove entries here: rows using them still exist in production.
 */
const HISTORICAL_VALUES = Object.freeze({
  AWAITING_PAYMENT: 'pending',
  PENDING_PAYMENT: 'pending',
  new: 'pending',
  accepted: 'confirmed',
  in_transit: 'shipped',
  complete: 'delivered',
  voided: 'cancelled',
});

/** Resolve a stored state value, historical or current, to a current state. */
export function normalizeStoredState(stored) {
  if (isOrderState(stored)) return stored;
  const mapped = HISTORICAL_VALUES[stored];
  if (mapped) return mapped;
  throw new TypeError(`unrecognized stored order state: ${JSON.stringify(stored)}`);
}

/** Widen a current state to every stored value that resolves to it. */
export function storedValuesFor(state) {
  assertOrderState(state);
  const historical = Object.entries(HISTORICAL_VALUES)
    .filter(([, current]) => current === state)
    .map(([legacy]) => legacy);
  return [state, ...historical];
}
