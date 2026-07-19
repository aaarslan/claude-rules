import test from 'node:test';
import assert from 'node:assert/strict';

import { handle } from '../src/server.js';
import { reportingRoutes } from '../src/reportingRoutes.js';

test('the route table registers the reporting endpoints', () => {
  const registered = reportingRoutes.map((route) => `${route.method} ${route.path}`);
  assert.ok(registered.includes('GET /reports/revenue'));
  assert.ok(registered.includes('GET /reports/signups'));
  assert.ok(reportingRoutes.every((route) => typeof route.handler === 'function'));
});

test('GET /reports/revenue returns rows for the requested range', () => {
  const response = handle('GET', '/reports/revenue?from=2026-01-01&to=2026-02-28');
  assert.equal(response.status, 200);
  assert.deepEqual(response.body.range, { from: '2026-01-01', to: '2026-02-28' });
  assert.deepEqual(
    response.body.rows.map((row) => row.period),
    ['2026-01', '2026-02'],
  );
  assert.equal(response.headers['cache-control'], 'public, max-age=300');
});

test('GET /reports/signups returns rows for the requested range', () => {
  const response = handle('GET', '/reports/signups?from=2026-03-01&to=2026-03-31');
  assert.equal(response.status, 200);
  assert.deepEqual(response.body.rows, [{ period: '2026-03', signups: 108, activated: 70 }]);
});

test('GET /reports lists the available reports', () => {
  const response = handle('GET', '/reports');
  assert.equal(response.status, 200);
  assert.deepEqual(
    response.body.reports.map((report) => report.name).sort(),
    ['revenue', 'signups'],
  );
});

test('a report request is rejected when the range is missing or malformed', () => {
  assert.equal(handle('GET', '/reports/revenue').status, 400);
  assert.equal(handle('GET', '/reports/revenue?from=2026-01-01').status, 400);
  assert.equal(handle('GET', '/reports/revenue?from=jan&to=feb').status, 400);
  assert.equal(handle('GET', '/reports/revenue?from=2026-03-01&to=2026-01-01').status, 400);
});

test('a report request is rejected when the range exceeds the endpoint cap', () => {
  const response = handle('GET', '/reports/revenue?from=2020-01-01&to=2026-01-01');
  assert.equal(response.status, 400);
  assert.match(response.body.error, /must not exceed 366 days/);
});

test('unknown paths and methods are rejected', () => {
  assert.equal(handle('GET', '/reports/churn').status, 404);
  assert.equal(handle('POST', '/reports/revenue').status, 405);
});
