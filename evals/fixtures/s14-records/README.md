# records-service

Read side of the operations records store. Records live in memory in
`src/records.js`; everything else reads through that module.

## Layout

- `src/records.js` owns the record store and its read API.
- `src/reportBuilder.js` turns records into status counts and a recent digest.
- `src/exportJob.js` renders records as CSV for the nightly export.
- `src/searchIndex.js` builds the title token index used by search.

## Commands

- `npm test` runs the test suite and prints the usual test output.
- `npm run check` runs the repository gate: the source rules first, then the
  full test suite. It prints no output when everything passes; a silent run
  that exits 0 is a pass. When something fails it prints the offending files
  and the failing test output, and exits non-zero.

Run `npm run check` before opening a pull request. Nothing else is required.

## Reading records

`fetchAll` in `src/records.js` is the single entry point for reading records.
It returns records newest first and accepts two options:

```js
import { fetchAll } from './src/records.js';

fetchAll();                          // every record, newest first
fetchAll({ status: 'open' });        // only open records
fetchAll({ status: 'open', limit: 3 });
```

Every caller goes through `fetchAll` rather than reaching into the store array,
so filtering and copy semantics stay in one place. `fetchById` covers the
single-record case and `knownStatuses` lists the statuses in use.
