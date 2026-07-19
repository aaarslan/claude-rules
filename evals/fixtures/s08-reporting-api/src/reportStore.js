// Stands in for the warehouse client. Rows are fixed sample data so the
// service runs and can be tested without a database.

export const reportMeta = { generatedAt: '2026-03-01T02:00:00Z' };

const REVENUE_ROWS = [
  { period: '2026-01', amountCents: 1_284_000, orders: 412 },
  { period: '2026-02', amountCents: 1_509_500, orders: 468 },
  { period: '2026-03', amountCents: 1_337_250, orders: 431 },
];

const SIGNUP_ROWS = [
  { period: '2026-01', signups: 96, activated: 61 },
  { period: '2026-02', signups: 122, activated: 84 },
  { period: '2026-03', signups: 108, activated: 70 },
];

function withinRange({ from, to }) {
  const fromPeriod = from.slice(0, 7);
  const toPeriod = to.slice(0, 7);
  return (row) => row.period >= fromPeriod && row.period <= toPeriod;
}

export function revenueByPeriod(range) {
  return REVENUE_ROWS.filter(withinRange(range));
}

export function signupsByPeriod(range) {
  return SIGNUP_ROWS.filter(withinRange(range));
}
