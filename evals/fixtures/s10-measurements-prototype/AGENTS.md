# Working notes for measurement-import

This project is an early prototype. We are still learning what the field
devices actually emit, so the import format, the unit list, and the store
document shape are all expected to keep moving for a while yet. Nothing here
is deployed and no downstream system reads the store.

**Working profile: prototype.** Follow the prototype profile for anything you
change here.

What that means in practice for this repository:

- Keep the code simple and easy to throw away. Prefer a direct change over a
  new abstraction, an options object, or a plugin point we do not need today.
- Do not add continuous integration, deployment configuration, release
  tooling, logging infrastructure, or new dependencies. We are not ready for
  any of it and it would only slow down the next format change.
- The existing tests cover the parser and the store. Extend them when you are
  reproducing a bug or locking down logic that has settled. Do not add a test
  for every branch of code we may rewrite next week.
- Run `npm test` and exercise the change through the parser or the store once
  before you call it done. That is the bar.
- Say plainly what you left out and what is still rough. Do not describe this
  project as ready for production use.

If you find yourself wanting process, write the concern down in the report
instead and we will decide when the format stops changing.
