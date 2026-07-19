# Phase 1 Batch One (rerun): Execution Notes

Scenarios S05 and S07, arms A, B, C, both surfaces, three reps: 36 runs, all
executed 2026-07-18 at revision `a6f45b3`. **No scoring, no verdicts.** This file
records execution facts only. Packets go to graders; [ARM-MAP.md](ARM-MAP.md)
does not.

This batch replaces a predecessor batch (private archive), voided for arm-label
leakage. No packet identifier is shared with the voided batch.

## Validity: 36 of 36

Every run valid. No run was voided, redone, or discarded in this batch, and no
run failed to complete.

## Neutrality sweep

Run before packaging, on all 36 transcripts, for arm labels, fixture labels,
evaluation vocabulary, harness tool names, "packet", `<stdin>` blocks, and
foreign packet identifiers. **Zero non-benign hits.** Confirmed independently by
direct string search:

| String | Transcripts containing it |
| --- | --- |
| `run baseline` | 0 |
| `arm A` / `arm B` / `arm C` | 0 / 0 / 0 |
| `fixture s05` / `fixture s07` | 0 / 0 |
| `assemble-run` | 0 |
| `evaluator` | 0 |
| `<stdin>` | 0 |
| `rules-on` | 0 |

Two classes of match were classified benign rather than voiding:

- **Canonical rule vocabulary**, as pre-registered: "greenfield experiments" in
  the prototype profile's `load_when`, and "evaluating system design" in the
  architecture rule's. Both are ordinary corpus prose that a run legitimately
  reads.
- **In-corpus product tooling.** Four runs listed `agent-rules/tools/` and saw
  `route-hook.mjs` alongside `contrast-check.mjs` and `slop-scan.sh`. Those ship
  as part of the rules system under evaluation and are documented in `ADOPT.md`,
  so seeing them is seeing the product, not the harness. The sweep pattern was
  corrected to match only genuine harness tooling (`assemble-run`,
  `expected-sets`, `score-gate`, `package-run`, `run-p1`, `gen-manifest`), none
  of which appears in any transcript.

A pre-flight sweep of freshly assembled arm A, B, and C checkouts was also run
before any evaluated run, confirming `git log` shows only
`dev <dev@local> | initial import` and that the corpus `CHANGELOG.md` and
`README.md` are absent from arm B.

## Covariates

Means per cell, six runs each (two scenarios by three reps).

| Surface / arm | n | Wall clock | Tool calls | Output tokens | Rules injected | Rules read |
| --- | --- | --- | --- | --- | --- | --- |
| claude / A | 6 | 45s | 11 | 2412 | 0 | 0 |
| claude / B | 6 | 62s | 15 | 3904 | 15 | 0 |
| claude / C | 6 | 50s | 12 | 2798 | 0 | 0 |
| codex / A | 6 | 90s | 3 | n/a | 0 | 0 |
| codex / B | 6 | 145s | 7 | n/a | 15 | 7 |
| codex / C | 6 | 125s | 4 | n/a | 0 | 0 |

Codex does not report token usage in its transcript, so that column is
unavailable there; its tool-call column counts shell invocations, which are
coarser than Claude's individual tool calls and not comparable across surfaces.

Arm B is the most expensive cell on both surfaces, as in the voided batch: 62s
against 45s for arm A on Claude, and 145s against 90s on Codex. On Claude the
routed files arrive by injection and cost prompt-cache reads rather than tool
calls; on Codex they are read, at a mean of 7 rule files per run. None of this
speaks to quality, which is the graders' question.

Comparison with the voided batch is available but weak: cell means moved by
amounts consistent with ordinary variance at n=6 (for example Codex arm B fell
from 188s to 145s and from 19 to 7 shell invocations), and the two batches
differ in checkout contents as well as in leakage, since arm B no longer carries
the corpus `CHANGELOG.md` and `README.md`. Nothing should be inferred from the
difference.

## Execution conditions

- **Claude:** CLI 2.1.214, model pinned `claude-fable-5`, `--setting-sources
  project,local`, explicit `--allowedTools` allowlist held identical across all
  runs. Arms A and C carry no project hook, which is correct: only arm B wires
  `route-hook.mjs`.
- **Codex:** CLI 0.144.4, model pinned `gpt-5.6-sol`, `--sandbox
  workspace-write`. Operator `~/.codex/AGENTS.md` is empty and `config.toml`
  declares no instructions, so no global agent memory applies;
  `model_reasoning_effort = "max"` from that config applies equally to all runs.
- **Isolation:** agent stdin closed with `</dev/null` on every run, so no driver
  input can reach a prompt. Each checkout sits in its own private parent
  directory, so `..` contains no sibling condition.
- **Arm order** rotated per surface, rep, and scenario, so no arm ran as a
  contiguous block and time-of-day drift spreads across arms. The realised order
  is recorded in the arm map.
- **Hygiene:** fresh checkout per run, no checkout reused, packet-ID directory
  names carrying no arm or fixture, prompts verbatim from the runbook with
  nothing appended.
