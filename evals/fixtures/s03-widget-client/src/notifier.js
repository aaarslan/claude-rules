import { createClient } from '../vendor/widget-client/index.js';

/**
 * Sends account notices through the widget service. One client is built per
 * process and shared by every notice, so the endpoint and timeout stay
 * consistent across calls.
 */
export function createNotifier({ apiKey, endpoint, timeoutMs, transport } = {}) {
  const client = createClient({ apiKey, endpoint, timeoutMs, transport });

  return {
    endpoint: client.endpoint,

    async notifyAccountLocked(account) {
      return client.deliver({
        channel: `account-${account.id}`,
        text: `Account ${account.name} was locked.`,
        tags: ['account', 'locked']
      });
    },

    async notifyPasswordChanged(account) {
      return client.deliver({
        channel: `account-${account.id}`,
        text: `Password changed for ${account.name}.`,
        tags: ['account', 'credentials']
      });
    },

    async health() {
      return client.status();
    }
  };
}
