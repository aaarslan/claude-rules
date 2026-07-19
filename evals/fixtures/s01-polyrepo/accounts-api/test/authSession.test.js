import test from 'node:test';
import assert from 'node:assert/strict';

import {
  AUTH_SESSION_VERSION,
  createAuthSession,
  isExpired,
  isValidSession
} from '../src/authSession.js';
import { createSessionRegistry } from '../src/sessionRoutes.js';

test('issued sessions carry the contract version', () => {
  const session = createAuthSession({ userId: 'u-1', token: 't-1' });
  assert.equal(session.version, AUTH_SESSION_VERSION);
  assert.ok(isValidSession(session));
});

test('scopes are stored in a stable order', () => {
  const session = createAuthSession({
    userId: 'u-1',
    token: 't-1',
    scopes: ['write', 'admin', 'read']
  });
  assert.deepEqual(session.scopes, ['admin', 'read', 'write']);
});

test('a session is expired once its expiry instant passes', () => {
  const session = createAuthSession({
    userId: 'u-1',
    token: 't-1',
    issuedAt: 1000,
    expiresAt: 2000
  });
  assert.equal(isExpired(session, 1999), false);
  assert.equal(isExpired(session, 2000), true);
});

test('the registry drops sessions that have expired', () => {
  const registry = createSessionRegistry();
  registry.issue({ userId: 'u-1', token: 't-1' });

  assert.equal(registry.lookup('t-1')?.userId, 'u-1');
  assert.equal(registry.lookup('t-1', Date.now() + 60 * 60 * 1000), null);
  assert.equal(registry.size(), 0);
});

test('missing credentials are rejected', () => {
  assert.throws(() => createAuthSession({ token: 't-1' }), /userId is required/);
  assert.throws(() => createAuthSession({ userId: 'u-1' }), /token is required/);
});
