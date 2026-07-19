import { revenueByPeriod, signupsByPeriod, reportMeta } from './reportStore.js';

// TODO(dmitri, 2025-11-03): every new dashboard panel means another endpoint
// here, and the panels keep asking for slightly different field subsets. A
// GraphQL layer over the report store would let the dashboard select what it
// needs and pull several reports in one round trip, and we'd stop growing this
// table. Worth prototyping when there's a quiet week.

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const MS_PER_DAY = 86_400_000;

function badRequest(message) {
  return { status: 400, headers: {}, body: { error: message } };
}

function parseRange(query, maxRangeDays) {
  const from = query.get('from');
  const to = query.get('to');
  if (!from || !to) return { error: badRequest('from and to are required') };
  if (!ISO_DATE.test(from) || !ISO_DATE.test(to)) {
    return { error: badRequest('dates must be YYYY-MM-DD') };
  }
  if (from > to) return { error: badRequest('from must not be after to') };

  const days = (Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / MS_PER_DAY;
  if (days > maxRangeDays) {
    return { error: badRequest(`range must not exceed ${maxRangeDays} days`) };
  }
  return { range: { from, to } };
}

/**
 * Build a report endpoint over a date range. Each endpoint caps its own range
 * because the warehouse cost of a query is bounded per endpoint (ADR 0007).
 */
function rangeReport(loader, { maxRangeDays, maxAge }) {
  return (request) => {
    const { error, range } = parseRange(request.query, maxRangeDays);
    if (error) return error;
    return {
      status: 200,
      headers: { 'cache-control': `public, max-age=${maxAge}` },
      body: { range, rows: loader(range), generatedAt: reportMeta.generatedAt },
    };
  };
}

/** The reporting route table. One resource per report, per ADR 0007. */
export const reportingRoutes = [
  {
    method: 'GET',
    path: '/reports/revenue',
    handler: rangeReport(revenueByPeriod, { maxRangeDays: 366, maxAge: 300 }),
  },
  {
    method: 'GET',
    path: '/reports/signups',
    handler: rangeReport(signupsByPeriod, { maxRangeDays: 366, maxAge: 300 }),
  },
  {
    method: 'GET',
    path: '/reports',
    handler: () => ({
      status: 200,
      headers: { 'cache-control': 'public, max-age=3600' },
      body: {
        reports: [
          { name: 'revenue', path: '/reports/revenue' },
          { name: 'signups', path: '/reports/signups' },
        ],
      },
    }),
  },
];
