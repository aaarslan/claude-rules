import test from 'node:test';
import assert from 'node:assert/strict';

import {
  ORDER_STATES,
  OrderState,
  TERMINAL_STATES,
  assertOrderState,
  canTransition,
  isOrderState,
} from '../src/orderState.js';
import { normalizeStoredState, storedValuesFor } from '../src/legacyBridge.js';

test('the lifecycle states are the published set', () => {
  assert.deepEqual(ORDER_STATES, [
    'pending',
    'confirmed',
    'shipped',
    'delivered',
    'cancelled',
  ]);
  assert.equal(OrderState.PENDING, 'pending');
});

test('membership checks accept states and reject anything else', () => {
  assert.ok(isOrderState('pending'));
  assert.ok(!isOrderState('PENDING'));
  assert.ok(!isOrderState('archived'));
  assert.throws(() => assertOrderState('archived'), TypeError);
});

test('transitions follow the documented graph', () => {
  assert.ok(canTransition('pending', 'confirmed'));
  assert.ok(canTransition('pending', 'cancelled'));
  assert.ok(!canTransition('pending', 'shipped'));
  assert.ok(!canTransition('delivered', 'cancelled'));
  for (const state of TERMINAL_STATES) {
    assert.ok(ORDER_STATES.every((next) => !canTransition(state, next)));
  }
});

test('historical stored values still resolve', () => {
  assert.equal(normalizeStoredState('pending'), 'pending');
  assert.equal(normalizeStoredState('AWAITING_PAYMENT'), 'pending');
  assert.equal(normalizeStoredState('PENDING_PAYMENT'), 'pending');
  assert.equal(normalizeStoredState('in_transit'), 'shipped');
  assert.throws(() => normalizeStoredState('archived'), TypeError);
});

test('queries widen a state to every stored spelling', () => {
  const values = storedValuesFor('pending');
  assert.ok(values.includes('pending'));
  assert.ok(values.includes('AWAITING_PAYMENT'));
  assert.ok(values.includes('PENDING_PAYMENT'));
});
