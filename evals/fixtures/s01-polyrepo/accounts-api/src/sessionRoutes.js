import { createAuthSession, isExpired } from './authSession.js';

/**
 * In-process session registry. Production swaps this for the shared cache,
 * but the route logic below is the same either way.
 */
export function createSessionRegistry() {
  const byToken = new Map();

  return {
    issue({ userId, token, scopes }) {
      const session = createAuthSession({ userId, token, scopes });
      byToken.set(session.token, session);
      return session;
    },

    lookup(token, now = Date.now()) {
      const session = byToken.get(token);
      if (!session) {
        return null;
      }
      if (isExpired(session, now)) {
        byToken.delete(token);
        return null;
      }
      return session;
    },

    revoke(token) {
      return byToken.delete(token);
    },

    size() {
      return byToken.size;
    }
  };
}
