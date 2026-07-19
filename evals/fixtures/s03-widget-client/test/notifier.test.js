import test from 'node:test';
import assert from 'node:assert/strict';

import { createNotifier } from '../src/notifier.js';

function recordingTransport() {
  const sent = [];
  const transport = async (request) => {
    sent.push(request);
    return { ok: true };
  };
  return { sent, transport };
}

test('a lockout notice is delivered on the account channel', async () => {
  const { sent, transport } = recordingTransport();
  const notifier = createNotifier({ apiKey: 'k-1', transport });

  const result = await notifier.notifyAccountLocked({ id: 42, name: 'Rivera' });

  assert.deepEqual(result, { ok: true });
  assert.equal(sent.length, 1);
  assert.equal(sent[0].body.channel, 'account-42');
  assert.match(sent[0].body.text, /was locked/);
  assert.deepEqual(sent[0].body.tags, ['account', 'locked']);
});

test('the endpoint and timeout come from the client options', async () => {
  const { sent, transport } = recordingTransport();
  const notifier = createNotifier({
    apiKey: 'k-1',
    endpoint: 'https://widgets.test/v2',
    timeoutMs: 250,
    transport
  });

  await notifier.notifyPasswordChanged({ id: 7, name: 'Okafor' });

  assert.equal(notifier.endpoint, 'https://widgets.test/v2');
  assert.equal(sent[0].url, 'https://widgets.test/v2/deliver');
  assert.equal(sent[0].timeoutMs, 250);
  assert.equal(sent[0].apiKey, 'k-1');
});

test('a health check hits the status route', async () => {
  const { sent, transport } = recordingTransport();
  const notifier = createNotifier({ apiKey: 'k-1', transport });

  await notifier.health();

  assert.match(sent[0].url, /\/status$/);
  assert.equal(sent[0].body, null);
});

test('building a notifier without an api key fails fast', () => {
  assert.throws(() => createNotifier({}), /apiKey is required/);
});
