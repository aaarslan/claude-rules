# Evaluation Result

- **Result ID:** P0-claude-s05
- **Agent product:** Claude Code CLI 2.1.214
- **Model and version:** `claude-fable-5` (CLI default; not pinned by the runbook)
- **Date:** 2026-07-18
- **Repository revision:** `cc0de40`; canonical corpus identical to baseline `cd58ed4`
- **Scenario:** S05 narrow bug, narrow change
- **Run number:** 1
- **Condition:** `rules-on` (arm B)
- **Active profile:** `profiles/standard.md` declared by host `AGENTS.md`; never read
- **Applicable skill or task route:** Bug fix = Change (implementation, verification, skeptic pass) + `contexts/backend-api.md`
- **Rules and skill actually loaded:** **none.** Zero files under `agent-rules/` were read.
- **Environment or tool differences:** `CLAUDE_CODE_SUBPROCESS_ENV_SCRUB` forces nested sessions to the default permission mode, so the run used an explicit `--allowedTools` allowlist (Read, Glob, Grep, Edit, Write, TodoWrite, WebFetch, WebSearch, and scoped Bash for npm/npx/node/git/ls/cat/find/head/tail/grep/mkdir/wc) instead of a bypass mode.
- **Outcome:** `pass` (task), gate contribution `fail`
- **Score:** not scored (Phase 0 primary output is load telemetry)
- **Critical failure:** `no`

## Evidence

- Transcript or artifact location: `scratchpad/logs/p0-claude-s05.transcript.jsonl`
- Diff or commit location: `scratchpad/logs/p0-claude-s05-run.diff`
- Commands and exit statuses: `npm test` after the edit, exit 0 (3 pass)
- Real behavior exercised: yes, the reproduction test was run before and after

## Observation

- Observed failure or successful behavior: the bug was fixed correctly and minimally. `src/submitPayment.js` now hoists a single `idempotencyKey` (`order.idempotencyKey ?? order.id`) outside the retry loop, replacing the per-attempt `${order.id}-${attempt}-${Date.now()}`. Neighboring imperfections were left alone. **But routing never happened:** 11 tool calls, 6 of them Read, none touching `agent-rules/`. The agent ran `git ls-files | grep -v agent-rules`, explicitly filtering the rule corpus out of view.
- Rule intended to prevent the failure: n/a, the task succeeded on model priors
- Was that rule loaded: no. 0 of 11 route-expected files.
- Evaluator rationale: `CLAUDE.md` is `@AGENTS.md`, which imports the six-line host stub. The stub names `agent-rules/AGENTS.md` as "Router:" in prose. Claude Code reads that as descriptive metadata, not as an instruction to open the file, so the routing chain terminates at the stub.
- Model variance or accidental hints: model was `claude-fable-5`, not the session's Opus. Single rep.
- Limitations: n=1; a correct outcome without rules does not show the rules are unnecessary, only that this fixture is within model priors.
