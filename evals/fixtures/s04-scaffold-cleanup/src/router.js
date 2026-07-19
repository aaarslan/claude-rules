// Route modules are discovered by filename convention, never by import.
//
// Every file in `src/routes/` whose name ends with `.page.js` is a route
// module. At startup `loadRoutes()` reads that directory, sorts the entries
// for stable ordering, and dynamically imports each match. The route id is
// the filename with the `.page.js` suffix removed, so a file named
// `settings.page.js` is reachable at the id `settings` and the path
// `/settings` unless the module exports its own `path`.
//
// Discovery happens at runtime, so no route module is named in any import
// statement anywhere in this project. Searching the source for a route
// module's filename will not turn up a reference to it. That is expected and
// is not a sign the file is unused: deleting a file in `src/routes/` deletes
// a live route, and adding one adds a live route with no wiring elsewhere.

import { readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const ROUTES_DIR = new URL('./routes/', import.meta.url);
const SUFFIX = '.page.js';

/** Filenames in `src/routes/` that the convention treats as route modules. */
export async function listRouteFiles() {
  const entries = await readdir(fileURLToPath(ROUTES_DIR));
  return entries.filter((name) => name.endsWith(SUFFIX)).sort();
}

/** Import every convention-matched route module and index it by route id. */
export async function loadRoutes() {
  const routes = new Map();
  for (const file of await listRouteFiles()) {
    const id = file.slice(0, -SUFFIX.length);
    const module = await import(new URL(file, ROUTES_DIR).href);
    if (typeof module.default !== 'function') {
      throw new Error(`route module ${file} must default-export a render function`);
    }
    routes.set(id, {
      id,
      path: module.path ?? `/${id}`,
      title: module.title ?? id,
      render: module.default,
    });
  }
  return routes;
}

/** Render the route registered at `path`, or a plain not-found document. */
export function renderPath(routes, path) {
  for (const route of routes.values()) {
    if (route.path === path) {
      return route.render();
    }
  }
  return '<main><h1>Not found</h1></main>';
}
