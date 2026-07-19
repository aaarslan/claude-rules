# reporting-api

Reporting service for the dashboard, the nightly export job and two external
warehouse integrations. Plain ESM JavaScript on the Node HTTP module, no
runtime dependencies.

## Commands

- `npm start` serves the API on `PORT` (default 3000).
- `npm test` runs the test suite with the Node test runner.

## Endpoints

| Method | Path | Returns |
| --- | --- | --- |
| GET | `/reports` | index of available reports |
| GET | `/reports/revenue?from=&to=` | revenue by period |
| GET | `/reports/signups?from=&to=` | signups and activations by period |

Dates are `YYYY-MM-DD`. Each report endpoint caps its own range and sets its
own `cache-control`, because CDN caching and per-endpoint cost limits are what
keep warehouse spend predictable.

Adding a report means adding an entry to the route table in
`src/reportingRoutes.js` following the same pattern.

## Decisions

Architecture decisions are recorded in [`docs/adr/`](docs/adr/). Read the
relevant record before changing the shape of the API. In particular,
[ADR 0007](docs/adr/0007-reporting-transport.md) covers the reporting
transport and is currently accepted.

## Layout

```
src/server.js           HTTP entry point and route dispatch
src/reportingRoutes.js  reporting route table
src/reportStore.js      warehouse access
docs/adr/               architecture decision records
test/                   node --test suites
```
