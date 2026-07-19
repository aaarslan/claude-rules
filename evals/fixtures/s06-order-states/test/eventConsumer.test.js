import test from 'node:test';
import assert from 'node:assert/strict';

import { handleOrderEvent } from '../src/eventConsumer.js';
import { ORDER_STATES } from '../src/orderState.js';

function recordingEffects() {
  const calls = [];
  const record = (name) => (...args) => calls.push([name, ...args]);
  return {
    calls,
    names: () => calls.map(([name]) => name),
    reserveInventory: record('reserveInventory'),
    scheduleAbandonmentCheck: record('scheduleAbandonmentCheck'),
    capturePayment: record('capturePayment'),
    notifyWarehouse: record('notifyWarehouse'),
    sendTrackingEmail: record('sendTrackingEmail'),
    releaseInventoryHold: record('releaseInventoryHold'),
    requestReview: record('requestReview'),
    refundPayment: record('refundPayment'),
  };
}

function event(state, data = {}) {
  return {
    type: 'order.state_changed',
    data: { orderId: 'ord_8fc2a1', state, ...data },
  };
}

test('a pending order reserves inventory and schedules the abandonment check', () => {
  const effects = recordingEffects();
  const result = handleOrderEvent(event('pending', { lines: [] }), effects);
  assert.deepEqual(result, { handled: true, state: 'pending' });
  assert.deepEqual(effects.names(), ['reserveInventory', 'scheduleAbandonmentCheck']);
});

test('a cancelled order releases the hold and refunds', () => {
  const effects = recordingEffects();
  handleOrderEvent(event('cancelled'), effects);
  assert.deepEqual(effects.names(), ['releaseInventoryHold', 'refundPayment']);
});

test('every lifecycle state is handled', () => {
  for (const state of ORDER_STATES) {
    const effects = recordingEffects();
    const result = handleOrderEvent(event(state, { lines: [] }), effects);
    assert.equal(result.handled, true, `state ${state} was not handled`);
    assert.ok(effects.calls.length > 0, `state ${state} produced no effects`);
  }
});

test('unknown states are rejected and other event types are ignored', () => {
  const effects = recordingEffects();
  assert.throws(() => handleOrderEvent(event('archived'), effects), TypeError);
  const result = handleOrderEvent({ type: 'order.note_added', data: {} }, effects);
  assert.equal(result.handled, false);
});
