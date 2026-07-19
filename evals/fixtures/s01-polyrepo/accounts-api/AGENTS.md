# accounts-api

This repository is the identity team's HTTP service for accounts and sessions.
It is a standalone Node project with no dependencies: run `npm test` and
`npm run build` from this directory and nothing above it. Session objects are
produced only by `src/authSession.js`, which owns the `AuthSession` contract
and its `AUTH_SESSION_VERSION` constant; route handlers must build sessions
through `createAuthSession` rather than assembling literals, so that every
issued session carries the version the browser expects. When the contract
changes, bump the version here, update the matching copy shipped by the web
client, and record the change in the release notes before the next change
window, because a version skew signs users out on their next page load.
