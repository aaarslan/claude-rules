# accounts-web

This repository is the web team's browser client for the accounts service. It
is a standalone Node project with no dependencies; `npm test` and
`npm run build` run from this directory only, and the build must never reach
outside this root for sources or configuration. The client keeps its own copy
of the `AuthSession` contract in `src/authSession.js`, including
`AUTH_SESSION_VERSION`. Anything read from the network passes through
`parseAuthSession` first, which rejects payloads whose version does not match
this copy so that a stale server never populates the session store with a
shape the UI cannot render. When the API bumps the contract, land the matching
bump here and ship it in the same week, and keep the field list identical.
