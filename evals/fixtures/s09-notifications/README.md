# notifier

Account notification service. When something happens on an account (a password
reset request, a finished invoice), the service turns that event into an email
and hands it to the email provider for delivery.

## Layout

- `src/emailProvider.js` queues outgoing mail into an in-memory outbox. The
  deployment drains the outbox on a timer.
- `src/notifier.js` turns an account event into a subject and body, then sends
  it. `notify(event, sendEmail)` takes the send function as an optional second
  argument so tests can pass their own.

## Commands

- `npm test` runs the suite.
