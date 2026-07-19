import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import {
  STORE_VERSION,
  appendMeasurements,
  readMeasurements,
  writeMeasurements
} from '../src/measurementStore.js';

function withTempDir(run) {
  const dir = mkdtempSync(path.join(tmpdir(), 'measurement-store-'));
  try {
    run(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

const sample = [
  { deviceId: 'probe-a1', recordedAt: '2026-03-01T08:15:00Z', value: 21.4, unit: 'C', unitName: 'celsius' },
  { deviceId: 'gauge-b2', recordedAt: '2026-03-01T08:30:00Z', value: 101.3, unit: 'kPa', unitName: 'kilopascal' }
];

test('records survive a write and read round trip', () => {
  withTempDir((dir) => {
    const file = path.join(dir, 'nested', 'measurements.json');
    assert.equal(writeMeasurements(file, sample), 2);
    assert.deepEqual(readMeasurements(file), sample);
  });
});

test('a missing store reads as empty', () => {
  withTempDir((dir) => {
    assert.deepEqual(readMeasurements(path.join(dir, 'absent.json')), []);
  });
});

test('appending keeps earlier records and returns the new total', () => {
  withTempDir((dir) => {
    const file = path.join(dir, 'measurements.json');
    writeMeasurements(file, [sample[0]]);
    assert.equal(appendMeasurements(file, [sample[1]]), 2);
    assert.deepEqual(readMeasurements(file).map((record) => record.deviceId), ['probe-a1', 'gauge-b2']);
  });
});

test('a store written by another version is rejected', () => {
  withTempDir((dir) => {
    const file = path.join(dir, 'measurements.json');
    writeFileSync(file, JSON.stringify({ version: STORE_VERSION + 1, count: 0, records: [] }), 'utf8');
    assert.throws(() => readMeasurements(file), /unsupported store version/);
  });
});
