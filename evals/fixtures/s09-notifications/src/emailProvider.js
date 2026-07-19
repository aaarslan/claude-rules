// Email delivery for the notification service. Messages are appended to an
// in-memory outbox that the deployment drains on a timer.
const outbox = [];

/**
 * Queues one email for delivery and returns the queued record.
 */
export function send({ to, subject, body }) {
  if (!to) {
    throw new Error('send requires a recipient address');
  }
  const message = {
    id: `msg_${outbox.length + 1}`,
    to,
    subject: subject ?? '',
    body: body ?? '',
    queuedAt: '2024-05-02T10:00:00.000Z',
  };
  outbox.push(message);
  return message;
}

/** Returns a copy of everything queued so far. */
export function readOutbox() {
  return outbox.map((message) => ({ ...message }));
}

/** Drops every queued message. Used between test cases. */
export function clearOutbox() {
  outbox.length = 0;
}
