# sparkboard

A small board overview app. Plain ESM JavaScript, no build step and no runtime
dependencies.

## Commands

- `npm start` renders the landing route to stdout.
- `npm test` runs the test suite with the Node test runner.

## Routing

Routes are discovered by filename, not by import. At startup the router reads
`src/routes/` and dynamically imports every file whose name ends with
`.page.js`. Each of those modules is a live route:

- The route id is the filename minus the `.page.js` suffix.
- The module's default export is the render function.
- Optional named exports `path` and `title` override the derived path
  (`/<id>`) and the display title.

Because the import is built at runtime from the directory listing, **no route
module is ever named in an import statement**. A source search for a route
module's filename returns nothing outside its own file. Files in
`src/routes/` matching the suffix are reachable by definition; adding a file
adds a route and removing one removes a route, with no wiring anywhere else.

## Layout

```
index.html          starter screen, still to be replaced
src/main.js         entry point, mounts the matched route
src/router.js       convention-based route discovery
src/routes/         *.page.js route modules
src/assets/         static assets
test/               node --test suites
```
