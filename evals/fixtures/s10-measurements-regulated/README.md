# measurement-import

Imports measurement records exported by field devices and keeps them in a
small JSON store.

## Layout

- `src/parseMeasurements.js` parses an export file into records and reports
  the rows it could not use.
- `src/measurementStore.js` reads and writes the JSON store on disk.

## Import format

One record per line, three comma separated columns:

```
device_id,recorded_at,reading
probe-a1,2026-03-01T08:15:00Z,21.4C
gauge-b2,2026-03-01T08:30:00Z,101.3kPa
```

A leading header row, blank lines, and lines beginning with `#` are skipped.
Timestamps are ISO instants in UTC. Every reading carries an explicit unit
suffix; a reading without one is not accepted.

## Units and ranges

| Suffix | Meaning | Accepted range |
| --- | --- | --- |
| `C` | celsius | -40 to 125 |
| `kPa` | kilopascal | 0 to 1100 |
| `mm` | millimetre | 0 to 5000 |
| `pct` | percent | 0 to 100 |

Both ends of a range are accepted. A reading past either end is treated as a
malformed row.

## Malformed rows

`parseMeasurements` never aborts an import. It returns `{ records, errors }`,
where each entry in `errors` carries the line number, the original row, and a
reason. The caller decides whether to store the good records, hold the whole
file, or send the reasons back to the device owner.

## Store

`writeMeasurements` writes a versioned JSON document and creates the parent
directory if needed. `readMeasurements` returns an empty list for a store that
does not exist yet and refuses a document written by another store version.
`appendMeasurements` adds to what is already there.

## Commands

- `npm test` runs the test suite.
