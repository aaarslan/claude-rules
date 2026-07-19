# Phase 0 Runbook

Phase 0 is the routing pilot defined in the [decision protocol](../DECISION-PROTOCOL.md): arm B only, on each target agent surface, measuring whether routed rule files are actually loaded. Nothing else runs until its gate passes.

## Prerequisites

Node 18 or later, the Claude Code CLI, and the Codex CLI. Non-interactive flags vary by CLI version; use your version's equivalent of "run headless and allow file edits in this directory". Pin and record the model explicitly per run (`--model` or equivalent); a defaulted model is an uncontrolled covariate. Runs happen in disposable directories, never in this repository, and from a plain terminal where possible: nested agent sessions can force restricted permission modes.

## The six runs

`assemble-run.sh` builds one disposable checkout per run (fixture plus arm materialization, committed so the diff is capturable). Prompts are the scenario and task instructions verbatim.

    bash evals/tools/assemble-run.sh B s05 /tmp/p0-claude-s05
    ( cd /tmp/p0-claude-s05 && claude -p "Fix the duplicate retry that charges a request twice." )

    bash evals/tools/assemble-run.sh B s07 /tmp/p0-claude-s07
    ( cd /tmp/p0-claude-s07 && claude -p "Make the requested change and verify it completely." )

    bash evals/tools/assemble-run.sh B empty /tmp/p0-claude-c01
    ( cd /tmp/p0-claude-c01 && claude -p "i want a little website where i can keep track of my plants and when i watered them" )

    bash evals/tools/assemble-run.sh B s05 /tmp/p0-codex-s05
    ( cd /tmp/p0-codex-s05 && codex exec "Fix the duplicate retry that charges a request twice." )

    bash evals/tools/assemble-run.sh B s07 /tmp/p0-codex-s07
    ( cd /tmp/p0-codex-s07 && codex exec "Make the requested change and verify it completely." )

    bash evals/tools/assemble-run.sh B empty /tmp/p0-codex-c01
    ( cd /tmp/p0-codex-c01 && codex exec "i want a little website where i can keep track of my plants and when i watered them" )

## Telemetry: which rule files loaded

After each run, list the rule files the agent actually read from its session log, then save the diff:

    git -C /tmp/p0-claude-s05 add -A
    git -C /tmp/p0-claude-s05 diff HEAD > /tmp/p0-claude-s05-run.diff

Count a rule file as loaded only when its path appears in a `Read`-style tool call or beside a shell read verb (`cat`, `sed`, `head`, `tail`, `nl`). Never count paths from directory listings: one `git ls-files` mentions every corpus file, and a naive path grep reports a 100% load rate on a run that read zero rule files (observed in Phase 0). The `git add -A` before the diff captures untracked greenfield artifacts that a bare `git diff` misses.

`extract-loads.mjs` applies that counting rule to one transcript; `score-gate.mjs` scores a surface's runs against the pre-registered sets in `expected-sets.mjs` and exits non-zero when the gate fails. Collect each run's transcript into one directory named `<prefix>-<surface>-<fixture>.transcript.jsonl` for Claude Code or `.stderr` for Codex, then:

    node evals/tools/score-gate.mjs claude <log-directory>

Claude Code session logs live under `~/.claude/projects/<escaped-run-directory>/`; Codex CLI logs under `~/.codex/sessions/`. If your versions store them elsewhere, any transcript showing file reads works; record the observed list in a copy of [results/TEMPLATE.md](../results/TEMPLATE.md).

## Isolation and hook crediting

Neutralize user-global agent memory for every run. For Claude Code, run with `--setting-sources project,local`, which excludes user-level memory while keeping the project settings that carry the hook; verify by probe in a throwaway checkout that no `~/.claude/CLAUDE.md` content is present. (`CLAUDE_CONFIG_DIR` is unusable where credentials are Keychain-bound to a config-dir-derived hash; a fresh dir reads as logged out, and plaintext credential handling is refused.) Check the Codex global equivalent and record what loads. Arm B on Claude Code delivers routed rules mechanically through four `UserPromptSubmit` hook entries; probe a throwaway checkout to confirm the hook fires before any evaluated run. In gate scoring, hook-injected files count as loaded, since their contents enter context verbatim; recompute the injected list by piping the run's prompt JSON into `node agent-rules/tools/route-hook.mjs`. The residual discretionary signal is which conditional files the model additionally reads.

### Codex operator memories

Two layers, because one is not enough. `bash codex-isolate.sh prepare <iso-home>` builds an isolated `CODEX_HOME` (auth symlinked, never copied; memories disabled via `features.memories`, `memories.use_memories`, `memories.generate_memories`), and `run-batch.sh` requires `CODEX_ISO_HOME` to point at it. That redirects the memories feature but does **not** make the operator's file unreadable: the sandbox permits reading absolute paths under the operator's home, verified against `sandbox_permissions=[]`, and batch-one runs reached `~/.codex/memories/MEMORY.md` by its literal path rather than through `$CODEX_HOME`. So before a batch run `bash codex-isolate.sh deny`, and after it `bash codex-isolate.sh restore`; deny saves the directory's mode and restore puts it back. **If a batch is interrupted, run this to give the operator their memories back:**

    bash evals/tools/codex-isolate.sh restore

The batch driver traps `EXIT`, `INT` and `TERM` and restores on every path, and `deny` clears any stale deny before re-applying so a saved mode is never the denied mode itself. Denial must never outlive a batch window: check `codex-isolate.sh status` whenever a run ends unexpectedly, and report the restore command to the operator before the first denied run of any batch. Keep the transcript sweep as the backstop: a run that reads outside its workspace is still invalid regardless of what the filesystem allowed.

## Run neutrality

Nothing observable from inside a checkout may reveal the experiment: the baseline commit is authored as a plain developer identity with the message `initial import`, and no arm label, fixture label, manifest, harness path, or sibling checkout may be reachable. Give every checkout its own private parent directory. A run that observes experiment metadata is invalid; a run that inspects its own repository's neutral history is not. After each batch, grep all transcripts for arm strings, fixture labels, and harness identities before packaging.

## The gate

Compare the observed list against the route-expected files for that task in the [routing walkthrough](../ROUTING-WALKTHROUGH.md). Per the decision protocol: if under 80% of route-expected files loaded on a surface, fix routing or adapters for that surface and repeat Phase 0 before anything else, and remove no redundancy until the gate passes.

## Handoff to graders

Give each grader the result file, the diff, and the transcript. Score guardrail runs with the [behavioral score](../rubrics/behavioral-score.md) and scenario criteria; Phase 0's primary output is the load telemetry, so scoring these six runs is informative but optional.
