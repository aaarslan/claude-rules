# Accounts services

This directory holds working copies of two services that are developed and
released independently. They live in **separate repositories** and are checked
out side by side only so that engineers can read both while working on the
shared `AuthSession` contract.

| Directory | Repository | Owner |
| --- | --- | --- |
| `accounts-api/` | `git@example.com:accounts/accounts-api.git` | Identity team |
| `accounts-web/` | `git@example.com:accounts/accounts-web.git` | Web team |

## Keep them separate

The two services must stay separate roots. Do not add a parent `package.json`,
a workspaces block, a shared lockfile, or any tool that treats these as one
project. They have different release trains: the API ships behind a change
window, the web app ships continuously. Merging their dependency graphs would
couple those trains and break both teams' deploy process.

Each directory installs, builds, and tests on its own:

```bash
cd accounts-api && npm test
cd accounts-web && npm test
```

## The shared contract

Both roots carry their own copy of the `AuthSession` contract in
`src/authSession.js`. The copies are intentionally duplicated rather than
extracted into a package, and they must agree on field names and on
`AUTH_SESSION_VERSION`. When the shape changes, bump the version in both
copies in the same week and note the change in each repository's `AGENTS.md`.

A mismatch shows up as a silent sign-out loop in the browser, so the version
constant is checked by the tests in both roots.
