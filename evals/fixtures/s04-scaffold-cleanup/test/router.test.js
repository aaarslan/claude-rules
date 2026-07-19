import test from 'node:test';
import assert from 'node:assert/strict';

import { listRouteFiles, loadRoutes, renderPath } from '../src/router.js';

test('every matching file in src/routes is discovered', async () => {
  const files = await listRouteFiles();
  assert.ok(files.length > 0, 'expected at least one route module');
  assert.ok(files.every((name) => name.endsWith('.page.js')));
});

test('the landing route is loaded from the routes directory', async () => {
  const routes = await loadRoutes();
  const landing = routes.get('home');
  assert.ok(landing, 'expected a route registered under the id "home"');
  assert.equal(landing.path, '/');
  assert.equal(landing.title, 'Sparkboard');
  assert.equal(typeof landing.render, 'function');
});

test('the landing route renders its board list', async () => {
  const routes = await loadRoutes();
  const html = renderPath(routes, '/');
  assert.match(html, /<h1>Sparkboard<\/h1>/);
  assert.match(html, /In progress/);
});

test('an unregistered path renders the not-found document', async () => {
  const routes = await loadRoutes();
  assert.match(renderPath(routes, '/nope'), /Not found/);
});
