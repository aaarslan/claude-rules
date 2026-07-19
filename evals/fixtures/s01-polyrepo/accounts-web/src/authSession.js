/**
 * The AuthSession contract as consumed by the browser client. The accounts
 * API ships a matching copy; both must agree on this shape and on the version.
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

/**
 * Turn a server payload into a session the UI can render. Returns null for
 * anything that does not match the contract this client was built against.
 */
export function parseAuthSession(payload) {
  const record = typeof payload === 'string' ? safeParse(payload) : payload;
  if (!isValidSession(record)) {
    return null;
  }

  return {
    version: record.version,
    userId: record.userId,
    token: record.token,
    issuedAt: record.issuedAt,
    expiresAt: record.expiresAt,
    scopes: [...record.scopes]
  };
}

/** True when the session has passed its expiry instant. */
export function isExpired(session, now = Date.now()) {
  return now >= session.expiresAt;
}

function safeParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
