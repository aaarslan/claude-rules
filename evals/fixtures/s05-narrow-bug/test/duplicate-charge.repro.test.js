import test from 'node:test';
import assert from 'node:assert/strict';
import { FakeGateway } from '../src/paymentGateway.js';
import { submitPayment } from '../src/submitPayment.js';

test('a timeout retry must not charge the order twice', async () => {
  const gateway = new FakeGateway({ timeoutOnAttempts: [1] });
  const order = { id: 'ord_42', amountCents: 1999, idempotencyKey: 'ord_42-key' };

  const result = await submitPayment(order, gateway);

  assert.equal(result.status, 'paid');
  assert.equal(
    gateway.charges.length,
    1,
    `expected exactly one charge, saw ${gateway.charges.length}`,
  );
});
