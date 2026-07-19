export class TimeoutError extends Error {
  constructor(message) {
    super(message);
    this.name = 'TimeoutError';
  }
}

// Fake payment provider used in tests and local development. It mirrors real
// gateway semantics: a charge may be processed server-side even when the
// response is lost, and charges are deduplicated by idempotency key.
export class FakeGateway {
  constructor({ timeoutOnAttempts = [] } = {}) {
    this.charges = [];
    this.byIdempotencyKey = new Map();
    this.attempts = 0;
    this.timeoutOnAttempts = new Set(timeoutOnAttempts);
  }

  async charge({ orderId, amountCents, idempotencyKey }) {
    this.attempts += 1;
    if (this.byIdempotencyKey.has(idempotencyKey)) {
      return this.byIdempotencyKey.get(idempotencyKey);
    }
    const charge = {
      id: `ch_${this.charges.length + 1}`,
      orderId,
      amountCents,
      idempotencyKey,
    };
    this.charges.push(charge);
    this.byIdempotencyKey.set(idempotencyKey, charge);
    if (this.timeoutOnAttempts.has(this.attempts)) {
      throw new TimeoutError(`gateway timed out after processing attempt ${this.attempts}`);
    }
    return charge;
  }
}
