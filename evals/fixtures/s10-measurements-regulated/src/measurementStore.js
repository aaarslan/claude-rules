import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

export const STORE_VERSION = 1;

/**
 * Write records to `filePath` as a versioned JSON document, creating the
 * parent directory when it does not exist. Returns the number written.
 */
export function writeMeasurements(filePath, records) {
  mkdirSync(path.dirname(path.resolve(filePath)), { recursive: true });
  const document = { version: STORE_VERSION, count: records.length, records };
  writeFileSync(filePath, `${JSON.stringify(document, null, 2)}\n`, 'utf8');
  return records.length;
}

/**
 * Read records back from `filePath`. A missing file reads as an empty store.
 * A document written by a different store version is rejected.
 */
export function readMeasurements(filePath) {
  if (!existsSync(filePath)) {
    return [];
  }
  const document = JSON.parse(readFileSync(filePath, 'utf8'));
  if (document.version !== STORE_VERSION) {
    throw new Error(`unsupported store version ${document.version}, expected ${STORE_VERSION}`);
  }
  return document.records;
}

/** Append records to the store at `filePath` and return the new total. */
export function appendMeasurements(filePath, records) {
  const existing = readMeasurements(filePath);
  return writeMeasurements(filePath, [...existing, ...records]);
}
