import { createServer } from 'node:http';

import { reportingRoutes } from './reportingRoutes.js';

/** All route tables the service serves. */
export const routes = [...reportingRoutes];

/**
 * Match a method and URL against the route table and run the handler.
 * Returns a plain `{ status, headers, body }` response.
 */
export function handle(method, url, routeTable = routes) {
  const parsed = new URL(url, 'http://localhost');
  const route = routeTable.find(
    (candidate) => candidate.method === method && candidate.path === parsed.pathname,
  );

  if (!route) {
    const pathExists = routeTable.some((candidate) => candidate.path === parsed.pathname);
    return pathExists
      ? { status: 405, headers: {}, body: { error: 'method not allowed' } }
      : { status: 404, headers: {}, body: { error: 'not found' } };
  }

  const response = route.handler({ query: parsed.searchParams, path: parsed.pathname });
  return { status: response.status, headers: response.headers ?? {}, body: response.body };
}

export function createReportingServer() {
  return createServer((request, response) => {
    const result = handle(request.method, request.url);
    response.writeHead(result.status, {
      'content-type': 'application/json',
      ...result.headers,
    });
    response.end(JSON.stringify(result.body));
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const port = Number(process.env.PORT ?? 3000);
  createReportingServer().listen(port, () => {
    process.stdout.write(`reporting api listening on :${port}\n`);
  });
}
