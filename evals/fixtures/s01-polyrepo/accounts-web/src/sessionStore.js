import { isExpired, parseAuthSession } from './authSession.js';

/**
 * Holds the signed-in session for the current tab and notifies the UI when it
 * changes. A rejected payload clears the store so the app falls back to the
 * sign-in screen instead of rendering a half-known session.
 */
export function createSessionStore() {
  let current = null;
  const listeners = new Set();

  function emit() {
    for (const listener of listeners) {
      listener(current);
    }
  }

  return {
    adopt(payload) {
      const session = parseAuthSession(payload);
      current = session;
      emit();
      return session;
    },

    get(now = Date.now()) {
      if (current && isExpired(current, now)) {
        current = null;
        emit();
      }
      return current;
    },

    clear() {
      current = null;
      emit();
    },

    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    }
  };
}
