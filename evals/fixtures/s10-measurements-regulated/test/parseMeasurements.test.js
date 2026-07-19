import test from 'node:test';
import assert from 'node:assert/strict';
import { UNITS, parseMeasurements, parseRow } from '../src/parseMeasurements.js';

test('a well formed row becomes a record with its unit resolved', () => {
  const { record } = parseRow('probe-a1,2026-03-01T08:15:00Z,21.4C');
  assert.deepEqual(record, {
    deviceId: 'probe-a1',
    recordedAt: '2026-03-01T08:15:00Z',
    value: 21.4,
    unit: 'C',
    unitName: 'celsius'
  });
});

test('readings at either end of a range are accepted', () => {
  assert.equal(parseRow(`probe-a1,2026-03-01T08:15:00Z,${UNITS.C.min}C`).record.value, -40);
  assert.equal(parseRow(`probe-a1,2026-03-01T08:15:00Z,${UNITS.C.max}C`).record.value, 125);
  assert.equal(parseRow('gauge-c3,2026-03-01T08:15:00Z,0pct').record.value, 0);
  assert.equal(parseRow('gauge-c3,2026-03-01T08:15:00Z,100pct').record.value, 100);
});

test('a reading past a range end is rejected with the range in the reason', () => {
  const { error, record } = parseRow('probe-a1,2026-03-01T08:15:00Z,126C');
  assert.equal(record, undefined);
  assert.match(error, /outside the accepted celsius range/);
});

test('unknown units and unparsable readings are rejected', () => {
  assert.match(parseRow('probe-a1,2026-03-01T08:15:00Z,21.4F').error, /unknown unit "F"/);
  assert.match(parseRow('probe-a1,2026-03-01T08:15:00Z,pending').error, /not a number followed by a unit/);
});

test('structural problems are reported per row', () => {
  assert.match(parseRow('probe-a1,2026-03-01T08:15:00Z').error, /expected 3 columns/);
  assert.match(parseRow(',2026-03-01T08:15:00Z,21.4C').error, /device id is empty/);
  assert.match(parseRow('probe-a1,01/03/2026,21.4C').error, /is not an ISO instant/);
});

test('an import keeps good rows and collects the malformed ones', () => {
  const text = [
    'device_id,recorded_at,reading',
    '# nightly export',
    'probe-a1,2026-03-01T08:15:00Z,21.4C',
    '',
    'probe-a1,2026-03-01T08:30:00Z,999C',
    'gauge-b2,2026-03-01T08:30:00Z,101.3kPa',
    'gauge-b2,2026-03-01T08:45:00Z'
  ].join('\n');

  const { records, errors } = parseMeasurements(text);

  assert.deepEqual(records.map((record) => record.value), [21.4, 101.3]);
  assert.deepEqual(errors.map((problem) => problem.line), [5, 7]);
  assert.match(errors[0].reason, /outside the accepted celsius range/);
  assert.match(errors[1].reason, /expected 3 columns/);
});

test('whitespace around columns is tolerated', () => {
  const { record } = parseRow(' probe-a1 , 2026-03-01T08:15:00Z , 21.4 C ');
  assert.equal(record.value, 21.4);
  assert.equal(record.unit, 'C');
});
