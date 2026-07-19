import { assertOrderState, OrderState } from './orderState.js';

/**
 * States that page the on-call rota when an order sits in them past its SLA.
 * Written as wire values because the alert rules are matched against the raw
 * event payload before it is parsed.
 */
const SLA_ALERT_STATES = Object.freeze(['pending', 'confirmed']);

/** True when a raw payload's state is one the SLA watcher cares about. */
export function isSlaWatched(rawState) {
  return SLA_ALERT_STATES.includes(rawState);
}

/**
 * Handles `order.state_changed` events from the message bus and turns each one
 * into the side effects that state requires.
 */
export function handleOrderEvent(event, effects) {
  if (event.type !== 'order.state_changed') {
    return { handled: false, reason: `ignored event type ${event.type}` };
  }

  const state = assertOrderState(event.data.state);
  const orderId = event.data.orderId;

  switch (state) {
    case OrderState.PENDING:
      effects.reserveInventory(orderId, event.data.lines);
      effects.scheduleAbandonmentCheck(orderId);
      return { handled: true, state };

    case OrderState.CONFIRMED:
      effects.capturePayment(orderId);
      effects.notifyWarehouse(orderId);
      return { handled: true, state };

    case OrderState.SHIPPED:
      effects.sendTrackingEmail(orderId, event.data.trackingNumber);
      return { handled: true, state };

    case OrderState.DELIVERED:
      effects.releaseInventoryHold(orderId);
      effects.requestReview(orderId);
      return { handled: true, state };

    case OrderState.CANCELLED:
      effects.releaseInventoryHold(orderId);
      effects.refundPayment(orderId);
      return { handled: true, state };

    default:
      throw new Error(`no handler for order state ${state}`);
  }
}
