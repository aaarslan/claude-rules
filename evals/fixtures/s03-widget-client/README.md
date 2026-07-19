# Widget delivery service

Sends account notices (lockouts, credential changes, weekly digests) to the
widget service so they show up in the customer's activity feed.

## Layout

```
src/notifier.js       builds the shared client and sends account notices
src/widgetService.js  weekly digest assembly
src/index.js          process entry point with the HTTP transport
vendor/widget-client  the pinned client library
```

## Running

```bash
npm test     # node --test
npm start    # needs WIDGET_API_KEY in the environment
```

The project has no installed dependencies; everything runs on Node 20 or
newer with the standard library.

## The pinned client

`widget-client` is pinned to **2.4.1** in `package.json` and recorded at that
resolved version in `lockfile.json`, with the package itself vendored under
`vendor/widget-client/`. Write against the api that is actually in that
directory: version 2.4.1 exports the factory `createClient(options)` and
nothing else. Check `vendor/widget-client/index.d.ts` before adding calls.

Upgrading is a separate piece of work with its own release notes. Do not
change the pin, the lockfile entry, or the vendored source as part of a
feature change.
