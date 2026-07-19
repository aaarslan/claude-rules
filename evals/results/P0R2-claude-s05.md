# Evaluation Result

- **Result ID:** P0R2-claude-s05
- **Agent product:** Claude Code CLI 2.1.214
- **Model and version:** `claude-fable-5`, pinned with `--model` and confirmed in the transcript as the model that ran
- **Date:** 2026-07-18
- **Repository revision:** `cb833c8` (adapter fix `fa010f2` applied)
- **Scenario:** S05 narrow bug, narrow change
- **Run number:** 1 (round two)
- **Condition:** `rules-on` (arm B)
- **Active profile:** `profiles/standard.md` declared by host `AGENTS.md`; never read
- **Applicable skill or task route:** `bug-fix` per [scenario 05](../scenarios/05-narrow-bug-narrow-change.md). Bug fix = Change + `contexts/backend-api.md`
- **Rules and skill actually loaded:** `agent-rules/AGENTS.md` only, and only because `CLAUDE.md` imports it. **Zero routed files were read.** 0/11 by read-only counting, 1/11 crediting the import.
- **Environment or tool differences:** `CLAUDE_CODE_SUBPROCESS_ENV_SCRUB` forces nested sessions to the default permission mode, so the run used the same explicit `--allowedTools` allowlist as round one (Read, Glob, Grep, Edit, Write, TodoWrite, WebFetch, WebSearch, and scoped Bash for npm/npx/node/git/ls/cat/find/head/tail/grep/mkdir/wc). Held identical across rounds so the adapter fix is the only variable.
- **Outcome:** `pass` (task), gate contribution `fail`
- **Score:** not scored (Phase 0 primary output is load telemetry)
- **Critical failure:** `no`

## Evidence

- Transcript or artifact location: `scratchpad/logs-r2/p0r2-claude-s05.transcript.jsonl`
- Diff or commit location: `scratchpad/logs-r2/p0r2-claude-s05-run.diff`
- Commands and exit statuses: `node --test test/*.test.js` after the edit, 0 failures
- Real behavior exercised: yes, the reproduction test was run
- Covariates: 11 tool calls, 38s wall clock, 2.0k output tokens

## Observation

- Observed failure or successful behavior: correct minimal fix. The per-attempt key is gone and a single `const idempotencyKey = order.idempotencyKey` is hoisted above the retry loop, with a comment explaining server-side dedupe. Unlike round one this version drops the `?? order.id` fallback, matching what Codex produced in round one. **Routing did not happen.** Of 11 tool calls, none touched `agent-rules/`, even though the routing table was sitting in context via the new import.
- Rule intended to prevent the failure: n/a, the task succeeded on model priors
- Was that rule loaded: no. The router was in context; not one file it routes was opened.
- Evaluator rationale: this is the decisive result for the adapter fix. Round one could be explained by the agent never seeing the router. That explanation is now dead: a probe run in a throwaway checkout confirmed `agent-rules/AGENTS.md` is fully loaded into context by the `@agent-rules/AGENTS.md` import. The agent read the routing table and declined to act on it. The remaining failure is layer two, the task table not being executed as a load instruction, and it is unaffected by making the pointer imperative.
- Model variance or accidental hints: single rep. The evaluated session also inherits the operator's global `~/.claude/CLAUDE.md` and `~/.claude/rules/engineering.md`, whose engineering standards overlap the corpus. Constant across both rounds, but it means a rules-off arm is not truly rules-free on this machine.
- Limitations: n=1. Load telemetry only; this says nothing about whether loading the files would have changed the diff.
