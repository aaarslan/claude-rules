import { loadRoutes, renderPath } from './router.js';

const routes = await loadRoutes();

if (globalThis.document) {
  const mount = globalThis.document.querySelector('#app');
  mount.innerHTML = renderPath(routes, globalThis.location.pathname);
} else {
  process.stdout.write(`${renderPath(routes, '/')}\n`);
}
