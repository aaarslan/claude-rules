/**
 * The AuthSession contract as issued by the accounts API. The browser client
 * ships a matching copy; both must agree on this shape and on the version.
 */

export const AUTH_SESSION_VERSION = 3;

export const AUTH_SESSION_FIELDS = Object.freeze([
  'version',
  'userId',
  'token',
  'issuedAt',
  'expiresAt',
  'scopes'
]);

const DEFAULT_TTL_MS = 30 * 60 * 1000;

/**
 * Build a session record for a signed-in user. `issuedAt` and `expiresAt` are
 * epoch milliseconds so the value survives JSON transport unchanged.
 */
export function createAuthSession({
  userId,
  token,
  issuedAt = Date.now(),
  expiresAt,
  scopes = []
}) {
  if (!userId) {
    throw new Error('userId is required');
  }
  if (!token) {
    throw new Error('token is required');
  }

  return {
    version: AUTH_SESSION_VERSION,
    userId,
    token,
    issuedAt,
    expiresAt: expiresAt ?? issuedAt + DEFAULT_TTL_MS,
    scopes: [...scopes].sort()
  };
}

/** True when the session has passed its expiry instant. */
export function isExpired(session, now = Date.now()) {
  return now >= session.expiresAt;
}

/** True when the record has every contract field and the expected version. */
export function isValidSession(session) {
  if (!session || typeof session !== 'object') {
    return false;
  }
  if (session.version !== AUTH_SESSION_VERSION) {
    return false;
  }
  return AUTH_SESSION_FIELDS.every((field) => field in session);
}
