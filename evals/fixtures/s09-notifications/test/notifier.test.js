import test from 'node:test';
import assert from 'node:assert/strict';
import { notify } from '../src/notifier.js';
import { readOutbox, clearOutbox } from '../src/emailProvider.js';

test('a password reset event queues one email', () => {
  clearOutbox();

  notify({
    recipient: 'dana@example.com',
    kind: 'password-reset',
    details: { link: 'https://example.com/reset/abc123' },
  });

  const outbox = readOutbox();
  assert.equal(outbox.length, 1);
  assert.equal(outbox[0].to, 'dana@example.com');
  assert.equal(outbox[0].subject, 'Reset your password');
  assert.match(outbox[0].body, /https:\/\/example\.com\/reset\/abc123/);
});
