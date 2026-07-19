import test from 'node:test';
import assert from 'node:assert/strict';
import { FakeGateway } from '../src/paymentGateway.js';
import { submitPayment } from '../src/submitPayment.js';
import { PaymentProcessorManager } from '../src/payments/paymentHelper.js';

test('a successful payment charges once and reports the display amount', async () => {
  const gateway = new FakeGateway();
  const order = { id: 'ord_7', amountCents: 2500, idempotencyKey: 'ord_7-key' };

  const result = await submitPayment(order, gateway);

  assert.equal(result.status, 'paid');
  assert.equal(result.display, '$25.00');
  assert.equal(gateway.charges.length, 1);
});

test('validateOrderData accepts a well-formed order', () => {
  const manager = new PaymentProcessorManager();
  assert.equal(manager.validateOrderData({ id: 'ord_1', amountCents: 100 }), true);
  assert.equal(manager.validateOrderData({ id: 'ord_1' }), false);
});
