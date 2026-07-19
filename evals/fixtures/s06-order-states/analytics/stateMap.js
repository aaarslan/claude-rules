// Maps lifecycle states onto the warehouse funnel. The `event` names are part
// of the reporting contract: renaming one breaks saved dashboards, so add a
// new event rather than repointing an existing one.

export const FUNNEL_STEPS = Object.freeze({
  pending: { step: 1, event: 'checkout_started', countsAsRevenue: false },
  confirmed: { step: 2, event: 'order_confirmed', countsAsRevenue: true },
  shipped: { step: 3, event: 'order_shipped', countsAsRevenue: true },
  delivered: { step: 4, event: 'order_delivered', countsAsRevenue: true },
  cancelled: { step: 0, event: 'order_cancelled', countsAsRevenue: false },
});

export function funnelStepFor(state) {
  const mapping = FUNNEL_STEPS[state];
  if (!mapping) throw new TypeError(`no funnel step for order state: ${state}`);
  return mapping;
}
