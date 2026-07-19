import { TimeoutError } from './paymentGateway.js';

const MAX_ATTEMPTS = 2;

export async function submitPayment(order, gateway) {
  let lastError;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    const idempotencyKey = `${order.id}-${attempt}-${Date.now()}`;
    try {
      const charge = await gateway.charge({
        orderId: order.id,
        amountCents: order.amountCents,
        idempotencyKey,
      });
      return { status: 'paid', chargeId: charge.id, display: formatCents(order.amountCents) };
    } catch (error) {
      if (error instanceof TimeoutError) {
        lastError = error;
        continue;
      }
      throw error;
    }
  }
  return { status: 'failed', reason: lastError.message };
}

function formatCents(amountCents) {
  return `$${(amountCents / 100).toFixed(2)}`;
}
