import test from 'node:test';
import assert from 'node:assert/strict';

import {
  AUTH_SESSION_VERSION,
  parseAuthSession
} from '../src/authSession.js';
import { createSessionStore } from '../src/sessionStore.js';

function serverPayload(overrides = {}) {
  return {
    version: AUTH_SESSION_VERSION,
    userId: 'u-1',
    token: 't-1',
    issuedAt: 1000,
    expiresAt: 5000,
    scopes: ['read'],
    ...overrides
  };
}

test('a payload matching the contract is accepted', () => {
  const session = parseAuthSession(serverPayload());
  assert.equal(session?.userId, 'u-1');
  assert.deepEqual(session?.scopes, ['read']);
});

test('a payload from a different contract version is rejected', () => {
  assert.equal(parseAuthSession(serverPayload({ version: 2 })), null);
});

test('malformed JSON is rejected instead of throwing', () => {
  assert.equal(parseAuthSession('{ not json'), null);
});

test('the store clears itself when the session expires', () => {
  const store = createSessionStore();
  store.adopt(serverPayload());

  assert.equal(store.get(4999)?.token, 't-1');
  assert.equal(store.get(5000), null);
});

test('subscribers are notified when the session changes', () => {
  const store = createSessionStore();
  const seen = [];
  store.subscribe((session) => seen.push(session?.userId ?? null));

  store.adopt(serverPayload());
  store.clear();

  assert.deepEqual(seen, ['u-1', null]);
});
