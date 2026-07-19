import test from 'node:test';
import assert from 'node:assert/strict';
import { fetchAll, fetchById, knownStatuses } from '../src/records.js';
import { buildStatusReport, buildRecentDigest } from '../src/reportBuilder.js';
import { describeExport, exportRecordsCsv } from '../src/exportJob.js';
import { search } from '../src/searchIndex.js';

test('fetchAll returns every record newest first', () => {
  const records = fetchAll();
  assert.equal(records.length, 6);
  assert.equal(records[0].id, 'rec-105');
  assert.equal(records.at(-1).id, 'rec-104');
});

test('fetchAll filters by status and honours the limit', () => {
  assert.deepEqual(fetchAll({ status: 'open' }).map((r) => r.id), ['rec-105', 'rec-103', 'rec-101']);
  assert.equal(fetchAll({ limit: 2 }).length, 2);
  assert.deepEqual(fetchAll({ status: 'missing' }), []);
});

test('fetchAll hands out copies, not the stored records', () => {
  const first = fetchAll()[0];
  first.title = 'edited in place';
  assert.notEqual(fetchAll()[0].title, 'edited in place');
});

test('fetchById returns one record or undefined', () => {
  assert.equal(fetchById('rec-102').owner, 'jonas');
  assert.equal(fetchById('rec-999'), undefined);
});

test('known statuses are unique and sorted', () => {
  assert.deepEqual(knownStatuses(), ['archived', 'closed', 'open']);
});

test('status report counts every record once', () => {
  const report = buildStatusReport();
  assert.equal(report.total, 6);
  assert.deepEqual(report.counts, { archived: 1, closed: 2, open: 3 });
});

test('recent digest is capped at the requested size', () => {
  const digest = buildRecentDigest(2);
  assert.equal(digest.length, 2);
  assert.match(digest[0], /rec-105/);
});

test('csv export has a header plus one row per record', () => {
  const lines = exportRecordsCsv().split('\n');
  assert.equal(lines[0], 'id,title,status,owner,updatedAt');
  assert.equal(lines.length, 7);
  assert.equal(describeExport('open').rowCount, 3);
});

test('search matches titles on every token', () => {
  assert.deepEqual(search('supplier audit'), ['rec-101']);
  assert.deepEqual(search('nothing here'), []);
});
