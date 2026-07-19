import test from 'node:test';
import assert from 'node:assert/strict';
import { summarize } from '../src/summarize.js';

test('summarize counts and totals records', () => {
  const result = summarize([{ amountCents: 250 }, { amountCents: 1000 }]);
  assert.equal(result.count, 2);
  assert.equal(result.totalCents, 1250);
});

test('summarize handles empty input', () => {
  const result = summarize([]);
  assert.equal(result.count, 0);
  assert.equal(result.totalCents, 0);
});
