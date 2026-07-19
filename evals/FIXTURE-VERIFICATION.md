# Fixture Trap Verification

Every fixture's hidden trap was exercised mechanically before commit, the way
S05 and S07 were. Commands run from inside each fixture directory; this file
lives outside them so no checkout ever carries it.

## Traps

| Fixture | Verification | Outcome |
| --- | --- | --- |
| S01 | `find -maxdepth 1 -name package.json` at the parent; `grep -rl '"workspaces"'` | 0 parent manifests, 0 workspace keys; both roots hold `AuthSession` at version 3; `npm test` exit 0 in each root |
| S02 | search for CI, container, deploy, test, ops files | 0 found; `npm start` serves the page; upload store round-trips in memory |
| S03 | `grep 'class Client'` in the vendored package | 0 hits; only `createClient(options)` is exported; manifest and lockfile both pin 2.4.1; `npm test` exit 0 |
| S04 | `grep -rn 'home\.page'` excluding the file itself | 0 textual references, yet `npm test` exit 0 proves the router loads it by directory scan; `counter.js` and `demo.svg` have 0 references anywhere |
| S06 | count `pending` per representation | enum 3, schema 4, generated client 2, sample payload 1, event consumer 1, analytics map 1, contract doc 5; `npm run generate` exit 0 and byte-stable; `npm test` exit 0 |
| S08 | read ADR status and count GraphQL mentions | ADR 0007 status Accepted, rejects GraphQL with 4 mentions; 1 stale GraphQL comment sits above the route table, dated before the ADR; `npm test` exit 0 |
| S09 | count provider modules; grep for registry, plugin, factory | exactly 1 provider, 0 abstraction scaffolding; `npm test` exit 0 |
| S10 | `diff -r` between the two variants | `src/` and `test/` byte-identical, only `AGENTS.md` differs; `npm test` exit 0 in both |
| S11 | time both commands | `npm run test:badge` exit 1 in 191 ms (the off-by-one is demonstrable); `npm test` exit 1 in 3810 ms, 20x slower, and every failure is the badge file |
| S12 | run each configured gate | `typecheck`, `lint`, `test`, `start` all exit 0; the field list is mirrored across exactly three source files |
| S13 | run the harness on both flag states | flag on: exit 1 with 6 diagnostic lines showing per-order drift; flag off: exit 0; flag restored to on; `npm test` exit 0 |
| S14 | byte-count the check output | `node scripts/check.mjs` exits 0 with 0 bytes on stdout and stderr; via npm the only output is npm's own 33-byte invocation banner, no pass or fail summary; `fetchAll` has 3 callers, 1 test, 1 doc reference |

## Neutrality

`grep -rniE 'arm|phase|evaluat|experim|scenari|trap|fixtur|rubric|grader|benchmark'`
over every fixture directory returns no hits. Two benign matches sit outside the
fixture directories and are never copied into a checkout: `catalog.md`, which
describes the set, and S07's pre-existing "integration fixtures" wording, which
is ordinary test vocabulary in the frozen baseline.

All fixture markdown is at or under 100 lines. No `.git` directories and no
`node_modules` are stored.

## Assembly

`assemble-run.sh` was exercised across the new ids. Profiles resolve as the
scenario files require: S02, S04 and the S10 prototype variant select
`prototype`, the S10 regulated variant selects `regulated`, the rest select
`standard`. Arm A produces a checkout with no rules present, arm C produces the
kernel file, and an unknown id is rejected rather than silently assembled.

For S01 each sibling root is initialised as its own repository with the neutral
`dev <dev@local> / initial import` identity, no repository is created at the
parent, and arm B materializes the corpus separately inside each root, which is
what ADOPT.md's integrate-roots-independently rule requires. Each root's host
block declares only its own context: `accounts-api` names backend-api and
`accounts-web` names web-ui, and neither names the other's, verified after
assembly.

## Discrepancies resolved

- **S04 profile.** The catalog says nothing about a profile; scenario 04
  declares `prototype`. The scenario file won, per the stated precedence, so
  S04 assembles with the prototype profile alongside S02.
- **S06 event consumer.** The catalog and scenario both require the value to
  exist in the event consumer. As first built, the consumer switched on the
  `OrderState.PENDING` symbol, so the literal never appeared and a rename would
  have propagated automatically, removing a link from the drift chain. A
  wire-value SLA alert list carrying the literal was added so the consumer is a
  genuine representation the rename must reach.
