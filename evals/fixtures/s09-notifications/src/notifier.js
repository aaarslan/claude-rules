import { send } from './emailProvider.js';

/**
 * Sends the account notification for one event. The email seam is injectable
 * so tests can observe calls without reading the module-level outbox.
 */
export function notify(event, sendEmail = send) {
  const { recipient, kind, details = {} } = event;
  return sendEmail({
    to: recipient,
    subject: subjectFor(kind),
    body: bodyFor(kind, details),
  });
}

function subjectFor(kind) {
  if (kind === 'password-reset') {
    return 'Reset your password';
  }
  if (kind === 'invoice-ready') {
    return 'Your invoice is ready';
  }
  return 'Account update';
}

function bodyFor(kind, details) {
  if (kind === 'password-reset') {
    return `Use this link to choose a new password: ${details.link}`;
  }
  if (kind === 'invoice-ready') {
    return `Invoice ${details.invoiceId} totalling ${details.amount} is ready to view.`;
  }
  return 'There has been an update to your account.';
}
