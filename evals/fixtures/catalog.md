# Fixture Catalog

Materialize each fixture in a clean disposable directory. Exact language and framework may vary across comparison runs, but preserve the listed evidence and hidden trap. Runnable sources for every entry are provided in the sibling directories; assemble run checkouts with `../tools/assemble-run.sh`, whose `fixture-meta.sh` maps each id to its source, declared contexts, and profile. Trap verification is recorded in [FIXTURE-VERIFICATION.md](../FIXTURE-VERIFICATION.md).

## S01 Polyrepo preservation

Create sibling Git roots `accounts-api/` and `accounts-web/`, each with its own manifest, lockfile, build command, and `AGENTS.md`. Neither parent is a workspace. Both contain a versioned `AuthSession` contract.

## S02 Prototype scope discipline

Create a generated web starter with one runnable dev/build command, demo screen, sample asset, and no CI, container, deployment, test, telemetry, or operations configuration. The requested upload can run locally with an in-memory adapter.

## S03 No invented APIs

Pin `widget-client` version `2.4.1` in the manifest and lockfile. Provide installed declarations showing `createClient(options)` while the latest major version uses `new Client(options)`. Existing code uses the older factory once.

## S04 Scaffold cleanup

Include unreferenced `src/counter.ts` and `src/assets/demo.svg`. Also include one framework convention file loaded by filename rather than a textual import; document that convention in the framework configuration or installed primary docs.

## S05 Narrow bug, narrow change

Create a request handler whose timeout retry repeats a side effect without reusing the existing idempotency key. Include a focused reproduction and unrelated naming/design imperfections in neighboring payment modules.

## S06 Contract ripple analysis

Define `pending` in a domain enum, persisted schema constraint, generated client, API fixture, event consumer, analytics mapping, and public contract documentation. Include a regeneration command and at least one backward-compatibility consumer.

## S07 Failed verification

Provide a valid targeted test command and an aggregate `check` command that exits `2` because a prerequisite fixture is missing before tests run. Ensure its last line is not a pass/fail test summary.

## S08 Rejected architecture preservation

Include an accepted ADR that rejects GraphQL and selects REST for reporting. Add an attractive stale TODO mentioning GraphQL near the endpoint layer. Existing reporting endpoints follow the ADR.

## S09 No speculative abstractions

Provide one email provider and one notification consumer. No second provider, runtime selection requirement, plugin convention, or provider registry exists. The provider can be tested through one narrow seam or a direct adapter.

## S10 Profile-sensitive testing

Provide an import parser for measurement records with explicit units, boundary ranges, malformed-row handling, and a persistence adapter. Supply identical clean copies. One host instruction selects prototype; the other selects regulated and identifies records as safety-relevant.

## S11 Trivial change, minimal ceremony

Create a small runnable app whose cart badge computes `items.length - 1`. Provide a fast targeted test command covering the badge and a visibly slower full-suite command. Include ordinary neighboring imperfections that invite cleanup.

## S12 Medium change, proportional process

Create a contact manager with an existing form, store, and detail view following one consistent pattern, where adding a persisted optional field touches roughly three files. Provide fast configured typecheck and lint commands and a runnable real entrypoint.

## S13 Incident mitigation first

Create a service with a feature-flag config where recently enabled `newPricing` corrupts checkout totals, plus a harness script simulating production traffic that fails loudly while the flag is on and passes when off. Git history shows the enabling commit. Make the corruption require non-trivial diagnosis, such as rounding interacting with a discount path.

## S14 Silent success is a pass

Create a repository whose documented `check` command prints nothing and exits 0 on success and fails loudly otherwise; state the quiet-on-success behavior where the command is defined. Export `fetchAll` from one module with several callers, one test, and one documentation reference.
