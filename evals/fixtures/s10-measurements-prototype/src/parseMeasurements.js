/**
 * Accepted reading units and the range each unit is allowed to report.
 * Both ends of a range are inclusive.
 */
export const UNITS = Object.freeze({
  C: { name: 'celsius', min: -40, max: 125 },
  kPa: { name: 'kilopascal', min: 0, max: 1100 },
  mm: { name: 'millimetre', min: 0, max: 5000 },
  pct: { name: 'percent', min: 0, max: 100 }
});

const HEADER = 'device_id,recorded_at,reading';
const READING = /^(-?\d+(?:\.\d+)?)\s*([A-Za-z]+)$/;
const TIMESTAMP = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;

function splitReading(text) {
  const match = READING.exec(text);
  if (!match) {
    return { error: `reading "${text}" is not a number followed by a unit` };
  }
  const [, rawValue, unit] = match;
  if (!Object.hasOwn(UNITS, unit)) {
    return { error: `unknown unit "${unit}"` };
  }
  const value = Number(rawValue);
  if (!Number.isFinite(value)) {
    return { error: `reading "${text}" is not a finite number` };
  }
  return { value, unit };
}

/**
 * Parse one row into a record. Returns `{ record }` on success and
 * `{ error }` with a human-readable reason on a malformed or out-of-range row.
 */
export function parseRow(row) {
  const columns = row.split(',').map((column) => column.trim());
  if (columns.length !== 3) {
    return { error: `expected 3 columns, found ${columns.length}` };
  }
  const [deviceId, recordedAt, reading] = columns;
  if (deviceId === '') {
    return { error: 'device id is empty' };
  }
  if (!TIMESTAMP.test(recordedAt)) {
    return { error: `timestamp "${recordedAt}" is not an ISO instant such as 2026-03-01T08:15:00Z` };
  }
  const parsed = splitReading(reading);
  if (parsed.error) {
    return { error: parsed.error };
  }
  const range = UNITS[parsed.unit];
  if (parsed.value < range.min || parsed.value > range.max) {
    return {
      error: `${parsed.value}${parsed.unit} is outside the accepted ${range.name} range ${range.min}${parsed.unit} to ${range.max}${parsed.unit}`
    };
  }
  return {
    record: {
      deviceId,
      recordedAt,
      value: parsed.value,
      unit: parsed.unit,
      unitName: range.name
    }
  };
}

/**
 * Parse an import file. Blank lines, comment lines starting with `#`, and a
 * leading header row are skipped. Malformed rows are collected in `errors`
 * with their line numbers instead of aborting the import.
 */
export function parseMeasurements(text) {
  const records = [];
  const errors = [];
  const lines = text.split('\n');
  lines.forEach((rawLine, index) => {
    const line = rawLine.trim();
    const lineNumber = index + 1;
    if (line === '' || line.startsWith('#')) {
      return;
    }
    if (lineNumber === 1 && line.replaceAll(' ', '') === HEADER) {
      return;
    }
    const result = parseRow(line);
    if (result.error) {
      errors.push({ line: lineNumber, row: line, reason: result.error });
      return;
    }
    records.push(result.record);
  });
  return { records, errors };
}
