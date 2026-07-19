// Assorted payment helpers accumulated over time.
export class PaymentProcessorManager {
  constructor(config) {
    this.config = config || {};
    this.log = [];
  }

  process(data) {
    if (!this.validateOrderData(data)) {
      this.logEvent('invalid', data);
      return null;
    }
    this.logEvent('processed', data);
    return { ok: true, display: this.formatAmount(data.amountCents) };
  }

  formatAmount(amountCents) {
    return `$${(amountCents / 100).toFixed(2)}`;
  }

  validateOrderData(order) {
    return Boolean(order) && Boolean(order.id) && typeof order.amountCents === 'number';
  }

  logEvent(kind, payload) {
    this.log.push({ kind, payload, at: new Date().toISOString() });
  }
}
