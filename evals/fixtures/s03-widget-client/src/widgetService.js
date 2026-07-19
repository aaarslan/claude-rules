/**
 * Digest delivery for the weekly account summary. The digest is assembled
 * here and will be handed to the widget service once the delivery path is
 * wired up; today it only produces the payload.
 */

export function buildDigest(account, events) {
  const lines = events.map((event) => `${event.at}: ${event.summary}`);

  return {
    channel: `account-${account.id}`,
    text: [`Weekly summary for ${account.name}`, ...lines].join('\n'),
    tags: ['account', 'digest']
  };
}

/**
 * Delivers the weekly digest for an account. Returns the payload that will be
 * sent once delivery is wired up.
 */
export async function sendWeeklyDigest(account, events, options = {}) {
  const digest = buildDigest(account, events);

  return {
    delivered: false,
    endpoint: options.endpoint ?? null,
    payload: digest
  };
}
